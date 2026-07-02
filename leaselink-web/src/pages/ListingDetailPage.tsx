import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Application } from "@/lib/data";
import {
  MapPin, Bed, Bath, Maximize, CheckCircle, ArrowLeft, Calendar,
  Star, Shield, User, ChevronLeft, ChevronRight, X, Send, Clock, Sparkles
} from "lucide-react";

const REVIEWS = [
  { name: "Alex M.", rating: 5, text: "Great landlord, very responsive. The apartment was exactly as described.", date: "Nov 2024" },
  { name: "Sarah L.", rating: 4, text: "Nice place, convenient location. Minor maintenance took a bit to fix but overall great.", date: "Aug 2024" },
  { name: "Jordan K.", rating: 5, text: "Best apartment I've had in Berkeley. Highly recommend to any student.", date: "May 2024" },
];

export default function ListingDetailPage() {
  const [, params] = useRoute("/listings/:id");
  const [, navigate] = useLocation();
  const { listings, user, submitApplication, hasApplied, showToast } = useApp();

  const listing = listings.find((l) => l.id === params?.id);
  const [imageIdx, setImageIdx] = useState(0);
  const [tab, setTab] = useState<"overview" | "amenities" | "requirements" | "reviews">("overview");
  const [showModal, setShowModal] = useState(false);

  const [formName, setFormName] = useState(user?.name ?? "");
  const [personalEmail, setPersonalEmail] = useState("");
  const [berkeleyEmail, setBerkeleyEmail] = useState(
    user?.email && user.email.endsWith("@berkeley.edu") ? user.email : ""
  );
  const [appMessage, setAppMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!listing) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Listing not found.</p>
          <button onClick={() => navigate("/listings")} className="text-[#1a2744] font-semibold hover:underline">
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const alreadyApplied = user ? hasApplied(listing.id) : false;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formName.trim()) errs.name = "Full name required";
    if (!personalEmail.trim() || !personalEmail.includes("@")) errs.personalEmail = "Valid email required";
    if (!berkeleyEmail.trim()) errs.berkeleyEmail = "Berkeley email required";
    else if (!berkeleyEmail.toLowerCase().endsWith("@berkeley.edu")) errs.berkeleyEmail = "Must end in @berkeley.edu";
    if (!appMessage.trim()) errs.message = "Message required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const app: Application = {
      id: `app-${Date.now()}`,
      listingId: listing.id,
      landlordId: listing.landlordId,
      studentId: user.id,
      name: formName,
      personalEmail,
      berkeleyEmail,
      message: appMessage,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    submitApplication(app);
    setSubmitting(false);
    setShowModal(false);
    showToast("Application Sent! The landlord will be in touch.", "success");
  };

  const openModal = () => {
    if (!user) { navigate("/login"); return; }
    setErrors({});
    setShowModal(true);
  };

  const prevImage = () => setImageIdx((i) => (i === 0 ? listing.images.length - 1 : i - 1));
  const nextImage = () => setImageIdx((i) => (i === listing.images.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate("/listings")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2744] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200 shadow-sm">
              <img src={listing.images[imageIdx]} alt={listing.title} className="w-full h-full object-cover" />
              {listing.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {listing.images.map((_, i) => (
                      <button key={i} onClick={() => setImageIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === imageIdx ? "bg-white scale-125" : "bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}
              {listing.verified && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1a2744]/90 text-white text-sm font-medium px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-4 h-4 text-[#f5c842]" />
                  Verified Listing
                </div>
              )}
            </div>

            {listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {listing.images.map((img, i) => (
                  <button key={i} onClick={() => setImageIdx(i)} className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === imageIdx ? "border-[#f5c842]" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {(["overview", "amenities", "requirements", "reviews"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors capitalize ${
                      tab === t ? "text-[#1a2744] border-b-2 border-[#f5c842]" : "text-gray-500 hover:text-[#1a2744]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {tab === "overview" && (
                  <div>
                    <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Available", value: new Date(listing.available).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                        { label: "Lease", value: `${listing.leaseLength} months` },
                        { label: "Pets", value: listing.petFriendly ? "Allowed" : "Not Allowed" },
                        { label: "Size", value: `${listing.sqft} sqft` },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <p className="font-semibold text-[#1a2744] text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === "amenities" && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {listing.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-[#f5c842]/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3.5 h-3.5 text-[#f5c842]" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{a}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tab === "requirements" && (
                  <div className="space-y-4">
                    <div className="bg-[#1a2744]/5 border border-[#1a2744]/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-[#1a2744]" />
                        <h3 className="font-semibold text-[#1a2744]">Application Requirements</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-[#1a2744]/10">
                          <span className="text-sm text-gray-600">Minimum Credit Score</span>
                          <span className="font-semibold text-[#1a2744]">{listing.requirements.minCreditScore}+</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1a2744]/10">
                          <span className="text-sm text-gray-600">Income Requirement</span>
                          <span className="font-semibold text-[#1a2744]">{listing.requirements.incomeMultiplier}× monthly rent</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-600">Co-Signer Required</span>
                          <span className={`font-semibold ${listing.requirements.coSignerRequired ? "text-amber-600" : "text-green-600"}`}>
                            {listing.requirements.coSignerRequired ? "Required" : "Not Required"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === "reviews" && (
                  <div className="space-y-5">
                    {listing.verified ? (
                      REVIEWS.map((r) => (
                        <div key={r.name} className="pb-5 border-b border-gray-100 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-xs font-bold">
                                {r.name[0]}
                              </div>
                              <span className="font-medium text-sm text-gray-800">{r.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: r.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-[#f5c842] text-[#f5c842]" />
                              ))}
                              <span className="text-xs text-gray-400 ml-1">{r.date}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 pl-10">{r.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-8">
                        Reviews are only available for verified listings.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <div className="mb-4">
                <h1 className="text-xl font-extrabold text-[#1a2744] leading-tight">{listing.title}</h1>
                <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {listing.address}
                </p>
              </div>

              <div className="text-3xl font-extrabold text-[#1a2744] mb-4">
                ${listing.price.toLocaleString()}
                <span className="text-base font-normal text-gray-400">/mo</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { icon: Bed, label: listing.beds === 0 ? "Studio" : `${listing.beds} Bed` },
                  { icon: Bath, label: `${listing.baths} Bath` },
                  { icon: Maximize, label: `${listing.sqft} ft²` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <Icon className="w-4 h-4 text-[#1a2744] mx-auto mb-1" />
                    <span className="text-xs font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 pb-5 border-b border-gray-100">
                <Calendar className="w-4 h-4" />
                Available {new Date(listing.available).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#1a2744] flex items-center justify-center text-white font-bold">
                  {listing.landlordName[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a2744]">{listing.landlordName}</p>
                  <div className="flex items-center gap-1">
                    {listing.verified && <CheckCircle className="w-3.5 h-3.5 text-[#f5c842]" />}
                    <span className="text-xs text-gray-500">{listing.verified ? "Verified Landlord" : "Landlord"}</span>
                  </div>
                </div>
              </div>

              {alreadyApplied ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Application Submitted</p>
                    <p className="text-xs text-green-600">The landlord will be in touch.</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={openModal}
                  className="w-full bg-[#f5c842] text-[#1a2744] font-extrabold py-4 rounded-xl hover:bg-[#f5c842]/90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  data-testid="button-express-interest"
                >
                  <Sparkles className="w-4 h-4" />
                  {user ? "Express Interest" : "Sign In to Express Interest"}
                </button>
              )}

              <div className="mt-3 flex items-center gap-1.5 justify-center text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                Avg. response within 48 hours
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-[#1a2744]">Express Interest</h2>
                <p className="text-sm text-gray-500 truncate max-w-xs">{listing.title}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Jordan Lee"
                  className={`w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#f5c842] ${errors.name ? "border-red-300" : "border-gray-200"}`}
                  data-testid="input-name"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Personal Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  placeholder="jordan@gmail.com"
                  className={`w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#f5c842] ${errors.personalEmail ? "border-red-300" : "border-gray-200"}`}
                  data-testid="input-personal-email"
                />
                {errors.personalEmail && <p className="text-xs text-red-500 mt-1">{errors.personalEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Berkeley Email <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 ml-1">(must end in @berkeley.edu)</span>
                </label>
                <input
                  type="email"
                  value={berkeleyEmail}
                  onChange={(e) => setBerkeleyEmail(e.target.value)}
                  placeholder="jordan.lee@berkeley.edu"
                  className={`w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#f5c842] ${errors.berkeleyEmail ? "border-red-300" : "border-gray-200"}`}
                  data-testid="input-berkeley-email"
                />
                {errors.berkeleyEmail && <p className="text-xs text-red-500 mt-1">{errors.berkeleyEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Message <span className="text-red-500">*</span></label>
                <textarea
                  value={appMessage}
                  onChange={(e) => setAppMessage(e.target.value)}
                  rows={4}
                  placeholder="Introduce yourself and explain why this place is a good fit..."
                  className={`w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#f5c842] resize-none ${errors.message ? "border-red-300" : "border-gray-200"}`}
                  data-testid="input-message"
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a2744] text-white font-semibold py-3 rounded-xl hover:bg-[#1a2744]/90 disabled:opacity-60"
                  data-testid="button-submit-application"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Submit Application</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
