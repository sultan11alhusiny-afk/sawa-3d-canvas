import { ReactNode } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "المنتجات", icon: Package },
  { to: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { to: "/admin/users", label: "المستخدمون", icon: Users },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-display font-bold mb-4">غير مصرح</h1>
          <p className="text-muted-foreground mb-6">
            هذه الصفحة للأدمن فقط. حسابك ليس لديه صلاحية الوصول.
          </p>
          <Button variant="outline" onClick={() => navigate("/")}>العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success("تم تسجيل الخروج");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-l border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-display font-bold text-gradient-gold">SAWA</h1>
          <p className="text-xs text-muted-foreground mt-1">لوحة الأدمن</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 truncate">{user.email}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            خروج
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
