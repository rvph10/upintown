import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

export const GET: APIRoute = async () => {
  // Read the logo file from the public directory
  const logoPath = path.join(process.cwd(), 'public', 'global', 'logo.png');

  try {
    // Load the original logo image
    const logoImage = await loadImage(logoPath);
    
    // Calculate padding (20% of the logo dimensions, minimum 20px)
    const padding = Math.max(Math.min(logoImage.width, logoImage.height) * 0.2, 20);
    
    // Create a canvas with padding around the logo
    const canvasWidth = logoImage.width + padding * 2;
    const canvasHeight = logoImage.height + padding * 2;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    
    // Fill with dark background (#000000)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the logo centered with padding
    ctx.drawImage(logoImage, padding, padding);
    
    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error generating logo with dark background:', error);
    return new Response('Logo not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};
