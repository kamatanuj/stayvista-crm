# StayVista API - Deployment Guide

## Quick Deploy

```bash
# 1. Navigate to project
cd /root/.openclaw/workspace/stayvista-agent

# 2. Login to Cloudflare
npx wrangler login

# 3. Deploy
npx wrangler deploy

# 4. Set secret
npx wrangler secret put WEBHOOK_SECRET
# Enter: stayvista-webhook-2024
```

## API Endpoints

### Tools (Phase 1)
- `POST /api/tools/search-villas`
- `POST /api/tools/check-availability`
- `POST /api/tools/get-pricing`
- `POST /api/tools/villa-details`
- `POST /api/tools/compare-villas`
- `GET /api/tools/locations`
- `GET /api/tools/promotions`

### Webhooks (Phase 2)
- `POST /api/webhooks/create-booking`
- `POST /api/webhooks/cancel-booking`
- `POST /api/webhooks/reschedule-booking`
- `POST /api/webhooks/booking-status`
- `POST /api/webhooks/corporate-enquiry`

### Admin
- `GET /api/health`
- `GET /api/bookings`

## Test Commands

```bash
# Health check
curl https://stayvista-api.kamatanuj.workers.dev/api/health

# Search villas
curl -X POST https://stayvista-api.kamatanuj.workers.dev/api/tools/search-villas \
  -H "Content-Type: application/json" \
  -d '{"location":"Goa","guests":4}'

# Create booking
curl -X POST https://stayvista-api.kamatanuj.workers.dev/api/webhooks/create-booking \
  -H "Content-Type: application/json" \
  -d '{
    "villa_id": "villa_001",
    "guest_name": "Anuj Kamat",
    "email": "anuj@example.com",
    "phone": "9820370923",
    "check_in": "2026-05-20",
    "check_out": "2026-05-23",
    "guests": 4
  }'
```
