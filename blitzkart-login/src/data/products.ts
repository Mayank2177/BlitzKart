import organicBananas from "@/assets/products/organic-bananas.png";
import farmEggs from "@/assets/products/farm-eggs.png";
import wheatBread from "@/assets/products/wheat-bread.png";
import tonedMilk from "@/assets/products/toned-milk.png";
import redApples from "@/assets/products/red-apples.png";
import tomatoes from "@/assets/products/tomatoes.png";
import basmatiRice from "@/assets/products/basmati-rice.png";
import onions from "@/assets/products/onions.png";
import atta from "@/assets/products/atta.png";
import oliveOil from "@/assets/products/olive-oil.png";
import greenChillies from "@/assets/products/green-chillies.png";
import potatoes from "@/assets/products/potatoes.png";
import chips from "@/assets/products/chips.png";
import greekYogurt from "@/assets/products/greek-yogurt.png";
import cola from "@/assets/products/cola.png";
import energyDrink from "@/assets/products/energy-drink.png";
import noodles from "@/assets/products/noodles.png";
import darkChocolate from "@/assets/products/dark-chocolate.png";
import mixedNuts from "@/assets/products/mixed-nuts.png";
import mangoJuice from "@/assets/products/mango-juice.png";
import biscuits from "@/assets/products/biscuits.png";
import popcorn from "@/assets/products/popcorn.png";
import greenTea from "@/assets/products/green-tea.png";
import mineralWater from "@/assets/products/mineral-water.png";
import detergent from "@/assets/products/detergent.png";
import dishwash from "@/assets/products/dishwash.png";
import toiletCleaner from "@/assets/products/toilet-cleaner.png";
import floorCleaner from "@/assets/products/floor-cleaner.png";
import kitchenTissues from "@/assets/products/kitchen-tissues.png";
import garbageBags from "@/assets/products/garbage-bags.png";
import scrubSponge from "@/assets/products/scrub-sponge.png";
import airFreshener from "@/assets/products/air-freshener.png";
import aluminiumFoil from "@/assets/products/aluminium-foil.png";
import mosquitoRepellent from "@/assets/products/mosquito-repellent.png";
import usbCable from "@/assets/products/usb-cable.png";
import wirelessEarbuds from "@/assets/products/wireless-earbuds.png";
import phoneCharger from "@/assets/products/phone-charger.png";
import deskLamp from "@/assets/products/desk-lamp.png";
import powerBank from "@/assets/products/power-bank.png";
import bluetoothSpeaker from "@/assets/products/bluetooth-speaker.png";
import smartwatchBand from "@/assets/products/smartwatch-band.png";
import screenProtector from "@/assets/products/screen-protector.png";
import mousePad from "@/assets/products/mouse-pad.png";
import hdmiCable from "@/assets/products/hdmi-cable.png";
import faceWash from "@/assets/products/face-wash.png";
import moisturizer from "@/assets/products/moisturizer.png";
import sunscreen from "@/assets/products/sunscreen.png";
import shampoo from "@/assets/products/shampoo.png";
import lipstick from "@/assets/products/lipstick.png";
import deodorant from "@/assets/products/deodorant.png";
import hairOil from "@/assets/products/hair-oil.png";
import nailPolish from "@/assets/products/nail-polish.png";
import faceMask from "@/assets/products/face-mask.png";
import bodyLotion from "@/assets/products/body-lotion.png";

import pujaThali from "@/assets/products/puja-thali.png";
import agarbatti from "@/assets/products/agarbatti.png";
import ghee from "@/assets/products/ghee.png";
import camphor from "@/assets/products/camphor.png";
import coconut from "@/assets/products/coconut.png";
import ladoo from "@/assets/products/ladoo.png";
import kumkum from "@/assets/products/kumkum.png";
import diyaSet from "@/assets/products/diya-set.png";
import flowerGarland from "@/assets/products/flower-garland.png";
import haldi from "@/assets/products/haldi.png";

export interface ProductData {
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  discount?: number;
  category: string;
}

export const allProducts: ProductData[] = [
  // Grocery & Kitchen
  { name: "Organic Bananas", price: 45, originalPrice: 60, unit: "1 dozen", image: organicBananas, discount: 25, category: "Grocery & Kitchen" },
  { name: "Farm Fresh Eggs", price: 89, unit: "12 pcs", image: farmEggs, category: "Grocery & Kitchen" },
  { name: "Whole Wheat Bread", price: 42, originalPrice: 55, unit: "400g", image: wheatBread, discount: 24, category: "Grocery & Kitchen" },
  { name: "Amul Toned Milk", price: 30, unit: "500ml", image: tonedMilk, category: "Grocery & Kitchen" },
  { name: "Red Apples", price: 120, originalPrice: 160, unit: "1 kg", image: redApples, discount: 25, category: "Grocery & Kitchen" },
  { name: "Fresh Tomatoes", price: 35, unit: "500g", image: tomatoes, category: "Grocery & Kitchen" },
  { name: "Basmati Rice 5kg", price: 399, originalPrice: 475, unit: "5 kg", image: basmatiRice, discount: 16, category: "Grocery & Kitchen" },
  { name: "Onions", price: 42, unit: "1 kg", image: onions, category: "Grocery & Kitchen" },
  { name: "Aashirvaad Atta", price: 289, unit: "5 kg", image: atta, category: "Grocery & Kitchen" },
  { name: "Olive Oil", price: 550, originalPrice: 650, unit: "1 L", image: oliveOil, discount: 15, category: "Grocery & Kitchen" },
  { name: "Green Chillies", price: 18, unit: "200g", image: greenChillies, category: "Grocery & Kitchen" },
  { name: "Potatoes", price: 30, unit: "1 kg", image: potatoes, category: "Grocery & Kitchen" },

  // Snacks & Drinks
  { name: "Lays Classic Chips", price: 20, unit: "52g", image: chips, category: "Snacks & Drinks" },
  { name: "Greek Yogurt", price: 75, originalPrice: 99, unit: "200g", image: greekYogurt, discount: 24, category: "Snacks & Drinks" },
  { name: "Coca Cola 750ml", price: 40, unit: "750ml", image: cola, category: "Snacks & Drinks" },
  { name: "Red Bull Energy", price: 125, unit: "250ml", image: energyDrink, category: "Snacks & Drinks" },
  { name: "Maggi Noodles", price: 14, unit: "70g", image: noodles, category: "Snacks & Drinks" },
  { name: "Dark Chocolate", price: 99, originalPrice: 130, unit: "100g", image: darkChocolate, discount: 24, category: "Snacks & Drinks" },
  { name: "Mixed Nuts", price: 299, originalPrice: 399, unit: "250g", image: mixedNuts, discount: 25, category: "Snacks & Drinks" },
  { name: "Mango Juice", price: 45, unit: "1 L", image: mangoJuice, category: "Snacks & Drinks" },
  { name: "Biscuit Pack", price: 30, unit: "200g", image: biscuits, category: "Snacks & Drinks" },
  { name: "Popcorn", price: 60, unit: "150g", image: popcorn, category: "Snacks & Drinks" },
  { name: "Green Tea Bags", price: 180, originalPrice: 220, unit: "25 bags", image: greenTea, discount: 18, category: "Snacks & Drinks" },
  { name: "Mineral Water", price: 20, unit: "1 L", image: mineralWater, category: "Snacks & Drinks" },

  // Household Items
  { name: "Surf Excel Detergent", price: 235, originalPrice: 280, unit: "1 kg", image: detergent, discount: 16, category: "Household Items" },
  { name: "Vim Dishwash Gel", price: 99, unit: "500ml", image: dishwash, category: "Household Items" },
  { name: "Harpic Toilet Cleaner", price: 85, unit: "500ml", image: toiletCleaner, category: "Household Items" },
  { name: "Floor Cleaner", price: 145, originalPrice: 175, unit: "1 L", image: floorCleaner, discount: 17, category: "Household Items" },
  { name: "Kitchen Tissues", price: 120, unit: "2 rolls", image: kitchenTissues, category: "Household Items" },
  { name: "Garbage Bags", price: 65, unit: "30 pcs", image: garbageBags, category: "Household Items" },
  { name: "Scrub Sponge Pack", price: 45, unit: "3 pcs", image: scrubSponge, category: "Household Items" },
  { name: "Air Freshener", price: 199, originalPrice: 249, unit: "250ml", image: airFreshener, discount: 20, category: "Household Items" },
  { name: "Aluminium Foil", price: 95, unit: "9m roll", image: aluminiumFoil, category: "Household Items" },
  { name: "Mosquito Repellent", price: 72, unit: "45ml", image: mosquitoRepellent, category: "Household Items" },

  // Electronics
  { name: "USB-C Cable", price: 299, originalPrice: 499, unit: "1.5m", image: usbCable, discount: 40, category: "Electronics" },
  { name: "Wireless Earbuds", price: 1299, originalPrice: 1999, unit: "1 pc", image: wirelessEarbuds, discount: 35, category: "Electronics" },
  { name: "Phone Charger 20W", price: 599, unit: "1 pc", image: phoneCharger, category: "Electronics" },
  { name: "LED Desk Lamp", price: 849, originalPrice: 1099, unit: "1 pc", image: deskLamp, discount: 23, category: "Electronics" },
  { name: "Power Bank 10000mAh", price: 999, originalPrice: 1499, unit: "1 pc", image: powerBank, discount: 33, category: "Electronics" },
  { name: "Bluetooth Speaker", price: 1599, unit: "1 pc", image: bluetoothSpeaker, category: "Electronics" },
  { name: "Smartwatch Band", price: 399, unit: "1 pc", image: smartwatchBand, category: "Electronics" },
  { name: "Screen Protector", price: 149, unit: "2 pcs", image: screenProtector, category: "Electronics" },
  { name: "Mouse Pad", price: 199, originalPrice: 299, unit: "1 pc", image: mousePad, discount: 33, category: "Electronics" },
  { name: "HDMI Cable", price: 349, unit: "1.8m", image: hdmiCable, category: "Electronics" },

  // Beauty Products
  { name: "Face Wash", price: 175, originalPrice: 220, unit: "100ml", image: faceWash, discount: 20, category: "Beauty Products" },
  { name: "Moisturizer Cream", price: 299, unit: "100g", image: moisturizer, category: "Beauty Products" },
  { name: "Sunscreen SPF 50", price: 450, originalPrice: 550, unit: "50ml", image: sunscreen, discount: 18, category: "Beauty Products" },
  { name: "Hair Shampoo", price: 225, unit: "340ml", image: shampoo, category: "Beauty Products" },
  { name: "Lipstick", price: 399, originalPrice: 499, unit: "1 pc", image: lipstick, discount: 20, category: "Beauty Products" },
  { name: "Perfume Deodorant", price: 189, unit: "150ml", image: deodorant, category: "Beauty Products" },
  { name: "Hair Oil", price: 120, unit: "200ml", image: hairOil, category: "Beauty Products" },
  { name: "Nail Polish Set", price: 249, originalPrice: 350, unit: "5 pcs", image: nailPolish, discount: 29, category: "Beauty Products" },
  { name: "Face Mask Pack", price: 199, unit: "5 sheets", image: faceMask, category: "Beauty Products" },
  { name: "Body Lotion", price: 275, originalPrice: 350, unit: "200ml", image: bodyLotion, discount: 21, category: "Beauty Products" },

  // Navratri Special
  { name: "Puja Thali Set", price: 249, originalPrice: 399, unit: "1 set", image: pujaThali, discount: 38, category: "Navratri Special" },
  { name: "Agarbatti Pack", price: 49, originalPrice: 79, unit: "100 sticks", image: agarbatti, discount: 38, category: "Navratri Special" },
  { name: "Pure Desi Ghee", price: 299, originalPrice: 450, unit: "500ml", image: ghee, discount: 34, category: "Navratri Special" },
  { name: "Camphor Tablets", price: 35, originalPrice: 55, unit: "50g", image: camphor, discount: 36, category: "Navratri Special" },
  { name: "Puja Coconut", price: 30, originalPrice: 45, unit: "1 pc", image: coconut, discount: 33, category: "Navratri Special" },
  { name: "Besan Ladoo Box", price: 199, originalPrice: 320, unit: "500g", image: ladoo, discount: 38, category: "Navratri Special" },
  { name: "Kumkum & Roli Set", price: 25, originalPrice: 40, unit: "1 set", image: kumkum, discount: 38, category: "Navratri Special" },
  { name: "Brass Diya Set", price: 149, originalPrice: 249, unit: "4 pcs", image: diyaSet, discount: 40, category: "Navratri Special" },
  { name: "Marigold Garland", price: 45, originalPrice: 70, unit: "1 string", image: flowerGarland, discount: 36, category: "Navratri Special" },
  { name: "Haldi Powder", price: 39, originalPrice: 60, unit: "100g", image: haldi, discount: 35, category: "Navratri Special" },
];

export const categories = ["Grocery & Kitchen", "Snacks & Drinks", "Household Items", "Electronics", "Beauty Products", "Navratri Special"];
