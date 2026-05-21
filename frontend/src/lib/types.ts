export type ProductCategory =
  | "All"
  | "Drinks"
  | "Snacks"
  | "Protein"
  | "Hot Food"
  | "Grab & Go"
  | "Merch";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  priceCents: number;
  image: string;
  isHotFood?: boolean;
  isSelfServeEnabled: boolean;
  inventoryCount: number;
};

export type CartItem = Product & {
  quantity: number;
  isComped?: boolean;
};