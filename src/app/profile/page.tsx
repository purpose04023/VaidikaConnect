"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, Calendar, Clock, MapPin, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isConfirmingOrderId, setIsConfirmingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    const userEmail = user.email || "";
    const userFullName = user.user_metadata?.full_name || userEmail.split("@")[0] || "Devotee";

    async function fetchData() {
      setIsLoadingData(true);
      
      // 1. Fetch user profile with fallback
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);
      } catch (err) {
        console.warn("Profiles table missing or profile not found. Using local profile fallback.");
        setProfile({
          id: userId,
          full_name: userFullName,
          phone_whatsapp: "Not set",
          role: "user"
        });
      }

      // 2. Fetch custom pooja orders with localStorage fallback
      let userOrders: any[] = [];
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from("custom_pooja_requests")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;
        userOrders = ordersData || [];
      } catch (err) {
        console.warn("custom_pooja_requests table missing. Loading orders from client cache.");
      }

      // Merge mock orders from localStorage
      try {
        const localOrders = JSON.parse(localStorage.getItem("mock_custom_pooja_requests") || "[]");
        const userLocalOrders = localOrders.filter((o: any) => o.user_id === userId);
        
        userLocalOrders.forEach((lo: any) => {
          if (!userOrders.some(uo => uo.id === lo.id)) {
            userOrders.push(lo);
          }
        });

        // Sort by created_at descending
        userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } catch (localErr) {
        console.error("Failed to load mock orders from localStorage:", localErr);
      }
      setOrders(userOrders);

      // 3. Fetch standard bookings history
      let userBookings: any[] = [];
      try {
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (bookingsError) throw bookingsError;
        userBookings = bookingsData || [];
      } catch (err) {
        console.warn("bookings table missing or fetch failed. using fallback.");
      }
      setBookings(userBookings);

      setIsLoadingData(false);
    }
    fetchData();
  }, [user]);

  // Confirm and book checkout trigger
  const handleConfirmBooking = async (orderId: string) => {
    setIsConfirmingOrderId(orderId);

    try {
      let isDbUpdateSuccess = false;
      try {
        const response = await fetch("/api/custom-pooja-request/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: orderId, status: "completed" })
        });
        
        if (response.ok) {
          isDbUpdateSuccess = true;
        }
      } catch (dbErr) {
        console.warn("Could not update order status in Supabase. Attempting localStorage update.");
      }

      // If database update failed or skipped, try updating client-side cache
      let updatedLocal = false;
      try {
        const localOrders = JSON.parse(localStorage.getItem("mock_custom_pooja_requests") || "[]");
        const idx = localOrders.findIndex((o: any) => o.id === orderId);
        if (idx !== -1) {
          localOrders[idx].status = "completed";
          localStorage.setItem("mock_custom_pooja_requests", JSON.stringify(localOrders));
          updatedLocal = true;
        }
      } catch (localErr) {
        console.error("Failed to update status in localStorage:", localErr);
      }

      if (!isDbUpdateSuccess && !updatedLocal) {
        throw new Error("Could not find order to confirm.");
      }

      // Update local state
      setOrders(current =>
        current.map(o => (o.id === orderId ? { ...o, status: "completed" } : o))
      );

      toast({
        title: "Pooja Confirmed & Booked!",
        description: "Your ceremony is successfully booked. The Assigned Pandit details will be sent to WhatsApp.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: err.message || "Could not confirm booking.",
      });
    } finally {
      setIsConfirmingOrderId(null);
    }
  };

  if (isUserLoading || (user && isLoadingData)) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">Please sign in to view your profile and pooja bookings.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="font-headline text-4xl font-bold text-primary mb-2">My Profile & Bookings</h1>
      <p className="text-muted-foreground mb-8">Manage your custom pooja requests and view booking history.</p>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Left Side: Profile Info Card */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-primary/15 text-primary rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-3 border border-primary/25">
                {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </div>
              <CardTitle className="text-lg font-bold">{profile?.full_name || "Devotee"}</CardTitle>
              <CardDescription className="truncate text-xs">{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 border-t text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>WhatsApp: {profile?.phone_whatsapp || "Not set"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary" className="capitalize">{profile?.role || "User"}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Bookings & Request History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Custom Pooja Requests
          </h2>

          {orders.length === 0 ? (
            <Card className="text-center p-8 bg-muted/10 border-dashed">
              <CardContent className="space-y-4 pt-4">
                <p className="text-muted-foreground">You haven't requested any custom poojas yet.</p>
                <Button asChild variant="outline">
                  <Link href="/programs">Explore Programs to Request</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isPending = order.status === "pending_review" || order.status === "new" || order.status === "wait";
                const isAssigned = order.status === "price_assigned";
                const isCompleted = order.status === "completed";

                return (
                  <Card key={order.id} className="overflow-hidden border-border bg-card shadow-md">
                    <CardHeader className="bg-muted/10 border-b py-3 px-5 flex flex-row items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Request ID: {order.id.slice(0, 8)}...</span>
                        <h3 className="font-bold text-foreground text-lg leading-snug mt-0.5">
                          {order.pooja_description.substring(0, 45)}{order.pooja_description.length > 45 ? "..." : ""}
                        </h3>
                      </div>
                      
                      {isPending && <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/30">Awaiting Price</Badge>}
                      {isAssigned && <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Price Offered</Badge>}
                      {isCompleted && <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/30">Confirmed & Booked</Badge>}
                    </CardHeader>
                    
                    <CardContent className="p-5 space-y-4 text-sm text-muted-foreground">
                      <p className="italic text-foreground bg-secondary/20 p-3 rounded-lg border border-border/40">
                        "{order.pooja_description}"
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>Date: {order.preferred_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>Time: {order.preferred_time}</span>
                        </div>
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <MapPin className="h-4 w-4 text-primary mt-0.5" />
                          <span>Location: {order.location || "Online"}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-muted/5 border-t py-4 px-5 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        {order.total_amount ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Price Quote:</span>
                            <span className="text-2xl font-extrabold text-foreground">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium italic text-amber-500">Pandits verifying requirements...</span>
                        )}
                      </div>

                      {isAssigned && (
                        <Button
                          onClick={() => handleConfirmBooking(order.id)}
                          disabled={isConfirmingOrderId === order.id}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                        >
                          {isConfirmingOrderId === order.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              <span>Booking...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1.5" />
                              <span>Confirm & Book Pooja</span>
                            </>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Program Booking History block */}
          <h2 className="text-2xl font-bold flex items-center gap-2 pt-6">
            <Calendar className="h-6 w-6 text-primary" />
            Program Booking History
          </h2>

          {bookings.length === 0 ? (
            <Card className="text-center p-8 bg-muted/10 border-dashed">
              <CardContent className="space-y-4 pt-4">
                <p className="text-muted-foreground">You haven't booked any standard programs yet.</p>
                <Button asChild variant="outline">
                  <Link href="/find-pujari">Explore & Book Programs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const dateObj = new Date(booking.muhurtham_time);
                const formattedDate = dateObj.toLocaleDateString();
                const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <Card key={booking.id} className="overflow-hidden border-border bg-card shadow-md">
                    <CardHeader className="bg-muted/10 border-b py-3 px-5 flex flex-row items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Booking ID: {booking.id.slice(0, 8)}...</span>
                        <h3 className="font-bold text-foreground text-lg leading-snug mt-0.5">
                          {booking.puja_name || "Sacred Ritual"}
                        </h3>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/30 capitalize">
                        {booking.status || "Confirmed"}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="p-5 space-y-4 text-sm text-muted-foreground">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>Muhurtham Date: {formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>Time: {formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                          <span>Dakshina: ₹{parseFloat(booking.dakshina).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Convenience Fee: ₹{parseFloat(booking.convenience_fee).toLocaleString()}</Badge>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-muted/5 border-t py-3 px-5">
                      <Button asChild className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl">
                        <Link href={booking.program_id ? `/find-pujari?puja=${booking.program_id}` : '/find-pujari'}>
                          Book Again
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
