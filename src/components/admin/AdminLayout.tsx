import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Users, KanbanSquare, Settings, LogOut, Menu, X, HardHat, Share2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/admin/contractors", label: "Contractors", icon: HardHat },
  { to: "/admin/distributions", label: "Distribution", icon: Share2 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/photos", label: "Photos", icon: Camera },
];

export default function AdminLayout() {
  const { user, loading, isAdmin, isAgent, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin && !isAgent) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </div>
      </div>
    );
  }

  const sidebar = (
    <nav className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <Link to="/admin/dashboard" className="font-display text-lg font-bold text-foreground">
          Build Right <span className="text-accent">CRM</span>
        </Link>
      </div>
      <div className="flex-1 p-4 space-y-1">
        {NAV.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2 truncate">{user.email}</p>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 h-full bg-card shadow-xl">
            <button className="absolute top-4 right-4" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <span className="font-display font-bold text-foreground">Build Right <span className="text-accent">CRM</span></span>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
