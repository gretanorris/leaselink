import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, Listing, Application, ApplicationStatus, LandlordStatus, SEED_LISTINGS, STORAGE_KEYS } from "./data";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface AppContextValue {
  user: User | null;
  users: User[];
  listings: Listing[];
  applications: Application[];
  toasts: Toast[];
  login: (user: User) => void;
  logout: () => void;
  registerUser: (user: User) => void;
  updateUserStatus: (id: string, status: LandlordStatus) => void;
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  submitApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  getLandlordListings: (landlordId?: string) => Listing[];
  getLandlordApplications: (landlordId?: string) => Application[];
  getListingApplications: (listingId: string) => Application[];
  getStudentApplications: (studentId?: string) => Application[];
  hasApplied: (listingId: string) => boolean;
  showToast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => read<User | null>(STORAGE_KEYS.currentUser, null));
  const [users, setUsers] = useState<User[]>(() => read<User[]>(STORAGE_KEYS.users, []));
  const [listings, setListings] = useState<Listing[]>(() => {
    const stored = read<Listing[]>(STORAGE_KEYS.listings, []);
    return stored.length > 0 ? stored : SEED_LISTINGS;
  });
  const [applications, setApplications] = useState<Application[]>(() => read<Application[]>(STORAGE_KEYS.applications, []));
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => write(STORAGE_KEYS.currentUser, user), [user]);
  useEffect(() => write(STORAGE_KEYS.users, users), [users]);
  useEffect(() => write(STORAGE_KEYS.listings, listings), [listings]);
  useEffect(() => write(STORAGE_KEYS.applications, applications), [applications]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = `t-${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);

  const registerUser = (newUser: User) => {
    setUsers((arr) => {
      const filtered = arr.filter((u) => u.id !== newUser.id);
      return [...filtered, newUser];
    });
  };

  const updateUserStatus = (id: string, status: LandlordStatus) => {
    setUsers((arr) => arr.map((u) => (u.id === id ? { ...u, status } : u)));
    setUser((cur) => (cur && cur.id === id ? { ...cur, status } : cur));
  };

  const addListing = (listing: Listing) => setListings((arr) => [...arr, listing]);
  const updateListing = (id: string, updates: Partial<Listing>) =>
    setListings((arr) => arr.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  const deleteListing = (id: string) => {
    setListings((arr) => arr.filter((l) => l.id !== id));
    setApplications((arr) => arr.filter((a) => a.listingId !== id));
  };

  const submitApplication = (app: Application) => setApplications((arr) => [...arr, app]);
  const updateApplicationStatus = (id: string, status: ApplicationStatus) =>
    setApplications((arr) => arr.map((a) => (a.id === id ? { ...a, status } : a)));

  const getLandlordListings = (landlordId?: string) => {
    const id = landlordId ?? user?.id;
    return listings.filter((l) => l.landlordId === id);
  };
  const getLandlordApplications = (landlordId?: string) => {
    const id = landlordId ?? user?.id;
    return applications.filter((a) => a.landlordId === id);
  };
  const getListingApplications = (listingId: string) =>
    applications.filter((a) => a.listingId === listingId);
  const getStudentApplications = (studentId?: string) => {
    const id = studentId ?? user?.id;
    return applications.filter((a) => a.studentId === id);
  };
  const hasApplied = (listingId: string) =>
    applications.some((a) => a.listingId === listingId && a.studentId === user?.id);

  return (
    <AppContext.Provider
      value={{
        user, users, listings, applications, toasts,
        login, logout, registerUser, updateUserStatus,
        addListing, updateListing, deleteListing,
        submitApplication, updateApplicationStatus,
        getLandlordListings, getLandlordApplications, getListingApplications, getStudentApplications,
        hasApplied, showToast, dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
