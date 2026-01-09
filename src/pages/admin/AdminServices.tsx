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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number;
  original_price: number | null;
  duration_minutes: number;
  is_active: boolean | null;
  is_combo: boolean | null;
  badge: string | null;
  benefits: string[] | null;
  image_url: string | null;
  display_order: number | null;
}

const defaultService: Partial<Service> = {
  name: "",
  description: "",
  short_description: "",
  price: 0,
  original_price: null,
  duration_minutes: 30,
  is_active: true,
  is_combo: false,
  badge: "",
  benefits: [],
  image_url: "",
};

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [benefitsInput, setBenefitsInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error fetching services", variant: "destructive" });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const openDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setBenefitsInput(service.benefits?.join("\n") || "");
    } else {
      setEditingService({ ...defaultService });
      setBenefitsInput("");
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingService?.name || !editingService?.price) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }

    const benefits = benefitsInput
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b);

    const serviceData = {
      name: editingService.name,
      description: editingService.description || null,
      short_description: editingService.short_description || null,
      price: editingService.price,
      original_price: editingService.original_price || null,
      duration_minutes: editingService.duration_minutes || 30,
      is_active: editingService.is_active ?? true,
      is_combo: editingService.is_combo ?? false,
      badge: editingService.badge || null,
      benefits: benefits.length > 0 ? benefits : null,
      image_url: editingService.image_url || null,
    };

    if (editingService.id) {
      const { error } = await supabase
        .from("services")
        .update(serviceData)
        .eq("id", editingService.id);

      if (error) {
        toast({ title: "Error updating service", variant: "destructive" });
      } else {
        toast({ title: "Service updated" });
        setDialogOpen(false);
        fetchServices();
      }
    } else {
      const { error } = await supabase.from("services").insert(serviceData);

      if (error) {
        toast({ title: "Error creating service", variant: "destructive" });
      } else {
        toast({ title: "Service created" });
        setDialogOpen(false);
        fetchServices();
      }
    }
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting service", variant: "destructive" });
    } else {
      toast({ title: "Service deleted" });
      fetchServices();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("services")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating service", variant: "destructive" });
    } else {
      fetchServices();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your services and pricing</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService?.id ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={editingService?.name || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge (optional)</Label>
                  <Input
                    id="badge"
                    placeholder="e.g., Popular, New"
                    value={editingService?.badge || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, badge: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  value={editingService?.short_description || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, short_description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={editingService?.description || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingService?.price || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, price: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (₹)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    placeholder="For discounts"
                    value={editingService?.original_price || ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        original_price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={editingService?.duration_minutes || 30}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        duration_minutes: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  placeholder="https://..."
                  value={editingService?.image_url || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, image_url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea
                  id="benefits"
                  rows={4}
                  placeholder="Reduces inflammation&#10;Improves recovery&#10;Boosts energy"
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={editingService?.is_active ?? true}
                    onCheckedChange={(checked) =>
                      setEditingService({ ...editingService, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_combo"
                    checked={editingService?.is_combo ?? false}
                    onCheckedChange={(checked) =>
                      setEditingService({ ...editingService, is_combo: checked })
                    }
                  />
                  <Label htmlFor="is_combo">Combo Package</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Service</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No services yet. Add your first service!
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        {service.badge && (
                          <Badge variant="secondary" className="mt-1">
                            {service.badge}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">₹{service.price}</p>
                        {service.original_price && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₹{service.original_price}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{service.duration_minutes} min</TableCell>
                    <TableCell>
                      {service.is_combo ? (
                        <Badge variant="outline">Combo</Badge>
                      ) : (
                        <Badge variant="outline">Single</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={service.is_active ?? true}
                        onCheckedChange={(checked) => toggleActive(service.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteService(service.id)}
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

export default AdminServices;
