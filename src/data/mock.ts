/**
 * Mock data shaped after the INVENTROX Supabase schema so the UI can be
 * swapped onto the real RPC/Supabase layer without component changes.
 */

export const TENANT_ID = "9f2a1c40-0000-4000-8000-000000000001";

export type Category =
  | "Coffee"
  | "Syrups"
  | "Milks"
  | "Packaging"
  | "Accessories"
  | "Apparel";

export interface Product {
  id: string;
  user_id: string;
  sku: string;
  name: string;
  category: Category;
  cost: number;
  price: number;
  stock: number;
  reorder_point: number;
  gst_rate: number;
  hsn: string;
  unit: string;
  supplier: string;
}

export interface SaleItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  gst_rate: number;
}

export interface Sale {
  id: string;
  user_id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  payment_method: "UPI" | "Card" | "Cash";
  items: SaleItem[];
  date: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  segment: "Retail" | "Wholesale" | "Cafe";
  ltv: number;
  orders_count: number;
  avg_order_value: number;
  days_since_last_visit: number;
}

const p = (
  sku: string,
  name: string,
  category: Category,
  cost: number,
  price: number,
  stock: number,
  reorder_point: number,
  hsn: string,
  unit: string,
  supplier: string,
  gst_rate = 18,
): Product => ({
  id: sku.toLowerCase(),
  user_id: TENANT_ID,
  sku,
  name,
  category,
  cost,
  price,
  stock,
  reorder_point,
  gst_rate,
  hsn,
  unit,
  supplier,
});

export const products: Product[] = [
  p("CF-ETH-250", "Ethiopia Yirgacheffe 250g", "Coffee", 620, 1150, 18, 24, "0901", "pack", "Highland Traders", 5),
  p("CF-COL-1KG", "Colombia Supremo 1kg", "Coffee", 1780, 2950, 42, 20, "0901", "bag", "Highland Traders", 5),
  p("CF-BLD-500", "House Blend 500g", "Coffee", 780, 1390, 6, 15, "0901", "pack", "Roast Collective", 5),
  p("SY-VAN-750", "Vanilla Syrup 750ml", "Syrups", 340, 690, 64, 20, "2106", "bottle", "SweetLine Foods"),
  p("SY-HAZ-750", "Hazelnut Syrup 750ml", "Syrups", 355, 710, 11, 18, "2106", "bottle", "SweetLine Foods"),
  p("MK-OAT-1L", "Barista Oat Milk 1L", "Milks", 118, 210, 220, 80, "0404", "carton", "Verde Dairy", 12),
  p("PK-CUP-8OZ", "Ripple Cup 8oz (50pc)", "Packaging", 245, 430, 96, 40, "4823", "sleeve", "PackWorks"),
  p("AC-TMP-58", "Tamper 58mm Steel", "Accessories", 1250, 2390, 14, 8, "8210", "unit", "BrewGear India"),
  p("AP-TEE-BLK", "Crew Tee — Black", "Apparel", 380, 899, 37, 15, "6109", "unit", "ThreadLab"),
];

export const lowStock = products.filter((x) => x.stock <= x.reorder_point);

export const sales: Sale[] = [
  {
    id: "s1",
    user_id: TENANT_ID,
    invoice_number: "INV-2041",
    customer_name: "Bluebird Cafe",
    customer_phone: "+91 98200 41122",
    subtotal: 18400,
    discount: 400,
    gst: 900,
    total: 18900,
    payment_method: "UPI",
    items: [
      { sku: "CF-COL-1KG", name: "Colombia Supremo 1kg", qty: 6, price: 2950, gst_rate: 5 },
      { sku: "MK-OAT-1L", name: "Barista Oat Milk 1L", qty: 4, price: 210, gst_rate: 12 },
    ],
    date: "2026-08-14T10:12:00Z",
  },
  {
    id: "s2",
    user_id: TENANT_ID,
    invoice_number: "INV-2040",
    customer_name: "Rhea Nair",
    customer_phone: "+91 99870 12233",
    subtotal: 2290,
    discount: 0,
    gst: 132,
    total: 2422,
    payment_method: "Card",
    items: [{ sku: "AC-TMP-58", name: "Tamper 58mm Steel", qty: 1, price: 2390, gst_rate: 18 }],
    date: "2026-08-14T09:04:00Z",
  },
  {
    id: "s3",
    user_id: TENANT_ID,
    invoice_number: "INV-2039",
    customer_name: "Anchor Roastery",
    customer_phone: "+91 90040 88761",
    subtotal: 41200,
    discount: 1200,
    gst: 2060,
    total: 42060,
    payment_method: "UPI",
    items: [{ sku: "CF-ETH-250", name: "Ethiopia Yirgacheffe 250g", qty: 40, price: 1150, gst_rate: 5 }],
    date: "2026-08-13T16:48:00Z",
  },
  {
    id: "s4",
    user_id: TENANT_ID,
    invoice_number: "INV-2038",
    customer_name: "Kettle & Co.",
    customer_phone: "+91 98330 55210",
    subtotal: 9600,
    discount: 0,
    gst: 900,
    total: 10500,
    payment_method: "Cash",
    items: [{ sku: "PK-CUP-8OZ", name: "Ripple Cup 8oz (50pc)", qty: 20, price: 430, gst_rate: 18 }],
    date: "2026-08-13T12:20:00Z",
  },
];

export const customers: Customer[] = [
  { id: "c1", user_id: TENANT_ID, name: "Bluebird Cafe", phone: "+91 98200 41122", segment: "Wholesale", ltv: 486000, orders_count: 62, avg_order_value: 7838, days_since_last_visit: 1 },
  { id: "c2", user_id: TENANT_ID, name: "Anchor Roastery", phone: "+91 90040 88761", segment: "Wholesale", ltv: 312400, orders_count: 28, avg_order_value: 11157, days_since_last_visit: 2 },
  { id: "c3", user_id: TENANT_ID, name: "Kettle & Co.", phone: "+91 98330 55210", segment: "Cafe", ltv: 148900, orders_count: 41, avg_order_value: 3631, days_since_last_visit: 2 },
  { id: "c4", user_id: TENANT_ID, name: "Rhea Nair", phone: "+91 99870 12233", segment: "Retail", ltv: 24800, orders_count: 12, avg_order_value: 2066, days_since_last_visit: 9 },
];

export const revenueSeries = [
  { label: "Mon", value: 84000 },
  { label: "Tue", value: 96500 },
  { label: "Wed", value: 78200 },
  { label: "Thu", value: 118400 },
  { label: "Fri", value: 142900 },
  { label: "Sat", value: 168300 },
  { label: "Sun", value: 131700 },
];

export const valuationByCategory = [
  { category: "Coffee", value: 42 },
  { category: "Packaging", value: 18 },
  { category: "Milks", value: 14 },
  { category: "Syrups", value: 12 },
  { category: "Accessories", value: 9 },
  { category: "Apparel", value: 5 },
];

export const categoryTint: Record<Category, string> = {
  Coffee: "from-[oklch(0.62_0.13_45)]/40",
  Syrups: "from-[oklch(0.7_0.13_330)]/35",
  Milks: "from-[oklch(0.75_0.09_230)]/35",
  Packaging: "from-[oklch(0.7_0.1_140)]/35",
  Accessories: "from-[oklch(0.72_0.1_90)]/35",
  Apparel: "from-[oklch(0.62_0.12_290)]/35",
};
