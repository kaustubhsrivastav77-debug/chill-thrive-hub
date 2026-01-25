import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  CalendarX,
  Plus,
  Trash2,
  Edit2,
  Settings,
  CalendarIcon,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimeSlot {
  id: string;
  slot_time: string;
  capacity: number;
  is_active: boolean;
}

interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
}

const AdminSettings = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Time Slots State
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Partial<TimeSlot> | null>(null);
  
  // Blocked Dates State
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [blockReason, setBlockReason] = useState("");

  // Fetch Time Slots
  const fetchTimeSlots = useCallback(async () => {
    const { data, error } = await supabase
      .from("time_slots")
      .select("*")
      .order("slot_time", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load time slots", variant: "destructive" });
    } else {
      setTimeSlots(data || []);
    }
    setLoadingSlots(false);
  }, [toast]);

  // Fetch Blocked Dates
  const fetchBlockedDates = useCallback(async () => {
    const { data, error } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("blocked_date", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load blocked dates", variant: "destructive" });
    } else {
      setBlockedDates(data || []);
    }
    setLoadingDates(false);
  }, [toast]);

  useEffect(() => {
    fetchTimeSlots();
    fetchBlockedDates();
  }, [fetchTimeSlots, fetchBlockedDates]);

  // Time Slot CRUD
  const openSlotDialog = (slot?: TimeSlot) => {
    setEditingSlot(slot || { slot_time: "", capacity: 1, is_active: true });
    setSlotDialogOpen(true);
  };

  const saveTimeSlot = async () => {
    if (!editingSlot?.slot_time) {
      toast({ title: "Error", description: "Please enter a time", variant: "destructive" });
      return;
    }

    if (editingSlot.id) {
      // Update
      const { error } = await supabase
        .from("time_slots")
        .update({
          slot_time: editingSlot.slot_time,
          capacity: editingSlot.capacity || 1,
          is_active: editingSlot.is_active,
        })
        .eq("id", editingSlot.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update time slot", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Time slot updated" });
        fetchTimeSlots();
      }
    } else {
      // Create
      const { error } = await supabase
        .from("time_slots")
        .insert({
          slot_time: editingSlot.slot_time,
          capacity: editingSlot.capacity || 1,
          is_active: editingSlot.is_active ?? true,
        });

      if (error) {
        toast({ title: "Error", description: "Failed to create time slot", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Time slot created" });
        fetchTimeSlots();
      }
    }
    setSlotDialogOpen(false);
  };

  const deleteTimeSlot = async (id: string) => {
    const { error } = await supabase.from("time_slots").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete time slot", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Time slot deleted" });
      fetchTimeSlots();
    }
  };

  const toggleSlotActive = async (slot: TimeSlot) => {
    const { error } = await supabase
      .from("time_slots")
      .update({ is_active: !slot.is_active })
      .eq("id", slot.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      fetchTimeSlots();
    }
  };

  // Blocked Date CRUD
  const saveBlockedDate = async () => {
    if (!selectedDate) {
      toast({ title: "Error", description: "Please select a date", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("blocked_dates").insert({
      blocked_date: format(selectedDate, "yyyy-MM-dd"),
      reason: blockReason || null,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Error", description: "This date is already blocked", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Failed to block date", variant: "destructive" });
      }
    } else {
      toast({ title: "Success", description: "Date blocked successfully" });
      fetchBlockedDates();
      setDateDialogOpen(false);
      setSelectedDate(undefined);
      setBlockReason("");
    }
  };

  const deleteBlockedDate = async (id: string) => {
    const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to unblock date", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Date unblocked" });
      fetchBlockedDates();
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground">
              Only administrators can access the settings page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Settings className="h-7 w-7 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage time slots, blocked dates, and business configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Slots Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Time Slots
                </CardTitle>
                <CardDescription>
                  Manage available booking time slots
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => openSlotDialog()} className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingSlots ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No time slots configured</p>
                <Button variant="link" onClick={() => openSlotDialog()}>
                  Add your first time slot
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-colors",
                      slot.is_active ? "bg-card" : "bg-muted/50 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={slot.is_active}
                        onCheckedChange={() => toggleSlotActive(slot)}
                      />
                      <div>
                        <p className="font-medium">{slot.slot_time}</p>
                        <p className="text-xs text-muted-foreground">
                          Capacity: {slot.capacity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openSlotDialog(slot)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteTimeSlot(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blocked Dates Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarX className="h-5 w-5 text-destructive" />
                  Blocked Dates
                </CardTitle>
                <CardDescription>
                  Block dates when bookings are unavailable
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setDateDialogOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" />
                Block Date
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingDates ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : blockedDates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarX className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No blocked dates</p>
                <Button variant="link" onClick={() => setDateDialogOpen(true)}>
                  Block a date
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {blockedDates.map((date) => (
                  <div
                    key={date.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-destructive/5 border-destructive/20"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(date.blocked_date), "EEEE, MMMM d, yyyy")}
                      </p>
                      {date.reason && (
                        <p className="text-xs text-muted-foreground">{date.reason}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteBlockedDate(date.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Time Slot Dialog */}
      <Dialog open={slotDialogOpen} onOpenChange={setSlotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSlot?.id ? "Edit Time Slot" : "Add Time Slot"}
            </DialogTitle>
            <DialogDescription>
              Configure the time slot settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="slot_time">Time</Label>
              <Input
                id="slot_time"
                placeholder="e.g., 9:00 AM - 10:00 AM"
                value={editingSlot?.slot_time || ""}
                onChange={(e) =>
                  setEditingSlot((prev) => ({ ...prev, slot_time: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={editingSlot?.capacity || 1}
                onChange={(e) =>
                  setEditingSlot((prev) => ({
                    ...prev,
                    capacity: parseInt(e.target.value) || 1,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of bookings for this slot
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={editingSlot?.is_active ?? true}
                onCheckedChange={(checked) =>
                  setEditingSlot((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlotDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTimeSlot} className="gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Date Dialog */}
      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block a Date</DialogTitle>
            <DialogDescription>
              Select a date to block from bookings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Holiday, Maintenance, etc."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveBlockedDate} className="gap-1">
              <CalendarX className="h-4 w-4" />
              Block Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;
