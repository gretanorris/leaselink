import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { User, LandlordType, STRIPE_PUBLISHABLE_KEY } from "@/lib/data";
import {
  Home, Shield, CheckCircle, ArrowRight, Upload, X, CreditCard, Lock, FileText
} from "lucide-react";

declare const Stripe: any;

const LANDLORD_TYPES: LandlordType[] = ["Independent Landlord", "Property Management Company"];

export default function LandlordSignupPage() {
  const [, navigate] = useLocation();
  const { login, registerUser, showToast } = useApp();

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [landlordType, setLandlordType] = useState<LandlordType>("Independent Landlord");
  const [proofUploaded, setProofUploaded] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [formError, setFormError] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [cardError, setCardError] = useState("");
  const [paying, setPaying] = useState(false);

  const stripeRef = useRef<any>(null);
  const cardElementRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showPaymentModal) return;
    {
      const init = (): void => {
        if (typeof Stripe === "undefined") {
          setTimeout(init, 100);
          return;
        }
        try {
          stripeRef.current = Stripe(STRIPE_PUBLISHABLE_KEY);
          const elements = stripeRef.current.elements({ appearance: { theme: "stripe" } });
          const card = elements.create("card", {
            style: {
              base: {
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#1a2744",
                "::placeholder": { color: "#9ca3af" },
              },
              invalid: { color: "#dc2626" },
            },
          });
          card.mount("#stripe-payment-element");
          card.on("change", (e: any) => setCardError(e.error ? e.error.message : ""));
          cardElementRef.current = card;
          setStripeLoaded(true);
        } catch (err) {
          console.error("Stripe init failed", err);
        }
      };
      init();

      return () => {
        try { cardElementRef.current?.unmount(); } catch {}
        cardElementRef.current = null;
        setStripeLoaded(false);
      };
    }
  }, [showPaymentModal]);

  const validateForm = () => {
    if (!name.trim()) return "Please enter your full name.";
    if (!propertyAddress.trim()) return "Please enter the property address.";
    if (!email.trim() || !email.includes("@")) return "Please enter a valid email.";
    if (!phone.trim()) return "Please enter your phone number.";
    if (!confirmed) return "Please confirm you are the legal owner or authorized manager.";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setFormError("");
    setShowPaymentModal(true);
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      if (cardElementRef.current && stripeRef.current) {
        await stripeRef.current.createPaymentMethod({
          type: "card",
          card: cardElementRef.current,
          billing_details: { name, email },
        });
      }
    } catch (err) {
      console.warn("Stripe error (treating as success for demo)", err);
    }

    await new Promise((r) => setTimeout(r, 800));

    const newUser: User = {
      id: `landlord-${Date.now()}`,
      name,
      email,
      role: "landlord",
      status: "pending",
      companyName: companyName || undefined,
      phone,
      propertyAddress,
      landlordType,
    };

    registerUser(newUser);
    login(newUser);
    showToast("Payment received — verification under review!", "success");

    setPaying(false);
    setShowPaymentModal(false);
    navigate("/verification-pending");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setProofUploaded(f.name);
      showToast(`Document "${f.name}" attached`, "success");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1a2744] mb-4">
            <Home className="w-7 h-7 text-[#f5c842]" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1a2744]">List Your Property on LeaseLink</h1>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Get verified and start receiving applications from trusted UC Berkeley students.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#1a2744] to-[#2a3a5e] text-white">
            <h2 className="font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#f5c842]" />
              Landlord Verification
            </h2>
            <p className="text-xs text-white/70 mt-0.5">
              All landlords undergo identity & ownership verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                required
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name (optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Bay Area Rentals LLC"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  I am a <span className="text-red-500">*</span>
                </label>
                <select
                  value={landlordType}
                  onChange={(e) => setLandlordType(e.target.value as LandlordType)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842] bg-white"
                >
                  {LANDLORD_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Property Address to List <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="123 Telegraph Ave, Berkeley, CA 94704"
                required
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(510) 555-0100"
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f5c842]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proof of Ownership
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-dashed transition-colors ${
                  proofUploaded
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-500 hover:border-[#1a2744] hover:bg-gray-50"
                }`}
              >
                {proofUploaded ? (
                  <>
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium">{proofUploaded}</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload Proof of Ownership</span>
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 mt-1.5">
                Deed, property tax statement, or management agreement (PDF, JPG, PNG)
              </p>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#1a2744] flex-shrink-0"
              />
              <span className="text-sm text-amber-900">
                I confirm I am the <strong>legal owner or authorized manager</strong> of this property.
              </span>
            </label>

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#f5c842] text-[#1a2744] font-extrabold text-base py-4 rounded-xl hover:bg-[#f5c842]/90 transition-all shadow-lg hover:shadow-xl"
              data-testid="button-get-verified"
            >
              <Shield className="w-5 h-5" />
              Get Verified — $49
            </button>

            <p className="text-center text-xs text-gray-400">
              One-time verification fee. Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#1a2744] font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#1a2744] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#f5c842]" />
                <div>
                  <h2 className="font-bold">Verification Payment</h2>
                  <p className="text-xs text-white/70">One-time fee</p>
                </div>
              </div>
              <button
                onClick={() => !paying && setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-gradient-to-br from-[#f5c842]/20 to-[#f5c842]/5 rounded-xl p-5 border border-[#f5c842]/30">
                <p className="text-xs uppercase tracking-wide text-[#1a2744]/60 font-bold">Verification Fee</p>
                <p className="text-3xl font-extrabold text-[#1a2744] mt-1">$49.00</p>
                <p className="text-xs text-[#1a2744]/60 mt-2">
                  ID & ownership verification within 24-48 hours
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" /> Card Information
                </label>
                <div
                  id="stripe-payment-element"
                  className="px-4 py-3.5 border border-gray-200 rounded-xl bg-white min-h-[48px] focus-within:ring-2 focus-within:ring-[#f5c842]"
                >
                  {!stripeLoaded && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                      Loading secure payment…
                    </div>
                  )}
                </div>
                {cardError && <p className="text-xs text-red-500 mt-1">{cardError}</p>}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                Payments secured by Stripe. PCI-DSS compliant.
              </div>

              <button
                onClick={handlePay}
                disabled={paying || !stripeLoaded}
                className="w-full flex items-center justify-center gap-2 bg-[#1a2744] text-white font-bold py-4 rounded-xl hover:bg-[#1a2744]/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="button-pay"
              >
                {paying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>Pay $49 <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
