import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { PhoneCall } from "lucide-react";
import { Constants } from "@/integrations/supabase/types";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

const COLUMNS = Constants.public.Enums.lead_status;
const COLUMN_COLORS: Record<string, string> = {
  new: "border-t-primary",
  contacted: "border-t-accent",
  qualified: "border-t-emerald-500",
  scheduled: "border-t-violet-500",
  won: "border-t-green-600",
  lost: "border-t-destructive",
};

export default function AdminPipeline() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const onDrop = async (status: string) => {
    if (!dragging || !user) return;
    const lead = leads.find((l) => l.id === dragging);
    if (!lead || lead.status === status) { setDragging(null); return; }

    // Optimistic update
    setLeads((prev) => prev.map((l) => l.id === dragging ? { ...l, status: status as Lead["status"] } : l));
    setDragging(null);

    await supabase.from("leads").update({ status: status as Lead["status"] }).eq("id", dragging);
    await supabase.from("lead_notes").insert({
      lead_id: dragging,
      user_id: user.id,
      content: `Moved to ${status}`,
      type: "status_change",
    });
  };

  if (loading) return <p className="text-muted-foreground">Loading pipeline...</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-foreground">Pipeline</h1>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col);
          return (
            <div
              key={col}
              className={`min-w-[220px] w-[220px] flex-shrink-0 bg-muted/50 rounded-lg border-t-4 ${COLUMN_COLORS[col] ?? "border-t-border"}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(col)}
            >
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm capitalize text-foreground">{col}</span>
                  <Badge variant="secondary" className="text-xs">{colLeads.length}</Badge>
                </div>
              </div>
              <div className="p-2 space-y-2 min-h-[200px]">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragging(lead.id)}
                    className={`bg-card rounded-md p-3 shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                      (lead as any).callback_requested ? "border-accent" : "border-border"
                    } ${dragging === lead.id ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-foreground">{lead.name}</p>
                      {(lead as any).callback_requested && <PhoneCall size={12} className="text-accent" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{lead.service}</p>
                    <p className="text-xs text-muted-foreground">{lead.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
