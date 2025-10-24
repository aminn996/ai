import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Calendar, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const [providers, setProviders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // Check admin access
    if (!user) {
      navigate("/admin");
      return;
    }

    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    // Fetch data
    fetchData();
  }, [user, isAdmin, navigate]);

  const fetchData = async () => {
    // Fetch providers
    const { data: providersData } = await supabase
      .from("service_providers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (providersData) setProviders(providersData);

    // Fetch bookings
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*, service_providers(name)")
      .order("created_at", { ascending: false })
      .limit(5);
    if (bookingsData) setBookings(bookingsData);

    // Fetch reviews
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*, service_providers(name)")
      .order("created_at", { ascending: false })
      .limit(5);
    if (reviewsData) setReviews(reviewsData);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const stats = [
    { title: "Total Providers", value: "875", icon: Users, change: "+12% this month" },
    { title: "Total Bookings", value: "2,345", icon: Calendar, change: "+8% this week" },
    { title: "Avg. Rating", value: "4.8", icon: Star, change: "+0.2 from last month" },
    { title: "Active Users", value: "12.4K", icon: TrendingUp, change: "+18% this month" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Aidora Admin</h1>
              <p className="text-xs text-muted-foreground">Management Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="transition-smooth">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor and manage your platform</p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="providers">Service Providers</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Service Providers</CardTitle>
                <CardDescription>Manage and verify service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.length > 0 ? (
                    providers.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex items-center gap-4">
                          <div 
                            className="h-12 w-12 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${provider.image_url})` }}
                          />
                          <div>
                            <p className="font-medium">{provider.name}</p>
                            <p className="text-sm text-muted-foreground">{provider.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {provider.verified && <Badge variant="secondary">Verified</Badge>}
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No providers yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Monitor booking requests and confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.service_providers?.name || "Unknown Provider"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={booking.status === "pending" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No bookings yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Monitor and moderate customer reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-medium">{review.service_providers?.name || "Unknown Provider"}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="mb-2 text-sm text-muted-foreground">
                          {review.comment || "No comment provided"}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Remove</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No reviews yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
