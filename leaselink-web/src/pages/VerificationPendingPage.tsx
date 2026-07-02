import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Clock, ShieldCheck, Mail, Phone, ArrowRight } from "lucide-react";

export default function VerificationPendingPage() {
  const [, navigate] = useLocation();
  const { user, updateUserStatus, showToast } = useApp();

  if (!user || user.role !== "landlord") {
    navigate("/login");
    return null;
  }

  const handleAdminApprove = () => {
    updateUserStatus(user.id, "verified");
    showToast("Account approved! Welcome to LeaseLink.", "success");
    setTimeout(() => navigate("/dashboard"), 600);
  };

  const isVerified = user.status === "verified";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12 relative">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`px-6 py-8 text-center ${isVerified ? "bg-gradient-to-br from-green-50 to-emerald-50" : "bg-gradient-to-br from-amber-50 to-yellow-50"}`}>
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${isVerified ? "bg-green-100" : "bg-amber-100"}`}>
              {isVerified ? (
                <ShieldCheck className="w-10 h-10 text-green-600" />
              ) : (
                <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
              )}
            </div>

            {isVerified ? (
              <>
                <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> LeaseLink Verified ✓
                </span>
                <h1 className="text-2xl font-extrabold text-[#1a2744]">You're Verified!</h1>
                <p className="text-gray-600 mt-2">
                  Welcome to LeaseLink. You can now create listings that show the verified badge.
                </p>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Clock className="w-3.5 h-3.5" /> Under Review — 24–48 hours
                </span>
                <h1 className="text-2xl font-extrabold text-[#1a2744]">Verification Pending</h1>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                  We've received your verification request and payment. Our team will review your documents and approve your account within 24–48 hours.
                </p>
              </>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-3">Application Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-[#1a2744]">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-[#1a2744]">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-[#1a2744]">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-[#1a2744]">{user.landlordType}</span>
                </div>
                {user.companyName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Company</span>
                    <span className="font-medium text-[#1a2744]">{user.companyName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Property</span>
                  <span className="font-medium text-[#1a2744] text-right max-w-[60%] truncate">{user.propertyAddress}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Verification Fee</span>
                  <span className="font-bold text-green-600">$49.00 ✓ Paid</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <p className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#1a2744] flex-shrink-0 mt-0.5" />
                We'll email you the moment your account is approved.
              </p>
              <p className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#1a2744] flex-shrink-0 mt-0.5" />
                Questions? Contact <span className="text-[#1a2744] font-medium">support@leaselink.com</span>
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center justify-center gap-2 bg-[#1a2744] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1a2744]/90 transition-all"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {!isVerified && (
        <button
          onClick={handleAdminApprove}
          className="fixed bottom-4 right-4 text-[10px] text-gray-400 hover:text-gray-600 hover:opacity-100 opacity-30 px-2 py-1 rounded transition-opacity"
          data-testid="button-admin-approve"
          title="Admin: simulate approval"
        >
          Admin: Approve
        </button>
      )}
    </div>
  );
}
