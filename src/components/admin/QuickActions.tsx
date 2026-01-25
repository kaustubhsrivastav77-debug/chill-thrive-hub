import { Link } from "react-router-dom";
import {
  Calendar,
  Package,
  MessageSquare,
  Image,
  CalendarDays,
  Users,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  description: string;
  icon: typeof Calendar;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: "New Booking",
    description: "Create a manual booking",
    icon: Calendar,
    href: "/admin/bookings",
    color: "from-primary/20 to-primary/5 text-primary",
  },
  {
    title: "Add Service",
    description: "Create a new service",
    icon: Package,
    href: "/admin/services",
    color: "from-emerald-500/20 to-emerald-500/5 text-emerald-500",
  },
  {
    title: "Add Testimonial",
    description: "Add customer feedback",
    icon: MessageSquare,
    href: "/admin/testimonials",
    color: "from-amber-500/20 to-amber-500/5 text-amber-500",
  },
  {
    title: "Upload Image",
    description: "Add to gallery",
    icon: Image,
    href: "/admin/gallery",
    color: "from-purple-500/20 to-purple-500/5 text-purple-500",
  },
  {
    title: "Create Event",
    description: "Schedule an event",
    icon: CalendarDays,
    href: "/admin/events",
    color: "from-blue-500/20 to-blue-500/5 text-blue-500",
  },
  {
    title: "Manage Users",
    description: "User roles & access",
    icon: Users,
    href: "/admin/users",
    color: "from-rose-500/20 to-rose-500/5 text-rose-500",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className={cn(
                "group relative flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br transition-all duration-300 hover:scale-105 hover:shadow-lg",
                action.color
              )}
            >
              <action.icon className="h-6 w-6 mb-2 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium text-center">{action.title}</span>
              <span className="text-xs text-muted-foreground text-center hidden sm:block">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
