import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

/**
 * Database Ping Endpoint
 * Keeps Supabase free tier database active by performing a lightweight query
 * This endpoint should be called periodically (e.g., every 6 hours) to prevent auto-pause
 *
 * SECURITY: Requires CRON_SECRET in Authorization header or x-vercel-cron header
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    // Verify authentication
    const cronSecret = import.meta.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const vercelCronHeader = request.headers.get('x-vercel-cron'); // Vercel automatically adds this

    // Allow either:
    // 1. Vercel Cron (has x-vercel-cron header with value matching CRON_SECRET)
    // 2. Manual with Bearer token
    const isVercelCron = vercelCronHeader === cronSecret;
    const isBearerAuth = authHeader === `Bearer ${cronSecret}`;

    if (!cronSecret || (!isVercelCron && !isBearerAuth)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    // Initialize Supabase
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Configuration error',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform a lightweight query - just count subscribers
    // This is enough to keep the database active
    const { error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Database ping error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Database query failed',
          details: error.message,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Don't expose subscriber count in response for security
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database is active',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Database ping error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
