// Cloudflare Worker for StayVista Voice Agent API
// Serves Phase 1 (Tools), Phase 2 (Webhooks), and Phase 3 (Advanced Tools)

import { Router } from './worker-router.js';

// Initialize router with our handlers
const router = new Router();

// Mock villa database (StayVista has 1000+ villas, using subset for demo)
const VILLAS = [
  {
    id: "villa_001",
    name: "The Ocean View Estate",
    location: "Goa",
    region: "North Goa",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 8,
    price_per_night: 45000,
    price_category: "Ultra-Luxury",
    villa_type: "Beachfront",
    amenities: ["Private Pool", "Beach Access", "Chef Service", "AC", "WiFi", "Parking"],
    pet_friendly: false,
    description: "Stunning beachfront villa with infinity pool overlooking the Arabian Sea"
  },
  {
    id: "villa_002",
    name: "Sunset Beach Villa",
    location: "Goa",
    region: "North Goa",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 6,
    price_per_night: 35000,
    price_category: "Luxury",
    villa_type: "Beachfront",
    amenities: ["Private Pool", "Garden", "BBQ", "AC", "WiFi"],
    pet_friendly: true,
    description: "Charming beach villa perfect for families with pets"
  },
  {
    id: "villa_003",
    name: "Casa Bella",
    location: "Goa",
    region: "South Goa",
    bedrooms: 5,
    bathrooms: 5,
    max_guests: 10,
    price_per_night: 38000,
    price_category: "Luxury",
    villa_type: "Pool",
    amenities: ["Private Pool", "Tennis Court", "Home Theater", "AC", "WiFi", "Parking"],
    pet_friendly: false,
    description: "Luxurious estate with private tennis court and home theater"
  },
  {
    id: "villa_004",
    name: "Hilltop Haven",
    location: "Lonavala",
    region: "Western Ghats",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 6,
    price_per_night: 18000,
    price_category: "Standard",
    villa_type: "Hill",
    amenities: ["Valley View", "Bonfire", "BBQ", "AC", "WiFi"],
    pet_friendly: true,
    description: "Scenic hilltop villa with panoramic valley views"
  },
  {
    id: "villa_005",
    name: "Valley Retreat",
    location: "Lonavala",
    region: "Western Ghats",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 8,
    price_per_night: 25000,
    price_category: "Premium",
    villa_type: "Hill",
    amenities: ["Private Pool", "Valley View", "Game Room", "AC", "WiFi", "Parking"],
    pet_friendly: false,
    description: "Premium valley retreat with private pool and game room"
  },
  {
    id: "villa_006",
    name: "Coastal Escape",
    location: "Alibaug",
    region: "Konkan Coast",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 6,
    price_per_night: 15000,
    price_category: "Standard",
    villa_type: "Beachfront",
    amenities: ["Beach Access", "Garden", "BBQ", "AC", "WiFi"],
    pet_friendly: true,
    description: "Affordable coastal getaway just 2 hours from Mumbai"
  },
  {
    id: "villa_007",
    name: "Mountain Mist",
    location: "Manali",
    region: "Himachal Pradesh",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 8,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Hill",
    amenities: ["Mountain View", "Fireplace", "Ski Storage", "AC", "WiFi", "Parking"],
    pet_friendly: false,
    description: "Premium mountain villa with stunning Himalayan views"
  },
  {
    id: "villa_008",
    name: "Coffee Estate",
    location: "Coorg",
    region: "Karnataka",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 6,
    price_per_night: 12000,
    price_category: "Budget",
    villa_type: "Heritage",
    amenities: ["Coffee Plantation", "Nature Walk", "AC", "WiFi"],
    pet_friendly: true,
    description: "Heritage villa amidst coffee plantations"
  },
  {
    id: "villa_009",
    name: "Palace Suites",
    location: "Jaipur",
    region: "Rajasthan",
    bedrooms: 5,
    bathrooms: 5,
    max_guests: 10,
    price_per_night: 55000,
    price_category: "Ultra-Luxury",
    villa_type: "Heritage",
    amenities: ["Heritage Architecture", "Courtyard", "Pool", "AC", "WiFi", "Parking"],
    pet_friendly: false,
    description: "Royal heritage palace with authentic Rajasthani architecture"
  },
  {
    id: "villa_010",
    name: "Lakeview Villa",
    location: "Udaipur",
    region: "Rajasthan",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 8,
    price_per_night: 42000,
    price_category: "Luxury",
    villa_type: "Heritage",
    amenities: ["Lake View", "Rooftop Dining", "Pool", "AC", "WiFi", "Parking"],
    pet_friendly: false,
    description: "Luxurious villa overlooking Lake Pichola"
  }
];

// Mock booking database
const BOOKINGS = new Map();
let bookingCounter = 1000;

// Mock availability (all available for demo)
const AVAILABILITY = new Map();

// ============================================
// PHASE 1: ELEVENLABS TOOLS (Fast, Read-Only)
// ============================================

// Tool 1: Search Villas
router.post('/api/tools/search-villas', async (request, env) => {
  const params = await request.json();
  
  let results = VILLAS;
  
  // Filter by location
  if (params.location && params.location !== 'any') {
    const loc = params.location.toLowerCase();
    results = results.filter(v => 
      v.location.toLowerCase().includes(loc) || 
      v.region.toLowerCase().includes(loc)
    );
  }
  
  // Filter by guests
  if (params.guests) {
    results = results.filter(v => v.max_guests >= parseInt(params.guests));
  }
  
  // Filter by budget
  if (params.max_budget) {
    results = results.filter(v => v.price_per_night <= parseInt(params.max_budget));
  }
  
  // Filter by villa type
  if (params.villa_type) {
    const type = params.villa_type.toLowerCase();
    results = results.filter(v => v.villa_type.toLowerCase() === type);
  }
  
  // Filter by bedrooms
  if (params.bedrooms) {
    results = results.filter(v => v.bedrooms >= parseInt(params.bedrooms));
  }
  
  if (results.length === 0) {
    return jsonResponse({
      success: true,
      message: `I couldn't find any villas matching your criteria.`,
      villas: [],
      alternatives: []
    });
  }
  
  const topVillas = results.slice(0, 3);
  let message = `Great! I found ${results.length} villas. `;
  message += `Here are the top recommendations:\n\n`;
  
  topVillas.forEach((villa, index) => {
    message += `${index + 1}. ${villa.name} in ${villa.location}\n`;
    message += `   ${villa.bedrooms} bedrooms, up to ${villa.max_guests} guests\n`;
    message += `   ₹${villa.price_per_night.toLocaleString()} per night\n\n`;
  });
  
  message += `Would you like more details about any of these?`;
  
  return jsonResponse({
    success: true,
    message,
    villas: topVillas.map(v => ({
      id: v.id,
      name: v.name,
      location: v.location,
      region: v.region,
      bedrooms: v.bedrooms,
      max_guests: v.max_guests,
      price_per_night: v.price_per_night,
      price_category: v.price_category,
      villa_type: v.villa_type,
      pet_friendly: v.pet_friendly
    })),
    total_count: results.length
  });
});

// Tool 2: Check Availability
router.post('/api/tools/check-availability', async (request, env) => {
  const params = await request.json();
  const { villa_id, check_in, check_out, guests } = params;
  
  const villa = VILLAS.find(v => v.id === villa_id);
  
  if (!villa) {
    return jsonResponse({
      success: false,
      message: "I couldn't find that villa.",
      available: false
    });
  }
  
  // For demo, assume all dates are available
  const isAvailable = true;
  
  let message = isAvailable 
    ? `✅ Great news! ${villa.name} is available from ${check_in} to ${check_out}.\n\n`
    : `❌ I'm sorry, ${villa.name} is not available from ${check_in} to ${check_out}.\n\n`;
  
  return jsonResponse({
    success: true,
    message,
    villa_id,
    villa_name: villa.name,
    available: isAvailable,
    next_available: check_in
  });
});

// Tool 3: Get Pricing
router.post('/api/tools/get-pricing', async (request, env) => {
  const params = await request.json();
  const { villa_id, check_in, check_out, guests, promo_code } = params;
  
  const villa = VILLAS.find(v => v.id === villa_id);
  
  if (!villa) {
    return jsonResponse({
      success: false,
      message: "Villa not found."
    });
  }
  
  const startDate = new Date(check_in);
  const endDate = new Date(check_out);
  const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
  
  const basePrice = villa.price_per_night * nights;
  
  // Calculate discounts
  let discounts = [];
  let totalDiscount = 0;
  
  // Weekend Special (Fri-Sun, 2+ nights)
  const hasWeekend = [0, 5, 6].includes(startDate.getDay()) || [0, 5, 6].includes(endDate.getDay());
  if (hasWeekend && nights >= 2) {
    const weekendDiscount = Math.round(basePrice * 0.20);
    discounts.push({ name: "Weekend Special", amount: weekendDiscount });
    totalDiscount += weekendDiscount;
  }
  
  // Extended Stay (5+ nights)
  if (nights >= 5) {
    const extendedDiscount = Math.round(basePrice * 0.15);
    discounts.push({ name: "Extended Stay", amount: extendedDiscount });
    totalDiscount += extendedDiscount;
  }
  
  // Early Bird (30+ days advance)
  const daysAdvance = Math.ceil((startDate - new Date()) / (1000 * 60 * 60 * 24));
  if (daysAdvance >= 30) {
    const earlyBirdDiscount = Math.round(basePrice * 0.10);
    discounts.push({ name: "Early Bird", amount: earlyBirdDiscount });
    totalDiscount += earlyBirdDiscount;
  }
  
  // Sunday Special
  if (startDate.getDay() === 0 || endDate.getDay() === 0) {
    const sundayDiscount = Math.round(basePrice * 0.26);
    discounts.push({ name: "Sunday Special", amount: sundayDiscount });
    totalDiscount += sundayDiscount;
  }
  
  // Midweek Reset (weekday bookings)
  if (!hasWeekend) {
    const midweekDiscount = Math.min(10000, Math.round(basePrice * 0.15));
    discounts.push({ name: "Midweek Reset", amount: midweekDiscount });
    totalDiscount += midweekDiscount;
  }
  
  // Promo code
  if (promo_code) {
    if (promo_code.toUpperCase() === 'NEWVISTAS') {
      const promoDiscount = Math.round(basePrice * 0.50);
      discounts.push({ name: "NEWVISTAS Promo", amount: promoDiscount });
      totalDiscount += promoDiscount;
    }
  }
  
  // Cap total discount at 40%
  const maxDiscount = Math.round(basePrice * 0.40);
  if (totalDiscount > maxDiscount) {
    totalDiscount = maxDiscount;
  }
  
  const subtotal = basePrice - totalDiscount;
  const taxes = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + taxes;
  
  let message = `💰 Pricing for ${villa.name}\n`;
  message += `${nights} nights × ₹${villa.price_per_night.toLocaleString()} = ₹${basePrice.toLocaleString()}\n\n`;
  
  if (discounts.length > 0) {
    message += `🎁 Discounts Applied:\n`;
    discounts.forEach(d => {
      if (d.amount > 0) message += `   ${d.name}: -₹${d.amount.toLocaleString()}\n`;
    });
    message += `   Total Discount: -₹${totalDiscount.toLocaleString()}\n\n`;
  }
  
  message += `Subtotal: ₹${subtotal.toLocaleString()}\n`;
  message += `Taxes (18% GST): ₹${taxes.toLocaleString()}\n`;
  message += `🏆 TOTAL: ₹${total.toLocaleString()}\n`;
  message += `Per person: ₹${Math.round(total / (guests || 1)).toLocaleString()}`;
  
  return jsonResponse({
    success: true,
    message,
    villa_id,
    villa_name: villa.name,
    nights,
    base_price: basePrice,
    discounts,
    total_discount: totalDiscount,
    subtotal,
    taxes,
    total,
    per_person: Math.round(total / (guests || 1))
  });
});

// Tool 4: Villa Details
router.post('/api/tools/villa-details', async (request, env) => {
  const params = await request.json();
  const villa = VILLAS.find(v => v.id === params.villa_id);
  
  if (!villa) {
    return jsonResponse({
      success: false,
      message: "Villa not found."
    });
  }
  
  let message = `🏡 ${villa.name}\n\n`;
  message += `📍 Location: ${villa.location}, ${villa.region}\n`;
  message += `🛏️ Bedrooms: ${villa.bedrooms} | 🛁 Bathrooms: ${villa.bathrooms}\n`;
  message += `👥 Max Guests: ${villa.max_guests}\n`;
  message += `💰 Price: ₹${villa.price_per_night.toLocaleString()} per night\n`;
  message += `🏷️ Category: ${villa.price_category}\n`;
  message += `🏠 Type: ${villa.villa_type}\n`;
  message += `🐾 Pet Friendly: ${villa.pet_friendly ? 'Yes' : 'No'}\n\n`;
  message += `📝 Description: ${villa.description}\n\n`;
  message += `✨ Amenities: ${villa.amenities.join(', ')}`;
  
  return jsonResponse({
    success: true,
    message,
    villa
  });
});

// Tool 5: Compare Villas
router.post('/api/tools/compare-villas', async (request, env) => {
  const params = await request.json();
  const villas = params.villa_ids.map(id => VILLAS.find(v => v.id === id)).filter(Boolean);
  
  if (villas.length < 2) {
    return jsonResponse({
      success: false,
      message: "Please provide at least 2 villa IDs to compare."
    });
  }
  
  let message = `📊 Villa Comparison\n\n`;
  
  villas.forEach((villa, index) => {
    message += `${index + 1}. ${villa.name}\n`;
    message += `   Location: ${villa.location}\n`;
    message += `   Price: ₹${villa.price_per_night.toLocaleString()}/night\n`;
    message += `   Bedrooms: ${villa.bedrooms} | Max Guests: ${villa.max_guests}\n`;
    message += `   Type: ${villa.villa_type} | Pet Friendly: ${villa.pet_friendly ? 'Yes' : 'No'}\n\n`;
  });
  
  return jsonResponse({
    success: true,
    message,
    villas
  });
});

// Tool 6: Get Locations
router.get('/api/tools/locations', async (request, env) => {
  const locations = [
    { name: "Goa", description: "Beachfront villas, party vibes", region: "West", villa_count: 3 },
    { name: "Lonavala", description: "Hill villas, valley views", region: "West", villa_count: 2 },
    { name: "Alibaug", description: "Coastal villas, Mumbai getaway", region: "West", villa_count: 1 },
    { name: "Manali", description: "Mountain villas, snow views", region: "North", villa_count: 1 },
    { name: "Coorg", description: "Coffee estates, nature retreats", region: "South", villa_count: 1 },
    { name: "Jaipur", description: "Heritage palaces, royal experience", region: "Rajasthan", villa_count: 1 },
    { name: "Udaipur", description: "Lake views, romantic getaways", region: "Rajasthan", villa_count: 1 },
    { name: "Karjat", description: "Valley estates, nature", region: "West", villa_count: 0 },
    { name: "Nashik", description: "Vineyard villas, wine country", region: "West", villa_count: 0 },
    { name: "Kasauli", description: "Hill station, peaceful retreat", region: "North", villa_count: 0 },
    { name: "Mussoorie", description: "Queen of Hills, panoramic views", region: "North", villa_count: 0 },
    { name: "Shimla", description: "Himachal heritage, snow peaks", region: "North", villa_count: 0 },
    { name: "Ooty", description: "Nilgiri hills, tea estates", region: "South", villa_count: 0 },
    { name: "Wayand", description: "Kerala backwaters, green paradise", region: "South", villa_count: 0 },
    { name: "Panchgani", description: "Table land views, strawberry farms", region: "West", villa_count: 0 }
  ];
  
  let message = `🌍 StayVista Destinations (86+ locations)\n\n`;
  message += `Popular locations:\n`;
  
  locations.filter(l => l.villa_count > 0).forEach(loc => {
    message += `• ${loc.name} - ${loc.description} (${loc.villa_count} villas)\n`;
  });
  
  return jsonResponse({
    success: true,
    message,
    locations
  });
});

// Tool 7: Get Promotions
router.get('/api/tools/promotions', async (request, env) => {
  const promotions = [
    {
      name: "NEWVISTAS",
      description: "FLAT 50% OFF on 2nd night",
      discount: "50%",
      code: "NEWVISTAS",
      valid_for: "Newest villa escapes"
    },
    {
      name: "Midweek Reset",
      description: "Up to ₹10,000 off on weekday bookings",
      discount: "Up to ₹10,000",
      code: "MIDWEEK",
      valid_for: "Monday-Thursday stays"
    },
    {
      name: "Sunday Getaway",
      description: "26% OFF on all Sunday stays",
      discount: "26%",
      code: "SUNDAY26",
      valid_for: "Sunday check-in or check-out"
    },
    {
      name: "Early Bird",
      description: "10% off for bookings 30+ days in advance",
      discount: "10%",
      code: null,
      valid_for: "Bookings 30+ days ahead"
    },
    {
      name: "Extended Stay",
      description: "15% off for 5+ night bookings",
      discount: "15%",
      code: null,
      valid_for: "Stays of 5 nights or more"
    },
    {
      name: "Weekend Special",
      description: "20% off for Fri-Sun stays (2+ nights)",
      discount: "20%",
      code: null,
      valid_for: "Friday-Sunday, 2+ nights"
    }
  ];
  
  let message = `🎉 Current StayVista Promotions\n\n`;
  
  promotions.forEach((promo, index) => {
    message += `${index + 1}. ${promo.name}\n`;
    message += `   ${promo.description}\n`;
    message += `   Discount: ${promo.discount}\n`;
    if (promo.code) message += `   Code: ${promo.code}\n`;
    message += `   Valid: ${promo.valid_for}\n\n`;
  });
  
  return jsonResponse({
    success: true,
    message,
    promotions
  });
});

// ============================================
// PHASE 2: WEBHOOKS (Secure, Write Operations)
// ============================================

// Webhook 1: Create Booking
router.post('/api/webhooks/create-booking', async (request, env) => {
  const params = await request.json();
  const { villa_id, guest_name, email, phone, check_in, check_out, guests, special_requests, promo_code } = params;
  
  const villa = VILLAS.find(v => v.id === villa_id);
  if (!villa) {
    return jsonResponse({
      success: false,
      message: "Villa not found."
    }, 400);
  }
  
  // Generate booking ID
  const bookingId = `SV${bookingCounter++}`;
  
  // Calculate pricing
  const startDate = new Date(check_in);
  const endDate = new Date(check_out);
  const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
  const basePrice = villa.price_per_night * nights;
  
  // Simple discount calculation
  let totalDiscount = 0;
  if (nights >= 5) totalDiscount += Math.round(basePrice * 0.15);
  if (promo_code && promo_code.toUpperCase() === 'NEWVISTAS') {
    totalDiscount += Math.round(basePrice * 0.50);
  }
  
  const maxDiscount = Math.round(basePrice * 0.40);
  if (totalDiscount > maxDiscount) totalDiscount = maxDiscount;
  
  const subtotal = basePrice - totalDiscount;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;
  
  // Store booking
  const booking = {
    id: bookingId,
    villa_id,
    villa_name: villa.name,
    guest_name,
    email,
    phone,
    check_in,
    check_out,
    guests,
    nights,
    base_price: basePrice,
    discount: totalDiscount,
    taxes,
    total,
    special_requests,
    promo_code,
    status: 'CONFIRMED',
    created_at: new Date().toISOString()
  };
  
  BOOKINGS.set(bookingId, booking);
  
  let message = `🎉 Booking Confirmed!\n\n`;
  message += `Booking ID: ${bookingId}\n`;
  message += `Guest: ${guest_name}\n`;
  message += `Villa: ${villa.name}\n`;
  message += `Dates: ${check_in} to ${check_out} (${nights} nights)\n`;
  message += `Guests: ${guests}\n`;
  message += `Total: ₹${total.toLocaleString()}\n\n`;
  message += `A confirmation email has been sent to ${email}.\n`;
  message += `For any changes, quote your Booking ID: ${bookingId}`;
  
  return jsonResponse({
    success: true,
    message,
    booking
  });
});

// Webhook 2: Cancel Booking
router.post('/api/webhooks/cancel-booking', async (request, env) => {
  const params = await request.json();
  const { booking_id, reason } = params;
  
  const booking = BOOKINGS.get(booking_id);
  if (!booking) {
    return jsonResponse({
      success: false,
      message: "Booking not found."
    }, 404);
  }
  
  // Calculate refund based on cancellation policy
  const checkInDate = new Date(booking.check_in);
  const today = new Date();
  const daysUntilCheckin = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
  
  let refundPercentage = 0;
  if (daysUntilCheckin >= 15) {
    refundPercentage = 100;
  } else if (daysUntilCheckin >= 7) {
    refundPercentage = 50;
  } else {
    refundPercentage = 0;
  }
  
  const refundAmount = Math.round(booking.total * (refundPercentage / 100));
  
  // Update booking status
  booking.status = 'CANCELLED';
  booking.cancellation_reason = reason;
  booking.refund_amount = refundAmount;
  booking.refund_percentage = refundPercentage;
  booking.cancelled_at = new Date().toISOString();
  
  let message = `✅ Booking ${booking_id} Cancelled\n\n`;
  message += `Refund: ${refundPercentage}% = ₹${refundAmount.toLocaleString()}\n`;
  message += `Refund will be processed within 5-7 business days.\n`;
  if (reason) message += `Reason: ${reason}`;
  
  return jsonResponse({
    success: true,
    message,
    booking
  });
});

// Webhook 3: Reschedule Booking
router.post('/api/webhooks/reschedule-booking', async (request, env) => {
  const params = await request.json();
  const { booking_id, new_check_in, new_check_out, reason } = params;
  
  const booking = BOOKINGS.get(booking_id);
  if (!booking) {
    return jsonResponse({
      success: false,
      message: "Booking not found."
    }, 404);
  }
  
  // Update dates
  const oldDates = `${booking.check_in} to ${booking.check_out}`;
  booking.check_in = new_check_in;
  booking.check_out = new_check_out;
  booking.reschedule_reason = reason;
  booking.rescheduled_at = new Date().toISOString();
  
  // Recalculate nights
  const startDate = new Date(new_check_in);
  const endDate = new Date(new_check_out);
  const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
  booking.nights = nights;
  
  let message = `✅ Booking ${booking_id} Rescheduled\n\n`;
  message += `Old dates: ${oldDates}\n`;
  message += `New dates: ${new_check_in} to ${new_check_out} (${nights} nights)\n`;
  message += `A confirmation email has been sent with updated details.`;
  
  return jsonResponse({
    success: true,
    message,
    booking
  });
});

// Webhook 4: Booking Status
router.post('/api/webhooks/booking-status', async (request, env) => {
  const params = await request.json();
  const { booking_id } = params;
  
  const booking = BOOKINGS.get(booking_id);
  if (!booking) {
    return jsonResponse({
      success: false,
      message: "Booking not found."
    }, 404);
  }
  
  let message = `📋 Booking Details: ${booking_id}\n\n`;
  message += `Status: ${booking.status}\n`;
  message += `Guest: ${booking.guest_name}\n`;
  message += `Villa: ${booking.villa_name}\n`;
  message += `Dates: ${booking.check_in} to ${booking.check_out}\n`;
  message += `Guests: ${booking.guests}\n`;
  message += `Total: ₹${booking.total.toLocaleString()}\n`;
  if (booking.special_requests) {
    message += `Special Requests: ${booking.special_requests}\n`;
  }
  
  return jsonResponse({
    success: true,
    message,
    booking
  });
});

// Webhook 5: Corporate Enquiry
router.post('/api/webhooks/corporate-enquiry', async (request, env) => {
  const params = await request.json();
  const { company_name, contact_name, email, phone, event_type, group_size, location, dates, budget, requirements } = params;
  
  // Generate enquiry ID
  const enquiryId = `CORP${Date.now().toString(36).toUpperCase().slice(-8)}`;
  
  let message = `🏢 Corporate Enquiry Received\n\n`;
  message += `Enquiry ID: ${enquiryId}\n`;
  message += `Company: ${company_name}\n`;
  message += `Contact: ${contact_name}\n`;
  message += `Event Type: ${event_type}\n`;
  message += `Group Size: ${group_size}\n`;
  if (location) message += `Preferred Location: ${location}\n`;
  if (dates) message += `Preferred Dates: ${dates}\n`;
  if (budget) message += `Budget: ${budget}\n`;
  if (requirements) message += `Requirements: ${requirements}\n`;
  message += `\nOur corporate team will contact you within 24 hours with a custom proposal.`;
  
  return jsonResponse({
    success: true,
    message,
    enquiry: {
      id: enquiryId,
      company_name,
      contact_name,
      email,
      phone,
      event_type,
      group_size,
      location,
      dates,
      budget,
      requirements,
      status: 'RECEIVED',
      created_at: new Date().toISOString()
    }
  });
});

// ============================================
// ADMIN & HEALTH ENDPOINTS
// ============================================

// Health Check
router.get('/api/health', async (request, env) => {
  return jsonResponse({
    status: "healthy",
    service: "StayVista Voice Agent API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    phases: {
      phase1_tools: "active",
      phase2_webhooks: "active"
    },
    stats: {
      total_villas: VILLAS.length,
      total_bookings: BOOKINGS.size,
      locations: 15
    }
  });
});

// List All Bookings
router.get('/api/bookings', async (request, env) => {
  const bookings = Array.from(BOOKINGS.values());
  return jsonResponse({
    success: true,
    count: bookings.length,
    bookings
  });
});

// ============================================
// MAIN HANDLER
// ============================================

export default {
  async fetch(request, env, ctx) {
    // Add CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      const response = await router.handle(request, env);
      
      // Add CORS to response
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });
    } catch (error) {
      return jsonResponse({
        success: false,
        message: error.message
      }, 500);
    }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
