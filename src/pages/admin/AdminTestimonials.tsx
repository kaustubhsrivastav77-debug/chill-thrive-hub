import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Star, Video } from "lucide-react";

interface Testimonial {
  id: string;
  customer_name: string;
  feedback: string;
  rating: number | null;
  is_video: boolean | null;
  video_url: string | null;
  video_thumbnail: string | null;
  is_visible: boolean | null;
  display_order: number | null;
}

const defaultTestimonial: Partial<Testimonial> = {
  customer_name: "",
  feedback: "",
  rating: 5,
  is_video: false,
  video_url: "",
  video_thumbnail: "",
  is_visible: true,
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error fetching testimonials", variant: "destructive" });
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const openDialog = (testimonial?: Testimonial) => {
    setEditing(testimonial || { ...defaultTestimonial });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing?.customer_name || !editing?.feedback) {
      toast({ title: "Name and feedback are required", variant: "destructive" });
      return;
    }

    const data = {
      customer_name: editing.customer_name,
      feedback: editing.feedback,
      rating: editing.rating || 5,
      is_video: editing.is_video ?? false,
      video_url: editing.video_url || null,
      video_thumbnail: editing.video_thumbnail || null,
      is_visible: editing.is_visible ?? true,
    };

    if (editing.id) {
      const { error } = await supabase
        .from("testimonials")
        .update(data)
        .eq("id", editing.id);

      if (error) {
        toast({ title: "Error updating testimonial", variant: "destructive" });
      } else {
        toast({ title: "Testimonial updated" });
        setDialogOpen(false);
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from("testimonials").insert(data);

      if (error) {
        toast({ title: "Error creating testimonial", variant: "destructive" });
      } else {
        toast({ title: "Testimonial created" });
        setDialogOpen(false);
        fetchTestimonials();
      }
    }
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting testimonial", variant: "destructive" });
    } else {
      toast({ title: "Testimonial deleted" });
      fetchTestimonials();
    }
  };

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    await supabase.from("testimonials").update({ is_visible: isVisible }).eq("id", id);
    fetchTestimonials();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage customer testimonials</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing?.id ? "Edit Testimonial" : "Add New Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={editing?.customer_name || ""}
                  onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback *</Label>
                <Textarea
                  id="feedback"
                  rows={4}
                  value={editing?.feedback || ""}
                  onChange={(e) => setEditing({ ...editing, feedback: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min={1}
                  max={5}
                  value={editing?.rating || 5}
                  onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_video"
                  checked={editing?.is_video ?? false}
                  onCheckedChange={(checked) => setEditing({ ...editing, is_video: checked })}
                />
                <Label htmlFor="is_video">Video Testimonial</Label>
              </div>

              {editing?.is_video && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="video_url">Video URL</Label>
                    <Input
                      id="video_url"
                      placeholder="YouTube or video URL"
                      value={editing?.video_url || ""}
                      onChange={(e) => setEditing({ ...editing, video_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video_thumbnail">Thumbnail URL</Label>
                    <Input
                      id="video_thumbnail"
                      value={editing?.video_thumbnail || ""}
                      onChange={(e) => setEditing({ ...editing, video_thumbnail: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <Switch
                  id="is_visible"
                  checked={editing?.is_visible ?? true}
                  onCheckedChange={(checked) => setEditing({ ...editing, is_visible: checked })}
                />
                <Label htmlFor="is_visible">Visible on website</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No testimonials yet
                  </TableCell>
                </TableRow>
              ) : (
                testimonials.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.customer_name}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.feedback}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.is_video ? (
                        <Video className="h-4 w-4 text-primary" />
                      ) : (
                        <span className="text-muted-foreground">Text</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.is_visible ?? true}
                        onCheckedChange={(checked) => toggleVisibility(item.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteTestimonial(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestimonials;
