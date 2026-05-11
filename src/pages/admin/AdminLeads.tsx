import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Constants } from "@/integrations/supabase/types";
import { Download, Plus, Search, PhoneCall, Archive } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Lead     = Tables<"leads">;
type LeadNote = Tables<"lead_notes">;

const STATUS_BADGE: Record<string,string> = {
  new:"bg-primary text-primary-foreground", contacted:"bg-accent text-accent-foreground",
  qualified:"bg-emerald-600 text-white", scheduled:"bg-violet-600 text-white",
  won:"bg-green-700 text-white", lost:"bg-destructive text-destructive-foreground",
};

function LeadsTableSkeleton() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="bg-muted/50 px-4 py-3 flex gap-6 border-b border-border">
        {[120,100,80,60,40,60].map((w,i)=><Skeleton key={i} className="h-3" style={{width:w}}/>)}
      </div>
      {Array.from({length:8}).map((_,i)=>(
        <div key={i} className="px-4 py-3.5 flex gap-6 items-center border-b border-border last:border-0">
          <Skeleton className="h-3 w-[120px]"/> <Skeleton className="h-3 w-[100px]"/> <Skeleton className="h-3 w-[80px]"/>
          <Skeleton className="h-5 w-[60px] rounded-full"/> <Skeleton className="h-3 w-[40px]"/> <Skeleton className="h-3 w-[60px]"/>
        </div>
      ))}
    </div>
  );
}

export default function AdminLeads() {
  const { user, isAdmin } = useAuth();
  const [leads,setLeads]=useState<Lead[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [statusFilter,setStatusFilter]=useState("");
  const [serviceFilter,setServiceFilter]=useState("");
  const [selectedLead,setSelectedLead]=useState<Lead|null>(null);
  const [notes,setNotes]=useState<LeadNote[]>([]);
  const [newNote,setNewNote]=useState("");
  const [showCreateModal,setShowCreateModal]=useState(false);
  const [createForm,setCreateForm]=useState({name:"",phone:"",email:"",zip:"",service:"",message:"",source:"phone" as string});
  // Archive confirmation: when non-null, the AlertDialog is open and targets this lead.
  const [archiveTarget,setArchiveTarget]=useState<Lead|null>(null);
  const [archiving,setArchiving]=useState(false);

  // Default list hides archived leads. Restore is a future feature (admin-only "Show archived" toggle).
  const fetchLeads=async()=>{ const {data}=await supabase.from("leads").select("*").is("archived_at",null).order("created_at",{ascending:false}); setLeads(data??[]); setLoading(false); };
  useEffect(()=>{ fetchLeads(); },[]);

  const filtered=useMemo(()=>leads.filter(l=>{
    if(statusFilter&&l.status!==statusFilter)return false;
    if(serviceFilter&&l.service!==serviceFilter)return false;
    if(search){ const q=search.toLowerCase(); return l.name.toLowerCase().includes(q)||l.phone.includes(q)||(l.email?.toLowerCase().includes(q)??false)||l.zip.includes(q); }
    return true;
  }),[leads,search,statusFilter,serviceFilter]);

  const openDetail=async(lead:Lead)=>{ setSelectedLead(lead); const {data}=await supabase.from("lead_notes").select("*").eq("lead_id",lead.id).order("created_at",{ascending:false}); setNotes((data as LeadNote[])??[]); };
  const addNote=async()=>{ if(!newNote.trim()||!selectedLead||!user)return; await supabase.from("lead_notes").insert({lead_id:selectedLead.id,user_id:user.id,content:newNote.trim(),type:"note"}); setNewNote(""); openDetail(selectedLead); };
  const updateLeadStatus=async(leadId:string,status:string)=>{ await supabase.from("leads").update({status:status as Lead["status"]}).eq("id",leadId); if(user)await supabase.from("lead_notes").insert({lead_id:leadId,user_id:user.id,content:`Status changed to ${status}`,type:"status_change"}); fetchLeads(); if(selectedLead?.id===leadId){const u={...selectedLead,status:status as Lead["status"]};setSelectedLead(u);openDetail(u);} };
  const exportCSV=()=>{ const h=["Name","Phone","Email","ZIP","Service","Status","Source","Created"]; const rows=filtered.map(l=>[l.name,l.phone,l.email??"",l.zip,l.service,l.status,l.source,l.created_at]); const csv=[h,...rows].map(r=>r.map(c=>`"${c}"`).join(",")).join("\n"); const blob=new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`leads-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url); };
  const createLead=async(e:React.FormEvent)=>{ e.preventDefault(); const {error}=await supabase.from("leads").insert({name:createForm.name,phone:createForm.phone,email:createForm.email||null,zip:createForm.zip,service:createForm.service,message:createForm.message||null,source:createForm.source as Lead["source"]}); if(error){toast({title:"Error creating lead",description:error.message,variant:"destructive"});}else{toast({title:"Lead created"});setShowCreateModal(false);setCreateForm({name:"",phone:"",email:"",zip:"",service:"",message:"",source:"phone"});fetchLeads();} };

  // Archive (soft-delete). Admin-only — the UI button is gated by isAdmin and a
  // BEFORE UPDATE trigger on the leads table rejects non-admin attempts at the DB level.
  // We log the action into lead_notes so the activity trail survives a restore.
  const confirmArchive = async () => {
    if (!archiveTarget || !user) return;
    setArchiving(true);
    const { error } = await supabase
      .from("leads")
      .update({ archived_at: new Date().toISOString(), archived_by: user.id })
      .eq("id", archiveTarget.id);
    if (error) {
      setArchiving(false);
      toast({ title: "Failed to archive lead", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.from("lead_notes").insert({
      lead_id: archiveTarget.id, user_id: user.id, content: "Lead archived", type: "status_change",
    });
    const archivedName = archiveTarget.name;
    setLeads(prev => prev.filter(l => l.id !== archiveTarget.id));
    setArchiveTarget(null);
    setSelectedLead(null);
    setArchiving(false);
    toast({ title: "Lead archived", description: `"${archivedName}" was moved to archived.` });
  };

  const services=[...new Set(leads.map(l=>l.service))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground">Leads</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-1"/>Export CSV</Button>
          <Button variant="cta" size="sm" onClick={()=>setShowCreateModal(true)}><Plus className="h-4 w-4 mr-1"/>New Lead</Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input id="leads-search" name="search" type="search" placeholder="Search name, phone, email..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9"/></div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="">All statuses</option>{Constants.public.Enums.lead_status.map(s=><option key={s} value={s}>{s}</option>)}</select>
        <select value={serviceFilter} onChange={e=>setServiceFilter(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="">All services</option>{services.map(s=><option key={s} value={s}>{s}</option>)}</select>
      </div>

      {loading ? <LeadsTableSkeleton/> : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Service</TableHead><TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">CB</TableHead><TableHead className="hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length===0?(
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No leads found</TableCell></TableRow>
              ):filtered.map(lead=>(
                <TableRow key={lead.id} className={`cursor-pointer ${(lead as any).callback_requested?"bg-accent/5":""}`} onClick={()=>openDetail(lead)}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{lead.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell">{lead.service}</TableCell>
                  <TableCell><Badge className={STATUS_BADGE[lead.status]??""}>{lead.status}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell">{(lead as any).callback_requested&&<PhoneCall size={14} className="text-accent"/>}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedLead} onOpenChange={open=>{if(!open)setSelectedLead(null);}}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedLead&&(<>
            <DialogHeader><DialogTitle className="font-display">{selectedLead.name}</DialogTitle></DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Phone:</span> {selectedLead.phone}</div>
                <div><span className="text-muted-foreground">Email:</span> {selectedLead.email??"—"}</div>
                <div><span className="text-muted-foreground">ZIP:</span> {selectedLead.zip}</div>
                <div><span className="text-muted-foreground">Service:</span> {selectedLead.service}</div>
                <div><span className="text-muted-foreground">Source:</span> {selectedLead.source}</div>
                <div><span className="text-muted-foreground">Created:</span> {new Date(selectedLead.created_at).toLocaleString()}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Callback:</span>{" "}{(selectedLead as any).callback_requested?<span className="text-accent font-semibold inline-flex items-center gap-1"><PhoneCall size={12}/>Requested</span>:"No"}</div>
              </div>
              {selectedLead.message&&<div><span className="text-muted-foreground">Message:</span><p className="mt-1">{selectedLead.message}</p></div>}
              <div>
                <label className="text-xs text-muted-foreground">Change Status</label>
                <select value={selectedLead.status} onChange={e=>updateLeadStatus(selectedLead.id,e.target.value)} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {Constants.public.Enums.lead_status.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Activity Log</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {notes.map(n=><div key={n.id} className={`text-xs p-2 rounded ${n.type==="note"?"bg-muted":"bg-accent/10"}`}><span className="text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span><p className="mt-0.5">{n.content}</p></div>)}
                  {notes.length===0&&<p className="text-muted-foreground text-xs">No activity yet</p>}
                </div>
                <div className="flex gap-2 mt-2">
                  <Textarea id="lead-new-note" name="new_note" value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Add a note..." className="min-h-[60px]"/>
                  <Button variant="cta" size="sm" onClick={addNote} disabled={!newNote.trim()}>Add</Button>
                </div>
              </div>
              {/* Admin-only archive action — visually quiet ghost button. Two clicks
                  required (this trigger + AlertDialog confirm) for safety. */}
              {isAdmin && (
                <div className="pt-3 border-t border-border flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={()=>setArchiveTarget(selectedLead)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Archive size={14} className="mr-1.5" aria-hidden="true"/>
                    Archive lead
                  </Button>
                </div>
              )}
            </div>
          </>)}
        </DialogContent>
      </Dialog>

      {/* Archive confirmation — destructive styling only on the confirm action,
          Cancel receives focus (DOM order + Radix focus-first behavior) so
          Enter cancels the dialog. */}
      <AlertDialog open={!!archiveTarget} onOpenChange={open=>{if(!open&&!archiving)setArchiveTarget(null);}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{archiveTarget?.name}&rdquo; will be hidden from the active leads list. The record and its activity log are preserved and can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e)=>{e.preventDefault();confirmArchive();}}
              disabled={archiving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {archiving ? "Archiving…" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Create Lead</DialogTitle></DialogHeader>
          <form onSubmit={createLead} className="space-y-3">
            <Input id="create-lead-name" name="name" placeholder="Name *"  value={createForm.name}    onChange={e=>setCreateForm({...createForm,name:e.target.value})}    required/>
            <Input id="create-lead-phone" name="phone" placeholder="Phone *" value={createForm.phone}   onChange={e=>setCreateForm({...createForm,phone:e.target.value})}   required/>
            <Input id="create-lead-email" name="email" placeholder="Email"   type="email" value={createForm.email} onChange={e=>setCreateForm({...createForm,email:e.target.value})}/>
            <Input id="create-lead-zip" name="zip" placeholder="ZIP *"   value={createForm.zip}     onChange={e=>setCreateForm({...createForm,zip:e.target.value})}     required/>
            <select id="create-lead-service" name="service" value={createForm.service} onChange={e=>setCreateForm({...createForm,service:e.target.value})} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select Service *</option>
              {["roofing","kitchen-bath-remodel","flooring","painting","concrete-driveway","windows-doors","general-remodeling"].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <select id="create-lead-source" name="source" value={createForm.source} onChange={e=>setCreateForm({...createForm,source:e.target.value})} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {Constants.public.Enums.lead_source.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <Textarea id="create-lead-message" name="message" placeholder="Message" value={createForm.message} onChange={e=>setCreateForm({...createForm,message:e.target.value})}/>
            <Button type="submit" variant="cta" className="w-full">Create Lead</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
