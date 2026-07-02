import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Listing {
  id: string;
  landlordId: string;
  landlordName: string;
  landlordVerified: boolean;
  landlordRating: number;
  title: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: "apartment" | "house" | "studio" | "room";
  amenities: string[];
  description: string;
  imageColor: string;
  availableFrom: string;
  petFriendly: boolean;
  furnished: boolean;
  distanceToUniversity: string;
  leaseLength: "6-month" | "12-month" | "flexible";
  requiresCosigner: boolean;
  minCreditScore: number;
  verified: boolean;
  createdAt: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Application {
  id: string;
  listingId: string;
  listingTitle: string;
  landlordName: string;
  status: "submitted" | "viewed" | "interview" | "decision";
  submittedAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  listingId: string;
  listingTitle: string;
  landlordName: string;
  landlordId: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

const SEED_LISTINGS: Listing[] = [
  {
    id: "1",
    landlordId: "l1",
    landlordName: "Maria Chen",
    landlordVerified: true,
    landlordRating: 4.9,
    title: "Modern Studio near Sather Gate",
    address: "2345 Telegraph Ave",
    city: "Berkeley, CA",
    price: 1850,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 420,
    type: "studio",
    amenities: ["WiFi", "Laundry", "Gym", "Parking", "AC", "Dishwasher"],
    description: "Bright and modern studio apartment just 3 minutes from UC Berkeley's main gate. Recently renovated with new appliances, hardwood floors, and large windows with views of the hills. Perfect for a focused student lifestyle.",
    imageColor: "#1B2A4A",
    availableFrom: "2024-08-01",
    petFriendly: false,
    furnished: true,
    distanceToUniversity: "0.3 mi",
    leaseLength: "12-month",
    requiresCosigner: false,
    minCreditScore: 650,
    verified: true,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: "r1", author: "jsmith2...@berkeley.edu", rating: 5, text: "Amazing landlord! Always responsive and the apartment was spotless. Perfect location for getting to campus.", date: "2024-01-15" },
      { id: "r2", author: "lchen...@berkeley.edu", rating: 5, text: "Loved living here. Safe neighborhood, great natural light. Maria kept everything in perfect condition.", date: "2023-11-20" },
    ],
  },
  {
    id: "2",
    landlordId: "l2",
    landlordName: "James Park",
    landlordVerified: true,
    landlordRating: 4.7,
    title: "Spacious 2BR near Sproul Plaza",
    address: "2512 Durant Ave",
    city: "Berkeley, CA",
    price: 3200,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    type: "apartment",
    amenities: ["WiFi", "Dishwasher", "AC", "Storage", "Bike Parking"],
    description: "Huge two-bedroom apartment with an open floor plan, perfect for two roommates. Large closets, in-unit dishwasher, and a cozy balcony overlooking the tree-lined street near campus.",
    imageColor: "#243660",
    availableFrom: "2024-07-15",
    petFriendly: true,
    furnished: false,
    distanceToUniversity: "0.5 mi",
    leaseLength: "12-month",
    requiresCosigner: true,
    minCreditScore: 700,
    verified: true,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: "r3", author: "mwilliams...@berkeley.edu", rating: 4, text: "Great location! Quick walk to Wheeler Hall. James was easy to work with on everything.", date: "2024-02-05" },
    ],
  },
  {
    id: "3",
    landlordId: "l1",
    landlordName: "Maria Chen",
    landlordVerified: true,
    landlordRating: 4.9,
    title: "Cozy Room in Student House",
    address: "2820 Benvenue Ave",
    city: "Berkeley, CA",
    price: 1200,
    bedrooms: 1,
    bathrooms: 2,
    sqft: 200,
    type: "room",
    amenities: ["WiFi", "Backyard", "Kitchen", "Parking", "Laundry"],
    description: "Private furnished room in a friendly 4-person student house. Quiet neighborhood, large shared kitchen, and a great community garden in the backyard. Bills included.",
    imageColor: "#1A3558",
    availableFrom: "2024-09-01",
    petFriendly: false,
    furnished: true,
    distanceToUniversity: "0.8 mi",
    leaseLength: "6-month",
    requiresCosigner: false,
    minCreditScore: 600,
    verified: true,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: "r4", author: "ptaylor...@berkeley.edu", rating: 5, text: "Best student living situation I've had. Housemates are great, Maria handles everything promptly.", date: "2024-03-10" },
      { id: "r5", author: "agarcia...@berkeley.edu", rating: 4, text: "Super convenient location, close to Elmwood shops. Would absolutely recommend.", date: "2023-12-15" },
    ],
  },
  {
    id: "4",
    landlordId: "l3",
    landlordName: "Sophia Williams",
    landlordVerified: true,
    landlordRating: 4.8,
    title: "3BR House with Yard — North Berkeley",
    address: "1850 Euclid Ave",
    city: "Berkeley, CA",
    price: 5400,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    type: "house",
    amenities: ["WiFi", "Yard", "Garage", "Washer/Dryer", "Dishwasher", "Fireplace"],
    description: "Beautiful 3-bedroom Craftsman house steps from campus with a fully equipped kitchen, private yard, and two full bathrooms. Great for a group of friends looking for a true home away from home.",
    imageColor: "#152038",
    availableFrom: "2024-08-15",
    petFriendly: true,
    furnished: false,
    distanceToUniversity: "0.7 mi",
    leaseLength: "12-month",
    requiresCosigner: true,
    minCreditScore: 720,
    verified: true,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: "r6", author: "bjohnson...@berkeley.edu", rating: 5, text: "This house is incredible. Sophia is the most responsive landlord I've ever had.", date: "2024-01-28" },
    ],
  },
  {
    id: "5",
    landlordId: "l2",
    landlordName: "James Park",
    landlordVerified: true,
    landlordRating: 4.7,
    title: "Budget Studio — 6-month Lease",
    address: "2950 Shattuck Ave",
    city: "Berkeley, CA",
    price: 1600,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 350,
    type: "studio",
    amenities: ["WiFi", "Laundry", "Storage"],
    description: "Affordable and functional studio apartment ideal for students on a budget. Clean, safe building with on-site laundry and great AC Transit access to campus.",
    imageColor: "#1E3566",
    availableFrom: "2024-07-01",
    petFriendly: false,
    furnished: false,
    distanceToUniversity: "1.2 mi",
    leaseLength: "6-month",
    requiresCosigner: false,
    minCreditScore: 580,
    verified: true,
    createdAt: new Date().toISOString(),
    reviews: [],
  },
];

const SEED_APPLICATIONS: Application[] = [
  {
    id: "app1",
    listingId: "1",
    listingTitle: "Modern Studio near Sather Gate",
    landlordName: "Maria Chen",
    status: "interview",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app2",
    listingId: "3",
    listingTitle: "Cozy Room in Student House",
    landlordName: "Maria Chen",
    status: "viewed",
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const SEED_MESSAGES: Message[] = [
  {
    id: "msg1",
    listingId: "1",
    listingTitle: "Modern Studio near Sather Gate",
    landlordName: "Maria Chen",
    landlordId: "l1",
    lastMessage: "Thanks for your application! Are you available Thursday for a tour?",
    lastTime: "10:42 AM",
    unread: 1,
    messages: [
      { id: "m1", senderId: "student", text: "Hi Maria! I'm very interested in the studio. Is it still available?", time: "Yesterday 3:15 PM" },
      { id: "m2", senderId: "l1", text: "Hi! Yes it's still available. Your .edu verification looks great.", time: "Yesterday 4:00 PM" },
      { id: "m3", senderId: "student", text: "Wonderful! I submitted an application.", time: "Yesterday 4:30 PM" },
      { id: "m4", senderId: "l1", text: "Thanks for your application! Are you available Thursday for a tour?", time: "10:42 AM" },
    ],
  },
  {
    id: "msg2",
    listingId: "3",
    listingTitle: "Cozy Room in Student House",
    landlordName: "Maria Chen",
    landlordId: "l1",
    lastMessage: "We've reviewed your application and it looks great!",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { id: "m5", senderId: "student", text: "Hello, is the room in the student house still available for September?", time: "2 days ago" },
      { id: "m6", senderId: "l1", text: "We've reviewed your application and it looks great!", time: "Yesterday" },
    ],
  },
];

interface ListingsContextType {
  listings: Listing[];
  savedIds: string[];
  recentlyViewedIds: string[];
  applications: Application[];
  messages: Message[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  addRecentlyViewed: (id: string) => void;
  addListing: (listing: Omit<Listing, "id" | "createdAt" | "reviews">) => void;
  deleteListing: (id: string) => void;
  getMyListings: (landlordId: string) => Listing[];
  sendMessage: (threadId: string, text: string) => void;
}

const ListingsContext = createContext<ListingsContextType | null>(null);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [applications] = useState<Application[]>(SEED_APPLICATIONS);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedListings = await AsyncStorage.getItem("leaselink_listings");
      if (storedListings) {
        const parsed = JSON.parse(storedListings);
        if (parsed.length > 0) setListings(parsed);
      }
      const storedSaved = await AsyncStorage.getItem("leaselink_saved");
      if (storedSaved) setSavedIds(JSON.parse(storedSaved));
      const storedViewed = await AsyncStorage.getItem("leaselink_viewed");
      if (storedViewed) setRecentlyViewedIds(JSON.parse(storedViewed));
    } catch {}
  };

  const toggleSave = async (id: string) => {
    const next = savedIds.includes(id) ? savedIds.filter((s) => s !== id) : [...savedIds, id];
    setSavedIds(next);
    await AsyncStorage.setItem("leaselink_saved", JSON.stringify(next));
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const addRecentlyViewed = async (id: string) => {
    const next = [id, ...recentlyViewedIds.filter((v) => v !== id)].slice(0, 10);
    setRecentlyViewedIds(next);
    await AsyncStorage.setItem("leaselink_viewed", JSON.stringify(next));
  };

  const addListing = async (listing: Omit<Listing, "id" | "createdAt" | "reviews">) => {
    const newListing: Listing = {
      ...listing,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      reviews: [],
    };
    const updated = [newListing, ...listings];
    setListings(updated);
    await AsyncStorage.setItem("leaselink_listings", JSON.stringify(updated));
  };

  const deleteListing = async (id: string) => {
    const updated = listings.filter((l) => l.id !== id);
    setListings(updated);
    await AsyncStorage.setItem("leaselink_listings", JSON.stringify(updated));
  };

  const getMyListings = (landlordId: string) => listings.filter((l) => l.landlordId === landlordId);

  const sendMessage = (threadId: string, text: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === threadId
          ? {
              ...m,
              messages: [
                ...m.messages,
                { id: Date.now().toString(), senderId: "student", text, time: "Just now" },
              ],
              lastMessage: text,
              lastTime: "Just now",
            }
          : m
      )
    );
  };

  return (
    <ListingsContext.Provider
      value={{
        listings,
        savedIds,
        recentlyViewedIds,
        applications,
        messages,
        toggleSave,
        isSaved,
        addRecentlyViewed,
        addListing,
        deleteListing,
        getMyListings,
        sendMessage,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used within ListingsProvider");
  return ctx;
}
