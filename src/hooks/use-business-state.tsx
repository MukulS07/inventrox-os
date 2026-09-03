import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { fireWebhookServer } from "@/lib/webhook-service";
import { sendInvoiceEmailDirectServer } from "@/lib/email-service";
import { loadServerDb, saveServerDb } from "@/lib/db-service";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  gstRate: number;
  hsn: string;
  unit: string;
  imageUrl: string;
  description: string;
  supplier: string;
  onRateList?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  segment: "VIP" | "Regular" | "New" | "Inactive";
  address: string;
  gstin: string;
  joinedDate: string;
  ltv: number;
  ordersCount: number;
  avgOrderValue: number;
  daysSinceLastVisit: number;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
  lineTotal: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  paymentMethod: "Cash" | "UPI" | "Card";
  date: string;
  otpVerified: boolean;
}

export interface ServiceReminder {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  serviceDate: string;
  nextDueDate: string;
  notes: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  activeOrders: number;
  totalValue: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  time: string;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  author: string;
  content: string;
  date: string;
}

// Database mapper helpers to translate between camelCase (App) and snake_case (Supabase Postgres)
const mapDbProductToApp = (db: any): Product => ({
  id: db.id,
  sku: db.sku,
  name: db.name,
  category: db.category,
  cost: Number(db.cost),
  price: Number(db.price),
  stock: Number(db.stock),
  gstRate: Number(db.gst_rate ?? db.gstRate ?? 18),
  hsn: db.hsn || "",
  unit: db.unit || "pcs",
  imageUrl: db.image_url || db.imageUrl || "",
  description: db.description || "",
  supplier: db.supplier || "",
  onRateList: db.on_rate_list ?? db.onRateList ?? false,
});

const mapAppProductToDb = (app: Partial<Product>) => {
  const db: any = {};
  if (app.sku !== undefined) db.sku = app.sku;
  if (app.name !== undefined) db.name = app.name;
  if (app.category !== undefined) db.category = app.category;
  if (app.cost !== undefined) db.cost = app.cost;
  if (app.price !== undefined) db.price = app.price;
  if (app.stock !== undefined) db.stock = app.stock;
  if (app.gstRate !== undefined) db.gst_rate = app.gstRate;
  if (app.hsn !== undefined) db.hsn = app.hsn;
  if (app.unit !== undefined) db.unit = app.unit;
  if (app.imageUrl !== undefined) db.image_url = app.imageUrl;
  if (app.description !== undefined) db.description = app.description;
  if (app.supplier !== undefined) db.supplier = app.supplier;
  return db;
};

const mapDbCustomerToApp = (db: any): Customer => ({
  id: db.id,
  name: db.name,
  phone: db.phone,
  email: db.email || "",
  segment: (db.segment as any) || "New",
  address: db.address || "",
  gstin: db.gstin || "",
  joinedDate: db.joined_date || db.joinedDate || new Date().toISOString().split("T")[0],
  ltv: Number(db.ltv ?? 0),
  ordersCount: Number(db.orders_count ?? db.ordersCount ?? 0),
  avgOrderValue: Number(db.avg_order_value ?? db.avgOrderValue ?? 0),
  daysSinceLastVisit: Number(db.days_since_last_visit ?? db.daysSinceLastVisit ?? 0),
});

const mapAppCustomerToDb = (app: Partial<Customer>) => {
  const db: any = {};
  if (app.name !== undefined) db.name = app.name;
  if (app.phone !== undefined) db.phone = app.phone;
  if (app.email !== undefined) db.email = app.email;
  if (app.segment !== undefined) db.segment = app.segment;
  if (app.address !== undefined) db.address = app.address;
  if (app.gstin !== undefined) db.gstin = app.gstin;
  if (app.joinedDate !== undefined) db.joined_date = app.joinedDate;
  if (app.ltv !== undefined) db.ltv = app.ltv;
  if (app.ordersCount !== undefined) db.orders_count = app.ordersCount;
  if (app.avgOrderValue !== undefined) db.avg_order_value = app.avgOrderValue;
  if (app.daysSinceLastVisit !== undefined) db.days_since_last_visit = app.daysSinceLastVisit;
  return db;
};

const mapDbSaleToApp = (db: any): Sale => {
  let items: SaleItem[] = [];
  try {
    if (db.items) {
      items = typeof db.items === "string" ? JSON.parse(db.items) : db.items;
    }
  } catch (e) {
    console.error("Error parsing sale items", e);
  }
  return {
    id: db.id,
    invoiceNumber: db.invoice_number || db.invoiceNumber || "",
    customerId: db.customer_id || db.customerId || "walkin",
    customerName: db.customer_name || db.customerName || "Walk-in Customer",
    customerPhone: db.customer_phone || db.customerPhone || "",
    items,
    subtotal: Number(db.subtotal || 0),
    discount: Number(db.discount || 0),
    gst: Number(db.gst || 0),
    total: Number(db.total || 0),
    paymentMethod: (db.payment_method as any) || "Cash",
    date: db.date || new Date().toISOString(),
    otpVerified: db.otp_verified !== undefined ? !!db.otp_verified : true,
  };
};

const mapAppSaleToDb = (app: Sale) => {
  return {
    invoice_number: app.invoiceNumber,
    customer_id: app.customerId,
    customer_name: app.customerName,
    customer_phone: app.customerPhone,
    subtotal: app.subtotal,
    discount: app.discount,
    gst: app.gst,
    total: app.total,
    payment_method: app.paymentMethod,
    date: app.date,
    items: app.items,
  };
};

const mapDbSupplierToApp = (db: any): Supplier => ({
  id: db.id,
  name: db.name,
  phone: db.phone,
  email: db.email || "",
  address: db.address || "",
  gstin: db.gstin || "",
  activeOrders: Number(db.active_orders ?? db.activeOrders ?? 0),
  totalValue: Number(db.total_value ?? db.totalValue ?? 0),
});

const mapAppSupplierToDb = (app: Partial<Supplier>) => {
  const db: any = {};
  if (app.name !== undefined) db.name = app.name;
  if (app.phone !== undefined) db.phone = app.phone;
  if (app.email !== undefined) db.email = app.email;
  if (app.address !== undefined) db.address = app.address;
  if (app.gstin !== undefined) db.gstin = app.gstin;
  if (app.activeOrders !== undefined) db.active_orders = app.activeOrders;
  if (app.totalValue !== undefined) db.total_value = app.totalValue;
  return db;
};

const mapDbCustomerNoteToApp = (db: any): CustomerNote => ({
  id: db.id,
  customerId: db.customer_id || db.customerId || "",
  author: db.author || "Operator",
  content: db.content || "",
  date: db.date || new Date().toISOString(),
});

const mapAppCustomerNoteToDb = (app: Partial<CustomerNote>) => {
  const db: any = {};
  if (app.customerId !== undefined) db.customer_id = app.customerId;
  if (app.author !== undefined) db.author = app.author;
  if (app.content !== undefined) db.content = app.content;
  if (app.date !== undefined) db.date = app.date;
  return db;
};

interface BusinessStateContextProps {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  services: ServiceReminder[];
  suppliers: Supplier[];
  notifications: Notification[];
  customerNotes: CustomerNote[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, fields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (id: string, quantity: number) => void;
  addCustomer: (customer: Omit<Customer, "id" | "joinedDate" | "ltv" | "ordersCount" | "avgOrderValue" | "daysSinceLastVisit">) => Customer;
  checkoutPos: (cartItems: { product: Product; quantity: number }[], customerId: string, paymentMethod: "Cash" | "UPI" | "Card", discountPercent: number) => Sale;
  addServiceReminder: (reminder: Omit<ServiceReminder, "id" | "status">) => void;
  updateServiceStatus: (id: string, status: ServiceReminder["status"]) => void;
  addSupplier: (supplier: Omit<Supplier, "id" | "activeOrders" | "totalValue">) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
  reorderFromSupplier: (supplierId: string, items: { productId: string; quantity: number }[]) => void;
  addCustomerNote: (customerId: string, content: string) => void;
  deleteCustomerNote: (id: string) => void;
  importDatabaseBackup: (backup: {
    products?: Product[];
    customers?: Customer[];
    sales?: Sale[];
    services?: ServiceReminder[];
    suppliers?: Supplier[];
    notifications?: Notification[];
    customerNotes?: CustomerNote[];
  }) => void;
  resetDatabase: () => Promise<void>;
}

const BusinessStateContext = createContext<BusinessStateContextProps | undefined>(undefined);

const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    sku: "COF-EXP-1KG",
    name: "Espresso Roast Beans 1kg",
    category: "Coffee",
    cost: 950,
    price: 1450,
    stock: 24,
    gstRate: 5,
    hsn: "0901",
    unit: "kg",
    imageUrl: "",
    description: "Premium dark roast blend, 100% Arabica, chocolatey and full-bodied.",
    supplier: "Blue Tokai Coffee",
    onRateList: true,
  },
  {
    id: "p2",
    sku: "COF-CBW-1KG",
    name: "Cold Brew Blend 1kg",
    category: "Coffee",
    cost: 1100,
    price: 1600,
    stock: 15,
    gstRate: 5,
    hsn: "0901",
    unit: "kg",
    imageUrl: "",
    description: "Coarse ground blend optimized for 18-hour cold steeping.",
    supplier: "Blue Tokai Coffee",
  },
];

const SEED_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Anita Sharma",
    phone: "9876543210",
    email: "anita.sharma@example.com",
    segment: "New",
    address: "B-204, Beverly Hills Apartments, Sector 56, Gurgaon",
    gstin: "07AAAAA1111A1Z1",
    joinedDate: new Date().toISOString().split("T")[0],
    ltv: 0,
    ordersCount: 0,
    avgOrderValue: 0,
    daysSinceLastVisit: 0,
  },
  {
    id: "c2",
    name: "Rohan Mehta",
    phone: "9812345678",
    email: "rohan.mehta@example.com",
    segment: "New",
    address: "H.No 45, Lane 3, Shanti Nagar, New Delhi",
    gstin: "",
    joinedDate: new Date().toISOString().split("T")[0],
    ltv: 0,
    ordersCount: 0,
    avgOrderValue: 0,
    daysSinceLastVisit: 0,
  },
];

const SEED_SALES: Sale[] = [];

const SEED_SERVICES: ServiceReminder[] = [];

const SEED_SUPPLIERS: Supplier[] = [];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Welcome to INVENTROX",
    body: "Your Business OS is ready. We have created 2 demo products and 2 demo customers to help you get started.",
    type: "success",
    read: false,
    time: "Just now",
  }
];

export const BusinessStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<ServiceReminder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  useEffect(() => {
    const initData = async () => {
      // Load from localStorage or seed first
      const localProducts = localStorage.getItem("inv_products");
      const localCustomers = localStorage.getItem("inv_customers");
      const localSales = localStorage.getItem("inv_sales");
      const localServices = localStorage.getItem("inv_services");
      const localSuppliers = localStorage.getItem("inv_suppliers");
      const localNotifications = localStorage.getItem("inv_notifications");
      const localCustomerNotes = localStorage.getItem("inv_customer_notes");

      let initProducts = localProducts ? JSON.parse(localProducts) : SEED_PRODUCTS;
      let initCustomers = localCustomers ? JSON.parse(localCustomers) : SEED_CUSTOMERS;
      let initSales = localSales ? JSON.parse(localSales) : SEED_SALES;
      let initServices = localServices ? JSON.parse(localServices) : SEED_SERVICES;
      let initSuppliers = localSuppliers ? JSON.parse(localSuppliers) : SEED_SUPPLIERS;
      let initNotifications = localNotifications ? JSON.parse(localNotifications) : SEED_NOTIFICATIONS;
      let initCustomerNotes = localCustomerNotes ? JSON.parse(localCustomerNotes) : [];

      try {
        const serverDbRes = await loadServerDb();
        if (serverDbRes.success && serverDbRes.data) {
          const db = serverDbRes.data;
          if (db.products) initProducts = db.products;
          if (db.customers) initCustomers = db.customers;
          if (db.sales) initSales = db.sales;
          if (db.services) initServices = db.services;
          if (db.suppliers) initSuppliers = db.suppliers;
          if (db.notifications) initNotifications = db.notifications;
          if (db.customerNotes) initCustomerNotes = db.customerNotes;
        }
      } catch (err) {
        console.warn("Failed to load database from server file:", err);
      }

      setProducts(initProducts);
      setCustomers(initCustomers);
      setSales(initSales);
      setServices(initServices);
      setSuppliers(initSuppliers);
      setNotifications(initNotifications);
      setCustomerNotes(initCustomerNotes);

      if (isSupabaseConfigured) {
        try {
          // Sync Products
          const { data: dbProducts, error: prodErr } = await supabase.from("products").select("*");
          if (!prodErr && dbProducts) {
            if (dbProducts.length === 0) {
              const seedData = initProducts.map((p: Product) => {
                const { id, ...rest } = p;
                return mapAppProductToDb(rest);
              });
              const { data: inserted, error: insertErr } = await supabase.from("products").insert(seedData).select();
              if (!insertErr && inserted) {
                const appProds = inserted.map(mapDbProductToApp);
                setProducts(appProds);
                localStorage.setItem("inv_products", JSON.stringify(appProds));
              }
            } else {
              const cachedLocal = localStorage.getItem("inv_products");
              const cachedProds = cachedLocal ? JSON.parse(cachedLocal) : [];
              const appProds = dbProducts.map(db => {
                const app = mapDbProductToApp(db);
                const match = cachedProds.find((cp: any) => cp.id === app.id);
                if (match && match.onRateList !== undefined) {
                  app.onRateList = match.onRateList;
                }
                return app;
              });
              setProducts(appProds);
              localStorage.setItem("inv_products", JSON.stringify(appProds));
            }
          }

          // Sync Customers
          const { data: dbCustomers, error: custErr } = await supabase.from("customers").select("*");
          if (!custErr && dbCustomers) {
            if (dbCustomers.length === 0) {
              const seedData = initCustomers.map((c: Customer) => {
                const { id, ...rest } = c;
                return mapAppCustomerToDb(rest);
              });
              const { data: inserted, error: insertErr } = await supabase.from("customers").insert(seedData).select();
              if (!insertErr && inserted) {
                const appCusts = inserted.map(mapDbCustomerToApp);
                setCustomers(appCusts);
                localStorage.setItem("inv_customers", JSON.stringify(appCusts));
              }
            } else {
              const appCusts = dbCustomers.map(mapDbCustomerToApp);
              setCustomers(appCusts);
              localStorage.setItem("inv_customers", JSON.stringify(appCusts));
            }
          }

          // Sync Suppliers
          const { data: dbSuppliers, error: supErr } = await supabase.from("suppliers").select("*");
          if (!supErr && dbSuppliers) {
            if (dbSuppliers.length === 0) {
              const seedData = initSuppliers.map((s: Supplier) => {
                const { id, ...rest } = s;
                return mapAppSupplierToDb(rest);
              });
              const { data: inserted, error: insertErr } = await supabase.from("suppliers").insert(seedData).select();
              if (!insertErr && inserted) {
                const appSups = inserted.map(mapDbSupplierToApp);
                setSuppliers(appSups);
                localStorage.setItem("inv_suppliers", JSON.stringify(appSups));
              }
            } else {
              const appSups = dbSuppliers.map(mapDbSupplierToApp);
              setSuppliers(appSups);
              localStorage.setItem("inv_suppliers", JSON.stringify(appSups));
            }
          }

          // Sync Sales
          const { data: dbSales, error: salesErr } = await supabase.from("sales").select("*").order("date", { ascending: false });
          if (!salesErr && dbSales) {
            if (dbSales.length > 0) {
              const appSales = dbSales.map(mapDbSaleToApp);
              setSales(appSales);
              localStorage.setItem("inv_sales", JSON.stringify(appSales));
            } else {
              setSales([]);
              localStorage.setItem("inv_sales", JSON.stringify([]));
            }
          }

          // Sync Customer Notes
          try {
            const { data: dbNotes, error: notesErr } = await supabase.from("customer_notes").select("*").order("date", { ascending: false });
            if (!notesErr && dbNotes) {
              const appNotes = dbNotes.map(mapDbCustomerNoteToApp);
              setCustomerNotes(appNotes);
              localStorage.setItem("inv_customer_notes", JSON.stringify(appNotes));
            }
          } catch (notesTableErr) {
            console.warn("Could not sync customer_notes table (it might not be created in Supabase yet):", notesTableErr);
          }
        } catch (err) {
          console.warn("Supabase initialization failed, running with local simulation.", err);
        }
      }
      setIsDbLoaded(true);
    };

    initData();
  }, []);

  useEffect(() => {
    if (!isDbLoaded) return;

    const timer = setTimeout(async () => {
      try {
        await saveServerDb({
          data: {
            products,
            customers,
            sales,
            services,
            suppliers,
            notifications,
            customerNotes,
          }
        });
      } catch (err) {
        console.warn("Failed to persist database state to server file:", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isDbLoaded, products, customers, sales, services, suppliers, notifications, customerNotes]);

  const saveAndSetProducts = (newProds: Product[]) => {
    setProducts(newProds);
    localStorage.setItem("inv_products", JSON.stringify(newProds));
  };

  const saveAndSetCustomers = (newCusts: Customer[]) => {
    setCustomers(newCusts);
    localStorage.setItem("inv_customers", JSON.stringify(newCusts));
  };

  const saveAndSetCustomerNotes = (newNotes: CustomerNote[]) => {
    setCustomerNotes(newNotes);
    localStorage.setItem("inv_customer_notes", JSON.stringify(newNotes));
  };



  const saveAndSetSales = (newSales: Sale[]) => {
    setSales(newSales);
    localStorage.setItem("inv_sales", JSON.stringify(newSales));
  };

  const saveAndSetServices = (newSrvs: ServiceReminder[]) => {
    setServices(newSrvs);
    localStorage.setItem("inv_services", JSON.stringify(newSrvs));
  };

  const saveAndSetSuppliers = (newSups: Supplier[]) => {
    setSuppliers(newSups);
    localStorage.setItem("inv_suppliers", JSON.stringify(newSups));
  };

  const saveAndSetNotifications = (newNotifs: Notification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem("inv_notifications", JSON.stringify(newNotifs));
  };

  const fireN8nWebhook = async (payload: any) => {
    if (typeof window === "undefined") return;
    let key = "inv_n8n_webhook";
    if (payload.event === "invoice.created") {
      key = "inv_n8n_webhook_invoice";
    } else if (payload.event && payload.event.startsWith("inventory.")) {
      key = "inv_n8n_webhook_stock";
    }
    
    let webhookUrl = localStorage.getItem(key);
    if (!webhookUrl && key !== "inv_n8n_webhook") {
      webhookUrl = localStorage.getItem("inv_n8n_webhook"); // fallback to old generic setting
    }
    if (!webhookUrl) return;
    try {
      await fireWebhookServer({
        data: {
          url: webhookUrl,
          payload,
        }
      });
    } catch (e) {
      console.warn("n8n Webhook dispatch error:", e);
    }
  };

  const addProduct = async (p: Omit<Product, "id">) => {
    const tempId = `p_${Date.now()}`;
    const newProduct: Product = {
      ...p,
      id: tempId,
    };
    const list = [...products, newProduct];
    saveAndSetProducts(list);
    addNotification(`Product Created`, `${p.name} has been added to catalog under SKU ${p.sku}.`, "success");

    if (isSupabaseConfigured) {
      try {
        const dbPayload = mapAppProductToDb(p);
        const { data, error } = await supabase.from("products").insert(dbPayload).select();
        if (!error && data && data[0]) {
          const syncedProd = mapDbProductToApp(data[0]);
          setProducts((current) => current.map((item) => (item.id === tempId ? syncedProd : item)));
        }
      } catch (err) {
        console.error("Supabase insert error in addProduct:", err);
      }
    }
  };

  const updateProduct = async (id: string, fields: Partial<Product>) => {
    const list = products.map((p) => {
      if (p.id === id) {
        const updated = { ...p, ...fields };
        if (updated.stock <= 5 && p.stock > 5) {
          addNotification("Low Stock Alert", `${updated.name} has dropped to ${updated.stock}.`, "warning");
          fireN8nWebhook({
            event: "inventory.low_stock",
            product: updated,
            timestamp: new Date().toISOString()
          });
        } else if (updated.stock === 0 && p.stock > 0) {
          addNotification("Out of Stock Warning", `${updated.name} is now out of stock.`, "error");
          fireN8nWebhook({
            event: "inventory.out_of_stock",
            product: updated,
            timestamp: new Date().toISOString()
          });
        }
        return updated;
      }
      return p;
    });
    saveAndSetProducts(list);

    if (isSupabaseConfigured) {
      try {
        const dbPayload = mapAppProductToDb(fields);
        await supabase.from("products").update(dbPayload).eq("id", id);
      } catch (err) {
        console.error("Supabase update error in updateProduct:", err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    const list = products.filter((p) => p.id !== id);
    saveAndSetProducts(list);

    if (prod) {
      addNotification("Product Deleted", `${prod.name} has been removed from catalog.`, "info");
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase delete error in deleteProduct:", err);
      }
    }
  };

  const restockProduct = async (id: string, qty: number) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    const newStock = prod.stock + qty;
    const list = products.map((p) => (p.id === id ? { ...p, stock: newStock } : p));
    saveAndSetProducts(list);
    addNotification("Stock Updated", `Added +${qty} units of ${prod.name}.`, "success");

    if (isSupabaseConfigured) {
      try {
        await supabase.from("products").update({ stock: newStock }).eq("id", id);
      } catch (err) {
        console.error("Supabase update error in restockProduct:", err);
      }
    }
  };

  const addCustomer = (c: Omit<Customer, "id" | "joinedDate" | "ltv" | "ordersCount" | "avgOrderValue" | "daysSinceLastVisit">) => {
    const tempId = `c_${Date.now()}`;
    const newCust: Customer = {
      ...c,
      id: tempId,
      joinedDate: new Date().toISOString().split("T")[0],
      ltv: 0,
      ordersCount: 0,
      avgOrderValue: 0,
      daysSinceLastVisit: 0,
    };
    saveAndSetCustomers([...customers, newCust]);
    addNotification("New Customer Registered", `${c.name} has been added to CRM.`, "success");

    if (isSupabaseConfigured) {
      const syncDbCustomer = async () => {
        try {
          const dbPayload = mapAppCustomerToDb(newCust);
          const { data, error } = await supabase.from("customers").insert(dbPayload).select();
          if (!error && data && data[0]) {
            const syncedCust = mapDbCustomerToApp(data[0]);
            setCustomers((current) => current.map((item) => (item.id === tempId ? syncedCust : item)));
          }
        } catch (err) {
          console.error("Supabase insert error in addCustomer:", err);
        }
      };
      syncDbCustomer();
    }
    return newCust;
  };

  const checkoutPos = (
    cartItems: { product: Product; quantity: number }[],
    customerId: string,
    paymentMethod: "Cash" | "UPI" | "Card",
    discountPercent: number
  ) => {
    let subtotal = 0;
    let totalGst = 0;
    const items: SaleItem[] = cartItems.map((item, idx) => {
      const lineSubtotal = item.product.price * item.quantity;
      subtotal += lineSubtotal;
      const lineGst = lineSubtotal * (item.product.gstRate / 100);
      totalGst += lineGst;

      return {
        id: `si_${Date.now()}_${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        gstRate: item.product.gstRate,
        lineTotal: lineSubtotal + lineGst,
      };
    });

    const discount = Math.round(subtotal * (discountPercent / 100));
    const finalTotal = Math.round(subtotal - discount + totalGst);

    const invoiceYear = new Date().getFullYear();
    const invoiceIndex = String(sales.length + 1).padStart(4, "0");
    const invoiceNumber = `INV-${invoiceYear}-${invoiceIndex}`;

    const customer = customers.find((c) => c.id === customerId) || {
      id: "walkin",
      name: "Walk-in Customer",
      phone: "N/A",
      email: "",
      ordersCount: 0,
      ltv: 0,
      segment: "New" as const,
    };

    const tempSaleId = `s_${Date.now()}`;
    const newSale: Sale = {
      id: tempSaleId,
      invoiceNumber,
      customerId,
      customerName: customer.name,
      customerPhone: (customer as any).phone || "",
      items,
      subtotal,
      discount,
      gst: Math.round(totalGst),
      total: finalTotal,
      paymentMethod,
      date: new Date().toISOString(),
      otpVerified: true,
    };

    saveAndSetSales([newSale, ...sales]);

    const updatedProducts = products.map((p) => {
      const cartItem = cartItems.find((item) => item.product.id === p.id);
      if (cartItem) {
        const remaining = Math.max(0, p.stock - cartItem.quantity);
        if (remaining <= 5 && p.stock > 5) {
          addNotification("Low Stock Alert", `${p.name} has dropped to ${remaining}.`, "warning");
          fireN8nWebhook({
            event: "inventory.low_stock",
            product: { ...p, stock: remaining },
            timestamp: new Date().toISOString()
          });
        } else if (remaining === 0 && p.stock > 0) {
          addNotification("Out of Stock Warning", `${p.name} is now out of stock.`, "error");
          fireN8nWebhook({
            event: "inventory.out_of_stock",
            product: { ...p, stock: remaining },
            timestamp: new Date().toISOString()
          });
        }
        return { ...p, stock: remaining };
      }
      return p;
    });
    saveAndSetProducts(updatedProducts);

    let updatedCustomerStats: any = null;
    if (customerId && customerId !== "walkin") {
      const updatedCustomers = customers.map((c) => {
        if (c.id === customerId) {
          const newOrders = c.ordersCount + 1;
          const newLtv = c.ltv + finalTotal;
          let segment: Customer["segment"] = c.segment;
          if (newLtv >= 50000 || newOrders >= 10) {
            segment = "VIP";
          } else if (newOrders >= 3) {
            segment = "Regular";
          }
          updatedCustomerStats = {
            ordersCount: newOrders,
            ltv: newLtv,
            avgOrderValue: Math.round(newLtv / newOrders),
            daysSinceLastVisit: 0,
            segment,
          };
          return {
            ...c,
            ...updatedCustomerStats,
          };
        }
        return c;
      });
      saveAndSetCustomers(updatedCustomers);
    }

    addNotification(
      "Sale Completed",
      `Invoice ${invoiceNumber} created. Total amount: ₹${finalTotal.toLocaleString("en-IN")}.`,
      "success"
    );

    // Dispatch direct invoice email via Resend API
    if (typeof window !== "undefined") {
      const resendApiKey = localStorage.getItem("inv_resend_key") || undefined;
      const compEmail = localStorage.getItem("inv_comp_email") || "onboarding@resend.dev";
      const compName = localStorage.getItem("inv_comp_name") || "INVENTROX Specialty Roasters";
      const compGstin = localStorage.getItem("inv_comp_gstin") || "07AAACO8892F1Z9";
      const compAddress = localStorage.getItem("inv_comp_address") || "Plot 45, Udyog Vihar Phase 4, Gurgaon, Haryana, 122016";
      const compPhone = localStorage.getItem("inv_comp_phone") || "+91 98765 43210";
      
      const targetCustomerEmail = (customer as any).email || (newSale as any).customerEmail || "";

      if (targetCustomerEmail) {
        console.log("Triggering direct Resend email dispatch...");
        
        // Parse items for Resend
        const parsedItems = cartItems.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        }));

        sendInvoiceEmailDirectServer({
          data: {
            resendApiKey,
            fromEmail: compEmail,
            toEmail: targetCustomerEmail,
            customerName: customer?.name || newSale.customerName || "Customer",
            invoiceNumber: invoiceNumber,
            total: finalTotal,
            items: parsedItems,
            companyDetails: {
              name: compName,
              gstin: compGstin,
              address: compAddress,
              phone: compPhone
            }
          }
        }).then(result => {
          if (result.success) {
            console.log("Direct Resend email sent successfully:", result.id);
            if (result.sandboxRedirected) {
              addNotification(
                "Email Redirected (Sandbox)",
                `Invoice #${invoiceNumber} redirected to verified email: ${result.verifiedEmail} (Sandbox mode).`,
                "warning"
              );
            } else {
              addNotification("Email Sent", `Invoice #${invoiceNumber} sent via Resend to ${targetCustomerEmail}.`, "success");
            }
          } else {
            console.warn("Direct Resend email dispatch error:", result.error);
            addNotification("Email Failed", `Could not dispatch invoice email: ${result.error}`, "error");
          }
        }).catch(err => {
          console.warn("Direct Resend email transmission exception:", err);
        });
      }
    }

    fireN8nWebhook({
      event: "invoice.created",
      sale: newSale,
      customer: customer,
      timestamp: new Date().toISOString()
    });

    if (isSupabaseConfigured) {
      const syncSale = async () => {
        try {
          const dbSale = mapAppSaleToDb(newSale);
          let { data: insertedSale, error: saleErr } = await supabase.from("sales").insert(dbSale).select();
          
          if (saleErr) {
            const { items: _, ...dbSaleWithoutItems } = dbSale;
            const { data: retryData, error: retryErr } = await supabase.from("sales").insert(dbSaleWithoutItems).select();
            if (!retryErr && retryData && retryData[0]) {
              insertedSale = retryData;
            }
          }

          if (insertedSale && insertedSale[0]) {
            const syncedSale = mapDbSaleToApp(insertedSale[0]);
            syncedSale.items = items;
            setSales((current) => current.map((s) => (s.id === tempSaleId ? syncedSale : s)));
          }

          for (const item of cartItems) {
            const freshProd = updatedProducts.find((p) => p.id === item.product.id);
            if (freshProd && !freshProd.id.startsWith("mock_")) {
              await supabase.from("products").update({ stock: freshProd.stock }).eq("id", freshProd.id);
            }
          }

          if (customerId && customerId !== "walkin" && !customerId.startsWith("c_temp") && updatedCustomerStats) {
            await supabase.from("customers").update(mapAppCustomerToDb(updatedCustomerStats)).eq("id", customerId);
          }
        } catch (err) {
          console.error("Supabase checkout syncing error:", err);
        }
      };
      syncSale();
    }

    return newSale;
  };

  const addServiceReminder = (r: Omit<ServiceReminder, "id" | "status">) => {
    const reminder: ServiceReminder = {
      ...r,
      id: `sr_${Date.now()}`,
      status: "Scheduled",
    };
    saveAndSetServices([reminder, ...services]);
    addNotification("Service Reminder Scheduled", `For ${r.customerName} - ${r.serviceType} on ${r.serviceDate}.`, "info");
    fireN8nWebhook({
      event: "service.scheduled",
      service: reminder,
      timestamp: new Date().toISOString()
    });
  };

  const updateServiceStatus = (id: string, status: ServiceReminder["status"]) => {
    const list = services.map((s) => (s.id === id ? { ...s, status } : s));
    saveAndSetServices(list);
    const service = services.find((s) => s.id === id);
    if (service) {
      addNotification("Service Updated", `Status changed to ${status} for ${service.customerName}.`, "success");
    }
  };

  const addSupplier = async (s: Omit<Supplier, "id" | "activeOrders" | "totalValue">) => {
    const tempId = `sup_${Date.now()}`;
    const newSup: Supplier = {
      ...s,
      id: tempId,
      activeOrders: 0,
      totalValue: 0,
    };
    saveAndSetSuppliers([...suppliers, newSup]);
    addNotification("Supplier Registered", `${s.name} added to operations list.`, "success");

    if (isSupabaseConfigured) {
      try {
        const dbPayload = mapAppSupplierToDb(newSup);
        const { data, error } = await supabase.from("suppliers").insert(dbPayload).select();
        if (!error && data && data[0]) {
          const syncedSup = mapDbSupplierToApp(data[0]);
          setSuppliers((current) => current.map((item) => (item.id === tempId ? syncedSup : item)));
        }
      } catch (err) {
        console.error("Supabase error during addSupplier:", err);
      }
    }
  };

  const clearNotifications = () => {
    const list = notifications.map((n) => ({ ...n, read: true }));
    saveAndSetNotifications(list);
  };

  const markNotificationAsRead = (id: string) => {
    const list = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveAndSetNotifications(list);
  };

  const reorderFromSupplier = async (supplierId: string, items: { productId: string; quantity: number }[]) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier) return;

    const newActiveOrders = supplier.activeOrders + 1;
    const updatedSuppliers = suppliers.map((sup) => {
      if (sup.id === supplierId) {
        return {
          ...sup,
          activeOrders: newActiveOrders,
        };
      }
      return sup;
    });
    saveAndSetSuppliers(updatedSuppliers);

    const updatedProducts = products.map((prod) => {
      const reorderItem = items.find((item) => item.productId === prod.id);
      if (reorderItem) {
        return {
          ...prod,
          stock: prod.stock + reorderItem.quantity,
        };
      }
      return prod;
    });
    saveAndSetProducts(updatedProducts);

    addNotification(
      "Supplier Order Sent",
      `Stock order processed for ${supplier.name}. Restocked items.`,
      "success"
    );

    if (isSupabaseConfigured) {
      try {
        await supabase.from("suppliers").update({ active_orders: newActiveOrders }).eq("id", supplierId);
        for (const item of items) {
          const freshProd = updatedProducts.find((p) => p.id === item.productId);
          if (freshProd) {
            await supabase.from("products").update({ stock: freshProd.stock }).eq("id", freshProd.id);
          }
        }
      } catch (err) {
        console.error("Supabase error during reorderFromSupplier:", err);
      }
    }
  };

  const addNotification = (title: string, body: string, type: Notification["type"]) => {
    const newNotif: Notification = {
      id: `n_${Date.now()}`,
      title,
      body,
      type,
      read: false,
      time: "Just now",
    };
    const currentNotifs = localStorage.getItem("inv_notifications");
    const parsed = currentNotifs ? JSON.parse(currentNotifs) : notifications;
    saveAndSetNotifications([newNotif, ...parsed]);
  };

  const addCustomerNote = async (customerId: string, content: string) => {
    const sessionStr = sessionStorage.getItem("user_session");
    let authorName = "Operator";
    if (sessionStr) {
      try {
        const s = JSON.parse(sessionStr);
        if (s.name) authorName = s.name;
      } catch (e) {}
    }

    const tempId = `note_${Date.now()}`;
    const newNote: CustomerNote = {
      id: tempId,
      customerId,
      author: authorName,
      content,
      date: new Date().toISOString(),
    };

    const list = [newNote, ...customerNotes];
    saveAndSetCustomerNotes(list);
    addNotification("Client Logged", `A new note has been logged in user history.`, "success");

    if (isSupabaseConfigured) {
      try {
        const dbPayload = mapAppCustomerNoteToDb(newNote);
        const { data, error } = await supabase.from("customer_notes").insert(dbPayload).select();
        if (!error && data && data[0]) {
          const syncedNote = mapDbCustomerNoteToApp(data[0]);
          setCustomerNotes((current) => current.map((item) => (item.id === tempId ? syncedNote : item)));
        }
      } catch (err) {
        console.error("Supabase insert error in addCustomerNote:", err);
      }
    }
  };

  const deleteCustomerNote = async (id: string) => {
    const list = customerNotes.filter((n) => n.id !== id);
    saveAndSetCustomerNotes(list);
    addNotification("Note Deleted", "A logged interaction note has been deleted.", "info");

    if (isSupabaseConfigured) {
      try {
        await supabase.from("customer_notes").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase delete error in deleteCustomerNote:", err);
      }
    }
  };

  const importDatabaseBackup = (backup: any) => {
    if (backup.products) saveAndSetProducts(backup.products);
    if (backup.customers) saveAndSetCustomers(backup.customers);
    if (backup.sales) saveAndSetSales(backup.sales);
    if (backup.services) saveAndSetServices(backup.services);
    if (backup.suppliers) saveAndSetSuppliers(backup.suppliers);
    if (backup.customerNotes) saveAndSetCustomerNotes(backup.customerNotes);
    if (backup.notifications) saveAndSetNotifications(backup.notifications);
  };

  const resetDatabase = async () => {
    saveAndSetProducts(SEED_PRODUCTS);
    saveAndSetCustomers(SEED_CUSTOMERS);
    saveAndSetSales(SEED_SALES);
    saveAndSetServices(SEED_SERVICES);
    saveAndSetSuppliers(SEED_SUPPLIERS);
    saveAndSetNotifications(SEED_NOTIFICATIONS);
    saveAndSetCustomerNotes([]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from("products").delete().neq("id", "0");
        await supabase.from("customers").delete().neq("id", "0");
        await supabase.from("sales").delete().neq("id", "0");
        await supabase.from("customer_notes").delete().neq("id", "0");
        await supabase.from("suppliers").delete().neq("id", "0");

        const prodSeed = SEED_PRODUCTS.map(p => {
          const { id, ...rest } = p;
          return mapAppProductToDb(rest);
        });
        const { data: prodInserted } = await supabase.from("products").insert(prodSeed).select();
        if (prodInserted) {
          saveAndSetProducts(prodInserted.map(mapDbProductToApp));
        }

        const custSeed = SEED_CUSTOMERS.map(c => {
          const { id, ...rest } = c;
          return mapAppCustomerToDb(rest);
        });
        const { data: custInserted } = await supabase.from("customers").insert(custSeed).select();
        if (custInserted) {
          saveAndSetCustomers(custInserted.map(mapDbCustomerToApp));
        }
      } catch (err) {
        console.error("Supabase reset error:", err);
      }
    }
  };

  return (
    <BusinessStateContext.Provider
      value={{
        products,
        customers,
        sales,
        services,
        suppliers,
        notifications,
        customerNotes,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        addCustomer,
        checkoutPos,
        addServiceReminder,
        updateServiceStatus,
        addSupplier,
        clearNotifications,
        markNotificationAsRead,
        reorderFromSupplier,
        addCustomerNote,
        deleteCustomerNote,
        importDatabaseBackup,
        resetDatabase,
      }}
    >
      {children}
    </BusinessStateContext.Provider>
  );
};

export const useBusinessState = () => {
  const context = useContext(BusinessStateContext);
  if (context === undefined) {
    throw new Error("useBusinessState must be used within a BusinessStateProvider");
  }
  return context;
};
