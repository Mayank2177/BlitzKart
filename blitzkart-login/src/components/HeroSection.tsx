import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Clock } from "lucide-react";
import heroImage from "@/assets/hero-groceries.png";

const HeroSection = () => {
  return (
    <section className="bg-primary/5 overflow-hidden border-b border-border">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/15 rounded-full px-4 py-1.5 mb-6">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Delivery in <strong>10 minutes</strong></span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Groceries at lightning{" "}
              <span className="text-primary">speed</span> ⚡
            </h1>

            <p className="text-muted-foreground text-lg mb-8 max-w-lg font-body">
              From fresh produce to daily essentials — everything delivered to your door faster than you can say "BlitzKart".
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="font-heading font-bold text-base gap-2">
                <Zap className="h-5 w-5" /> Order Now
              </Button>
              <Button size="lg" variant="outline" className="font-heading font-bold text-base">
                Browse Categories
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src={heroImage}
              alt="Fresh groceries delivered fast"
              className="w-full max-w-md drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
