import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

type Stats = {
  products: number;
  orders: number;
  users: number;
  revenue: number;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [products, orders, profiles, revenueData] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
      ]);
      const revenue = (revenueData.data ?? []).reduce((sum, o) => sum + Number(o.total ?? 0), 0);
      setStats({
        products: products.count ?? 0,
        orders: orders.count ?? 0,
        users: profiles.count ?? 0,
        revenue,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "المنتجات", value: stats.products, icon: Package, color: "text-blue-500" },
    { label: "الطلبات", value: stats.orders, icon: ShoppingCart, color: "text-green-500" },
    { label: "المستخدمون", value: stats.users, icon: Users, color: "text-purple-500" },
    { label: "الإيرادات", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>لوحة التحكم | SAWA Admin</title>
        <meta name="description" content="نظرة عامة على إحصائيات متجر SAWA" />
      </Helmet>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على نشاط المتجر</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <card.icon className={`w-8 h-8 ${card.color}`} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
              <p className="text-3xl font-bold">{loading ? "—" : card.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
