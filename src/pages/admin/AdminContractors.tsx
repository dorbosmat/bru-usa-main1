import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

type Contractor = {
  id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string | null;
  services_offered: string[];
  zip_codes_served: string[];
  city: string | null;
  state: string | null;
  status: string;
  max_leads_per_day: number;
  created_at: string;
};

const SERVICES = [
  "roofing", "kitchen-bath-remodel", "flooring", "painting",
  "concrete-driveway", "windows-doors", "general-remodeling",
];

const emptyForm = {
  company_name: "", contact_name: "", phone: "", email: "",
  services_offered: [] as string[], zip_codes_served: [] as string[],
  city: "", state: "", max_leads_per_day: 10,
};

export default function AdminContractors() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Contractor | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [zipInput, setZipInput] = useState("");

  const fetchContractors = async () => {
    const { data } = await supabase.from("contractors").select("*").order("created_at", { ascending: false });
    setContractors((data as Contractor[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchContractors(); }, []);

  const filtered = contractors.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.company_name.toLowerCase().includes(q) || c.contact_name.toLowerCase().includes(q) || c.phone.includes(q) || (c.city?.toLowerCase().includes(q) ?? false);
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setZipInput("");
    setShowModal(true);
  };

  const openEdit = (c: Contractor) => {
    setEditing(c);
    setForm({
      company_name: c.company_name,
      contact_name: c.contact_name,
      phone: c.phone,
      email: c.email ?? "",
      services_offered: c.services_offered,
      zip_codes_served: c.zip_codes_served,
      city: c.city ?? "",
      state: c.state ?? "",
      max_leads_per_day: c.max_leads_per_day,
    });
    setZipInput(c.zip_codes_served.join(", "));
    setShowModal(true);
  };

  const toggleService = (svc: string) => {
    setForm((f) => ({
      ...f,
      services_offered: f.services_offered.includes(svc)
        ? f.services_offered.filter((s) => s !== svc)
        : [...f.services_offered, svc],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const zips = zipInput.split(/[,\s]+/).map((z) => z.trim()).filter(Boolean);
    const payload = {
      company_name: form.company_name,
      contact_name: form.contact_name,
      phone: form.phone,
      email: form.email || null,
      services_offered: form.services_offered,
      zip_codes_served: zips,
      city: form.city || null,
      state: form.state || null,
      max_leads_per_day: form.max_leads_per_day,
    };

    if (editing) {
      const { error } = await supabase.from("contractors").update(payload as any).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Contractor updated" });
    } else {
      const { error } = await supabase.from("contractors").insert(payload as any);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Contractor added" });
    }
    setShowModal(false);
    fetchContractors();
  };

  const toggleStatus = async (c: Contractor) => {
    const newStatus = c.status === "active" ? "inactive" : "active";
    await supabase.from("contractors").update({ status: newStatus } as any).eq("id", c.id);
    toast({ title: `Contractor ${newStatus}` });
    fetchContractors();
  };

  const deleteContractor = async (id: string) => {
    if (!confirm("Delete this contractor?")) return;
    await supabase.from("contractors").delete().eq("id", id);
    toast({ title: "Contractor deleted" });
    fetchContractors();
  };

  const inputClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground">Contractors</h1>
        <Button variant="cta" size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Contractor</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input id="contractors-search" name="search" type="search" placeholder="Search contractors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Services</TableHead>
                <TableHead className="hidden md:table-cell">ZIPs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Limit/Day</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No contractors found</TableCell></TableRow>
              ) : filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.company_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{c.contact_name}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.services_offered.slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                      {c.services_offered.length > 3 && <Badge variant="outline" className="text-[10px]">+{c.services_offered.length - 3}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {c.zip_codes_served.length} ZIP{c.zip_codes_served.length !== 1 ? "s" : ""}
                  </TableCell>
                  <TableCell>
                    <Badge className={c.status === "active" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{c.max_leads_per_day}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Pencil className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(c)}>
                        <Switch checked={c.status === "active"} className="pointer-events-none" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteContractor(c.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? "Edit Contractor" : "Add Contractor"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3">
            <Input id="contractor-company" name="company_name" placeholder="Company Name *" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
            <Input id="contractor-contact" name="contact_name" placeholder="Contact Name *" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required />
            <Input id="contractor-phone" name="phone" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Input id="contractor-email" name="email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input id="contractor-city" name="city" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <Input id="contractor-state" name="state" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div>
              <label htmlFor="contractor-zips" className="text-xs text-muted-foreground">ZIP Codes Served (comma-separated)</label>
              <Input id="contractor-zips" name="zip_codes_served" placeholder="33601, 33602, 33603" value={zipInput} onChange={(e) => setZipInput(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Services Offered</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SERVICES.map((svc) => (
                  <Badge
                    key={svc}
                    variant={form.services_offered.includes(svc) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleService(svc)}
                  >
                    {svc}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="contractor-max-leads" className="text-xs text-muted-foreground">Max Leads Per Day</label>
              <Input id="contractor-max-leads" name="max_leads_per_day" type="number" min={1} max={100} value={form.max_leads_per_day} onChange={(e) => setForm({ ...form, max_leads_per_day: parseInt(e.target.value) || 10 })} />
            </div>
            <Button type="submit" variant="cta" className="w-full">{editing ? "Update" : "Add"} Contractor</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
