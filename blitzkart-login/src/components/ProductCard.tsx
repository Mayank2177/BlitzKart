import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  discount?: number;
}

const ProductCard = ({ name, price, originalPrice, unit, image, discount }: ProductCardProps) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.name === name);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow relative group">
      {discount && (
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-md z-10">
          {discount}% OFF
        </span>
      )}

      <div className="flex items-center justify-center h-28 overflow-hidden rounded-lg">
        <img src={image} alt={name} className="h-full w-full object-contain" />
      </div>

      <div className="flex-1">
        <h3 className="font-heading text-sm font-semibold text-foreground leading-tight">{name}</h3>
        <p className="text-xs text-muted-foreground font-body mt-0.5">{unit}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-foreground">₹{price}</span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">₹{originalPrice}</span>
          )}
        </div>
        {quantity === 0 ? (
          <Button
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => addItem({ name, price, originalPrice, unit, image })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-md"
              onClick={() => updateQuantity(name, quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm font-heading font-bold text-foreground">{quantity}</span>
            <Button
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => updateQuantity(name, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
