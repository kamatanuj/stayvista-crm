# StayVista AI Voice Agent - Setup Guide

## Agent Details
- **Agent ID:** `agent_2401krx9j08jecb926brv5rhc2abm`
- **API Key:** `sk_ee5277b3373bb060cc3de86f775cc544fe8a9afd1f043b52`
- **Platform:** ElevenLabs Conversational AI
- **Name:** Vista (StayVista Villa Booking Assistant)

## System Prompt

```
You are Vista, the friendly and knowledgeable AI concierge for StayVista, India's premier luxury villa and vacation rental platform. StayVista offers over 1,000+ handpicked villas across 86+ locations including Goa, Lonavala, Alibaug, Manali, Coorg, Mussoorie, Jaipur, Udaipur, and many more destinations.

YOUR JOB: Help guests find villas, check availability, calculate pricing with discounts, and CREATE BOOKINGS directly.

CONVERSATION STYLE:
- Warm, friendly, and professional
- Speak naturally with appropriate pauses
- Use Indian context (rupees, local locations, cultural references)
- Confirm details before actions
- Handle objections gracefully
- Use expressions like 'Namaste', 'Sure thing', 'Absolutely'

CAPABILITIES:
- Search villas by location, dates, guests, budget
- Check real-time availability
- Calculate pricing with all applicable discounts and offers
- Create bookings (requires explicit confirmation)
- Handle cancellations and rescheduling
- Provide villa details and recommendations
- Assist with corporate and group bookings
- Help with special requests (pet-friendly, pool, beach access, etc.)

IMPORTANT RULES:
1. ALWAYS use tools for searching and availability checks
2. ALWAYS ask for explicit confirmation before creating/modifying bookings
3. NEVER create bookings without guest confirmation
4. ALWAYS validate dates (check-in must be before check-out)
5. ALWAYS confirm pricing before booking
6. Use webhooks ONLY for confirmed bookings/cancellations

CURRENT PROMOTIONS (Always mention if applicable):
- FLAT 50% OFF on 2nd night on newest escapes (Code: NEWVISTAS)
- Midweek Reset Sale: Upto ₹10,000 Off On Weekday Bookings
- Sunday Getaway Sale: 26% OFF On All Sunday Stays
- Early Bird: Additional discounts for bookings 30+ days in advance

DISCOUNT RULES:
- Weekend Special: 20% off for Fri-Sun stays (2+ nights)
- Extended Stay: 15% off for 5+ nights
- Early Bird: 10% off for bookings 30+ days in advance
- Sunday Special: 26% off on Sunday stays
- Midweek Reset: Up to ₹10,000 off on weekday bookings
- Maximum discount: 40% total (promo codes stack with early bird)

LOCATIONS (86+ destinations):
North: Manali, Kasauli, Mussoorie, Shimla, Dehradun, Nainital, Bhimtal, Ranikhet
South: Goa, Coorg, Ooty, Coonoor, Wayanad, Alleppey
West: Lonavala, Alibaug, Karjat, Nashik, Panchgani, Igatpuri, Mahabaleshwar, Wada
East: Limited coverage
Rajasthan: Jaipur, Udaipur
Central: Panchgani, Pune

VILLA TYPES:
- Beachfront Villas
- Hill Villas
- Pool Villas
- Pet-Friendly Villas
- Party Villas
- Heritage Villas
- Eco-Friendly Villas
- Luxury Resorts (Vaana Collection)

PRICING TIERS:
- Budget: ₹8,000 - ₹15,000 per night
- Standard: ₹15,000 - ₹25,000 per night
- Premium: ₹25,000 - ₹45,000 per night
- Luxury: ₹35,000 - ₹55,000 per night
- Ultra-Luxury: ₹45,000+ per night

BOOKING POLICIES:
- Check-in: 2:00 PM, Check-out: 11:00 AM
- GST: 18% on all bookings
- Security deposit: Required for luxury villas
- Cancellation: Flexible policy - 100% refund 15+ days before, 50% refund 7-14 days, no refund within 7 days
- Pet policy: Varies by villa, mention if pet-friendly needed
- Maximum guests: Strictly enforced per villa capacity

SPECIAL SERVICES:
- In-villa chef services
- Airport transfers
- Local experiences and activities
- Celebration decorations
- Corporate retreat planning
- Wedding and event venues
```

## Tools Configuration

### Phase 1: Search & Discovery Tools (Read-Only)

#### 1. search_villas
```json
{
  "type": "function",
  "function": {
    "name": "search_villas",
    "description": "Search available villas based on location, dates, guests, and budget",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "Preferred location (Goa, Lonavala, Alibaug, Manali, Coorg, Mussoorie, Jaipur, Udaipur, Kasauli, Ooty, Nainital, Shimla, Karjat, Nashik, or 'any')"
        },
        "guests": {
          "type": "integer",
          "description": "Number of guests (1-20)"
        },
        "check_in": {
          "type": "string",
          "format": "date",
          "description": "Check-in date (YYYY-MM-DD)"
        },
        "check_out": {
          "type": "string",
          "format": "date",
          "description": "Check-out date (YYYY-MM-DD)"
        },
        "max_budget": {
          "type": "integer",
          "description": "Maximum budget per night in INR"
        },
        "villa_type": {
          "type": "string",
          "description": "Type: Beachfront, Hill, Pool, Party, Heritage, Pet-Friendly, Eco-Friendly"
        },
        "bedrooms": {
          "type": "integer",
          "description": "Minimum bedrooms (1-8)"
        }
      },
      "required": ["location", "guests"]
    }
  }
}
```

#### 2. check_availability
```json
{
  "type": "function",
  "function": {
    "name": "check_availability",
    "description": "Check real-time availability for specific villa and dates",
    "parameters": {
      "type": "object",
      "properties": {
        "villa_id": {
          "type": "string",
          "description": "Villa ID from search results"
        },
        "check_in": {
          "type": "string",
          "format": "date"
        },
        "check_out": {
          "type": "string",
          "format": "date"
        },
        "guests": {
          "type": "integer"
        }
      },
      "required": ["villa_id", "check_in", "check_out", "guests"]
    }
  }
}
```

#### 3. get_pricing
```json
{
  "type": "function",
  "function": {
    "name": "get_pricing",
    "description": "Calculate pricing with all applicable discounts and promotions",
    "parameters": {
      "type": "object",
      "properties": {
        "villa_id": {
          "type": "string"
        },
        "check_in": {
          "type": "string",
          "format": "date"
        },
        "check_out": {
          "type": "string",
          "format": "date"
        },
        "guests": {
          "type": "integer"
        },
        "promo_code": {
          "type": "string",
          "description": "Optional promo code for additional discounts"
        }
      },
      "required": ["villa_id", "check_in", "check_out", "guests"]
    }
  }
}
```

#### 4. villa_details
```json
{
  "type": "function",
  "function": {
    "name": "villa_details",
    "description": "Get detailed information about a specific villa including amenities, photos, reviews",
    "parameters": {
      "type": "object",
      "properties": {
        "villa_id": {
          "type": "string"
        }
      },
      "required": ["villa_id"]
    }
  }
}
```

#### 5. compare_villas
```json
{
  "type": "function",
  "function": {
    "name": "compare_villas",
    "description": "Compare multiple villas side by side",
    "parameters": {
      "type": "object",
      "properties": {
        "villa_ids": {
          "type": "array",
          "items": {"type": "string"},
          "description": "Array of villa IDs to compare"
        }
      },
      "required": ["villa_ids"]
    }
  }
}
```

#### 6. get_locations
```json
{
  "type": "function",
  "function": {
    "name": "get_locations",
    "description": "Get all available locations and destination information",
    "parameters": {
      "type": "object",
      "properties": {}
    }
  }
}
```

#### 7. get_promotions
```json
{
  "type": "function",
  "function": {
    "name": "get_promotions",
    "description": "Get current active promotions and offers",
    "parameters": {
      "type": "object",
      "properties": {}
    }
  }
}
```

### Phase 2: Webhooks (Secure Write Operations)

#### 1. create_booking
```json
{
  "type": "webhook",
  "webhook": {
    "name": "create_booking",
    "description": "Create a new booking after explicit guest confirmation",
    "url": "https://stayvista-api.kamatanuj.workers.dev/api/webhooks/create-booking",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${WEBHOOK_SECRET}"
    },
    "parameters": {
      "type": "object",
      "properties": {
        "villa_id": {"type": "string"},
        "guest_name": {"type": "string"},
        "email": {"type": "string"},
        "phone": {"type": "string"},
        "check_in": {"type": "string"},
        "check_out": {"type": "string"},
        "guests": {"type": "integer"},
        "special_requests": {"type": "string"},
        "promo_code": {"type": "string"},
        "payment_method": {"type": "string"}
      },
      "required": ["villa_id", "guest_name", "email", "phone", "check_in", "check_out", "guests"]
    },
    "confirmation_required": true,
    "confirmation_message": "I'll create a booking for {guest_name} at {villa_name} from {check_in} to {check_out} for ₹{total}. Please confirm: Would you like me to proceed with this booking?"
  }
}
```

#### 2. cancel_booking
```json
{
  "type": "webhook",
  "webhook": {
    "name": "cancel_booking",
    "description": "Cancel an existing booking with refund calculation",
    "url": "https://stayvista-api.kamatanuj.workers.dev/api/webhooks/cancel-booking",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${WEBHOOK_SECRET}"
    },
    "parameters": {
      "type": "object",
      "properties": {
        "booking_id": {"type": "string"},
        "reason": {"type": "string"}
      },
      "required": ["booking_id"]
    },
    "confirmation_required": true,
    "confirmation_message": "I'll cancel booking {booking_id}. Based on our cancellation policy, you'll receive a refund of ₹{refund_amount}. Please confirm: Do you want to proceed with cancellation?"
  }
}
```

#### 3. reschedule_booking
```json
{
  "type": "webhook",
  "webhook": {
    "name": "reschedule_booking",
    "description": "Reschedule an existing booking to new dates",
    "url": "https://stayvista-api.kamatanuj.workers.dev/api/webhooks/reschedule-booking",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${WEBHOOK_SECRET}"
    },
    "parameters": {
      "type": "object",
      "properties": {
        "booking_id": {"type": "string"},
        "new_check_in": {"type": "string"},
        "new_check_out": {"type": "string"},
        "reason": {"type": "string"}
      },
      "required": ["booking_id", "new_check_in", "new_check_out"]
    },
    "confirmation_required": true
  }
}
```

#### 4. booking_status
```json
{
  "type": "webhook",
  "webhook": {
    "name": "booking_status",
    "description": "Get current status and details of a booking",
    "url": "https://stayvista-api.kamatanuj.workers.dev/api/webhooks/booking-status",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "parameters": {
      "type": "object",
      "properties": {
        "booking_id": {"type": "string"}
      },
      "required": ["booking_id"]
    },
    "confirmation_required": false
  }
}
```

#### 5. corporate_enquiry
```json
{
  "type": "webhook",
  "webhook": {
    "name": "corporate_enquiry",
    "description": "Handle corporate and group booking enquiries",
    "url": "https://stayvista-api.kamatanuj.workers.dev/api/webhooks/corporate-enquiry",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "parameters": {
      "type": "object",
      "properties": {
        "company_name": {"type": "string"},
        "contact_name": {"type": "string"},
        "email": {"type": "string"},
        "phone": {"type": "string"},
        "event_type": {"type": "string"},
        "group_size": {"type": "integer"},
        "location": {"type": "string"},
        "dates": {"type": "string"},
        "budget": {"type": "string"},
        "requirements": {"type": "string"}
      },
      "required": ["company_name", "contact_name", "email", "phone", "event_type", "group_size"]
    },
    "confirmation_required": false
  }
}
```

## API Backend Requirements

### Cloudflare Worker Endpoints Needed:

```
POST /api/tools/search-villas
POST /api/tools/check-availability
POST /api/tools/get-pricing
POST /api/tools/villa-details
POST /api/tools/compare-villas
GET  /api/tools/locations
GET  /api/tools/promotions

POST /api/webhooks/create-booking
POST /api/webhooks/cancel-booking
POST /api/webhooks/reschedule-booking
POST /api/webhooks/booking-status
POST /api/webhooks/corporate-enquiry

GET  /api/health
```

## Voice Settings

- **Voice ID:** `pNInz6obpgDQGcFmaJgB` (Adam - Professional Male)
- **Model:** `eleven_turbo_v2_5`
- **Stability:** 0.5
- **Similarity Boost:** 0.75
- **Language:** en-IN (Indian English)
- **First Message:** "Namaste! Welcome to StayVista. I'm Vista, your personal villa concierge. How can I help you plan your perfect getaway today?"

## Key Differences from SaffronStays

| Feature | SaffronStays | StayVista |
|---------|-------------|-----------|
| Locations | 7 | 86+ |
| Villa Count | 20+ | 1000+ |
| Pricing | ₹15,000+ | ₹8,000+ |
| Special Focus | Luxury only | All tiers |
| Promotions | Standard | Heavy discounts |
| Corporate | Basic | Advanced |
| Collections | Standard | Vaana (Luxury) |

## Next Steps

1. Create Cloudflare Worker API backend
2. Configure tools in ElevenLabs dashboard
3. Test agent with sample conversations
4. Deploy CRM for lead capture
5. Monitor and optimize

## Files Created
- `/root/.openclaw/workspace/stayvista-agent/stayvista-integration.json`
- `/root/.openclaw/workspace/stayvista-agent/SETUP_GUIDE.md`

---

**Status:** ✅ Configuration Complete - Ready for ElevenLabs Setup
