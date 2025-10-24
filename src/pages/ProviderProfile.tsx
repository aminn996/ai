import { useState } from "react";
import { useParams } from "react-router-dom";
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

const ProviderProfile = () => {
  const { id } = useParams();
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  // Mock provider data
  const provider = {
    id: 1,
    name: "Dr. Amira Ben Salem",
    category: "Healthcare",
    specialty: "General Practitioner",
    rating: 4.9,
    reviewCount: 127,
    location: "Tunis, Tunisia",
    verified: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=800&fit=crop",
    phone: "+216 98 765 432",
    email: "amira.bensalem@example.tn",
    description: "Experienced general practitioner with over 10 years of medical practice. Specialized in family medicine and preventive care. Fluent in Arabic, French, and English.",
    availability: "Mon-Fri: 9AM-6PM, Sat: 9AM-2PM",
    services: ["General Consultation", "Health Check-ups", "Vaccinations", "Prescriptions"],
    reviewsList: [
      { id: 1, author: "Fatima K.", rating: 5, text: "Excellent doctor! Very attentive and professional.", date: "2 weeks ago" },
      { id: 2, author: "Ahmed M.", rating: 5, text: "Highly recommend. Great diagnosis and treatment.", date: "1 month ago" },
      { id: 3, author: "Sara B.", rating: 4, text: "Very good experience. Appointment was on time.", date: "1 month ago" }
    ]
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Booking request sent! The provider will contact you soon.");
    setBookingName("");
    setBookingEmail("");
    setBookingMessage("");
  };

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
                    src={provider.image}
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
                      <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{provider.location}</span>
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

                  <div className="mb-6">
                    <h2 className="mb-3 text-xl font-bold">Services Offered</h2>
                    <div className="flex flex-wrap gap-2">
                      {provider.services.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-4 text-xl font-bold">Client Reviews</h2>
                    <div className="space-y-4">
                      {provider.reviewsList.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-medium">{review.author}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground">{review.text}</p>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
