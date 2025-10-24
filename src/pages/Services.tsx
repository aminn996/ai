import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search, Navigation } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Provider {
  id: string;
  name: string;
  category: string;
  specialty: string;
  rating: number;
  review_count: number;
  location_name: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  image_url: string;
  distance?: number;
}

const Services = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location, loading: locationLoading, requestLocation, calculateDistance } = useGeolocation();
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("distance");

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast.error("Please sign in to view services");
      navigate("/auth");
      return;
    }

    fetchProviders();
  }, [user, navigate]);

  useEffect(() => {
    // Recalculate distances when location changes
    if (location && allProviders.length > 0) {
      const providersWithDistance = allProviders.map((provider) => ({
        ...provider,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          Number(provider.latitude),
          Number(provider.longitude)
        ),
      }));
      setAllProviders(providersWithDistance);
    }
  }, [location]);

  const fetchProviders = async () => {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*");

    if (error) {
      toast.error("Failed to load providers");
      return;
    }

    if (data) {
      // Calculate distances if location available
      const providersWithDistance = location
        ? data.map((provider) => ({
            ...provider,
            distance: calculateDistance(
              location.latitude,
              location.longitude,
              Number(provider.latitude),
              Number(provider.longitude)
            ),
          }))
        : data;
      
      setAllProviders(providersWithDistance as Provider[]);
    }
  };

  let filteredProviders = allProviders.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort providers
  if (sortBy === "distance" && location) {
    filteredProviders = filteredProviders.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  } else if (sortBy === "rating") {
    filteredProviders = filteredProviders.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">Browse Service Providers</h1>
            <p className="text-lg text-muted-foreground">
              Find trusted professionals for all your needs
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {location ? (
                  <>
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Showing services near you
                  </>
                ) : (
                  "Location unavailable - showing all services"
                )}
              </p>
              {!location && (
                <Button variant="outline" size="sm" onClick={requestLocation} disabled={locationLoading}>
                  <Navigation className="mr-2 h-4 w-4" />
                  {locationLoading ? "Getting location..." : "Enable Location"}
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Home Services">Home Services</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                  <SelectItem value="Professional Services">Professional</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="distance">Nearest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="group overflow-hidden transition-smooth hover:shadow-hover">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={provider.image_url}
                    alt={provider.name}
                    className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-bold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                    </div>
                    {provider.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mb-3 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground">({provider.review_count})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.location_name}</span>
                    </div>
                    {provider.distance && (
                      <span className="text-sm font-medium text-primary">
                        {provider.distance.toFixed(1)} km
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Link to={`/provider/${provider.id}`} className="w-full">
                    <Button className="w-full transition-smooth" variant="default">
                      View Profile
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                No providers found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
