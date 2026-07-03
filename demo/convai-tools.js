/**
 * StayVista Client Tools — SPA Edition (No Page Reloads!)
 *
 * KEY FIX: All "navigation" is done by showing/hiding <div> views.
 * No window.location.href changes — the ElevenLabs WebSocket stays alive.
 */

// === Villa Database (inline, no API calls) ===
const VILLA_DB = [
  // --- GOA (8 villas, all accommodate 8+ guests) ---
  { id: "SV-GOA-001", name: "Villa Serenity", location: "Goa", guests: 8, bedrooms: 4, price: 28000, type: "Beachfront", rating: 4.9, img: "https://images.unsplash.com/photo-1613490493576-ca68de2900c5?w=600", features: ["Private Pool", "Beach Access", "4 BHK", "AC"] },
  { id: "SV-GOA-002", name: "Villa Arcadia", location: "Goa", guests: 10, bedrooms: 5, price: 35000, type: "Beachfront", rating: 4.8, img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600", features: ["Private Pool", "Beach Access", "5 BHK", "Bar", "Party Deck"] },
  { id: "SV-GOA-003", name: "Casa de Sol", location: "Goa", guests: 12, bedrooms: 5, price: 32000, type: "Party", rating: 4.7, img: "https://images.unsplash.com/photo-1571896349842-33c891248539?w=600", features: ["Pool", "Party Deck", "5 BHK", "Bar", "Sound System"] },
  { id: "SV-GOA-004", name: "The Beach House", location: "Goa", guests: 8, bedrooms: 4, price: 26000, type: "Beachfront", rating: 4.7, img: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600", features: ["Beachfront", "Pool", "4 BHK", "Pet-Friendly"] },
  { id: "SV-GOA-005", name: "Villa Palmares", location: "Goa", guests: 8, bedrooms: 4, price: 24000, type: "Heritage", rating: 4.6, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600", features: ["Heritage", "Pool", "4 BHK", "Garden"] },
  { id: "SV-GOA-006", name: "Candolim Sands", location: "Goa", guests: 10, bedrooms: 4, price: 30000, type: "Beachfront", rating: 4.8, img: "https://images.unsplash.com/photo-1596394516093-501ba68a0e15?w=600", features: ["Beach Access", "Private Pool", "4 BHK", "Rooftop"] },
  { id: "SV-GOA-007", name: "Villa Sienna", location: "Goa", guests: 8, bedrooms: 3, price: 22000, type: "Eco-Friendly", rating: 4.5, img: "https://images.unsplash.com/photo-1605619227873-5d5e2d5e1b6a?w=600", features: ["Pool", "Garden", "3 BHK", "Eco-Friendly"] },
  { id: "SV-GOA-008", name: "Royal Palm Villa", location: "Goa", guests: 14, bedrooms: 6, price: 42000, type: "Party", rating: 4.9, img: "https://images.unsplash.com/photo-1613553474179-e1eda3a2e930?w=600", features: ["Private Pool", "6 BHK", "Bar", "Party Deck", "Beach Access"] },
  // --- LONAVALA ---
  { id: "SV-LON-001", name: "Hilltop Haven", location: "Lonavala", guests: 10, bedrooms: 4, price: 24000, type: "Hill", rating: 4.9, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600", features: ["Valley View", "Pool", "4 BHK", "Bonfire"] },
  { id: "SV-LON-002", name: "Misty Mountains", location: "Lonavala", guests: 8, bedrooms: 3, price: 18000, type: "Hill", rating: 4.6, img: "https://images.unsplash.com/photo-1605619227873-5d5e2d5e1b6a?w=600", features: ["Pool", "Garden", "3 BHK", "WiFi"] },
  // --- ALIBAUG ---
  { id: "SV-ALI-001", name: "Coastal Retreat", location: "Alibaug", guests: 8, bedrooms: 4, price: 26000, type: "Beachfront", rating: 4.8, img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600", features: ["Beach Access", "Pool", "4 BHK", "AC"] },
  // --- MANALI ---
  { id: "SV-MAN-001", name: "Valley View Villa", location: "Manali", guests: 12, bedrooms: 5, price: 30000, type: "Hill", rating: 4.7, img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", features: ["Mountain View", "Fireplace", "5 BHK", "Hot Tub"] },
  // --- COORG ---
  { id: "SV-COO-001", name: "Coffee County", location: "Coorg", guests: 6, bedrooms: 3, price: 16000, type: "Eco-Friendly", rating: 4.8, img: "https://images.unsplash.com/photo-1600593791207-1678763a9491?w=600", features: ["Plantation View", "Pool", "3 BHK", "Nature Walk"] },
  // --- UDAIPUR ---
  { id: "SV-UDA-001", name: "Lake Heritage", location: "Udaipur", guests: 10, bedrooms: 4, price: 32000, type: "Heritage", rating: 4.9, img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600", features: ["Lake View", "Heritage", "4 BHK", "Rooftop"] },
  // --- MABALESHWAR ---
  { id: "SV-MAB-001", name: "Strawberry Fields", location: "Mahabaleshwar", guests: 8, bedrooms: 3, price: 20000, type: "Hill", rating: 4.6, img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600", features: ["Garden", "Pool", "3 BHK", "Valley View"] }
];

// === SPA Navigation: show/hide views (NO page reload) ===
function showView(viewId) {
  console.log('[SPA] showView →', viewId);
  document.querySelectorAll('.spa-view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// === Render villas into the villas listing view ===
function renderVillas(filters) {
  const grid = document.getElementById('villasGrid');
  if (!grid) return;

  let villas = VILLA_DB;
  if (filters) {
    villas = VILLA_DB.filter(v => {
      if (filters.location && !v.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.guests && v.guests < filters.guests) return false;
      if (filters.max_budget && v.price > filters.max_budget) return false;
      if (filters.villa_type && !v.type.toLowerCase().includes(filters.villa_type.toLowerCase())) return false;
      if (filters.bedrooms && v.bedrooms < filters.bedrooms) return false;
      return true;
    });
  }

  // Update filter pills
  const filterContainer = document.getElementById('searchFilters');
  if (filterContainer) {
    filterContainer.innerHTML = '';
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val) {
          const pill = document.createElement('span');
          pill.className = 'filter-pill';
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
          pill.textContent = `${label}: ${val}`;
          filterContainer.appendChild(pill);
        }
      });
    }
    if (filterContainer.children.length === 0) {
      filterContainer.innerHTML = '<span class="filter-pill">All villas</span>';
    }
  }

  // Render cards
  grid.innerHTML = '';
  villas.forEach(villa => {
    const card = document.createElement('div');
    card.className = 'villa-card';
    card.setAttribute('data-villa-id', villa.id);
    card.setAttribute('data-villa-name', villa.name);
    card.onclick = () => openVillaDetail(villa.id);
    card.innerHTML = `
      <div class="image-wrap">
        <img src="${villa.img}" alt="${villa.name}">
        <div class="badge">${villa.type}</div>
      </div>
      <div class="info">
        <h3>${villa.name}</h3>
        <div class="location">📍 ${villa.location}, India</div>
        <div class="features">${villa.features.map(f => `<span>${f}</span>`).join('')}</div>
        <div class="rating"><strong>★ ${villa.rating}</strong> · ${villa.guests} guests · ${villa.bedrooms} BHK</div>
        <div class="price" style="margin-top: 8px;">₹${villa.price.toLocaleString('en-IN')}<small> /night</small></div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Store count for agent feedback
  window._lastVillaCount = villas.length;
}

// === Open villa detail view (SPA, no page reload) ===
function openVillaDetail(villaId) {
  const villa = VILLA_DB.find(v => v.id === villaId);
  if (!villa) return;

  const detailView = document.getElementById('view-villa-detail');
  if (!detailView) return;

  detailView.innerHTML = `
    <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px;">
      <button onclick="showView('view-villas')" style="background:none;border:none;color:#d4af37;font-size:14px;cursor:pointer;margin-bottom:20px;">← Back to Villas</button>
      <div class="villa-detail-card" data-villa-id="${villa.id}" data-villa-name="${villa.name}" style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <img src="${villa.img}" alt="${villa.name}" style="width:100%;height:400px;object-fit:cover;">
        <div style="padding:30px;">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:16px;">
            <div>
              <h2 style="font-size:28px;margin-bottom:4px;">${villa.name}</h2>
              <p style="font-size:15px;color:#666;">📍 ${villa.location}, India</p>
            </div>
            <div class="badge" style="position:static;background:#d4af37;color:#1a1a2e;padding:4px 12px;border-radius:4px;font-size:13px;font-weight:600;">${villa.type}</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin:24px 0;font-size:14px;">
            <div>👥 <strong>${villa.guests}</strong> guests</div>
            <div>🛏️ <strong>${villa.bedrooms}</strong> bedrooms</div>
            <div>⭐ <strong>${villa.rating}</strong> rating</div>
            <div>💰 ₹<strong>${villa.price.toLocaleString('en-IN')}</strong>/night</div>
          </div>
          <h3 style="margin:24px 0 12px;font-size:18px;">Amenities</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${villa.features.map(f => `<span style="background:#f3f4f6;padding:6px 14px;border-radius:6px;font-size:14px;">${f}</span>`).join('')}
          </div>
          <h3 style="margin:24px 0 12px;font-size:18px;">Description</h3>
          <p style="font-size:15px;line-height:1.8;color:#555;">${villa.name} is a stunning ${villa.type.toLowerCase()} property in ${villa.location}, perfect for ${villa.guests} guests across ${villa.bedrooms} bedrooms. Features ${villa.features.join(', ').toLowerCase()}. Rated ${villa.rating}/5 by happy guests.</p>
          <div style="margin-top:30px;padding:20px;background:#f8f9fa;border-radius:8px;">
            <p style="font-size:14px;color:#666;margin-bottom:12px;">📅 Check-in: 2:00 PM | Check-out: 11:00 AM</p>
            <p style="font-size:14px;color:#666;margin-bottom:12px;">🧹 Daily housekeeping included</p>
            <p style="font-size:14px;color:#666;">👨‍🍳 Chef available on request</p>
          </div>
        </div>
      </div>
    </div>
  `;

  showView('view-villa-detail');
}

// === Toast notification ===
function showToast(message, duration = 3000) {
  let toast = document.getElementById('stayvista-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'stayvista-toast';
    toast.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: rgba(26,26,46,0.95); color: #d4af37;
      padding: 12px 24px; border-radius: 8px; font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      z-index: 100000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s; pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.display = 'block';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.opacity = '0'; }, duration);
}

// ============================================================
// CLIENT TOOLS — registered with ElevenLabs SDK
// All use SPA navigation (show/hide divs) — NO page reloads
// ============================================================

const StayVistaClientTools = {

  /**
   * Show villas matching the user's search criteria.
   * Instead of navigating to /villas.html, we switch to the villas view
   * and render filtered cards — all in-page, no reload.
   */
  show_villas_on_page: async ({ location, guests, check_in, check_out, max_budget, villa_type, bedrooms }) => {
    console.log('[Tool] show_villas_on_page →', { location, guests, max_budget, villa_type, bedrooms });

    // Build filter object
    const filters = {};
    if (location) filters.location = location;
    if (guests) filters.guests = parseInt(guests);
    if (max_budget) filters.max_budget = parseInt(max_budget);
    if (villa_type) filters.villa_type = villa_type;
    if (bedrooms) filters.bedrooms = parseInt(bedrooms);

    // Switch to villas view (SPA — no page reload!)
    showView('view-villas');

    // Render filtered villas
    renderVillas(filters);

    // Build response for agent
    const count = window._lastVillaCount || 0;
    let msg = `Showing ${count} villas`;
    if (location) msg += ` in ${location}`;
    if (guests) msg += ` for ${guests}+ guests`;
    if (max_budget) msg += ` under ₹${max_budget}`;
    showToast(`Showing ${count} villas${location ? ' in ' + location : ''}`);

    return { success: true, villa_count: count, message: msg };
  },

  /**
   * Highlight a specific villa card with gold border + scroll into view.
   * Works entirely in the current page — no navigation.
   */
  highlight_villa: async ({ villa_id, villa_name }) => {
    console.log('[Tool] highlight_villa →', villa_id, villa_name);

    // Make sure we're on the villas view
    const villasView = document.getElementById('view-villas');
    if (!villasView || !villasView.classList.contains('active')) {
      showView('view-villas');
      renderVillas(null);
      // Small delay for view to appear
      await new Promise(r => setTimeout(r, 300));
    }

    // Try by data-villa-id first
    let card = document.querySelector(`[data-villa-id="${villa_id}"]`);
    if (!card && villa_name) {
      const cards = document.querySelectorAll('[data-villa-name]');
      for (const c of cards) {
        if (c.getAttribute('data-villa-name').toLowerCase().includes(villa_name.toLowerCase())) {
          card = c;
          break;
        }
      }
    }

    if (!card) {
      return { success: false, message: `Villa ${villa_id || villa_name} not found. Try asking to show villas first.` };
    }

    // Remove previous highlights
    document.querySelectorAll('.villa-highlight').forEach(el => el.classList.remove('villa-highlight'));
    card.classList.add('villa-highlight');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`⭐ Highlighting: ${card.getAttribute('data-villa-name') || villa_id}`);

    return { success: true, message: `Highlighted ${card.getAttribute('data-villa-name') || villa_id}. Scrolled into view.` };
  },

  /**
   * Open a villa's detail view (SPA — replaces page content, no reload).
   */
  open_villa_details: async ({ villa_id, villa_name }) => {
    console.log('[Tool] open_villa_details →', villa_id, villa_name);

    // Find villa in DB
    let villa = null;
    if (villa_id) {
      villa = VILLA_DB.find(v => v.id === villa_id);
    }
    if (!villa && villa_name) {
      villa = VILLA_DB.find(v => v.name.toLowerCase().includes(villa_name.toLowerCase()));
    }

    if (!villa) {
      return { success: false, message: 'Villa not found. Please specify the villa ID or name.' };
    }

    // Open detail view (SPA, no page reload)
    openVillaDetail(villa.id);
    showToast(`Opening details for ${villa.name}`);

    return {
      success: true,
      message: `Opened details for ${villa.name}`,
      villa: {
        id: villa.id,
        name: villa.name,
        location: villa.location,
        price: villa.price,
        guests: villa.guests,
        bedrooms: villa.bedrooms,
        rating: villa.rating,
        features: villa.features
      }
    };
  },

  /**
   * Scroll to a named section on the current page.
   */
  scroll_to_section: async ({ section_id }) => {
    console.log('[Tool] scroll_to_section →', section_id);

    let target = document.querySelector(`[data-section="${section_id}"]`);
    if (!target) target = document.getElementById(section_id);
    if (!target) target = document.querySelector(`[data-section*="${section_id}"]`);

    if (!target) {
      return { success: false, message: `Section "${section_id}" not found.` };
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`↓ Scrolled to: ${section_id}`);
    return { success: true, message: `Scrolled to ${section_id} section.` };
  },

  /**
   * Navigate to a page/view (SPA — show/hide, NO window.location change).
   */
  navigate_to_page: async ({ url }) => {
    console.log('[Tool] navigate_to_page →', url);

    // Map URL to SPA view
    let viewId = 'view-home';
    let pageName = 'home';

    if (url.includes('villa') && !url.includes('villas')) {
      // Individual villa page — need villa ID
      return { success: false, message: 'Please specify which villa you want to see. Use open_villa_details with a villa name.' };
    } else if (url.includes('villa')) {
      viewId = 'view-villas';
      pageName = 'villas listing';
      renderVillas(null);
    } else if (url.includes('about')) {
      viewId = 'view-home';
      pageName = 'about section';
    } else if (url.includes('contact')) {
      viewId = 'view-home';
      pageName = 'contact section';
    } else if (url === '/' || url === '/index.html' || url === 'home') {
      viewId = 'view-home';
      pageName = 'home';
    }

    showView(viewId);
    showToast(`Navigating to ${pageName}`);
    return { success: true, message: `Navigated to ${pageName}.` };
  },

  /**
   * Check availability for a villa on given dates.
   * Inline availability map — no backend needed.
   * SV-GOA-004 (The Beach House) is ALWAYS unavailable (fully booked).
   * SV-GOA-001 (Villa Serenity) is ALWAYS available.
   * All other villas are available by default.
   */
  check_availability: async ({ villa_id, villa_name, check_in, check_out }) => {
    console.log('[Tool] check_availability →', { villa_id, villa_name, check_in, check_out });

    // Resolve villa
    let villa = null;
    if (villa_id) villa = VILLA_DB.find(v => v.id === villa_id);
    if (!villa && villa_name) villa = VILLA_DB.find(v => v.name.toLowerCase().includes(villa_name.toLowerCase()));

    if (!villa) {
      return { success: false, available: false, message: 'Villa not found. Please specify the villa name or ID.' };
    }

    // Availability map (inline, demo purposes)
    // All villas are available by default for the demo.
    // To mark a villa as unavailable, add its ID to the array below.
    const UNAVAILABLE_VILLAS = ['SV-GOA-003']; // Casa de Sol is fully booked for demo

    const isUnavailable = UNAVAILABLE_VILLAS.includes(villa.id);
    const available = !isUnavailable;

    let msg;
    if (available) {
      msg = `${villa.name} (${villa.id}) is AVAILABLE for ${check_in || 'your dates'}${check_out ? ' to ' + check_out : ''}. ` +
            `Price: Rs.${villa.price.toLocaleString('en-IN')}/night. ` +
            `Accommodates ${villa.guests} guests in ${villa.bedrooms} bedrooms. ` +
            `Would you like me to proceed with the booking?`;
    } else {
      msg = `${villa.name} (${villa.id}) is currently FULLY BOOKED for those dates. ` +
            `I apologise for the inconvenience. ` +
            `May I suggest some similar villas in ${villa.location} that are available?`;
    }

    showToast(available ? `✅ ${villa.name} — Available` : `❌ ${villa.name} — Fully Booked`);

    return {
      success: true,
      villa_id: villa.id,
      villa_name: villa.name,
      available: available,
      check_in: check_in || null,
      check_out: check_out || null,
      price_per_night: villa.price,
      message: msg
    };
  },

  /**
   * Create a booking request (lead capture).
   * Stores the booking locally, shows a confirmation on screen,
   * AND sends a demo confirmation email if an email address is provided.
   */
  create_booking: async ({ villa_id, villa_name, guest_name, phone, email, check_in, check_out, guests }) => {
    console.log('[Tool] create_booking →', { villa_id, villa_name, guest_name, phone, email, check_in, check_out, guests });

    let villa = null;
    if (villa_id) villa = VILLA_DB.find(v => v.id === villa_id);
    if (!villa && villa_name) villa = VILLA_DB.find(v => v.name.toLowerCase().includes(villa_name.toLowerCase()));

    if (!villa) {
      return { success: false, message: 'Villa not found. Cannot create booking.' };
    }

    const bookingId = 'BK-' + Date.now().toString(36).toUpperCase();

    // Calculate nights
    let nights = 1;
    if (check_in && check_out) {
      try {
        const d1 = new Date(check_in);
        const d2 = new Date(check_out);
        nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
      } catch(e) {}
    }

    // Show booking confirmation on screen
    const detailView = document.getElementById('view-villa-detail');
    if (detailView) {
      detailView.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 60px 20px; text-align: center;">
          <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
            <h2 style="font-size: 24px; color: #1a1a2e; margin-bottom: 8px;">Booking Request Confirmed!</h2>
            <p style="font-size: 16px; color: #c99700; font-weight: 600; margin-bottom: 24px;">Booking ID: ${bookingId}</p>
            <div style="text-align: left; background: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 24px; font-size: 15px; line-height: 2;">
              <strong>Villa:</strong> ${villa.name} (${villa.id})<br>
              <strong>Location:</strong> ${villa.location}<br>
              <strong>Guests:</strong> ${guests || villa.guests}<br>
              <strong>Check-in:</strong> ${check_in || 'TBD'}<br>
              <strong>Check-out:</strong> ${check_out || 'TBD'}<br>
              <strong>Price:</strong> Rs.${villa.price.toLocaleString('en-IN')}/night<br>
              <strong>Total (${nights} nights):</strong> Rs.${(villa.price * nights).toLocaleString('en-IN')}<br>
              <strong>Guest Name:</strong> ${guest_name || 'TBD'}<br>
              <strong>Phone:</strong> ${phone || 'TBD'}<br>
              ${email ? `<strong>Email:</strong> ${email}<br>` : ''}
            </div>
            ${email ? `<div id="emailStatus" style="padding:12px;background:#fef9ef;border-radius:8px;margin-bottom:16px;font-size:14px;color:#8a6500;">📧 Sending confirmation email to ${email}...</div>` : '<div style="padding:12px;background:#f0f0f0;border-radius:8px;margin-bottom:16px;font-size:14px;color:#888;">💡 Tip: Provide an email address to receive a confirmation email!</div>'}
            <p style="font-size: 14px; color: #666;">Our team will call you within 2 hours to confirm your booking and process payment.</p>
            <button onclick="showView('view-home')" style="background: #c99700; color: white; border: none; border-radius: 30px; padding: 12px 32px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 16px;">Back to Home</button>
          </div>
        </div>
      `;
      showView('view-villa-detail');
    }

    showToast(`🎉 Booking confirmed: ${villa.name} — ${bookingId}`);

    // Send demo confirmation email if email address is provided
    let emailSent = false;
    let emailMsg = '';
    if (email && email.includes('@')) {
      try {
        // Same-origin POST (combined server handles /api/* alongside static files)
        const emailResponse = await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            booking_id: bookingId,
            villa_name: villa.name,
            villa_id: villa.id,
            guest_name: guest_name || 'Guest',
            phone: phone || 'N/A',
            check_in: check_in || 'TBD',
            check_out: check_out || 'TBD',
            guests: guests || villa.guests,
            price_per_night: villa.price,
            nights: nights,
            location: villa.location
          })
        });
        const emailResult = await emailResponse.json();
        if (emailResult.success) {
          emailSent = true;
          emailMsg = `A demo confirmation email has been sent to ${email}.`;
          // Update email status on page
          const emailStatusEl = document.getElementById('emailStatus');
          if (emailStatusEl) {
            emailStatusEl.innerHTML = `✅ Demo confirmation email sent to ${email}`;
            emailStatusEl.style.background = '#e8f5e9';
            emailStatusEl.style.color = '#2e7d32';
          }
          showToast(`📧 Email sent to ${email}`);
        } else {
          emailMsg = `Email sending failed: ${emailResult.error || 'unknown error'}.`;
          const emailStatusEl = document.getElementById('emailStatus');
          if (emailStatusEl) {
            emailStatusEl.innerHTML = `❌ Email failed: ${emailResult.error || 'error'}`;
            emailStatusEl.style.background = '#fce4ec';
            emailStatusEl.style.color = '#c62828';
          }
        }
      } catch (err) {
        console.error('[Tool] Email send failed:', err);
        emailMsg = `Email sending failed (server unavailable).`;
        const emailStatusEl = document.getElementById('emailStatus');
        if (emailStatusEl) {
          emailStatusEl.innerHTML = `❌ Email server unavailable`;
          emailStatusEl.style.background = '#fce4ec';
          emailStatusEl.style.color = '#c62828';
        }
      }
    }

    let returnMsg = `Booking request created successfully. Booking ID: ${bookingId}. ` +
                    `Our team will call ${guest_name || 'the guest'} at ${phone || 'the provided number'} within 2 hours to confirm. ` +
                    `Total: Rs.${(villa.price * nights).toLocaleString('en-IN')} for ${nights} night(s).`;
    if (emailSent) {
      returnMsg += ` ${emailMsg}`;
    } else if (email) {
      returnMsg += ` (Email sending failed — but booking is still confirmed.)`;
    }

    return {
      success: true,
      booking_id: bookingId,
      villa_id: villa.id,
      villa_name: villa.name,
      email_sent: emailSent,
      message: returnMsg
    };
  }
};

// Attach to window (const at top level doesn't create window properties in browsers)
window.StayVistaClientTools = StayVistaClientTools;
window.VILLA_DB = VILLA_DB;
window.showView = showView;
window.renderVillas = renderVillas;
window.openVillaDetail = openVillaDetail;