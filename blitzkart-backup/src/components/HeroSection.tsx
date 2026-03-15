import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Clock } from "lucide-react";
import heroImage from "@/assets/hero-groceries.png";

const HeroSection = () => {
  return (
    <section className="bg-brand-dark overflow-hidden">
      <div className="container py-12 md:py-20 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-brand-charcoal rounded-full px-4 py-1.5 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-primary-foreground font-body">Delivery in</span>
            <span className="font-heading font-bold text-brand-lime">10 minutes</span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-primary-foreground">Groceries at </span>
            <span className="text-primary">lightning</span>
            <br />
            <span className="text-brand-lime">speed</span>
            <span className="text-primary-foreground"> ⚡</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-md font-body">
            From fresh produce to daily essentials — everything delivered to your door faster than you can say "BlitzKart".
          </p>

          <div className="flex gap-3">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-bold text-base px-8 rounded-xl">
              <Zap className="w-4 h-4 mr-2" />
              Order Now
            </Button>
            <Button size="lg" variant="outline" className="border-brand-charcoal text-primary-foreground hover:bg-brand-charcoal font-heading rounded-xl">
              Browse Categories
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <img src={heroImage} alt="Fresh groceries delivered fast" className="w-full max-w-md drop-shadow-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
