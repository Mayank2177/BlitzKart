import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-4 font-body">
              LIMITED OFFER
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Get ₹100 off on your first order
            </h3>
            <p className="text-primary-foreground/70 font-body">
              Use code <span className="font-bold text-primary-foreground">BLITZ100</span> at checkout. Min order ₹299.
            </p>
          </div>
          <Button size="lg" variant="secondary" className="font-heading font-bold text-base gap-2 relative z-10 flex-shrink-0">
            <Zap className="h-5 w-5" /> Claim Offer
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoBanner;
