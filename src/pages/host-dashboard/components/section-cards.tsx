import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useGetAllBookingByOwnerIdQuery, selectBookingsByOwner } from "@/features/booking/bookingSlice"
import { useGetVehicleByOwnerQuery, selectAllVehiclesByOwner } from "@/features/vehicle/vehicleSlice"
import { useAppSelector } from "@/app/hook"
import { useEffect, useState } from "react";
import { useUser,useAuth } from "@clerk/clerk-react";

export function SectionCards() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
      const fetchToken = async () => {
        const token = await getToken({ template: "RoadMate" });
        setAuthToken(token);
      };
      fetchToken();
    }, [getToken]);

    const { isSuccess: isBookingSuccess } = useGetAllBookingByOwnerIdQuery({ token: authToken, ownerId: userId, status: ["ACTIVE", "COMPLETED", "CONFIRMED"] }, { skip: !userId || !authToken });
    const bookings = useAppSelector(selectBookingsByOwner(authToken, userId, ["ACTIVE", "COMPLETED", "CONFIRMED"]));

    const { isSuccess: isVehicleSuccess } = useGetVehicleByOwnerQuery(userId);
    const vehicles = useAppSelector(selectAllVehiclesByOwner(userId));

    const totalRevenue = bookings.reduce((total, booking) => {
      const bookingDays = booking.start_date && booking.end_date ? (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24) : 1; 
      return total + (booking.vehicle.base_price || 0) * bookingDays;
    }, 0);

  return (
    <div className=":data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {isBookingSuccess &&  totalRevenue.toLocaleString("en-US", { style: "currency", currency: "LKR" })}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Bookings</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {isBookingSuccess && bookings.length}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Listings</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {isVehicleSuccess && vehicles.length}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            4.5%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
