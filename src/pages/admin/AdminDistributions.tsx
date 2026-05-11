import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Distribution = {
  id: string;
  lead_id: string;
  contractor_id: string;
  sent_at: string;
  status: string;
  lead: { name: string; phone: string; zip: string; service: string } | null;
  contractor: { company_name: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
  sent: "bg-primary text-primary-foreground",
  viewed: "bg-accent text-accent-foreground",
  contacted: "bg-emerald-600 text-white",
};

export default function AdminDistributions() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDistributions = async () => {
    const { data } = await supabase
      .from("lead_distributions")
      .select("*, lead:leads(name, phone, zip, service), contractor:contractors(company_name)")
      .order("sent_at", { ascending: false })
      .limit(200);
    setDistributions((data as any[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchDistributions(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("lead_distributions").update({ status } as any).eq("id", id);
    toast({ title: `Status updated to ${status}` });
    fetchDistributions();
  };

  // Analytics
  const total = distributions.length;
  const bySvc: Record<string, number> = {};
  const byZip: Record<string, number> = {};
  distributions.forEach((d) => {
    if (d.lead?.service) bySvc[d.lead.service] = (bySvc[d.lead.service] || 0) + 1;
    if (d.lead?.zip) byZip[d.lead.zip] = (byZip[d.lead.zip] || 0) + 1;
  });
  const topZips = Object.entries(byZip).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));
  const svcData = Object.entries(bySvc).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Lead Distribution</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Distributed</p>
          <p className="text-3xl font-bold text-foreground mt-1">{total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Sent</p>
          <p className="text-3xl font-bold text-primary mt-1">{distributions.filter((d) => d.status === "sent").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Viewed</p>
          <p className="text-3xl font-bold text-accent mt-1">{distributions.filter((d) => d.status === "viewed").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Contacted</p>
          <p className="text-3xl font-bold text-foreground mt-1">{distributions.filter((d) => d.status === "contacted").length}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-display font-semibold text-foreground mb-4">Top ZIP Codes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topZips}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(24, 95%, 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h3 className="font-display font-semibold text-foreground mb-4">By Service</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={svcData} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(215, 65%, 18%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Distribution table */}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead className="hidden md:table-cell">Service</TableHead>
                <TableHead className="hidden md:table-cell">ZIP</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Sent</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributions.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No distributions yet</TableCell></TableRow>
              ) : distributions.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.lead?.name ?? "—"}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{d.lead?.service ?? "—"}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{d.lead?.zip ?? "—"}</TableCell>
                  <TableCell>{d.contractor?.company_name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[d.status] ?? ""}>{d.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(d.sent_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <select
                      value={d.status}
                      onChange={(e) => updateStatus(d.id, e.target.value)}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      <option value="sent">sent</option>
                      <option value="viewed">viewed</option>
                      <option value="contacted">contacted</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
