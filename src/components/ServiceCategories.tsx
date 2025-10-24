import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Wrench, GraduationCap, Sparkles, Briefcase, Home } from "lucide-react";

const categories = [
  {
    icon: Stethoscope,
    name: "Healthcare",
    description: "Doctors, dentists, nurses",
    color: "text-red-500",
    count: "120+ Providers"
  },
  {
    icon: Wrench,
    name: "Home Services",
    description: "Plumbers, electricians, cleaners",
    color: "text-orange-500",
    count: "250+ Providers"
  },
  {
    icon: GraduationCap,
    name: "Education",
    description: "Tutors, language classes",
    color: "text-blue-500",
    count: "180+ Providers"
  },
  {
    icon: Sparkles,
    name: "Wellness",
    description: "Beauty, fitness trainers",
    color: "text-purple-500",
    count: "95+ Providers"
  },
  {
    icon: Briefcase,
    name: "Professional Services",
    description: "Lawyers, accountants",
    color: "text-green-500",
    count: "150+ Providers"
  },
  {
    icon: Home,
    name: "Home Care",
    description: "Caretakers, babysitters",
    color: "text-pink-500",
    count: "80+ Providers"
  }
];

const ServiceCategories = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Browse Services by Category</h2>
          <p className="text-lg text-muted-foreground">
            Find the perfect professional for your needs
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.name} to={`/services?category=${category.name.toLowerCase()}`}>
              <Card className="group h-full gradient-card border-border transition-smooth hover:shadow-hover hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{category.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{category.description}</p>
                  <p className="text-xs font-medium text-primary">{category.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
