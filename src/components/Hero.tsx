import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-95" />
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            Find Trusted Services
            <br />
            Anytime, Anywhere in Tunisia
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Connect with verified local professionals for all your essential needs
          </p>
          
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="What service do you need?"
                  className="h-12 pl-10 bg-white/95 border-white/20"
                />
              </div>
              <Button size="lg" variant="secondary" className="h-12 transition-smooth hover:shadow-hover">
                Search Services
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Healthcare", "Home Services", "Education", "Wellness", "Professional"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition-smooth hover:bg-white/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
