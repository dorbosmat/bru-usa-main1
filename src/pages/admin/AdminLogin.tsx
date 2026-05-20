import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleForgotPassword = async () => { if (!email) { toast({ title: "Email required", description: "Enter your email address first.", variant: "destructive" }); return; } setSubmitting(true); const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/login` }); setSubmitting(false); if (error) { toast({ title: "Reset failed", description: error.message, variant: "destructive" }); } else { toast({ title: "Email sent", description: "Check your inbox for a password reset link." }); } }; <div className="flex items-center justify-center h-screen"><p className="text-muted-foreground">Loading...</p></div>;
  if (loading) return <div className="flex items-center justify-center h-screen"><p className="text-muted-foreground">Loading...</p></div>;  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // SECURITY-TODO: this admin login uses Supabase email/password with no
    // MFA and no IP allowlist on /admin/*. The admin role can read every
    // homeowner's PII (phone, email, address). Before opening leads to the
    // public again:
    //   1. Enable Supabase TOTP MFA and require it for users in the admin role.
    //   2. Add a Vercel middleware (or edge config) IP allowlist that gates
    //      every /admin/* path to the office/VPN ranges.
    //   3. Reduce admin session timeout to <= 4 hours.
    //   4. Add an audit-log table that every admin write appends to.
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin/dashboard");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Build Right <span className="text-accent">USA</span></h1>
          <p className="text-muted-foreground mt-2">Admin Login</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-lg border border-border p-6 space-y-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors">
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <div>
            <label htmlFor="admin-email" className="text-sm font-medium text-foreground">Email</label>
            <Input id="admin-email" name="email" autoComplete="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-sm font-medium text-foreground">Password</label>
            <Input id="admin-password" name="password" autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <button type="button" onClick={handleForgotPassword} className="text-sm text-muted-foreground hover:text-accent underline w-full text-center mt-2" disabled={submitting}>Forgot password?</button><Button type="submit" variant="cta" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
