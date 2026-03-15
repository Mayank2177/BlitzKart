import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  emoji: string;
  discount?: number;
}

const ProductCard = ({ name, price, originalPrice, unit, emoji, discount }: ProductCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow relative group">
      {discount && (
        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-heading font-bold px-2 py-0.5 rounded-full">
          {discount}% OFF
        </span>
      )}
      <div className="bg-secondary rounded-xl h-28 flex items-center justify-center text-5xl">
        {emoji}
      </div>
      <div className="flex-1">
        <h3 className="font-body font-medium text-sm text-foreground leading-tight">{name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{unit}</p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-heading font-bold text-foreground">₹{price}</span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through ml-1.5">₹{originalPrice}</span>
          )}
        </div>
        <Button size="icon" className="h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
