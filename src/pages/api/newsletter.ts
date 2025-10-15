import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase (env vars added by Vercel integration)
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Configuration error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.is_active) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Email already subscribed',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        // Reactivate subscription
        await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq('id', existing.id);
      }
    } else {
      // Insert new email
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, subscribed_at: new Date().toISOString() }]);

      if (error) {
        // Handle duplicate key error (race condition or concurrent requests)
        if (error.code === '23505') {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Email already subscribed',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // Log actual errors
        console.error('Supabase insert error:', error);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Subscription error',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Optional: Send welcome email with Resend
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'upintown <newsletter@upintown.dev>',
          to: email,
          subject: 'Welcome to upintown',
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <title>Welcome to upintown</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0a0a0a;">
                <tr>
                  <td align="center" style="padding: 60px 20px;">

                    <!-- Main Container -->
                    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; width: 100%;">

                      <!-- Red Accent Bar -->
                      <tr>
                        <td style="height: 2px; background-color: #c80815;"></td>
                      </tr>

                      <!-- Logo -->
                      <tr>
                        <td style="padding: 48px 0 64px 0; text-align: center;">
                          <img src="https://upintown.dev/global/logo.svg" alt="upintown" width="120" style="width: 120px; height: auto; display: block; margin: 0 auto;" />
                        </td>
                      </tr>

                      <!-- Hero Title -->
                      <tr>
                        <td style="padding: 0 0 24px 0;">
                          <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 48px; font-weight: 700; color: #f9f4eb; line-height: 1.1; letter-spacing: -0.03em; text-align: center;">
                            You're in
                          </h1>
                        </td>
                      </tr>

                      <!-- Subtitle -->
                      <tr>
                        <td style="padding: 0 0 56px 0; text-align: center;">
                          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 17px; color: #686560; line-height: 1.5;">
                            Thanks for subscribing to upintown
                          </p>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding: 0 0 56px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="height: 1px; background-color: rgba(249, 244, 235, 0.1);"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 0 0 40px 0;">
                          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; color: #f9f4eb; line-height: 1.6;">
                            You'll receive updates on our latest projects, insights into our process, and occasional thoughts on design and technology.
                          </p>
                        </td>
                      </tr>

                      <!-- Features Grid -->
                      <tr>
                        <td style="padding: 0 0 56px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                            <!-- Feature 1 -->
                            <tr>
                              <td style="padding: 0 0 28px 0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td width="8" style="padding-right: 16px;" valign="top">
                                      <div style="width: 8px; height: 8px; background-color: #c80815; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td>
                                      <p style="margin: 0 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; font-weight: 600; color: #f9f4eb; line-height: 1.4;">
                                        New projects
                                      </p>
                                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #686560; line-height: 1.5;">
                                        Be the first to see our latest work
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Feature 2 -->
                            <tr>
                              <td style="padding: 0 0 28px 0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td width="8" style="padding-right: 16px;" valign="top">
                                      <div style="width: 8px; height: 8px; background-color: #c80815; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td>
                                      <p style="margin: 0 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; font-weight: 600; color: #f9f4eb; line-height: 1.4;">
                                        Behind the scenes
                                      </p>
                                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #686560; line-height: 1.5;">
                                        Technical insights and process updates
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Feature 3 -->
                            <tr>
                              <td>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td width="8" style="padding-right: 16px;" valign="top">
                                      <div style="width: 8px; height: 8px; background-color: #c80815; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td>
                                      <p style="margin: 0 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; font-weight: 600; color: #f9f4eb; line-height: 1.4;">
                                        Exclusive updates
                                      </p>
                                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #686560; line-height: 1.5;">
                                        Early announcements and opportunities
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                          </table>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding: 0 0 56px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="height: 1px; background-color: rgba(249, 244, 235, 0.1);"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- CTA Button -->
                      <tr>
                        <td style="padding: 0 0 56px 0; text-align: center;">
                          <a href="https://upintown.dev" style="display: inline-block; padding: 16px 32px; background-color: #f9f4eb; color: #0a0a0a; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; font-weight: 600; border-radius: 8px; letter-spacing: -0.01em;">
                            Explore our work
                          </a>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding: 0 0 32px 0; text-align: center;">
                          <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #686560; line-height: 1.5;">
                            upintown · Digital Solutions
                          </p>
                          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #686560; line-height: 1.5;">
                            <a href="https://upintown.dev" style="color: #686560; text-decoration: none;">Website</a>
                            <span style="margin: 0 8px; color: #686560;">·</span>
                            <a href="https://github.com/rvph10" style="color: #686560; text-decoration: none;">Github</a>
                            <span style="margin: 0 8px; color: #686560;">·</span>
                            <a href="mailto:contact@upintown.dev" style="color: #686560; text-decoration: none;">Contact</a>
                          </p>
                        </td>
                      </tr>

                      <!-- Unsubscribe -->
                      <tr>
                        <td style="padding: 0 0 32px 0; text-align: center;">
                          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #686560; line-height: 1.5;">
                            <a href="#" style="color: #686560; text-decoration: underline;">Unsubscribe</a>
                          </p>
                        </td>
                      </tr>

                      <!-- Bottom Red Accent Bar -->
                      <tr>
                        <td style="height: 2px; background-color: #c80815;"></td>
                      </tr>

                    </table>

                  </td>
                </tr>
              </table>

            </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error('Resend error:', emailError);
        // Continue even if email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
