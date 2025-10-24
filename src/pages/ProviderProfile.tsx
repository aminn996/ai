import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location, calculateDistance } = useGeolocation();
  const [provider, setProvider] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to view provider profiles");
      navigate("/auth");
      return;
    }

    fetchProvider();
    fetchReviews();
  }, [id, user, navigate]);

  const fetchProvider = async () => {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      toast.error("Provider not found");
      navigate("/services");
      return;
    }

    // Calculate distance if location is available
    let providerWithDistance = { ...data, distance: undefined as number | undefined };
    if (location) {
      providerWithDistance.distance = calculateDistance(
        location.latitude,
        location.longitude,
        Number(data.latitude),
        Number(data.longitude)
      );
    }

    setProvider(providerWithDistance);
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(full_name)")
      .eq("provider_id", id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) setReviews(data);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to book services");
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      provider_id: id,
      user_id: user.id,
      customer_name: bookingName,
      customer_email: bookingEmail,
      message: bookingMessage,
    });

    if (error) {
      toast.error("Failed to send booking request");
      return;
    }

    toast.success("Booking request sent! The provider will contact you soon.");
    setBookingName("");
    setBookingEmail("");
    setBookingMessage("");
  };

  if (loading || !provider) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={provider.image_url}
                    alt={provider.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <h1 className="text-3xl font-bold">{provider.name}</h1>
                        {provider.verified && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg text-muted-foreground">{provider.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold">{provider.rating}</span>
                      <span className="text-muted-foreground">({provider.review_count} reviews)</span>
                    </div>
                  </div>

                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{provider.location_name}</span>
                      {provider.distance && (
                        <span className="text-sm text-primary">({provider.distance.toFixed(1)} km away)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>{provider.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>{provider.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{provider.availability}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="mb-3 text-xl font-bold">About</h2>
                    <p className="text-muted-foreground">{provider.description}</p>
                  </div>

                  {provider.services && provider.services.length > 0 && (
                    <div className="mb-6">
                      <h2 className="mb-3 text-xl font-bold">Services Offered</h2>
                      <div className="flex flex-wrap gap-2">
                        {provider.services.map((service: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="mb-4 text-xl font-bold">Client Reviews</h2>
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="font-medium">
                                  {review.profiles?.full_name || "Anonymous"}
                                </span>
                                <div className="flex items-center gap-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="mb-2 text-sm text-muted-foreground">{review.comment}</p>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No reviews yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Book This Service</h2>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Your Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        placeholder="Describe your needs..."
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full transition-smooth">
                      Send Booking Request
                    </Button>
                  </form>

                  <div className="mt-6 space-y-2 border-t pt-6">
                    <p className="text-sm text-muted-foreground">
                      Response time: Within 24 hours
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The provider will contact you to confirm availability
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderProfile;
