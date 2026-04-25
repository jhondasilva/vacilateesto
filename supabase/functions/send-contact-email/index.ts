import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  company: string;
  message: string;
}

// HTML escape function to prevent XSS/injection attacks
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Input validation function
function validateInput(data: ContactEmailRequest): { valid: boolean; error?: string } {
  // Check required fields
  if (!data.name || typeof data.name !== 'string') {
    return { valid: false, error: "Name is required and must be a string" };
  }
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: "Email is required and must be a string" };
  }
  if (!data.message || typeof data.message !== 'string') {
    return { valid: false, error: "Message is required and must be a string" };
  }

  // Validate lengths to prevent abuse
  if (data.name.length > 100) {
    return { valid: false, error: "Name must be less than 100 characters" };
  }
  if (data.email.length > 255) {
    return { valid: false, error: "Email must be less than 255 characters" };
  }
  if (data.company && data.company.length > 200) {
    return { valid: false, error: "Company must be less than 200 characters" };
  }
  if (data.message.length > 5000) {
    return { valid: false, error: "Message must be less than 5000 characters" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { name, email, company, message } = requestData as ContactEmailRequest;

    // Validate input
    const validation = validateInput({ name, email, company, message });
    if (!validation.valid) {
      console.log("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending contact email from:", escapeHtml(name), escapeHtml(email));

    // Escape all user inputs before inserting into HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company || "No especificada");
    const safeMessage = escapeHtml(message);

    // Enviar email usando Resend API directamente
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Media Kit Vacílate Esto <onboarding@resend.dev>",
        to: ["elpatio@hacemosloquenosgusta.com"],
        subject: `Nueva solicitud de Media Kit - ${safeCompany}`,
        html: `
          <h1>Nueva solicitud de contacto - Media Kit</h1>
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Empresa:</strong> ${safeCompany}</p>
          <h2>Mensaje:</h2>
          <p>${safeMessage}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este mensaje fue enviado desde el Media Kit de Vacílate Esto</p>
        `,
      }),
    });

    const data = await res.json();
    console.log("Email sent successfully:", data);

    if (!res.ok) {
      throw new Error(data.message || "Error sending email");
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
