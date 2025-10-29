# Supabase Database Keep-Alive Solution

## Overview
This solution prevents your Supabase free tier database from auto-pausing due to inactivity.

## How It Works

### 1. Database Ping Endpoint (`/api/db-ping`)
A lightweight API endpoint that performs a simple query to keep the database active.

**Endpoint:** `https://upintown.dev/api/db-ping`

**What it does:**
- Counts newsletter subscribers (lightweight query)
- Returns success status with timestamp
- Logs any errors for debugging

### 2. Vercel Cron Job
Automatically calls the ping endpoint every 6 hours using Vercel's built-in cron functionality.

**Schedule:** `0 */6 * * *` (Every 6 hours at minute 0)

**Configuration:** `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/db-ping",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## Testing

### Manual Test
You can manually test the endpoint:

```bash
curl https://upintown.dev/api/db-ping
```

Expected response:
```json
{
  "success": true,
  "message": "Database is active",
  "subscriberCount": 0,
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

### Monitor Cron Jobs
1. Go to your Vercel Dashboard
2. Select your project (upintown)
3. Navigate to "Cron Jobs" tab
4. You'll see execution history and logs

## Deployment

The cron job will automatically activate after your next deployment to Vercel:

```bash
npm run build
# Then deploy via Vercel CLI or push to your Git repository
```

## Notes

- **Free Tier Safe:** The query is extremely lightweight and won't consume significant resources
- **No External Dependencies:** Uses only Vercel's built-in features
- **Automatic:** Runs in the background without any manual intervention
- **Reliable:** Vercel Cron Jobs are reliable and will retry on failures

## Troubleshooting

If the database still pauses:
1. Check Vercel Dashboard > Cron Jobs for execution logs
2. Verify environment variables are set (SUPABASE_URL, SUPABASE_ANON_KEY)
3. Test the endpoint manually to ensure it works
4. Consider reducing the interval to every 4 hours: `0 */4 * * *`

## Alternative: Manual Pinging

If you prefer external monitoring, you can use free services like:
- UptimeRobot
- Cron-Job.org
- Better Uptime

Simply point them to `https://upintown.dev/api/db-ping` with a 6-hour interval.

