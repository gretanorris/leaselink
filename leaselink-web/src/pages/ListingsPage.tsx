import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Search, SlidersHorizontal, MapPin, Bed, Bath, CheckCircle, X, ChevronDown } from "lucide-react";

const NEIGHBORHOODS = ["All Areas", "Southside", "Northside", "Elmwood", "Rockridge", "West Berkeley"];

export default function ListingsPage() {
  const [, navigate] = useLocation();
  const { listings } = useApp();
  const [search, setSearch] = useState("");
  const [neighborhood, setNeighborhood] = useState("All Areas");
  const [minBeds, setMinBeds] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [leaseLength, setLeaseLength] = useState<6 | 12 | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()) &&
          !l.address.toLowerCase().includes(search.toLowerCase()) &&
          !l.neighborhood.toLowerCase().includes(search.toLowerCase())) return false;
      if (neighborhood !== "All Areas" && l.neighborhood !== neighborhood) return false;
      if (minBeds !== null && l.beds < minBeds) return false;
      if (maxPrice !== null && l.price > maxPrice) return false;
      if (leaseLength !== null && l.leaseLength !== leaseLength) return false;
      if (verifiedOnly && !l.verified) return false;
      if (petFriendly && !l.petFriendly) return false;
      return true;
    });
  }, [listings, search, neighborhood, minBeds, maxPrice, leaseLength, verifiedOnly, petFriendly]);

  const activeFiltersCount = [
    neighborhood !== "All Areas",
    minBeds !== null,
    maxPrice !== null,
    leaseLength !== null,
    verifiedOnly,
    petFriendly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setNeighborhood("All Areas");
    setMinBeds(null);
    setMaxPrice(null);
    setLeaseLength(null);
    setVerifiedOnly(false);
    setPetFriendly(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-[#1B2A4A] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">Find Your Berkeley Home</h1>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, address, or neighborhood..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#F5A623] text-[#1B2A4A] border-[#F5A623]"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-[#1B2A4A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Neighborhood</label>
                <div className="relative">
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623] bg-white pr-8"
                  >
                    {NEIGHBORHOODS.map((n) => <option key={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Bedrooms</label>
                <div className="relative">
                  <select
                    value={minBeds ?? ""}
                    onChange={(e) => setMinBeds(e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623] bg-white pr-8"
                  >
                    <option value="">Any</option>
                    <option value="0">Studio+</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Price/mo</label>
                <div className="relative">
                  <select
                    value={maxPrice ?? ""}
                    onChange={(e) => setMaxPrice(e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623] bg-white pr-8"
                  >
                    <option value="">Any</option>
                    <option value="1500">$1,500</option>
                    <option value="2000">$2,000</option>
                    <option value="2500">$2,500</option>
                    <option value="3000">$3,000</option>
                    <option value="4000">$4,000</option>
                    <option value="5000">$5,000</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Lease Length</label>
                <div className="flex gap-2">
                  {[6, 12].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLeaseLength(leaseLength === l ? null : l as 6 | 12)}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        leaseLength === l
                          ? "bg-[#1B2A4A] text-white border-[#1B2A4A]"
                          : "border-gray-200 text-gray-600 hover:border-[#1B2A4A]"
                      }`}
                    >
                      {l}mo
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Options</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="w-4 h-4 accent-[#1B2A4A]" />
                  <span className="text-sm text-gray-700">Verified Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} className="w-4 h-4 accent-[#1B2A4A]" />
                  <span className="text-sm text-gray-700">Pet Friendly</span>
                </label>
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex items-end">
                  <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium">
                    <X className="w-3.5 h-3.5" /> Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">
          {filtered.length} {filtered.length === 1 ? "listing" : "listings"} found
          {search && ` for "${search}"`}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No listings found</h3>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="text-sm text-[#1B2A4A] font-semibold hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <button
                key={listing.id}
                onClick={() => navigate(`/listings/${listing.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {listing.verified && (
                      <span className="flex items-center gap-1 bg-[#1B2A4A]/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-[#F5A623]" />
                        Verified
                      </span>
                    )}
                    {listing.petFriendly && (
                      <span className="bg-green-500/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Pets OK
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 text-[#1B2A4A] text-sm font-bold px-3 py-1 rounded-full">
                    ${listing.price.toLocaleString()}/mo
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                    {listing.leaseLength}mo lease
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-[#1B2A4A] text-base mb-1 truncate">{listing.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{listing.address}</span>
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5" />
                      {listing.beds === 0 ? "Studio" : `${listing.beds} bd`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5" />
                      {listing.baths} ba
                    </span>
                    <span>{listing.sqft.toLocaleString()} sqft</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">by {listing.landlordName}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
