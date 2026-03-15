import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <section className="container py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-brand-dark rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-3">
          <span className="inline-block bg-primary/20 text-primary text-xs font-heading font-bold px-3 py-1 rounded-full">
            LIMITED OFFER
          </span>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground">
            Get ₹100 off on your first order
          </h3>
          <p className="text-muted-foreground font-body">
            Use code <span className="text-brand-lime font-bold">BLITZ100</span> at checkout. Min order ₹299.
          </p>
        </div>
        <Button size="lg" className="bg-brand-lime text-brand-dark hover:bg-brand-lime/90 font-heading font-bold rounded-xl shrink-0">
          <Zap className="w-4 h-4 mr-2" />
          Claim Offer
        </Button>
      </motion.div>
    </section>
  );
};

export default PromoBanner;
