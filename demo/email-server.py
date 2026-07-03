#!/usr/bin/env python3
"""
StayVista Demo — Email API Server
Handles booking confirmation email requests from the frontend.
Sends via Gmail SMTP (himalaya CLI) or Python smtplib directly.
"""

import smtplib
import ssl
import json
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler, ThreadingHTTPServer
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os

# Gmail credentials (from himalaya config)
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "kamatanuj@gmail.com"
SMTP_PASSWORD = "yapm wbbh wqak vygb"  # App password
FROM_EMAIL = "kamatanuj@gmail.com"
FROM_NAME = "StayVista Demo"

PORT = 8901


def send_booking_email(to_email, booking_data):
    """Send a styled HTML confirmation email."""
    villa_name = booking_data.get("villa_name", "Unknown Villa")
    villa_id = booking_data.get("villa_id", "N/A")
    booking_id = booking_data.get("booking_id", "N/A")
    guest_name = booking_data.get("guest_name", "Guest")
    phone = booking_data.get("phone", "N/A")
    check_in = booking_data.get("check_in", "TBD")
    check_out = booking_data.get("check_out", "TBD")
    guests = booking_data.get("guests", "N/A")
    price = booking_data.get("price_per_night", "N/A")
    location = booking_data.get("location", "India")
    nights = booking_data.get("nights", 1)
    total = f"Rs.{(int(price) * nights):,}" if str(price).isdigit() else "TBD"

    html_body = f"""\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:Georgia,'Times New Roman',serif;">

  <!-- DEMO BANNER -->
  <div style="background:#e74c3c;text-align:center;padding:10px;font-size:14px;color:white;font-weight:bold;letter-spacing:1px;">
    ⚠️ THIS IS A DEMO EMAIL — No actual booking has been made. This is from a voice AI prototype.
  </div>

  <!-- Header -->
  <div style="background:#1a1a2e;padding:30px 40px;text-align:center;">
    <h1 style="color:#c99700;margin:0;font-size:32px;letter-spacing:-1px;">Stay<span style="color:white;">Vista</span></h1>
    <p style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:4px;font-family:Arial,sans-serif;">Luxury Villas & Holiday Homes in India</p>
  </div>

  <!-- Booking Confirmed -->
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <div style="padding:40px 30px;text-align:center;">
      <div style="font-size:56px;margin-bottom:8px;">🎉</div>
      <h2 style="color:#1a1a2e;font-size:26px;margin-bottom:8px;">Booking Request Confirmed!</h2>
      <p style="color:#c99700;font-size:16px;font-weight:600;font-family:Arial,sans-serif;">Booking ID: {booking_id}</p>
    </div>

    <!-- Details -->
    <div style="padding:0 30px 30px;">
      <p style="font-size:16px;color:#444;line-height:1.6;font-family:Arial,sans-serif;">
        Hi <strong>{guest_name}</strong>,<br><br>
        Thank you for choosing StayVista! We've received your booking request for <strong>{villa_name}</strong> in {location}. Our team will call you at <strong>{phone}</strong> within 2 hours to confirm your reservation and process payment.
      </p>

      <div style="background:#faf9f7;border-radius:8px;padding:24px;margin:24px 0;font-family:Arial,sans-serif;">
        <h3 style="color:#1a1a2e;font-size:16px;margin:0 0 16px;border-bottom:1px solid #eee;padding-bottom:12px;">📋 Booking Details</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="color:#888;padding:6px 0;width:40%;">Villa</td><td style="font-weight:600;padding:6px 0;">{villa_name} ({villa_id})</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Location</td><td style="font-weight:600;padding:6px 0;">{location}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Check-in</td><td style="font-weight:600;padding:6px 0;">{check_in}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Check-out</td><td style="font-weight:600;padding:6px 0;">{check_out}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Guests</td><td style="font-weight:600;padding:6px 0;">{guests}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Price/night</td><td style="font-weight:600;padding:6px 0;">Rs.{int(price):,}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Total ({nights} nights)</td><td style="font-weight:600;color:#c99700;padding:6px 0;">{total}</td></tr>
        </table>
      </div>

      <div style="background:#fef9ef;border-left:4px solid #c99700;padding:16px;border-radius:4px;margin:24px 0;font-family:Arial,sans-serif;">
        <p style="margin:0;font-size:14px;color:#444;">
          <strong>What's included:</strong> Private pool, daily housekeeping, free WiFi, chef on request, free parking, and 24/7 on-ground support.
        </p>
      </div>

      <div style="text-align:center;margin:30px 0;">
        <p style="font-size:14px;color:#666;font-family:Arial,sans-serif;">Check-in: 2:00 PM | Check-out: 11:00 AM</p>
        <p style="font-size:14px;color:#666;font-family:Arial,sans-serif;">Need help? Call +91-91679-28471 or email care@stayvista.com</p>
      </div>

      <a href="https://www.stayvista.com" style="display:inline-block;background:#c99700;color:white;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;font-family:Arial,sans-serif;">Explore More Villas →</a>
    </div>
  </div>

  <!-- Footer -->
  <div style="max-width:600px;margin:0 auto;padding:30px;text-align:center;">
    <p style="color:#888;font-size:12px;font-family:Arial,sans-serif;line-height:1.6;">
      StayVista © 2025 | <a href="https://www.stayvista.com" style="color:#c99700;text-decoration:none;">stayvista.com</a> | Script Your Stay<br>
      This email was sent from a <strong>voice AI demo prototype</strong>. No real booking has been placed. Prices shown are illustrative and subject to seasonal availability.
    </p>
  </div>
</body>
</html>
"""

    text_body = f"""
STAYVISTA — BOOKING CONFIRMATION (DEMO)

⚠️ THIS IS A DEMO EMAIL — No actual booking has been made.

Booking ID: {booking_id}

Hi {guest_name},

Thank you for choosing StayVista! We've received your booking request for {villa_name} in {location}. Our team will call you at {phone} within 2 hours to confirm your reservation.

BOOKING DETAILS:
  Villa: {villa_name} ({villa_id})
  Location: {location}
  Check-in: {check_in}
  Check-out: {check_out}
  Guests: {guests}
  Price: Rs.{int(price):,}/night
  Total ({nights} nights): {total}

What's included: Private pool, daily housekeeping, free WiFi, chef on request, free parking, 24/7 support.

Check-in: 2:00 PM | Check-out: 11:00 AM
Need help? Call +91-91679-28471 or email care@stayvista.com

---
StayVista © 2025 | stayvista.com | Script Your Stay
This email was sent from a voice AI demo prototype. No real booking has been placed.
"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[DEMO] StayVista Booking Confirmed — {villa_name} ({booking_id})"
    msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
    msg["To"] = to_email
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(FROM_EMAIL, [to_email], msg.as_string())

    return True


class EmailHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self.send_response(200)
        self._set_cors_headers()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _send_json(self, code, payload):
        """Send a JSON response with proper headers."""
        body = json.dumps(payload).encode()
        self.send_response(code)
        self._set_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        """Handle email send request."""
        if self.path != "/api/send-confirmation-email":
            self._send_json(404, {"error": "Not found"})
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self._send_json(400, {"success": False, "error": "Invalid JSON"})
            return

        to_email = data.get("email", "").strip()
        if not to_email or "@" not in to_email:
            self._send_json(400, {"success": False, "error": "Valid email address required"})
            return

        try:
            send_booking_email(to_email, data)
            self._send_json(200, {"success": True, "message": f"Demo confirmation email sent to {to_email}", "to": to_email})
            print(f"[{datetime.now().isoformat()}] ✅ Email sent to {to_email} — villa={data.get('villa_name','?')} booking={data.get('booking_id','?')}")
        except Exception as e:
            print(f"[{datetime.now().isoformat()}] ❌ Email failed: {e}")
            self._send_json(500, {"success": False, "error": str(e)})

    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def log_message(self, format, *args):
        print(f"[{datetime.now().isoformat()}] {args[0]}")


if __name__ == "__main__":
    print(f"📧 StayVista Email API Server starting on port {PORT}...")
    print(f"   Endpoint: POST http://localhost:{PORT}/api/send-confirmation-email")
    print(f"   From: {FROM_EMAIL}")
    server = ThreadingHTTPServer(('0.0.0.0', PORT), EmailHandler)
    server.serve_forever()