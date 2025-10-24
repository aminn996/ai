import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";

const allProviders = [
  {
    id: 1,
    name: "Dr. Amira Ben Salem",
    category: "Healthcare",
    specialty: "General Practitioner",
    rating: 4.9,
    reviews: 127,
    location: "Tunis",
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
    location: "Sousse",
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
    location: "Sfax",
    verified: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
  },
  {
    id: 4,
    name: "Karim Bouazizi",
    category: "Home Services",
    specialty: "Professional Plumber",
    rating: 4.7,
    reviews: 94,
    location: "Tunis",
    verified: true,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
  },
  {
    id: 5,
    name: "Salma Hamdi",
    category: "Wellness",
    specialty: "Yoga & Fitness Instructor",
    rating: 4.9,
    reviews: 112,
    location: "La Marsa",
    verified: true,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  },
  {
    id: 6,
    name: "Youssef Gharbi",
    category: "Professional Services",
    specialty: "Corporate Lawyer",
    rating: 4.8,
    reviews: 78,
    location: "Tunis",
    verified: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  }
];

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProviders = allProviders.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

          <div className="mb-8 flex flex-col gap-4 md:flex-row">
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
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Home Services">Home Services</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Wellness">Wellness</SelectItem>
                <SelectItem value="Professional Services">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
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
