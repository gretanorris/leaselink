import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { ClipboardList, MapPin, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";

const STATUS_STYLES = {
  pending: { label: "Pending", icon: Clock, classes: "bg-amber-50 text-amber-700 border-amber-200" },
  accepted: { label: "Accepted", icon: CheckCircle, classes: "bg-green-50 text-green-700 border-green-200" },
  rejected: { label: "Rejected", icon: XCircle, classes: "bg-red-50 text-red-600 border-red-200" },
};

export default function MyApplicationsPage() {
  const [, navigate] = useLocation();
  const { user, listings, getStudentApplications } = useApp();

  if (!user) {
    navigate("/login");
    return null;
  }

  const apps = getStudentApplications();
  const sorted = [...apps].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-[#1a2744] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#f5c842]" />
            My Applications
          </h1>
          <p className="text-white/60 text-sm mt-1">{sorted.length} application{sorted.length !== 1 ? "s" : ""} submitted</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">No applications yet</h3>
            <p className="text-sm text-gray-400 mb-4">Browse listings and express interest to get started.</p>
            <button
              onClick={() => navigate("/listings")}
              className="inline-flex items-center gap-2 bg-[#1a2744] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a2744]/90"
            >
              Browse Listings <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((app) => {
              const listing = listings.find((l) => l.id === app.listingId);
              const status = STATUS_STYLES[app.status];
              const StatusIcon = status.icon;

              return (
                <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-stretch">
                    {listing && (
                      <button
                        onClick={() => navigate(`/listings/${listing.id}`)}
                        className="flex-shrink-0 w-32 sm:w-40"
                      >
                        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                      </button>
                    )}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-[#1a2744] truncate">
                            {listing?.title ?? "Listing removed"}
                          </h3>
                          {listing && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              {listing.address}
                            </p>
                          )}
                        </div>
                        <span className={`flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.classes}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </div>

                      {listing && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-[#1a2744]">${listing.price.toLocaleString()}/mo</span>
                          <span className="text-gray-400 mx-1.5">·</span>
                          {listing.beds === 0 ? "Studio" : `${listing.beds} bd`} · {listing.baths} ba
                        </p>
                      )}

                      <p className="text-xs text-gray-400">
                        Submitted {new Date(app.submittedAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>

                      {app.status === "accepted" && (
                        <a
                          href="https://calendly.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Schedule a Tour <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
