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
import { format } from "date-fns";
import { Plus, Pencil, Trash2, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  image_url: string | null;
  is_visible: boolean | null;
}

const defaultEvent: Partial<Event> = {
  title: "",
  description: "",
  event_date: null,
  location: "",
  image_url: "",
  is_visible: true,
};

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Event> | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });

    if (error) {
      toast({ title: "Error fetching events", variant: "destructive" });
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const openDialog = (event?: Event) => {
    if (event) {
      setEditing(event);
      setSelectedDate(event.event_date ? new Date(event.event_date) : undefined);
    } else {
      setEditing({ ...defaultEvent });
      setSelectedDate(undefined);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing?.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    const data = {
      title: editing.title,
      description: editing.description || null,
      event_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
      location: editing.location || null,
      image_url: editing.image_url || null,
      is_visible: editing.is_visible ?? true,
    };

    if (editing.id) {
      const { error } = await supabase.from("events").update(data).eq("id", editing.id);

      if (error) {
        toast({ title: "Error updating event", variant: "destructive" });
      } else {
        toast({ title: "Event updated" });
        setDialogOpen(false);
        fetchEvents();
      }
    } else {
      const { error } = await supabase.from("events").insert(data);

      if (error) {
        toast({ title: "Error creating event", variant: "destructive" });
      } else {
        toast({ title: "Event created" });
        setDialogOpen(false);
        fetchEvents();
      }
    }
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting event", variant: "destructive" });
    } else {
      toast({ title: "Event deleted" });
      fetchEvents();
    }
  };

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    await supabase.from("events").update({ is_visible: isVisible }).eq("id", id);
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage upcoming events</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit Event" : "Add New Event"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
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
                  rows={3}
                  value={editing?.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  value={editing?.location || ""}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  placeholder="https://..."
                  value={editing?.image_url || ""}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                />
              </div>

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
          <CardTitle>All Events ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No events yet
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {event.event_date
                        ? format(new Date(event.event_date), "MMM d, yyyy")
                        : "TBD"}
                    </TableCell>
                    <TableCell>
                      {event.location ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={event.is_visible ?? true}
                        onCheckedChange={(checked) => toggleVisibility(event.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(event)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteEvent(event.id)}
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

export default AdminEvents;
