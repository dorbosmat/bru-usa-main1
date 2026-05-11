import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Check, X, Star, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Roofing", "Solar", "Windows & Doors", "Remodel", "Other"];
const LOCATIONS = ["Tampa FL", "Florida", "Los Angeles CA", "San Jose CA", "San Francisco CA", "Unknown"];

interface Photo {
  id: string;
  url: string;
  storage_path: string | null;
  service_category: string;
  location_tag: string;
  quality_score: number;
  approved: boolean;
  caption: string | null;
  created_at: string;
}

// Simple heuristic quality scoring based on file metadata
function estimateQuality(file: File): number {
  let score = 50;
  // Larger files tend to be higher quality
  if (file.size > 3_000_000) score += 20;
  else if (file.size > 1_000_000) score += 10;
  // JPEG is expected for jobsite photos
  if (file.type === "image/jpeg") score += 5;
  // Penalize very small files
  if (file.size < 200_000) score -= 20;
  return Math.min(100, Math.max(0, score));
}

// Guess category from filename
function guessCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("solar") || n.includes("panel")) return "Solar";
  if (n.includes("roof")) return "Roofing";
  if (n.includes("window") || n.includes("door")) return "Windows & Doors";
  if (n.includes("remodel") || n.includes("kitchen") || n.includes("bath")) return "Remodel";
  return "Other";
}

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchPhotos = useCallback(async () => {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });
    setPhotos((data as Photo[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("photos")
        .upload(path, file);

      if (uploadErr) {
        toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);
      const quality = estimateQuality(file);
      const category = guessCategory(file.name);

      await supabase.from("photos").insert({
        url: urlData.publicUrl,
        storage_path: path,
        service_category: category,
        quality_score: quality,
        approved: false,
      } as any);
    }

    toast({ title: "Upload complete", description: `${files.length} photo(s) uploaded.` });
    setUploading(false);
    e.target.value = "";
    fetchPhotos();
  };

  const updatePhoto = async (id: string, updates: Partial<Photo>) => {
    await supabase.from("photos").update(updates as any).eq("id", id);
    fetchPhotos();
  };

  const bulkApprove = async () => {
    for (const id of selected) {
      await supabase.from("photos").update({ approved: true } as any).eq("id", id);
    }
    setSelected(new Set());
    fetchPhotos();
    toast({ title: "Bulk approved", description: `${selected.size} photo(s) approved.` });
  };

  const deletePhoto = async (photo: Photo) => {
    if (photo.storage_path) {
      await supabase.storage.from("photos").remove([photo.storage_path]);
    }
    await supabase.from("photos").delete().eq("id", photo.id);
    fetchPhotos();
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const topPicks = [...photos].sort((a, b) => b.quality_score - a.quality_score).slice(0, 6);

  if (loading) return <p className="text-muted-foreground">Loading photos...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Photos Manager</h1>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <Button onClick={bulkApprove} size="sm" className="gap-2">
              <Check className="h-4 w-4" /> Approve {selected.size}
            </Button>
          )}
          <label>
            <Button asChild variant="cta" size="sm" className="gap-2 cursor-pointer">
              <span>
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Photos"}
              </span>
            </Button>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Top Picks suggestion */}
      {topPicks.length > 0 && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-accent" /> Suggested Top Picks (by quality score)
          </h3>
          <div className="flex gap-2 flex-wrap">
            {topPicks.map(p => (
              <div key={p.id} className="relative w-16 h-16 rounded overflow-hidden border border-border">
                <img src={p.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                <span className="absolute bottom-0 right-0 bg-foreground/70 text-primary-foreground text-[10px] px-1">
                  {p.quality_score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="relative aspect-[4/3]">
              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute top-2 left-2">
                <Checkbox
                  checked={selected.has(photo.id)}
                  onCheckedChange={() => toggleSelect(photo.id)}
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge variant={photo.approved ? "default" : "secondary"}>
                  {photo.approved ? "Approved" : "Pending"}
                </Badge>
              </div>
              <div className="absolute bottom-2 right-2">
                <Badge variant="outline" className="bg-background/80 text-xs">
                  Score: {photo.quality_score}
                </Badge>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex gap-2">
                <Select
                  value={photo.service_category}
                  onValueChange={v => updatePhoto(photo.id, { service_category: v })}
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select
                  value={photo.location_tag}
                  onValueChange={v => updatePhoto(photo.id, { location_tag: v })}
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                {!photo.approved ? (
                  <Button size="sm" variant="default" className="flex-1 h-8 text-xs gap-1" onClick={() => updatePhoto(photo.id, { approved: true })}>
                    <Check className="h-3 w-3" /> Approve
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1" onClick={() => updatePhoto(photo.id, { approved: false })}>
                    <X className="h-3 w-3" /> Unapprove
                  </Button>
                )}
                <Button size="sm" variant="destructive" className="h-8 text-xs gap-1" onClick={() => deletePhoto(photo)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No photos yet. Upload your first jobsite photos above.</p>
        </div>
      )}
    </div>
  );
}
