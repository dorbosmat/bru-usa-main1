import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Constants } from "@/integrations/supabase/types";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type UserRole = Tables<"user_roles">;

const INITIAL_ADMIN_EMAIL = ""; // Set your admin email here after first signup

export default function AdminSettings() {
  const { user, isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<(Profile & { roles: UserRole[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("agent");
  const [chatEnabled, setChatEnabled] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const [activityEnabled, setActivityEnabled] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  const fetchUsers = async () => {
    const { data: profs } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");
    const combined = (profs ?? []).map((p) => ({
      ...p,
      roles: (roles ?? []).filter((r) => r.user_id === p.user_id),
    }));
    setProfiles(combined);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  // Fetch site settings
  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["CHAT_ENABLED", "FAKE_ACTIVITY_ENABLED"])
      .then(({ data }) => {
        const settings = Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));
        setChatEnabled((settings["CHAT_ENABLED"] === true || settings["CHAT_ENABLED"] === "true"));
        setChatLoading(false);
        setActivityEnabled((settings["FAKE_ACTIVITY_ENABLED"] === true || settings["FAKE_ACTIVITY_ENABLED"] === "true"));
        setActivityLoading(false);
      });
  }, []);

  const toggleSetting = async (key: string, val: boolean, setter: (v: boolean) => void) => {
    setter(val);
    const { error } = await supabase
      .from("site_settings")
      .update({ value: val as unknown as any, updated_at: new Date().toISOString() })
      .eq("key", key);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setter(!val);
    } else {
      toast({ title: val ? `${key} enabled` : `${key} disabled` });
    }
  };
  const addRole = async (userId: string, role: string) => {
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: role as UserRole["role"],
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Role "${role}" added` }); fetchUsers(); }
  };

  const removeRole = async (roleId: string) => {
    await supabase.from("user_roles").delete().eq("id", roleId);
    toast({ title: "Role removed" });
    fetchUsers();
  };

  if (!isAdmin) {
    return <p className="text-muted-foreground">Only admins can access settings.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>

      <Card className="p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Team Members</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-3">
            {profiles.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{p.full_name || p.email || "No name"}</p>
                  <p className="text-xs text-muted-foreground">{p.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {p.roles.map((r) => (
                    <Badge key={r.id} variant="secondary" className="cursor-pointer" onClick={() => removeRole(r.id)}>
                      {r.role} ×
                    </Badge>
                  ))}
                  {!p.roles.find((r) => r.role === "admin") && (
                    <Button variant="ghost" size="sm" onClick={() => addRole(p.user_id, "admin")}>+ Admin</Button>
                  )}
                  {!p.roles.find((r) => r.role === "agent") && (
                    <Button variant="ghost" size="sm" onClick={() => addRole(p.user_id, "agent")}>+ Agent</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Chatbot Widget</h2>
            <p className="text-sm text-muted-foreground">Show the customer chat widget on the public site.</p>
          </div>
          {!chatLoading && (
            <Switch checked={chatEnabled} onCheckedChange={(v) => toggleSetting("CHAT_ENABLED", v, setChatEnabled)} />
          )}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Live Activity Toasts</h2>
            <p className="text-sm text-muted-foreground">Show social-proof activity notifications to public visitors.</p>
          </div>
          {!activityLoading && (
            <Switch checked={activityEnabled} onCheckedChange={(v) => toggleSetting("FAKE_ACTIVITY_ENABLED", v, setActivityEnabled)} />
          )}
        </div>
      </Card>

      <Card className="p-6 space-y-2 mb-4"><h2 className="font-display text-lg font-semibold text-foreground">WhatsApp & Zapier Notifications</h2><p className="text-sm text-muted-foreground">Configure these keys in Supabase Studio &rarr; Table Editor &rarr; site_settings: <code>WHATSAPP_NUMBER</code>, <code>WHATSAPP_NOTIFY_ENABLED</code>, <code>ZAPIER_WEBHOOK_URL</code>, <code>ZAPIER_WEBHOOK_ENABLED</code>. When ZAPIER_WEBHOOK_ENABLED is true and ZAPIER_WEBHOOK_URL is set, new leads will be forwarded to the webhook automatically.</p></Card><Card className="p-6 space-y-2">
        <h2 className="font-display text-lg font-semibold text-foreground">Setup Instructions</h2>
        <p className="text-sm text-muted-foreground">
          1. Sign up at <code className="bg-muted px-1 rounded">/admin/login</code> (use "Sign Up" if first time).<br />
          2. After signup, manually add admin role via the Cloud database tab: insert into <code className="bg-muted px-1 rounded">user_roles</code> with your user_id and role='admin'.<br />
          3. Once you're admin, you can manage roles for other users from this page.
        </p>
      </Card>
    </div>
  );
}
