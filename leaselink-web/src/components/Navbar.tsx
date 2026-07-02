import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Menu, X, Home, Search, LayoutDashboard, LogOut, ClipboardList, Building2 } from "lucide-react";

export default function Navbar() {
  const { user, logout, showToast } = useApp();
  const [location, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast("Signed out successfully", "info");
    setMenuOpen(false);
    navigate("/");
    window.location.assign(import.meta.env.BASE_URL);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#1a2744] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#f5c842] flex items-center justify-center">
              <Home className="w-4 h-4 text-[#1a2744]" />
            </div>
            <span className="font-bold text-lg tracking-tight group-hover:text-[#f5c842] transition-colors">
              LeaseLink
            </span>
            <span className="hidden sm:block text-xs bg-[#f5c842]/20 text-[#f5c842] px-2 py-0.5 rounded-full font-medium">
              Berkeley
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {!user && (
              <>
                <Link href="/listings" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${location.startsWith("/listings") ? "text-[#f5c842]" : "text-white/85"}`}>
                  Browse Listings
                </Link>
                <Link href="/signup" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${location === "/signup" ? "text-[#f5c842]" : "text-white/85"}`}>
                  For Landlords
                </Link>
                <Link href="/login" className="px-4 py-1.5 rounded-lg text-sm font-medium text-white/85 hover:bg-white/10 transition-colors ml-2">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#f5c842] text-[#1a2744] hover:bg-[#f5c842]/90 transition-colors">
                  Sign Up
                </Link>
              </>
            )}

            {user?.role === "student" && (
              <>
                <Link href="/listings" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${location.startsWith("/listings") ? "text-[#f5c842]" : "text-white/85"}`}>
                  <Search className="w-4 h-4" /> Browse Listings
                </Link>
                <Link href="/my-applications" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${location === "/my-applications" ? "text-[#f5c842]" : "text-white/85"}`}>
                  <ClipboardList className="w-4 h-4" /> My Applications
                </Link>
                <div className="ml-2 flex items-center gap-2 px-2 py-1 rounded-lg bg-white/10">
                  <div className="w-7 h-7 rounded-full bg-[#f5c842] text-[#1a2744] flex items-center justify-center font-bold text-xs">{user.name[0]?.toUpperCase()}</div>
                  <span className="text-xs font-medium max-w-[100px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                  data-testid="button-signout"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            )}

            {user?.role === "landlord" && (
              <>
                <Link href="/dashboard" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${location === "/dashboard" ? "text-[#f5c842]" : "text-white/85"}`}>
                  <LayoutDashboard className="w-4 h-4" /> My Dashboard
                </Link>
                <Link href="/listings" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${location.startsWith("/listings") ? "text-[#f5c842]" : "text-white/85"}`}>
                  <Search className="w-4 h-4" /> Browse Listings
                </Link>
                <div className="ml-2 flex items-center gap-2 px-2 py-1 rounded-lg bg-white/10">
                  <div className="w-7 h-7 rounded-full bg-[#f5c842] text-[#1a2744] flex items-center justify-center font-bold text-xs">{user.name[0]?.toUpperCase()}</div>
                  <span className="text-xs font-medium max-w-[100px] truncate">{user.name}</span>
                  {user.status === "verified" && (
                    <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full font-bold">✓</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                  data-testid="button-signout"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-1">
            {!user && (
              <>
                <Link href="/listings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium">
                  <Search className="w-4 h-4" /> Browse Listings
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium">
                  <Building2 className="w-4 h-4" /> For Landlords
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="block mx-3 mt-2 px-3 py-2.5 rounded-lg bg-[#f5c842] text-[#1a2744] text-sm font-bold text-center">
                  Sign Up
                </Link>
              </>
            )}
            {user?.role === "student" && (
              <>
                <Link href="/listings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium">
                  <Search className="w-4 h-4" /> Browse Listings
                </Link>
                <Link href="/my-applications" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium">
                  <ClipboardList className="w-4 h-4" /> My Applications
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-semibold text-red-300">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            )}
            {user?.role === "landlord" && (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium">
                  <LayoutDashboard className="w-4 h-4" /> My Dashboard
                </Link>
                <Link href="/listings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium">
                  <Search className="w-4 h-4" /> Browse Listings
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-semibold text-red-300">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
