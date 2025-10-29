import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const GET: APIRoute = async () => {
  // Read the logo file from the public directory
  const logoPath = path.join(process.cwd(), 'public', 'global', 'logo.png');
  
  try {
    const logoBuffer = fs.readFileSync(logoPath);
    
    return new Response(logoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response('Logo not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};

