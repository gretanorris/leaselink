import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { SEED_LISTINGS } from "@/lib/data";
import { Shield, Star, CheckCircle, ArrowRight, Home, GraduationCap, ChevronRight, MapPin, Bed, Bath } from "lucide-react";

const STATS = [
  { value: "1,200+", label: "Verified Listings" },
  { value: "4,800+", label: "Students Housed" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "72h", label: "Avg. Match Time" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    year: "3rd Year, CS",
    text: "LeaseLink made finding my apartment so easy. The verified badges gave me confidence the listings were real, and I moved in within two weeks!",
    rating: 5,
    avatar: "P",
  },
  {
    name: "Jake Torres",
    year: "1st Year, Economics",
    text: "As an out-of-state student, I was worried about finding housing remotely. The detailed listings and landlord verification feature were a lifesaver.",
    rating: 5,
    avatar: "J",
  },
  {
    name: "Mei Lin",
    year: "2nd Year, Biology",
    text: "I love how I could filter by lease length. Found a perfect 6-month lease for my co-op semester without any hassle.",
    rating: 5,
    avatar: "M",
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Identity Verified Landlords",
    description: "Every landlord is vetted through our Stripe-powered ID verification, so you know exactly who you're renting from.",
  },
  {
    icon: GraduationCap,
    title: "Student-First Platform",
    description: "Built exclusively for UC Berkeley students. CalNet .edu authentication ensures your community stays trusted.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "Only past tenants can leave reviews. No fake ratings — just honest, student-sourced feedback.",
  },
  {
    icon: CheckCircle,
    title: "Transparent Requirements",
    description: "See credit score minimums, income requirements, and co-signer policies upfront — no surprises at signing.",
  },
];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { user } = useApp();

  const featuredListings = SEED_LISTINGS.filter((l) => l.verified).slice(0, 3);

  return (
    <div className="min-h-screen">
      <section className="relative bg-[#1B2A4A] text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#F5A623]/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-[#F5A623]/5 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#F5A623]/20 text-[#F5A623] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Trusted by 4,800+ Berkeley Students
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Find Your Perfect
              <br />
              <span className="text-[#F5A623]">Berkeley Home</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/75 mb-10 max-w-2xl">
              LeaseLink connects UC Berkeley students with verified landlords for trustworthy, stress-free student housing. Every listing verified. Every landlord screened.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/listings")}
                className="inline-flex items-center justify-center gap-2 bg-[#F5A623] text-[#1B2A4A] font-bold px-8 py-4 rounded-xl hover:bg-[#F5A623]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Browse Listings
                <ArrowRight className="w-5 h-5" />
              </button>

              {!user && (
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-white/20"
                >
                  <Home className="w-5 h-5" />
                  List Your Property
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-extrabold text-[#F5A623]">{stat.value}</div>
                  <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2A4A] mb-4">
            Why Students Choose LeaseLink
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We built the housing platform we wish we'd had as Berkeley students.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#1B2A4A]/5 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-[#1B2A4A]" />
              </div>
              <h3 className="font-bold text-[#1B2A4A] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-[#1B2A4A]">Featured Listings</h2>
              <p className="text-gray-500 mt-1">Verified properties near UC Berkeley</p>
            </div>
            <button
              onClick={() => navigate("/listings")}
              className="hidden sm:flex items-center gap-1.5 text-[#1B2A4A] font-semibold hover:text-[#F5A623] transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
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
                  {listing.verified && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#1B2A4A]/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3 text-[#F5A623]" />
                      Verified
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 text-[#1B2A4A] text-sm font-bold px-3 py-1 rounded-full">
                    ${listing.price.toLocaleString()}/mo
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-[#1B2A4A] text-base mb-1 truncate">{listing.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.neighborhood}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5" />
                      {listing.beds === 0 ? "Studio" : `${listing.beds} bd`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5" />
                      {listing.baths} ba
                    </span>
                    <span>{listing.sqft} sqft</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => navigate("/listings")}
              className="inline-flex items-center gap-2 text-[#1B2A4A] font-semibold border border-[#1B2A4A] px-6 py-2 rounded-xl hover:bg-[#1B2A4A] hover:text-white transition-colors"
            >
              View All Listings <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-[#1B2A4A] mb-4">What Students Are Saying</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1B2A4A]">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1B2A4A] text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Find Your <span className="text-[#F5A623]">Berkeley Home?</span>
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join thousands of Cal students who found their perfect rental through LeaseLink.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/listings")}
              className="inline-flex items-center justify-center gap-2 bg-[#F5A623] text-[#1B2A4A] font-bold px-8 py-4 rounded-xl hover:bg-[#F5A623]/90 transition-all"
            >
              Browse Listings <ArrowRight className="w-5 h-5" />
            </button>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 font-semibold px-8 py-4 rounded-xl transition-all border border-white/20"
              >
                Sign In as Student
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F5A623] flex items-center justify-center">
                <Home className="w-4 h-4 text-[#1B2A4A]" />
              </div>
              <span className="font-bold">LeaseLink</span>
              <span className="text-xs text-gray-500 ml-2">UC Berkeley Student Housing Platform</span>
            </div>
            <p className="text-sm text-gray-500">© 2025 LeaseLink. Built for Bears, by Bears.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
