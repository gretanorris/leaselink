import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Listing } from "@/lib/data";
import {
  Plus, Building2, Users, DollarSign, TrendingUp, Edit3, Trash2,
  CheckCircle, X, Eye, MapPin, Bed, Bath, Calendar, ShieldCheck,
  Clock, Check, Calendar as CalendarIcon, ExternalLink
} from "lucide-react";

const NEIGHBORHOODS = ["Southside", "Northside", "Elmwood", "Rockridge", "West Berkeley", "Downtown Berkeley"];
const AMENITIES_LIST = ["In-unit Laundry", "Parking", "Pet-Friendly", "Balcony", "Dishwasher", "Air Conditioning", "Gym", "Rooftop", "Bike Storage", "High-Speed WiFi Ready"];

const EMPTY_LISTING: Omit<Listing, "id" | "landlordId" | "landlordName" | "verified"> = {
  title: "",
  address: "",
  neighborhood: "Southside",
  price: 0,
  beds: 1,
  baths: 1,
  sqft: 500,
  description: "",
  amenities: [],
  images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"],
  available: new Date().toISOString().split("T")[0],
  leaseLength: 12,
  petFriendly: false,
  requirements: { minCreditScore: 650, incomeMultiplier: 2.5, coSignerRequired: false },
};

export default function LandlordDashboard() {
  const [, navigate] = useLocation();
  const {
    user, getLandlordListings, getLandlordApplications, addListing,
    updateListing, deleteListing, updateApplicationStatus, listings: allListings, showToast,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_LISTING });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user || user.role !== "landlord") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1a2744] mb-2">Landlord Access Only</h2>
          <p className="text-gray-500 mb-4">Please sign in as a landlord to access the dashboard.</p>
          <button onClick={() => navigate("/login")} className="bg-[#1a2744] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1a2744]/90">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const myListings = getLandlordListings();
  const allApplications = getLandlordApplications();
  const totalRevenue = myListings.reduce((sum, l) => sum + l.price, 0);
  const isVerified = user.status === "verified" || user.id === "landlord-demo";

  const openAdd = () => {
    setForm({ ...EMPTY_LISTING });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (listing: Listing) => {
    setForm({
      title: listing.title, address: listing.address, neighborhood: listing.neighborhood,
      price: listing.price, beds: listing.beds, baths: listing.baths, sqft: listing.sqft,
      description: listing.description, amenities: [...listing.amenities],
      images: [...listing.images], available: listing.available,
      leaseLength: listing.leaseLength, petFriendly: listing.petFriendly,
      requirements: { ...listing.requirements },
    });
    setEditingId(listing.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    if (editingId) {
      updateListing(editingId, form);
      showToast("Listing updated successfully", "success");
    } else {
      const newListing: Listing = {
        ...form,
        id: `l-${Date.now()}`,
        landlordId: user.id,
        landlordName: user.name,
        verified: isVerified,
      };
      addListing(newListing);
      showToast("Listing created successfully", "success");
    }

    setSaving(false);
    setModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteListing(id);
    showToast("Listing deleted", "info");
    setDeleteConfirm(null);
  };

  const toggleAmenity = (a: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const handleAccept = (appId: string) => {
    updateApplicationStatus(appId, "accepted");
    showToast("Application accepted", "success");
  };
  const handleReject = (appId: string) => {
    updateApplicationStatus(appId, "rejected");
    showToast("Application rejected", "info");
  };

  const kpis = [
    { icon: Building2, label: "Active Listings", value: myListings.length, color: "bg-blue-50 text-blue-600" },
    { icon: Users, label: "Applications", value: allApplications.length, color: "bg-purple-50 text-purple-600" },
    { icon: DollarSign, label: "Monthly Revenue", value: `$${totalRevenue.toLocaleString()}`, color: "bg-green-50 text-green-600" },
    {
      icon: TrendingUp, label: "Acceptance Rate",
      value: allApplications.length > 0
        ? `${Math.round((allApplications.filter(a => a.status === "accepted").length / allApplications.length) * 100)}%`
        : "—",
      color: "bg-amber-50 text-amber-600"
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-[#1a2744] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">Landlord Dashboard</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <p className="text-white/70 text-sm">Welcome back, {user.name}</p>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> LeaseLink Verified ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" /> Verification Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-[#f5c842] to-[#f5d162] rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1a2744]">Have a property to list?</h2>
            <p className="text-sm text-[#1a2744]/80 mt-1">Create a new listing in under 2 minutes.</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 bg-[#1a2744] text-white font-extrabold px-6 py-3 rounded-xl hover:bg-[#1a2744]/90 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            data-testid="button-create-listing"
          >
            <Plus className="w-5 h-5" /> Create New Listing
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-extrabold text-[#1a2744]">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1a2744] mb-4">Your Listings</h2>
          {myListings.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-600 mb-1">No listings yet</h3>
              <p className="text-sm text-gray-400 mb-4">Click "Create New Listing" above to get started.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-40">
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                    {listing.verified && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-[#1a2744]/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-[#f5c842]" /> Verified
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-white/95 text-[#1a2744] text-xs font-bold px-2.5 py-1 rounded-full">
                      ${listing.price.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1a2744] truncate">{listing.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{listing.address}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {listing.beds === 0 ? "Studio" : `${listing.beds}bd`}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {listing.baths}ba</span>
                      <span>{listing.sqft} sqft</span>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/listings/${listing.id}`)}
                        className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => openEdit(listing)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1a2744] text-white text-xs font-semibold rounded-lg hover:bg-[#1a2744]/90 transition-colors"
                        data-testid={`button-edit-${listing.id}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Listing
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(listing.id)}
                        className="flex-shrink-0 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                        data-testid={`button-delete-${listing.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1a2744] mb-4">Applications</h2>
          {allApplications.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No applications received yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500 font-bold">
                      <th className="px-4 py-3">Applicant</th>
                      <th className="px-4 py-3">Berkeley Email</th>
                      <th className="px-4 py-3">Listing</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allApplications.map((app) => {
                      const listing = allListings.find((l) => l.id === app.listingId);
                      const rowBg =
                        app.status === "accepted" ? "bg-green-50/60" :
                        app.status === "rejected" ? "bg-gray-50/80" : "";
                      return (
                        <tr key={app.id} className={`border-b border-gray-100 last:border-0 ${rowBg}`}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#1a2744] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                                {app.name[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-[#1a2744] truncate">{app.name}</p>
                                <p className="text-xs text-gray-400 truncate">{app.personalEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-600 text-xs">{app.berkeleyEmail}</td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => listing && navigate(`/listings/${listing.id}`)}
                              className="text-[#1a2744] font-medium hover:underline text-left"
                            >
                              {listing?.title ?? "—"}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-gray-600 text-xs max-w-[200px]">
                            <p className="line-clamp-2">{app.message}</p>
                          </td>
                          <td className="px-4 py-4">
                            {app.status === "pending" && (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                            {app.status === "accepted" && (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                                <Check className="w-3 h-3" /> Accepted
                              </span>
                            )}
                            {app.status === "rejected" && (
                              <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                                <X className="w-3 h-3" /> Rejected
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right">
                            {app.status === "pending" && (
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => handleAccept(app.id)}
                                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                                  data-testid={`button-accept-${app.id}`}
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleReject(app.id)}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                                  data-testid={`button-reject-${app.id}`}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {app.status === "accepted" && (
                              <a
                                href="https://calendly.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2744] hover:bg-[#1a2744]/90 text-white text-xs font-semibold rounded-lg transition-colors"
                              >
                                <CalendarIcon className="w-3 h-3" /> Schedule Tour <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {app.status === "rejected" && (
                              <span className="text-xs text-gray-400 italic">Rejected</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-[#1a2744]">{editingId ? "Edit Listing" : "Create New Listing"}</h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]" placeholder="e.g. Sunny Studio Near Campus" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Neighborhood</label>
                  <select value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842] bg-white">
                    {NEIGHBORHOODS.map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Rent ($)</label>
                  <input type="number" required min={500} value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]" placeholder="2000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]" placeholder="123 Telegraph Ave, Berkeley, CA 94704" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrooms</label>
                  <select value={form.beds} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842] bg-white">
                    <option value={0}>Studio</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms</label>
                  <select value={form.baths} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842] bg-white">
                    <option value={1}>1</option>
                    <option value={1.5}>1.5</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sqft</label>
                  <input type="number" min={100} value={form.sqft || ""} onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]" placeholder="500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Available From</label>
                <input type="date" value={form.available} onChange={(e) => setForm({ ...form, available: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842] resize-none" placeholder="Describe the property..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map((a) => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${form.amenities.includes(a) ? "bg-[#1a2744] text-white border-[#1a2744]" : "border-gray-200 text-gray-600 hover:border-[#1a2744]"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-[#1a2744] text-white font-semibold py-3 rounded-xl hover:bg-[#1a2744]/90 disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editingId ? "Save Changes" : "Create Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Listing?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. All applications for this listing will also be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
