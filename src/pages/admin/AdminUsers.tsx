import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Shield, ShieldOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type UserRow = {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  isAdmin: boolean;
};

const AdminUsers = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role").eq("role", "admin"),
    ]);
    if (pErr || rErr) {
      toast.error((pErr ?? rErr)!.message);
      setLoading(false);
      return;
    }
    const adminSet = new Set((roles ?? []).map((r) => r.user_id));
    setUsers((profiles ?? []).map((p) => ({ ...p, isAdmin: adminSet.has(p.user_id) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
    if (currentlyAdmin) {
      if (userId === me?.id && !confirm("ستفقد صلاحيات الأدمن. متأكد؟")) return;
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
      if (error) toast.error(error.message);
      else { toast.success("تمت إزالة الأدمن"); load(); }
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) toast.error(error.message);
      else { toast.success("تم تعيين أدمن"); load(); }
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>المستخدمون | SAWA Admin</title>
      </Helmet>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">المستخدمون</h1>
        <p className="text-muted-foreground">إدارة الحسابات والصلاحيات</p>
      </div>

      <Card>
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">لا يوجد مستخدمون</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(u.created_at).toLocaleDateString("ar-EG")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.isAdmin ? "default" : "secondary"}>
                      {u.isAdmin ? "أدمن" : "مستخدم"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdmin(u.user_id, u.isAdmin)}
                    >
                      {u.isAdmin ? (
                        <><ShieldOff className="w-4 h-4" /> إزالة أدمن</>
                      ) : (
                        <><Shield className="w-4 h-4" /> تعيين أدمن</>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </AdminLayout>
  );
};

export default AdminUsers;
