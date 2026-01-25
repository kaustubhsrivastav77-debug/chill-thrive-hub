import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingStatusChartProps {
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  loading?: boolean;
}

const COLORS = {
  pending: "hsl(43, 96%, 56%)",
  confirmed: "hsl(142, 76%, 36%)",
  cancelled: "hsl(0, 84%, 60%)",
  completed: "hsl(221, 83%, 53%)",
};

export function BookingStatusChart({
  pending,
  confirmed,
  cancelled,
  completed,
  loading,
}: BookingStatusChartProps) {
  const data = [
    { name: "Pending", value: pending, color: COLORS.pending },
    { name: "Confirmed", value: confirmed, color: COLORS.confirmed },
    { name: "Cancelled", value: cancelled, color: COLORS.cancelled },
    { name: "Completed", value: completed, color: COLORS.completed },
  ].filter((item) => item.value > 0);

  const total = pending + confirmed + cancelled + completed;

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Booking Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (total === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Booking Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            No booking data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Booking Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Bookings</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <p className="text-2xl font-bold text-emerald-600">{confirmed}</p>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
