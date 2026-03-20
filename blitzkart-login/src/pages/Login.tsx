import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Zap, ShoppingCart, Package, Truck, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

type View = "login" | "signup" | "forgot";
type Role = "user" | "admin";

const Login = () => {
  const [view, setView] = useState<View>("login");
  const [role, setRole] = useState<Role>("user");
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (view !== "forgot" && !password)) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      toast({ variant: "destructive", title: "Please fill in all fields" });
      return;
    }
    if (role === "admin" && view === "login" && !adminCode) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      toast({ variant: "destructive", title: "Admin access code is required" });
      return;
    }

    if (view === "forgot") {
      toast({ title: "Reset link sent! ✉️", description: "Check your email for the password reset link." });
      setView("login");
      return;
    }

    toast({
      title: view === "login"
        ? `Welcome back${role === "admin" ? ", Admin" : ""}! ⚡`
        : "Account created! 🎉",
      description: role === "admin"
        ? "Redirecting to admin dashboard..."
        : "Redirecting to BlitzKart...",
    });

    setTimeout(() => {
      navigate(role === "admin" ? "/admin" : "/");
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-brand-lime/10 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-white">
              Blitz<span className="text-primary">Kart</span>
            </h1>
          </div>

          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            {role === "admin" ? "Manage your store 🛡️" : "Groceries at lightning speed ⚡"}
          </h2>
          <p className="text-white/60 text-lg font-body mb-10">
            {role === "admin"
              ? "Access inventory, dispatch, analytics and full store management from one dashboard."
              : "From fresh produce to daily essentials — everything delivered to your door in minutes."}
          </p>

          <div className="space-y-5">
            {(role === "user"
              ? [
                  { icon: Truck, label: "10-minute delivery", desc: "Fastest in the city" },
                  { icon: Package, label: "10,000+ products", desc: "Everything you need" },
                  { icon: ShoppingCart, label: "Easy ordering", desc: "Simple, fast checkout" },
                ]
              : [
                  { icon: Shield, label: "Full admin access", desc: "Inventory & dispatch control" },
                  { icon: Package, label: "Product management", desc: "Add, edit, remove products" },
                  { icon: Truck, label: "Order tracking", desc: "Real-time dispatch monitoring" },
                ]
            ).map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white font-medium font-body">{item.label}</p>
                  <p className="text-white/40 text-sm font-body">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-heading text-2xl font-bold text-foreground">
                Blitz<span className="text-primary">Kart</span>
              </span>
            </Link>
          </div>

          <Card className={`border border-border shadow-xl ${shaking ? "animate-shake" : ""}`}>
            <CardContent className="p-8">
              {/* Role toggle */}
              <div className="flex rounded-lg bg-muted p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium font-body transition-all ${
                    role === "user"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium font-body transition-all ${
                    role === "admin"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Administrator
                </button>
              </div>

              <h2 className="mb-1 font-heading text-2xl font-bold text-foreground">
                {view === "login" && (role === "admin" ? "Admin Login" : "Welcome Back")}
                {view === "signup" && "Create Account"}
                {view === "forgot" && "Reset Password"}
              </h2>
              <p className="mb-6 text-sm text-muted-foreground font-body">
                {view === "login" && (role === "admin" ? "Sign in to the admin dashboard" : "Sign in to your BlitzKart account")}
                {view === "signup" && "Get started with BlitzKart today"}
                {view === "forgot" && "Enter your email to receive a reset link"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {view === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground font-body">Full Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground font-body">
                    {role === "admin" ? "Admin Email" : "Email"}
                  </Label>
                  <Input id="email" type="email" placeholder={role === "admin" ? "admin@blitzkart.com" : "you@example.com"} value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
                </div>

                {view !== "forgot" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground font-body">Password</Label>
                      {view === "login" && (
                        <button type="button" onClick={() => { setView("forgot"); setPassword(""); }} className="text-xs font-medium text-primary hover:underline font-body">
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {role === "admin" && view === "login" && (
                  <div className="space-y-2">
                    <Label htmlFor="adminCode" className="text-sm font-medium text-foreground font-body">Admin Access Code</Label>
                    <Input id="adminCode" type="password" placeholder="Enter admin code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} className="h-11" />
                  </div>
                )}

                <Button type="submit" className="h-11 w-full font-heading font-bold text-base">
                  {view === "login" && (role === "admin" ? "Access Dashboard" : "Sign In")}
                  {view === "signup" && "Create Account"}
                  {view === "forgot" && "Send Reset Link"}
                </Button>
              </form>

              {view !== "forgot" && role === "user" && (
                <>
                  <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground font-body">OR</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <Button type="button" variant="outline" className="h-11 w-full gap-3 font-body font-medium" onClick={() => toast({ title: "Google Sign-In", description: "This is a UI demo." })}>
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>
                </>
              )}

              <div className="mt-6 text-center text-sm text-muted-foreground font-body">
                {view === "login" && role === "user" && (
                  <>Don't have an account?{" "}<button onClick={() => setView("signup")} className="font-medium text-primary hover:underline">Create Account</button></>
                )}
                {view === "signup" && (
                  <>Already have an account?{" "}<button onClick={() => setView("login")} className="font-medium text-primary hover:underline">Sign In</button></>
                )}
                {view === "forgot" && (
                  <button onClick={() => setView("login")} className="font-medium text-primary hover:underline">Back to Sign In</button>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground font-body">
            By continuing, you agree to BlitzKart's{" "}
            <span className="underline cursor-pointer hover:text-foreground">Terms of Service</span> and{" "}
            <span className="underline cursor-pointer hover:text-foreground">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
