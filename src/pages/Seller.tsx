import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Seller = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [colour, setColour] = useState("");
  const [vehicleImageUrl, setVehicleImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!make.trim() || !model.trim()) {
      toast({
        title: "Error",
        description: "Please enter vehicle make and model",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    setVehicleImageUrl(null);

    try {
      const prompt = `A professional photo of a ${colour || 'modern'} ${make} ${model} car, studio lighting, side view, high quality, detailed`;
      
      let data: any = null;
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const resp = await supabase.functions.invoke('generate-vehicle-image', {
          body: { prompt }
        });
        if (resp.error) throw resp.error;
        data = resp.data;
      } catch (clientErr) {
        console.warn('Supabase client unavailable for image generation, using direct URL', clientErr);
        const functionsUrl = 'https://ggarxjzwywppoqtehvhb.supabase.co/functions/v1/generate-vehicle-image';
        const response = await fetch(functionsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        if (!response.ok) throw new Error(`Image generation failed: ${response.status}`);
        data = await response.json();
      }

      if (data?.image) {
        setVehicleImageUrl(data.image);
        toast({
          title: "Success",
          description: "Vehicle image generated successfully",
        });
      } else {
        throw new Error('No image returned');
      }
    } catch (error: any) {
      console.error("Image generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate vehicle image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Vehicle Image Generator</h1>
        <p className="text-center text-muted-foreground mb-8">
          Generate AI images of vehicles based on make, model, and color
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>
              Enter vehicle information to generate an image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateImage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  placeholder="e.g., BMW"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  disabled={isGeneratingImage}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g., M3"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={isGeneratingImage}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colour">Colour (optional)</Label>
                <Input
                  id="colour"
                  placeholder="e.g., Blue"
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  disabled={isGeneratingImage}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isGeneratingImage}>
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  "Generate Vehicle Image"
                )}
              </Button>
            </form>

            {isGeneratingImage && (
              <div className="mt-6 flex items-center justify-center p-8 bg-muted rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                <span>Creating your vehicle image...</span>
              </div>
            )}

            {vehicleImageUrl && !isGeneratingImage && (
              <div className="mt-6 space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={vehicleImageUrl} 
                    alt={`${make} ${model}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Generated image of {colour && `${colour} `}{make} {model}
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
