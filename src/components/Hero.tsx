import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import blueCar from "@/assets/blue-bmw-car.png";
import logo from "@/assets/sell-my-car-newcastle-logo.png";

const DVLA_ENV_SUFFIX = import.meta.env.PROD ? "" : "&env=test";

export const Hero = () => {
  const [regValue, setRegValue] = useState("");
  const [mileageValue, setMileageValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<{ vrm?: string; mileage?: string; email?: string }>({});
  const [vehicleSummary, setVehicleSummary] = useState<{ title: string; details: string } | null>(null);
  const [vehicleData, setVehicleData] = useState<Record<string, unknown> | null>(null);
  const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);

  const cleanVRM = useCallback((value: string) => value.toUpperCase().replace(/\s+/g, ""), []);
  const validVRM = useCallback((value: string) => /^[A-Z0-9]{1,8}$/.test(value), []);

  const parseMileage = useCallback((value: string) => {
    const cleaned = value.replace(/,/g, "").trim();
    if (!cleaned || !/^\d+$/.test(cleaned)) {
      return null;
    }
    const miles = Number(cleaned);
    if (!Number.isFinite(miles) || miles < 1 || miles > 400000) {
      return null;
    }
    return miles;
  }, []);

  const uuidv4 = useCallback(() => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const rand = (Math.random() * 16) | 0;
      const value = char === "x" ? rand : (rand & 0x3) | 0x8;
      return value.toString(16);
    });
  }, []);

  const setError = useCallback((field: "vrm" | "mileage" | "email", message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearError = useCallback((field: "vrm" | "mileage" | "email") => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleRegChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
    setRegValue(nextValue);
    clearError("vrm");
  }, [clearError]);

  const handleMileageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const cleaned = event.target.value.replace(/[^0-9,]/g, "");
      setMileageValue(cleaned);
      clearError("mileage");
    },
    [clearError]
  );

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEmailValue(event.target.value);
      clearError("email");
    },
    [clearError]
  );

  const getStoredVehicle = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const raw = window.sessionStorage?.getItem("dvla.vehicle");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const formatVehicleSummary = useCallback((vehicle: Record<string, unknown> | null, fallbackVrm: string) => {
    if (!vehicle) {
      return null;
    }

    const getString = (key: string) => {
      const value = vehicle[key];
      return typeof value === "string" ? value : "";
    };

    const getNumber = (key: string) => {
      const value = vehicle[key];
      return typeof value === "number" ? value : null;
    };

    const make = getString("make");
    const model = getString("model");
    const numericYear = getNumber("year") ?? getNumber("yearOfManufacture");
    const rawYear = numericYear != null ? numericYear.toString() : getString("registrationDate") || getString("monthOfFirstRegistration");
    const year = rawYear.length >= 4 ? rawYear.slice(0, 4) : "";
    const colour = getString("colour");
    const body = getString("body") || getString("bodyType");
    const fuel = getString("fuel") || getString("fuelType");
    const title = [make, model].filter(Boolean).join(" ").trim() || fallbackVrm;
    const details = [year, colour, body, fuel].filter(Boolean).join(" • ");

    return { title, details };
  }, []);

  const handleHeroSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (step === 1) {
        const normalized = cleanVRM(regValue);
        if (!normalized || !validVRM(normalized)) {
          setError("vrm", "Enter a valid UK number plate.");
          return;
        }

        if (typeof window !== "undefined") {
          try {
            window.sessionStorage?.setItem("dvla.prefill", normalized);
          } catch (error) {
            console.warn("Unable to persist DVLA prefill", error);
          }
        }

        const url = `/api/dvla?vrm=${encodeURIComponent(normalized)}${DVLA_ENV_SUFFIX}`;
        setIsFetchingVehicle(true);
        setError("vrm", "");

        fetch(url, { credentials: "include" })
          .then(async (response) => {
            if (!response.ok) {
              const status = response.status;
              if (status === 404) {
                throw new Error("We couldn't find that reg. Double-check the plate and try again.");
              }
              if (status === 429) {
                throw new Error("DVLA is busy right now. Please wait a moment and try again.");
              }
              throw new Error("DVLA lookup failed. Please try again.");
            }
            return response.json();
          })
          .then((vehicle) => {
            setVehicleData(vehicle);
            const summary = formatVehicleSummary(vehicle, normalized);
            setVehicleSummary(summary);
            if (typeof window !== "undefined") {
              try {
                window.sessionStorage?.setItem("dvla.vehicle", JSON.stringify(vehicle));
                window.sessionStorage?.setItem("dvla.vrm", normalized);
              } catch (error) {
                console.warn("Unable to cache DVLA response", error);
              }
            }

            if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
              window.dispatchEvent(
                new CustomEvent("dvla:prefill", {
                  detail: { vrm: normalized },
                })
              );
            }

            const dvlaBlock = document.querySelector(".dvla-hero");
            if (dvlaBlock && typeof dvlaBlock.scrollIntoView === "function") {
              try {
                dvlaBlock.scrollIntoView({ behavior: "smooth", block: "start" });
              } catch {
                dvlaBlock.scrollIntoView();
              }
            }

            setStep(2);
          })
          .catch((error: Error) => {
            setError("vrm", error.message || "DVLA lookup failed. Please try again.");
          })
          .finally(() => {
            setIsFetchingVehicle(false);
          });

        return;
      }

      if (step === 2) {
        const parsed = parseMileage(mileageValue);
        if (!parsed) {
          setError("mileage", "Enter a mileage between 1 and 400,000 miles.");
          return;
        }
        setStep(3);
        return;
      }

      if (step === 3) {
        if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
          setError("email", "Enter a valid email address.");
          return;
        }

        const normalizedVRM = cleanVRM(regValue);
        const parsedMileage = parseMileage(mileageValue);
        if (!normalizedVRM || !parsedMileage) {
          setStep(1);
          return;
        }

        const storedVehicle = vehicleData || getStoredVehicle();
        if (typeof window !== "undefined") {
          const redirectUri = encodeURIComponent(`/${normalizedVRM}?mileage=${parsedMileage}`);
          const params = new URLSearchParams({
            clientId: "seller-web-app",
            redirectUri,
            brand: (storedVehicle?.make as string) || "",
            vrm: normalizedVRM,
            xSpId: uuidv4(),
          });

          window.location.href = `/auth/seller?${params.toString()}`;
        }
      }
    },
    [
      step,
      cleanVRM,
      regValue,
      validVRM,
      setError,
      mileageValue,
      parseMileage,
      emailValue,
      vehicleData,
      getStoredVehicle,
      uuidv4,
      formatVehicleSummary,
    ]
  );

  const handleBack = useCallback(() => {
    setStep((prev) => {
      const next = prev === 3 ? 2 : 1;
      if (next === 1) {
        setVehicleSummary(null);
        setVehicleData(null);
      }
      return next;
    });
  }, []);

  const primaryCtaLabel = useMemo(() => {
    if (step === 1) return "Next: confirm mileage →";
    if (step === 2) return "Next: email →";
    return "Get my valuation →";
  }, [step]);

  const activeStepValue = useMemo(() => {
    if (step === 1) return regValue;
    if (step === 2) return mileageValue;
    return emailValue;
  }, [step, regValue, mileageValue, emailValue]);

  const activeStepChangeHandler = useMemo(() => {
    if (step === 1) return handleRegChange;
    if (step === 2) return handleMileageChange;
    return handleEmailChange;
  }, [step, handleRegChange, handleMileageChange, handleEmailChange]);

  const activeStepPlaceholder = useMemo(() => {
    if (step === 1) return "ENTER REG";
    if (step === 2) return "Enter mileage";
    return "you@example.com";
  }, [step]);

  const activeStepAutocomplete = useMemo(() => {
    if (step === 1) return "off";
    if (step === 2) return "off";
    return "email";
  }, [step]);

  const activeStepInputMode = useMemo(() => {
    if (step === 2) return "numeric";
    return "text";
  }, [step]);

  const activeError = useMemo(() => {
    if (step === 1) return errors.vrm;
    if (step === 2) return errors.mileage;
    return errors.email;
  }, [step, errors]);

  const helperCopy = useMemo(() => {
    if (step === 1) return "We use this to fetch the official DVLA record instantly.";
    if (step === 2) return "Anywhere between 1 and 400,000 miles.";
    return "We’ll send your valuation link and next steps right away.";
  }, [step]);

  return (
    <section id="hero" className="relative overflow-hidden bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Centered Yellow Background Container with rounded corners */}
          <div className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden bg-hero-yellow p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-6 relative z-10">
               
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                  Sell my car.
                  <br />
                  Fast, fair and
                  <br />
                  no fuss.
                </h1>

                <p className="text-lg md:text-xl text-foreground/90 max-w-xl">
                  <span className="font-semibold">Get a free valuation,</span> the best offer from 7,500+ dealers,
                  and free home collection with same-day payment.
                </p>

                <form className="max-w-2xl space-y-3" onSubmit={handleHeroSubmit} data-dvla-trigger-form>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Input
                        type="text"
                        value={activeStepValue}
                        onChange={activeStepChangeHandler}
                        placeholder={activeStepPlaceholder}
                        autoComplete={activeStepAutocomplete}
                        inputMode={activeStepInputMode}
                        aria-invalid={Boolean(activeError)}
                        className={`h-14 text-base bg-background border-2 border-border font-medium placeholder:text-muted-foreground/50 rounded-xl ${
                          step === 1 ? "uppercase" : ""
                        }`}
                      />
                      {activeError && <p className="text-sm font-semibold text-red-600">{activeError}</p>}
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                      {step > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={handleBack}
                          className="h-14 px-6 text-base font-semibold rounded-xl"
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        className="h-14 px-8 text-base font-semibold whitespace-nowrap bg-foreground text-background hover:bg-foreground/90 rounded-xl"
                        disabled={isFetchingVehicle}
                      >
                        {isFetchingVehicle ? "Looking up…" : primaryCtaLabel}
                      </Button>
                    </div>
                  </div>

                  {step >= 2 && (
                    <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Vehicle</p>
                      {vehicleSummary ? (
                        <>
                          <p className="text-base font-semibold text-foreground leading-tight">{vehicleSummary.title}</p>
                          {vehicleSummary.details && (
                            <p className="text-sm text-foreground/70">{vehicleSummary.details}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-foreground/60">Fetching DVLA data…</p>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-foreground/70">{helperCopy}</p>
                </form>

                {/* Trustpilot Badge */}
                <div className="flex items-center gap-3 pt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-[#00B67A] text-[#00B67A]" />
                    <span className="font-bold text-foreground">Trustpilot</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-[#00B67A] text-[#00B67A]" />
                    ))}
                  </div>
                  <span className="text-sm text-foreground/80">92,250+ reviews</span>
                </div>
              </div>

              {/* Right Content - Car Image */}
              <div className="relative flex items-center justify-center">
                <img 
                  src={blueCar}
                  alt="Blue BMW car"
                  className="w-full h-auto relative z-10"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
