import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BodyMeasurements {
  height: number;
  weight: number;
  gender: "male" | "female" | "neutral";
  bodyType: string;
}

interface RequestBody {
  measurements: BodyMeasurements;
  garmentType: string;
  garmentColor: string;
  customText?: string;
  designImage?: string;
}

function getBodyDescription(measurements: BodyMeasurements): string {
  const { height, weight, gender, bodyType } = measurements;
  
  const heightDesc = height < 160 ? "short" : height < 175 ? "average height" : "tall";
  
  const bodyTypeDescs: Record<string, string> = {
    slim: "slim and lean body",
    average: "average build body",
    athletic: "athletic and muscular body",
    plus: "plus-size body with broad shoulders",
  };
  
  const genderDesc = gender === "male" ? "male" : gender === "female" ? "female" : "androgynous";
  
  return `${heightDesc} ${genderDesc} person with ${bodyTypeDescs[bodyType] || "average body"}`;
}

function getGarmentDescription(garmentType: string, garmentColor: string): string {
  const colorName = getColorName(garmentColor);
  
  const garmentDescs: Record<string, string> = {
    hoodie: `${colorName} hoodie with hood down`,
    tshirt: `${colorName} t-shirt with crew neck`,
    polo: `${colorName} polo shirt with collar`,
  };
  
  return garmentDescs[garmentType] || `${colorName} ${garmentType}`;
}

function getColorName(hex: string): string {
  const colorMap: Record<string, string> = {
    "#1a1a1a": "black",
    "#f5f5dc": "cream/bone white",
    "#8a9a7b": "sage green",
    "#0a1128": "deep navy blue",
    "#D4AF37": "gold",
    "#722F37": "burgundy",
    "#228b22": "forest green",
    "#36454f": "charcoal gray",
  };
  return colorMap[hex] || hex;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body: RequestBody = await req.json();
    const { measurements, garmentType, garmentColor, customText } = body;

    if (!measurements || !garmentType || !garmentColor) {
      throw new Error("Missing required fields: measurements, garmentType, garmentColor");
    }

    const bodyDescription = getBodyDescription(measurements);
    const garmentDescription = getGarmentDescription(garmentType, garmentColor);

    // Build the image generation prompt
    let prompt = `Ultra-realistic fashion photography of a ${bodyDescription} wearing a ${garmentDescription}. `;
    prompt += `The model is standing in a front-facing pose in a professional studio with neutral gray background. `;
    prompt += `The clothing fits naturally with realistic folds, shadows, and fabric texture. `;
    
    if (customText) {
      prompt += `The garment has "${customText}" text printed on the front. `;
    }
    
    prompt += `High-end fashion photography, 4K quality, soft studio lighting, professional model pose. `;
    prompt += `The person is 100% AI-generated, photorealistic but not a real human. `;
    prompt += `Full body shot showing the garment clearly. Clean, minimal aesthetic.`;

    console.log("Generating image with prompt:", prompt);

    // Use Lovable AI image generation model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the generated image URL from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated by AI");
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        prompt, // Return prompt for debugging
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-ai-preview:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
