import type { APIRoute } from 'astro';

export const prerender = false; // Force SSR for this route

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validation basique
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email format',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // TODO: Intégrer avec Resend, SendGrid, ou autre service d'email
    // Pour l'instant, on simule l'envoi
    console.warn('Contact form submission (not sent):', { name, email, message });

    /*
    // Exemple avec Resend:
    // import { Resend } from 'resend';
    // const resend = new Resend(import.meta.env.RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from: 'contact@upintown.com',
    //   to: 'hello@upintown.com',
    //   subject: `New contact from ${name}`,
    //   html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong><br/>${message}</p>`,
    // });
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message sent successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
