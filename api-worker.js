// Cloudflare Worker for StayVista Voice Agent API
// Serves Phase 1 (Tools), Phase 2 (Webhooks), and Phase 3 (Advanced Tools)

import { Router } from './worker-router.js';

// Initialize router with our handlers
const router = new Router();

// Real StayVista property database (scraped from stayvista.com)
// 28 villas across 17 locations with real amenities
const VILLAS = [
  {
    id: "villa_001",
    name: "Villa Arcadia - Candolim",
    location: "North Goa",
    region: "Goa",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 8,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Private Pool", "Lawn", "AC", "Balcony/Terrace", "Indoor/Outdoor Games", "TV", "Wi-Fi", "Music System/Speaker", "Refrigerator", "Wheelchair Friendly", "Cook Available", "Pet Friendly", "Hair Dryer", "Water Purifier", "Fire Extinguisher", "Indoor Parking", "CCTV", "Wardrobe", "Geyser", "Extra Mattress", "Toiletries", "Towels"],
    pet_friendly: true,
    description: "Relax and unwind in this gorgeous 3 BHK beach-side villa located in Candolim and have an unforgettable beach getaway. Make the most of the plenty of space available here for family and friends to spread out and enjoy the comfortable interiors. The villa has a magnificent pool where you can spend you...",
    slug: "villa-arcadia-candolim-3-bhk-villa-in-goa-with-private-pool-and-spacious-rooms",
    url: "https://www.stayvista.com/villa/villa-arcadia-candolim-3-bhk-villa-in-goa-with-private-pool-and-spacious-rooms",
  },
  {
    id: "villa_002",
    name: "The Vara House",
    location: "Varanasi",
    region: "Uttar Pradesh",
    bedrooms: 14,
    bathrooms: 14,
    max_guests: 28,
    price_per_night: 55000,
    price_category: "Luxury",
    villa_type: "Heritage",
    amenities: ["Indoor/Outdoor Games", "Wi-Fi", "AC", "Heater", "A/C", "Refrigerator", "Workstation", "Fire Extinguisher", "CCTV", "Indoor Parking", "Water Purifier", "Geyser", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "the-vara-house",
    url: "https://www.stayvista.com/villa/the-vara-house",
  },
  {
    id: "villa_003",
    name: "Sukoon Villa - Manor",
    location: "Mumbai",
    region: "Maharashtra",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 9,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Lawn", "Private Pool", "Balcony/Terrace", "Indoor/Outdoor Games", "Wi-Fi", "AC", "Music System/Speaker", "TV", "A/C", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Water Purifier", "Hair Dryer", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels", "Outdoor Parking"],
    pet_friendly: false,
    description: "",
    slug: "sukoon-villa",
    url: "https://www.stayvista.com/villa/sukoon-villa",
  },
  {
    id: "villa_004",
    name: "La Beaumont",
    location: "Alibaug",
    region: "Maharashtra",
    bedrooms: 4,
    bathrooms: 2,
    max_guests: 12,
    price_per_night: 30000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Bonfire", "BBQ", "Lawn", "Private Pool", "Wi-Fi", "Indoor/Outdoor Games", "AC", "Balcony/Terrace", "Music System/Speaker", "TV", "A/C", "Refrigerator", "CCTV", "Fire Extinguisher", "Water Purifier", "Indoor Parking", "Extra Mattress", "Geyser", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "la-beaumont",
    url: "https://www.stayvista.com/villa/la-beaumont",
  },
  {
    id: "villa_005",
    name: "Bean & Brick Villa",
    location: "Chikmagalur",
    region: "Karnataka",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 12,
    price_per_night: 30000,
    price_category: "Premium",
    villa_type: "Nature Resort",
    amenities: ["Bonfire", "Lawn", "Balcony/Terrace", "Indoor/Outdoor Games", "Gazebo", "Wi-Fi", "Music System/Speaker", "TV", "Pet Friendly", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Indoor Parking", "Water Purifier", "Hair Dryer", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels", "Outdoor Parking"],
    pet_friendly: true,
    description: "",
    slug: "bean-brick-villa",
    url: "https://www.stayvista.com/villa/bean-brick-villa",
  },
  {
    id: "villa_006",
    name: "Pranaam",
    location: "Alibaug",
    region: "Maharashtra",
    bedrooms: 6,
    bathrooms: 6,
    max_guests: 15,
    price_per_night: 45000,
    price_category: "Luxury",
    villa_type: "Pool",
    amenities: ["BBQ", "Lawn", "Private Pool", "Balcony/Terrace", "AC", "Wi-Fi", "Indoor/Outdoor Games", "Music System/Speaker", "TV", "Refrigerator", "Bar", "Wheelchair Friendly", "Indoor Parking", "Fire Extinguisher", "CCTV", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Towels", "Toiletries"],
    pet_friendly: false,
    description: "With a beautiful modern exterior and luxurious interiors, Pranaam Villa is the epitome of a holiday retreat. Located only a few hours away from the city, barely 10 minutes from Mandwa Jetty, this sprawling property is ideal to spend time with your loved ones. Along with cosy outdoor sit-outs for you...",
    slug: "pranaam-6-bhk-villa-in-alibaug-with-private-pool-and-spacious-rooms",
    url: "https://www.stayvista.com/villa/pranaam-6-bhk-villa-in-alibaug-with-private-pool-and-spacious-rooms",
  },
  {
    id: "villa_007",
    name: "Serenova",
    location: "Coorg",
    region: "Karnataka",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 12,
    price_per_night: 30000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["BBQ", "Lawn", "Private Pool", "AC", "Wi-Fi", "Indoor/Outdoor Games", "Music System/Speaker", "TV", "A/C", "Refrigerator", "Driver/Staff Accommodation", "Workstation", "Bar", "Indoor Parking", "Iron", "CCTV", "Fire Extinguisher", "Hair Dryer", "Water Purifier", "Extra Mattress", "Geyser", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "serenova",
    url: "https://www.stayvista.com/villa/serenova",
  },
  {
    id: "villa_008",
    name: "Oakwood Manor",
    location: "Shimla",
    region: "Himachal Pradesh",
    bedrooms: 6,
    bathrooms: 6,
    max_guests: 18,
    price_per_night: 45000,
    price_category: "Luxury",
    villa_type: "Hill Station",
    amenities: ["Bonfire", "BBQ", "Lawn", "Wi-Fi", "Indoor/Outdoor Games", "Music System/Speaker", "TV", "Refrigerator", "Wheelchair Friendly", "Cook Available", "Indoor Parking", "CCTV", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Towels", "Toiletries"],
    pet_friendly: false,
    description: "",
    slug: "oakwood-manor",
    url: "https://www.stayvista.com/villa/oakwood-manor",
  },
  {
    id: "villa_009",
    name: "The Mint Villa",
    location: "Karjat",
    region: "Maharashtra",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 9,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Bonfire", "BBQ", "Lawn", "Private Pool", "Bathtub", "Gazebo", "Wi-Fi", "AC", "Balcony/Terrace", "TV", "Sports Turf", "Indoor/Outdoor Games", "Bar", "Refrigerator", "Workstation", "Fire Extinguisher", "Iron", "CCTV", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "the-mint-villa",
    url: "https://www.stayvista.com/villa/the-mint-villa",
  },
  {
    id: "villa_010",
    name: "Villa Cobblestone",
    location: "Nashik",
    region: "Maharashtra",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 12,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Private Pool", "Lawn", "Indoor/Outdoor Games", "Music System/Speaker", "TV", "Wheelchair Friendly", "Bar", "Refrigerator", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "Nashik is home to some of the most remarkable homes, and Villa Cobblestone is no exception. True to its name, the exteriors of this holiday home are adorned with a stone-facade, and the interiors are an effortless blend of vintage furnishings and modern amenities. Equipped with a plethora of ameniti...",
    slug: "villa-cobblestone-3-bhk-villa-in-nashik-with-private-pool-and-spacious-rooms",
    url: "https://www.stayvista.com/villa/villa-cobblestone-3-bhk-villa-in-nashik-with-private-pool-and-spacious-rooms",
  },
  {
    id: "villa_011",
    name: "Evora @ Ved Vilas",
    location: "Shimla",
    region: "Himachal Pradesh",
    bedrooms: 6,
    bathrooms: 6,
    max_guests: 18,
    price_per_night: 45000,
    price_category: "Luxury",
    villa_type: "Hill Station",
    amenities: ["Bonfire", "BBQ", "Lawn", "Balcony/Terrace", "Indoor/Outdoor Games", "Wi-Fi", "AC", "Heater", "Music System/Speaker", "TV", "Pet Friendly", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Indoor Parking", "Water Purifier", "Hair Dryer", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: true,
    description: "",
    slug: "evora-at-ved-vilas",
    url: "https://www.stayvista.com/villa/evora-at-ved-vilas",
  },
  {
    id: "villa_012",
    name: "Maison Vera - Vasai",
    location: "Mumbai",
    region: "Maharashtra",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 10,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Bonfire", "BBQ", "Lawn", "Private Pool", "Balcony/Terrace", "Indoor/Outdoor Games", "Gazebo", "Wi-Fi", "AC", "Music System/Speaker", "TV", "A/C", "Workstation", "Refrigerator", "Iron", "CCTV", "Indoor Parking", "Water Purifier", "Hair Dryer", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "maison-vera",
    url: "https://www.stayvista.com/villa/maison-vera",
  },
  {
    id: "villa_013",
    name: "7 Rooms @ Serene w/ Outdoor Bonfire",
    location: "Kasauli",
    region: "Himachal Pradesh",
    bedrooms: 7,
    bathrooms: 7,
    max_guests: 18,
    price_per_night: 45000,
    price_category: "Luxury",
    villa_type: "Hill Station",
    amenities: ["BBQ", "Lawn", "Bonfire", "Heater", "Indoor/Outdoor Games", "Balcony/Terrace", "Music System/Speaker", "TV", "AC", "Refrigerator", "Water Purifier", "Fire Extinguisher", "Indoor Parking", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "Relive the bygone eras and catch a glimpse of the yesteryears while at Serene in Barog. It's spectacular, vintage interiors featuring statement period pieces along with its equally stunning exteriors echo a certain alluring old charm. Snuggle under the tartan blankets on the terrace and gaze at the ...",
    slug: "7-rooms-at-serene",
    url: "https://www.stayvista.com/villa/7-rooms-at-serene",
  },
  {
    id: "villa_014",
    name: "Nature’s Island",
    location: "Nashik",
    region: "Maharashtra",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 12,
    price_per_night: 30000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Bonfire", "BBQ", "Lawn", "Private Pool", "Balcony/Terrace", "Indoor/Outdoor Games", "Gazebo", "AC", "Heater", "Music System/Speaker", "TV", "A/C", "Driver/Staff Accommodation", "Wheelchair Friendly", "Bar", "Workstation", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Indoor Parking", "Water Purifier", "Hair Dryer", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "natures-island",
    url: "https://www.stayvista.com/villa/natures-island",
  },
  {
    id: "villa_015",
    name: "Amritalaya - Raison",
    location: "Manali",
    region: "Himachal Pradesh",
    bedrooms: 6,
    bathrooms: 6,
    max_guests: 18,
    price_per_night: 45000,
    price_category: "Luxury",
    villa_type: "Hill Station",
    amenities: ["Bonfire", "BBQ", "Lawn", "Indoor/Outdoor Games", "Wi-Fi", "AC", "Music System/Speaker", "TV", "Heater", "Balcony/Terrace", "Wheelchair Friendly", "Driver/Staff Accommodation", "Workstation", "Refrigerator", "Fire Extinguisher", "CCTV", "Iron", "Indoor Parking", "Hair Dryer", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "amritalaya",
    url: "https://www.stayvista.com/villa/amritalaya",
  },
  {
    id: "villa_016",
    name: "The Beach House",
    location: "Alibaug",
    region: "Maharashtra",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 10,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Private Pool", "Lawn", "BBQ", "Wi-Fi", "Music System/Speaker", "TV", "AC", "Indoor/Outdoor Games", "Driver/Staff Accommodation", "Refrigerator", "Hair Dryer", "Water Purifier", "Fire Extinguisher", "Indoor Parking", "Extra Mattress", "Wardrobe", "Geyser", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "Take a break from the hectic life of the city and head over to The Beach House. Like its name suggests, this beautiful villa is located a stone's throw away from one of the cleanest beaches in Alibaug, Awas Beach. Featuring a beautiful blend of tropical and modern interiors, while here, guests can p...",
    slug: "the-beach-house-3-bhk-villa-in-alibaug-with-private-pool-and-spacious-rooms",
    url: "https://www.stayvista.com/villa/the-beach-house-3-bhk-villa-in-alibaug-with-private-pool-and-spacious-rooms",
  },
  {
    id: "villa_017",
    name: "Ostia Marari - a Boutique Beach Stay",
    location: "Alleppey",
    region: "Kerala",
    bedrooms: 6,
    bathrooms: 6,
    max_guests: 18,
    price_per_night: 45000,
    price_category: "Luxury",
    villa_type: "Beachfront",
    amenities: ["BBQ", "Lawn", "Balcony/Terrace", "Indoor/Outdoor Games", "Wi-Fi", "AC", "Music System/Speaker", "TV", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Indoor Parking", "Water Purifier", "Hair Dryer", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "ostia-marari-a-boutique-beach-stay",
    url: "https://www.stayvista.com/villa/ostia-marari-a-boutique-beach-stay",
  },
  {
    id: "villa_018",
    name: "Saya Infinity",
    location: "Karjat",
    region: "Maharashtra",
    bedrooms: 8,
    bathrooms: 8,
    max_guests: 24,
    price_per_night: 55000,
    price_category: "Luxury",
    villa_type: "Pool",
    amenities: ["Bonfire", "BBQ", "Lawn", "Private Pool", "Balcony/Terrace", "Sports Turf", "Indoor/Outdoor Games", "Gazebo", "Bathtub", "Wi-Fi", "AC", "Music System/Speaker", "TV", "A/C", "Driver/Staff Accommodation", "Pet Friendly", "Bar", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Indoor Parking", "Water Purifier", "Hair Dryer", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: true,
    description: "",
    slug: "saya-infinity",
    url: "https://www.stayvista.com/villa/saya-infinity",
  },
  {
    id: "villa_019",
    name: "Star @ Oakwood Manor",
    location: "Shimla",
    region: "Himachal Pradesh",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 9,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Hill Station",
    amenities: ["Bonfire", "BBQ", "Lawn", "Heater", "Wi-Fi", "Indoor/Outdoor Games", "Music System/Speaker", "TV", "Refrigerator", "Wheelchair Friendly", "Cook Available", "Indoor Parking", "CCTV", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Towels", "Toiletries"],
    pet_friendly: false,
    description: "",
    slug: "star-at-oakwood-manor",
    url: "https://www.stayvista.com/villa/star-at-oakwood-manor",
  },
  {
    id: "villa_020",
    name: "Pranamya Villa",
    location: "Alibaug",
    region: "Maharashtra",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 12,
    price_per_night: 30000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Bonfire", "BBQ", "Lawn", "Private Pool", "Balcony/Terrace", "Indoor/Outdoor Games", "Gazebo", "Wi-Fi", "AC", "Music System/Speaker", "TV", "A/C", "Driver/Staff Accommodation", "Pet Friendly", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Indoor Parking", "Water Purifier", "Hair Dryer", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: true,
    description: "",
    slug: "pranamya-villa",
    url: "https://www.stayvista.com/villa/pranamya-villa",
  },
  {
    id: "villa_021",
    name: "Mountain Rain",
    location: "Wayanad",
    region: "Kerala",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 9,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Nature Resort",
    amenities: ["BBQ", "Lawn", "AC", "Wi-Fi", "Indoor/Outdoor Games", "Bathtub", "Music System/Speaker", "TV", "Refrigerator", "Indoor Parking", "CCTV", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Towels", "Toiletries"],
    pet_friendly: false,
    description: "This heavenly home couldn't ask for a more idyllic location. The sprawling greens this home is surrounded by, create a sense that the entire hillside is your playground. You will also find many seating and lounging areas to unwind by these ethereal views. Inside, lounge by the aesthetic living area,...",
    slug: "mountain-rain",
    url: "https://www.stayvista.com/villa/mountain-rain",
  },
  {
    id: "villa_022",
    name: "Summit @ The Mohru Estate - Chail w/ Heated Pool",
    location: "Shimla",
    region: "Himachal Pradesh",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 12,
    price_per_night: 30000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["BBQ", "Lawn", "Private Pool", "Balcony/Terrace", "Indoor/Outdoor Games", "Gazebo", "Wi-Fi", "AC", "Heater", "Music System/Speaker", "TV", "A/C", "Wheelchair Friendly", "Driver/Staff Accommodation", "Bar", "Workstation", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Indoor Parking", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "summit-at-the-mohru-estate",
    url: "https://www.stayvista.com/villa/summit-at-the-mohru-estate",
  },
  {
    id: "villa_023",
    name: "Shambala @ Himalayan Retreat",
    location: "Manali",
    region: "Himachal Pradesh",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 8,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Hill Station",
    amenities: ["BBQ", "Lawn", "Bonfire", "TV", "Balcony/Terrace", "Balcony/Terrace", "Heater", "Indoor/Outdoor Games", "Music System/Speaker", "Wi-Fi", "Driver/Staff Accommodation", "Refrigerator", "Electric Blanket", "Pet Friendly", "Wheelchair Friendly", "Hair Dryer", "Fire Extinguisher", "CCTV", "Indoor Parking", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: true,
    description: "A verdurous forest, impressive wooden contemporary interiors, and oh-so-dreamy views allow these Swiss chalets to stand in a league of their own. An amalgamation of 3 stunning units that offer an individual home in itself, this charming abode puts you in a quintessential neighbourhood amongst the co...",
    slug: "shambala-at-himalayan-retreat",
    url: "https://www.stayvista.com/villa/shambala-at-himalayan-retreat",
  },
  {
    id: "villa_024",
    name: "Amanat Riverfront Cottage",
    location: "Pahalgam",
    region: "Jammu And Kashmir",
    bedrooms: 7,
    bathrooms: 7,
    max_guests: 21,
    price_per_night: 45000,
    price_category: "Luxury",
    villa_type: "Hill Station",
    amenities: ["Bonfire", "BBQ", "Lawn", "Balcony/Terrace", "Indoor/Outdoor Games", "Jacuzzi", "Wi-Fi", "AC", "Heater", "Music System/Speaker", "A/C", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Water Purifier", "Hair Dryer", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "amanat-riverfront-cottage",
    url: "https://www.stayvista.com/villa/amanat-riverfront-cottage",
  },
  {
    id: "villa_025",
    name: "Tableland Vista",
    location: "Panchgani",
    region: "Maharashtra",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 20,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Bonfire", "Lawn", "Private Pool", "Balcony/Terrace", "Heater", "AC", "Wi-Fi", "Indoor/Outdoor Games", "Jacuzzi", "TV", "Music System/Speaker", "Refrigerator", "Pet Friendly", "Driver/Staff Accommodation", "CCTV", "Fire Extinguisher", "Hair Dryer", "Water Purifier", "Iron", "Geyser", "Wardrobe", "Extra Mattress", "Towels", "Toiletries"],
    pet_friendly: true,
    description: "",
    slug: "tableland-vista",
    url: "https://www.stayvista.com/villa/tableland-vista",
  },
  {
    id: "villa_026",
    name: "Villa 360",
    location: "Nainital",
    region: "Uttarakhand",
    bedrooms: 5,
    bathrooms: 5,
    max_guests: 15,
    price_per_night: 38000,
    price_category: "Luxury",
    villa_type: "Hill Station",
    amenities: ["Bonfire", "BBQ", "Heater", "Indoor/Outdoor Games", "TV", "Balcony/Terrace", "Wi-Fi", "Pet Friendly", "Water Purifier", "CCTV", "Indoor Parking", "Geyser", "Extra Mattress", "Wardrobe", "Towels", "Toiletries"],
    pet_friendly: true,
    description: "Amidst the majestic Ayarpatta Hills, Villa 360 lies on a sloping hill, overlooking the lush greenery. The spacious, rustic interiors feature beautiful arches, glittering chandeliers, and vibrant pops of colour spread throughout the home. The balcony overlooks the surrounding expanse of greenery, whi...",
    slug: "villa-360",
    url: "https://www.stayvista.com/villa/villa-360",
  },
  {
    id: "villa_027",
    name: "Golden Petal",
    location: "Panchgani",
    region: "Maharashtra",
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 12,
    price_per_night: 30000,
    price_category: "Premium",
    villa_type: "Pool",
    amenities: ["Bonfire", "BBQ", "Lawn", "Private Pool", "Balcony/Terrace", "Indoor/Outdoor Games", "Wi-Fi", "AC", "Music System/Speaker", "Workstation", "Refrigerator", "Iron", "CCTV", "Fire Extinguisher", "Indoor Parking", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "",
    slug: "golden-petal",
    url: "https://www.stayvista.com/villa/golden-petal",
  },
  {
    id: "villa_028",
    name: "Mellow Cottage",
    location: "Mussoorie",
    region: "Uttarakhand",
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 7,
    price_per_night: 22000,
    price_category: "Premium",
    villa_type: "Hill Station",
    amenities: ["Bonfire", "BBQ", "Lawn", "Indoor/Outdoor Games", "Wi-Fi", "Heater", "Refrigerator", "Cook Available", "CCTV", "Indoor Parking", "Water Purifier", "Geyser", "Extra Mattress", "Wardrobe", "Toiletries", "Towels"],
    pet_friendly: false,
    description: "While at Mellow Cottage, you are guaranteed to be at your peaceful best, amidst the starry skies. One of the last houses on the hill, this cosy holiday home overlooks the picture-perfect snow-clad Himalayas. Wake up to the sweet sound of birdsongs, listen to the humming of churchbells, enjoy the win...",
    slug: "mellow-cottage",
    url: "https://www.stayvista.com/villa/mellow-cottage",
  },
];
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

// Tool 3a: Get Villa Details via Browser (Live StayVista scraping)
router.post('/api/tools/get-villa-details', async (request, env) => {
  const params = await request.json();
  const { villa_name, villa_id } = params;
  if (!villa_name) {
    return jsonResponse({
      success: false,
      message: "Please provide a villa name so I can look up the details for you.",
      villa_name: ""
    }, 400);
  }
  try {
    const result = await fetchVillaDetailsFromStayVista(villa_name, villa_id);
    return jsonResponse(result);
  } catch (e) {
    console.error("Browser tool error:", e);
    return jsonResponse({
      success: false,
      villa_name: villa_name,
      found: false,
      message: "I encountered an issue pulling up those details. Let me connect you with our villa specialist who can assist personally.",
      fallback_price_range: "₹15,000 – ₹45,000 per night",
      next_step: "Ask guest for preferred location, dates, and budget so our team can curate options."
    }, 500);
  }
});
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
// BROWSER AGENT FUNCTIONS (get-villa-details)
// ============================================

async function fetchVillaDetailsFromStayVista(villaName, villaId) {
  // Step 0: Check local mock database first (for demo/testing)
  const localMatch = VILLAS.find(v => 
    v.name.toLowerCase().includes(villaName.toLowerCase()) ||
    (villaId && v.id === villaId)
  );
  if (localMatch) {
    return {
      success: true,
      villa_name: localMatch.name,
      found: true,
      source: "local_database",
      villa_url: `https://www.stayvista.com/villas/${localMatch.id}`,
      location: `${localMatch.location}, ${localMatch.region}`,
      price_per_night: `₹${localMatch.price_per_night.toLocaleString()}`,
      bedrooms: String(localMatch.bedrooms),
      bathrooms: String(localMatch.bathrooms),
      max_guests: String(localMatch.max_guests),
      amenities: localMatch.amenities,
      description: localMatch.description,
      images: [],
      pet_friendly: localMatch.pet_friendly,
      villa_type: localMatch.villa_type,
      price_category: localMatch.price_category,
      availability_status: "Requires date-specific check — use check_availability tool",
      recommendation: `${localMatch.name} in ${localMatch.location} offers ${localMatch.bedrooms} bedrooms for up to ${localMatch.max_guests} guests at ₹${localMatch.price_per_night.toLocaleString()} per night. Key amenities include ${localMatch.amenities.slice(0, 4).join(", ")}.`,
    };
  }

  // Step 1: Try to search StayVista (works for client-side rendered sites via API if available)
  const searchUrl = `https://www.stayvista.com/search?query=${encodeURIComponent(villaName)}`;
  
  const searchResponse = await fetch(searchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
  });

  if (!searchResponse.ok) {
    return {
      villa_name: villaName,
      found: false,
      message: "StayVista search is temporarily unavailable.",
      fallback_price_range: "₹15,000 – ₹45,000 per night",
      suggestions: getSimilarVillaSuggestions(villaName),
      next_step: "Ask guest for their preferred location, dates, and budget so our team can curate options.",
    };
  }

  const searchHtml = await searchResponse.text();
  const villaLinks = extractVillaLinks(searchHtml, villaName);

  if (villaLinks.length === 0) {
    return {
      villa_name: villaName,
      found: false,
      message: `I couldn't locate "${villaName}" on StayVista. It may be sold out, renamed, or available under a slightly different name.`,
      fallback_price_range: "₹15,000 – ₹45,000 per night",
      suggestions: getSimilarVillaSuggestions(villaName),
      next_step: "Ask guest for their preferred location, dates, and budget so our team can curate options.",
    };
  }

  // Step 2: Open the villa page and extract details
  const villaUrl = villaLinks[0];
  const villaResponse = await fetch(`https://www.stayvista.com${villaUrl}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
  });

  const villaHtml = await villaResponse.text();
  const details = extractVillaData(villaHtml, villaUrl);

  return {
    success: true,
    villa_name: details.name || villaName,
    found: true,
    villa_url: `https://www.stayvista.com${villaUrl}`,
    location: details.location || "StayVista",
    price_per_night: details.price || "Contact for pricing",
    bedrooms: details.bedrooms || "",
    bathrooms: details.bathrooms || "",
    max_guests: details.maxGuests || "",
    amenities: details.amenities || [],
    description: details.description || "",
    images: details.images || [],
    availability_status: "Requires date-specific check — use check_availability tool",
    recommendation: formatRecommendation(details),
  };
}

function extractVillaLinks(html, query) {
  const links = [];
  const regex = /href="(\/villas\/[^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const url = match[1];
    if (!links.includes(url)) links.push(url);
  }
  const altRegex = /href="(\/properties\/[^"]+)"/g;
  while ((match = altRegex.exec(html)) !== null) {
    const url = match[1];
    if (!links.includes(url)) links.push(url);
  }
  return links.slice(0, 3);
}

function extractVillaData(html, urlPath) {
  const data = {
    name: "", location: "", price: "",
    bedrooms: "", bathrooms: "", maxGuests: "",
    amenities: [], description: "", images: [],
  };

  // Extract name from <title> or h1
  const titleMatch = html.match(/<title>([^<]+)/i);
  if (titleMatch) {
    data.name = titleMatch[1].replace(/\s*\|\s*StayVista/, "").trim();
  }

  // Extract location
  const locationMatch = html.match(/"location"\s*:\s*"([^"]+)"/i) || 
    html.match(/"city"\s*:\s*"([^"]+)"/i) ||
    html.match(/<span[^>]*class="[^"]*location[^"]*"[^>]*>([^<]+)/i);
  if (locationMatch) data.location = locationMatch[1].trim();

  // Extract price - look for ₹ or Rs patterns
  const priceMatch = html.match(/[₹Rs.\s]+([\d,]+(?:\s*-\s*[\d,]+)?)/i) ||
    html.match(/price["\s]*[:=]["\s]*["']?([\d,]+)/i);
  if (priceMatch) data.price = `₹${priceMatch[1].trim()}`;

  // Extract bedrooms
  const bedMatch = html.match(/(\d+)\s*(?:Bedroom|BHK|bed)/i);
  if (bedMatch) data.bedrooms = bedMatch[1];

  // Extract bathrooms
  const bathMatch = html.match(/(\d+)\s*Bathroom/i);
  if (bathMatch) data.bathrooms = bathMatch[1];

  // Extract max guests
  const guestMatch = html.match(/(\d+)\s*(?:Guests?|Max Guests?)/i);
  if (guestMatch) data.maxGuests = guestMatch[1];

  // Extract amenities from JSON
  const amenityRegex = /"amenities"\s*:\s*\[([^\]]+)\]/i;
  const amenityMatch = html.match(amenityRegex);
  if (amenityMatch) {
    const raw = amenityMatch[1];
    const items = raw.match(/"([^"]+)"/g);
    if (items) {
      data.amenities = items.map(s => s.replace(/"/g, "")).slice(0, 8);
    }
  }
  if (data.amenities.length === 0) {
    const iconRegex = /<span[^>]*class="[^"]*amenity[^"]*"[^>]*>([^<]+)/gi;
    let am;
    while ((am = iconRegex.exec(html)) !== null) {
      if (am[1].trim().length > 2 && !data.amenities.includes(am[1].trim())) {
        data.amenities.push(am[1].trim());
      }
    }
  }

  // Extract description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) ||
    html.match(/"description"\s*:\s*"([^"]{50,})"/i);
  if (descMatch) {
    data.description = descMatch[1].replace(/\\n/g, " ").replace(/\\/g, "").trim();
  }

  // Extract images
  const imgRegex = /"url"\s*:\s*"(https:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi;
  let img;
  while ((img = imgRegex.exec(html)) !== null) {
    if (!data.images.includes(img[1])) data.images.push(img[1]);
  }
  if (data.images.length === 0) {
    const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (ogImage) data.images.push(ogImage[1]);
  }

  return data;
}

function formatRecommendation(details) {
  const parts = [];
  if (details.name) parts.push(`${details.name}`);
  if (details.location) parts.push(`in ${details.location}`);
  if (details.bedrooms) parts.push(`offers ${details.bedrooms} bedrooms`);
  if (details.maxGuests) parts.push(`for up to ${details.maxGuests} guests`);
  if (details.price) parts.push(`at ${details.price} per night`);
  let rec = parts.join(" ");
  if (details.amenities?.length > 0) {
    rec += `. Key amenities include ${details.amenities.slice(0, 4).join(", ")}.`;
  }
  return rec || "A beautiful villa option — ask me about availability and pricing for your dates.";
}

function getSimilarVillaSuggestions(query) {
  const queryLower = query.toLowerCase();
  return VILLAS.filter(v => 
    v.location.toLowerCase().includes(queryLower) ||
    v.villa_type.toLowerCase().includes(queryLower)
  ).slice(0, 3).map(v => ({
    id: v.id, name: v.name, location: v.location,
    price_per_night: v.price_per_night, bedrooms: v.bedrooms
  }));
}

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
