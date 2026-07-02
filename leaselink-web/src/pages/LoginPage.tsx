import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Home, GraduationCap, Building2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { User } from "@/lib/data";

type TabRole = "student" | "landlord";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login, users, registerUser } = useApp();
  const [role, setRole] = useState<TabRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (role === "student" && !email.endsWith(".edu")) {
      setError("Please use your .edu email address.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    let user: User;
    if (existing) {
      user = existing;
    } else {
      user = {
        id: role === "landlord" ? `landlord-${Date.now()}` : `student-${Date.now()}`,
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        role,
        ...(role === "landlord" ? { status: "verified" as const } : {}),
      };
      registerUser(user);
    }

    login(user);
    if (role === "landlord") {
      navigate(user.status === "pending" ? "/verification-pending" : "/dashboard");
    } else {
      navigate("/listings");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1B2A4A] mb-4">
            <Home className="w-7 h-7 text-[#F5A623]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A]">Welcome to LeaseLink</h1>
          <p className="text-gray-500 mt-1">Sign in to access your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => { setRole("student"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                role === "student"
                  ? "bg-[#1B2A4A] text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => { setRole("landlord"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                role === "landlord"
                  ? "bg-[#1B2A4A] text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Landlord
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {role === "student" && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                Use your UC Berkeley <strong>.edu</strong> email address to sign in.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {role === "student" ? "Berkeley Email (.edu)" : "Email Address"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "student" ? "yourname@berkeley.edu" : "landlord@email.com"}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent text-sm pr-12 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1B2A4A] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1B2A4A]/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {role === "landlord" && (
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-[#1B2A4A] font-semibold hover:underline"
                >
                  Sign up as Landlord
                </button>
              </p>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
          <br />
          LeaseLink is exclusively for UC Berkeley community members.
        </p>
      </div>
    </div>
  );
}
