import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  category: string;
  is_visible: boolean | null;
  display_order: number | null;
}

const categories = ["general", "ice-bath", "events", "behind-the-scenes", "community"];

const defaultImage: Partial<GalleryImage> = {
  image_url: "",
  title: "",
  description: "",
  category: "general",
  is_visible: true,
};

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<GalleryImage> | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error fetching images", variant: "destructive" });
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const openDialog = (image?: GalleryImage) => {
    setEditing(image || { ...defaultImage });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing?.image_url) {
      toast({ title: "Image URL is required", variant: "destructive" });
      return;
    }

    const data = {
      image_url: editing.image_url,
      title: editing.title || null,
      description: editing.description || null,
      category: editing.category || "general",
      is_visible: editing.is_visible ?? true,
    };

    if (editing.id) {
      const { error } = await supabase.from("gallery_images").update(data).eq("id", editing.id);

      if (error) {
        toast({ title: "Error updating image", variant: "destructive" });
      } else {
        toast({ title: "Image updated" });
        setDialogOpen(false);
        fetchImages();
      }
    } else {
      const { error } = await supabase.from("gallery_images").insert(data);

      if (error) {
        toast({ title: "Error adding image", variant: "destructive" });
      } else {
        toast({ title: "Image added" });
        setDialogOpen(false);
        fetchImages();
      }
    }
  };

  const deleteImage = async (id: string) => {
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting image", variant: "destructive" });
    } else {
      toast({ title: "Image deleted" });
      fetchImages();
    }
  };

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    await supabase.from("gallery_images").update({ is_visible: isVisible }).eq("id", id);
    fetchImages();
  };

  const filteredImages =
    filterCategory === "all" ? images : images.filter((img) => img.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Manage photo gallery</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit Image" : "Add New Image"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  placeholder="https://..."
                  value={editing?.image_url || ""}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                />
              </div>

              {editing?.image_url && (
                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={editing.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editing?.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={2}
                  value={editing?.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editing?.category || "general"}
                  onValueChange={(value) => setEditing({ ...editing, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat.replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_visible"
                  checked={editing?.is_visible ?? true}
                  onCheckedChange={(checked) => setEditing({ ...editing, is_visible: checked })}
                />
                <Label htmlFor="is_visible">Visible</Label>
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

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat.replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Images ({filteredImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredImages.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No images yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div key={image.id} className="relative group rounded-lg overflow-hidden border">
                  <img
                    src={image.image_url}
                    alt={image.title || "Gallery image"}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => openDialog(image)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => toggleVisibility(image.id, !image.is_visible)}
                    >
                      {image.is_visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteImage(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {!image.is_visible && (
                    <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      Hidden
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs capitalize">
                    {image.category.replace("-", " ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGallery;
