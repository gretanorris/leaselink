export type UserRole = "student" | "landlord";
export type LandlordStatus = "pending" | "verified";
export type ApplicationStatus = "pending" | "accepted" | "rejected";
export type LandlordType = "Independent Landlord" | "Property Management Company";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: LandlordStatus;
  companyName?: string;
  phone?: string;
  propertyAddress?: string;
  landlordType?: LandlordType;
}

export interface Listing {
  id: string;
  landlordId: string;
  landlordName: string;
  title: string;
  address: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  amenities: string[];
  images: string[];
  available: string;
  leaseLength: 6 | 12;
  petFriendly: boolean;
  verified: boolean;
  requirements: {
    minCreditScore: number;
    incomeMultiplier: number;
    coSignerRequired: boolean;
  };
}

export interface Application {
  id: string;
  listingId: string;
  landlordId: string;
  studentId: string;
  name: string;
  personalEmail: string;
  berkeleyEmail: string;
  message: string;
  status: ApplicationStatus;
  submittedAt: string;
}

export const SEED_LISTINGS: Listing[] = [
  {
    id: "l1",
    landlordId: "landlord-demo",
    landlordName: "Marcus Johnson",
    title: "Sunny Studio Near Campus",
    address: "2345 Telegraph Ave, Berkeley, CA 94704",
    neighborhood: "Southside",
    price: 1850,
    beds: 0,
    baths: 1,
    sqft: 380,
    description:
      "Bright studio apartment steps from UC Berkeley's south gate. Recently renovated kitchen with stainless steel appliances, in-unit laundry, and a private balcony overlooking a quiet courtyard. Perfect for focused students who love natural light.",
    amenities: ["In-unit Laundry", "Balcony", "Stainless Appliances", "High-Speed WiFi Ready", "Bike Storage"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    ],
    available: "2025-08-01",
    leaseLength: 12,
    petFriendly: false,
    verified: true,
    requirements: { minCreditScore: 650, incomeMultiplier: 2.5, coSignerRequired: false },
  },
  {
    id: "l2",
    landlordId: "landlord-demo",
    landlordName: "Sarah Chen",
    title: "Charming 2BR in Elmwood",
    address: "456 College Ave, Berkeley, CA 94705",
    neighborhood: "Elmwood",
    price: 3200,
    beds: 2,
    baths: 1,
    sqft: 850,
    description:
      "Spacious two-bedroom with original hardwood floors and updated bath in the coveted Elmwood neighborhood. Walking distance to the Elmwood shopping district, cafes, and the Claremont BART. Shared backyard patio and off-street parking included.",
    amenities: ["Hardwood Floors", "Backyard", "Off-Street Parking", "Pet-Friendly", "Shared Washer/Dryer"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80",
    ],
    available: "2025-07-15",
    leaseLength: 12,
    petFriendly: true,
    verified: true,
    requirements: { minCreditScore: 700, incomeMultiplier: 3, coSignerRequired: false },
  },
  {
    id: "l3",
    landlordId: "other-landlord",
    landlordName: "David Kim",
    title: "Modern 1BR in Northside",
    address: "789 Euclid Ave, Berkeley, CA 94708",
    neighborhood: "Northside",
    price: 2400,
    beds: 1,
    baths: 1,
    sqft: 620,
    description:
      "Modern one-bedroom in quiet Northside, just a short walk to the north side of campus. Renovated in 2023 with new flooring, updated kitchen and bath, and ample closet space. The building features secure entry, a rooftop deck, and on-site management.",
    amenities: ["Rooftop Deck", "Secure Entry", "Renovated Kitchen", "Ample Closets", "On-Site Management"],
    images: [
      "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
    ],
    available: "2025-08-15",
    leaseLength: 12,
    petFriendly: false,
    verified: true,
    requirements: { minCreditScore: 680, incomeMultiplier: 2.8, coSignerRequired: true },
  },
  {
    id: "l4",
    landlordId: "other-landlord",
    landlordName: "Lisa Park",
    title: "Cozy 3BR House in Rockridge",
    address: "1200 Broadway Ter, Oakland, CA 94611",
    neighborhood: "Rockridge",
    price: 4800,
    beds: 3,
    baths: 2,
    sqft: 1400,
    description:
      "Gorgeous craftsman house in sought-after Rockridge, just one BART stop from campus. Three large bedrooms, two full baths, a chef's kitchen with island, private backyard with garden beds, and a two-car garage. Ideal for a group of students who want space and character.",
    amenities: ["Private Backyard", "2-Car Garage", "Chef's Kitchen", "Garden Beds", "Fireplace", "Washer/Dryer"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
    ],
    available: "2025-07-01",
    leaseLength: 12,
    petFriendly: true,
    verified: false,
    requirements: { minCreditScore: 720, incomeMultiplier: 3.5, coSignerRequired: false },
  },
  {
    id: "l5",
    landlordId: "other-landlord",
    landlordName: "Tom Rivera",
    title: "Budget Studio in West Berkeley",
    address: "3400 San Pablo Ave, Berkeley, CA 94702",
    neighborhood: "West Berkeley",
    price: 1450,
    beds: 0,
    baths: 1,
    sqft: 320,
    description:
      "Affordable studio in West Berkeley, great for students on a budget. Clean and recently painted, with a kitchenette and large windows. Close to AC Transit bus lines and the Berkeley Bowl. Utilities included in rent.",
    amenities: ["Utilities Included", "AC Transit Nearby", "Kitchenette", "Laundry in Building"],
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80",
    ],
    available: "2025-09-01",
    leaseLength: 6,
    petFriendly: false,
    verified: false,
    requirements: { minCreditScore: 600, incomeMultiplier: 2, coSignerRequired: true },
  },
  {
    id: "l6",
    landlordId: "landlord-demo",
    landlordName: "Marcus Johnson",
    title: "Luxury 1BR with Skyline Views",
    address: "2100 Durant Ave, Berkeley, CA 94704",
    neighborhood: "Southside",
    price: 3100,
    beds: 1,
    baths: 1,
    sqft: 720,
    description:
      "Premium one-bedroom on the top floor of a boutique building with sweeping views of the Bay. Floor-to-ceiling windows, quartz countertops, in-unit washer/dryer, and a dedicated parking spot. Concierge package service and secure building access.",
    amenities: ["Bay Views", "Floor-to-Ceiling Windows", "In-Unit Laundry", "Parking", "Concierge", "Quartz Counters"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    available: "2025-08-01",
    leaseLength: 12,
    petFriendly: false,
    verified: true,
    requirements: { minCreditScore: 720, incomeMultiplier: 3, coSignerRequired: false },
  },
];

export const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51TMZjcIZ10P8Ps21ZOC7ULYvRamMfObR0Er9Im5zD0UWeMeC6RCd0o1u9J7NhlNbmYOTMcEa6Qt8daYN3OxHVl9p0068keOWXE";

export const STORAGE_KEYS = {
  users: "leaselink_users",
  listings: "leaselink_listings",
  applications: "leaselink_applications",
  currentUser: "leaselink_current_user",
} as const;
