import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

const providers = [
  {
    id: 1,
    name: "Dr. Amira Ben Salem",
    category: "Healthcare",
    specialty: "General Practitioner",
    rating: 4.9,
    reviews: 127,
    location: "Tunis, Tunisia",
    verified: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Mohamed Trabelsi",
    category: "Home Services",
    specialty: "Licensed Electrician",
    rating: 4.8,
    reviews: 89,
    location: "Sousse, Tunisia",
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Leila Mansour",
    category: "Education",
    specialty: "Math & Physics Tutor",
    rating: 5.0,
    reviews: 156,
    location: "Sfax, Tunisia",
    verified: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
  }
];

const FeaturedProviders = () => {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Featured Service Providers</h2>
          <p className="text-lg text-muted-foreground">
            Highly rated professionals trusted by our community
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <Card key={provider.id} className="group overflow-hidden transition-smooth hover:shadow-hover">
              <div className="aspect-square overflow-hidden">
                <img
                  src={provider.image}
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
                    <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
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

        <div className="mt-12 text-center">
          <Link to="/services">
            <Button size="lg" variant="outline" className="transition-smooth">
              View All Providers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders;
