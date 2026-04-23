import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const authSchema = z.object({
  email: z.string().trim().email({ message: "بريد إلكتروني غير صحيح" }).max(255),
  password: z.string().min(6, { message: "كلمة السر 6 أحرف على الأقل" }).max(72),
  fullName: z.string().trim().min(2).max(100).optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!authLoading && user) navigate("/admin");
  }, [user, authLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      authSchema.pick({ email: true, password: true }).parse({ email, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "بيانات الدخول غير صحيحة" : error.message);
    } else {
      toast.success("تم تسجيل الدخول");
      navigate("/admin");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      authSchema.parse({ email, password, fullName });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("already") ? "البريد مسجل مسبقاً" : error.message);
    } else {
      toast.success("تم إنشاء الحساب! سجّل دخول الآن");
    }
  };

  return (
    <>
      <Helmet>
        <title>تسجيل الدخول | SAWA Admin</title>
        <meta name="description" content="سجّل دخولك للوصول إلى لوحة الأدمن في SAWA" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="text-4xl font-display font-bold text-gradient-gold">SAWA</Link>
            <p className="text-muted-foreground mt-2">لوحة تحكم الأدمن</p>
          </div>

          <Card className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">تسجيل دخول</TabsTrigger>
                <TabsTrigger value="signup">حساب جديد</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">البريد الإلكتروني</Label>
                    <Input id="signin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">كلمة السر</Label>
                    <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "دخول"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">الاسم الكامل</Label>
                    <Input id="signup-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                    <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">كلمة السر</Label>
                    <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "إنشاء حساب"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-4">
            ملاحظة: لإنشاء أول مدير، سجّل حساب ثم اطلب من المطور تعيينك كأدمن
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Auth;
