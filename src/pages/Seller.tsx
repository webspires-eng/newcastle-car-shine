import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { Loader2 } from "lucide-react";

interface VehicleData {
  vrm: string;
  make: string;
  model: string;
  year: number | null;
  colour: string;
  body: string;
  fuel: string;
}

const Seller = () => {
  const [vrm, setVrm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const { toast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vrm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a vehicle registration number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setVehicleData(null);

    try {
      // Call edge function which securely handles DVLA API
      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${baseUrl}/functions/v1/dvla-lookup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vrm: vrm.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lookup failed with status ${response.status}`);
      }

      const data: VehicleData = await response.json();

      setVehicleData(data);
      toast({
        title: "Success",
        description: "Vehicle details retrieved successfully",
      });
    } catch (error: any) {
      console.error("DVLA lookup error:", error);
      toast({
        title: "Lookup Failed",
        description: error.message || "Unable to retrieve vehicle details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">DVLA Lookup Test</h1>
        <p className="text-center text-muted-foreground mb-8">
          Test the DVLA API integration by entering a vehicle registration number
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Registration Lookup</CardTitle>
            <CardDescription>
              Enter a UK vehicle registration number to retrieve vehicle details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLookup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vrm">Vehicle Registration Number</Label>
                <Input
                  id="vrm"
                  placeholder="e.g., AB12 CDE"
                  value={vrm}
                  onChange={(e) => setVrm(e.target.value.toUpperCase())}
                  maxLength={8}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up...
                  </>
                ) : (
                  "Lookup Vehicle"
                )}
              </Button>
            </form>

            {vehicleData && (
              <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-semibold text-lg mb-3">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Registration:</span>
                    <p className="text-muted-foreground">{vehicleData.vrm}</p>
                  </div>
                  <div>
                    <span className="font-medium">Make:</span>
                    <p className="text-muted-foreground">{vehicleData.make || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Model:</span>
                    <p className="text-muted-foreground">{vehicleData.model || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Year:</span>
                    <p className="text-muted-foreground">{vehicleData.year || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Colour:</span>
                    <p className="text-muted-foreground">{vehicleData.colour || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Body Type:</span>
                    <p className="text-muted-foreground">{vehicleData.body || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Fuel Type:</span>
                    <p className="text-muted-foreground">{vehicleData.fuel || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Seller;
