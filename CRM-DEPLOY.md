# StayVista CRM - Deployment

## Deploy to Cloudflare Pages

```bash
# 1. Navigate to CRM folder
cd /root/.openclaw/workspace/stayvista-agent/public

# 2. Deploy to Cloudflare Pages
npx wrangler pages deploy . --project-name=stayvista-crm --branch=main

# 3. Your CRM will be at:
# https://stayvista-crm.pages.dev
```

## Features
- Lead management dashboard
- Real-time stats (total, hot, new, bookings)
- Filter by category (All, Hot, Cold, New, Corporate)
- View lead details
- Add follow-up notes
- Auto-refresh every 5 minutes
- Mobile responsive

## Connect to API
The CRM automatically fetches from:
`https://stayvista-api.kamatanuj.workers.dev/api/bookings`

## Demo Data
If API is not available, shows 3 sample leads:
1. Anuj Kamat - Goa booking (Hot)
2. TechCorp India - Corporate enquiry
3. Priya Sharma - Family vacation
