import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Leaf, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Invalid password");
        return;
      }

      await utils.auth.me.invalidate();
      setLocation("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AyuClinic Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your clinic from one place</p>
        </div>

        <Card className="shadow-xl border-0 ring-1 ring-gray-200">
          <CardHeader className="pb-4 pt-6 px-6">
            <div className="flex items-center gap-2 text-gray-700">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-lg">Admin Login</span>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <a href="/" className="text-sm text-green-600 hover:text-green-700 hover:underline">
                ← Back to website
              </a>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          Default password: <code className="bg-gray-100 px-1 py-0.5 rounded">AyuAdmin@2024</code>
          <br />Change it in the Secrets tab.
        </p>
      </div>
    </div>
  );
}
