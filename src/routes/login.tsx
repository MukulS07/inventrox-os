import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Boxes, Lock, Mail, Chrome, ArrowRight, ShieldCheck, AlertCircle, User, Building } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — INVENTROX" },
      {
        name: "description",
        content: "Log in to your INVENTROX Business Operating System account.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulated Google Login Popup State
  const [showGoogleSelector, setShowGoogleSelector] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string | null>(null);

  // Reset fields when switching modes
  useEffect(() => {
    setEmail("");
    setPassword("");
    setFullName("");
    setCompanyName("");
  }, [isSignUp]);

  // On mount, check if already logged in (redirect to dashboard)
  useEffect(() => {
    const session = sessionStorage.getItem("user_session");
    if (session) {
      navigate({ to: "/dashboard" });
    }
  }, [navigate]);

  const handlePrefillDemo = () => {
    setEmail("mukul@inventrox.com");
    setPassword("admin123");
    toast.info("Demo credentials loaded.");
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                company_name: companyName,
              }
            }
          });

          if (error) {
            toast.error(`Sign up failed: ${error.message}`);
            setLoading(false);
          } else {
            const session = data?.session;
            if (session) {
              sessionStorage.setItem(
                "user_session",
                JSON.stringify({
                  name: fullName,
                  companyName: companyName,
                  email,
                  role: "Admin",
                  mode: "Supabase"
                })
              );
              toast.success(`Account created! Welcome, ${fullName}!`);
              navigate({ to: "/dashboard" });
            } else {
              toast.success("Registration successful! Check email to verify account.");
              setIsSignUp(false);
              setLoading(false);
            }
          }
        } catch (err: any) {
          toast.error(`System error: ${err.message || String(err)}`);
          setLoading(false);
        }
      } else {
        // High-fidelity local simulation
        setTimeout(() => {
          sessionStorage.setItem(
            "user_session",
            JSON.stringify({
              name: fullName || "Guest Operator",
              companyName: companyName || "INVENTROX",
              email,
              role: "Admin",
              mode: "Local Simulation"
            })
          );
          toast.success(`Account created! Welcome, ${fullName || "Guest"}! (Local Simulation)`);
          navigate({ to: "/dashboard" });
        }, 1200);
      }
    } else {
      if (isSupabaseConfigured) {
        if (email === "mukul@inventrox.com" && password === "admin123") {
          setTimeout(() => {
            sessionStorage.setItem(
              "user_session",
              JSON.stringify({
                name: "Mukul Sharma",
                companyName: "INVENTROX",
                email: "mukul@inventrox.com",
                role: "Admin",
                mode: "Demo Account"
              })
            );
            toast.success("Welcome back, Mukul! (Demo Mode)");
            navigate({ to: "/dashboard" });
          }, 1000);
          return;
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            toast.error(`Login failed: ${error.message}`);
            setLoading(false);
          } else {
            const user = data.user;
            const metaName = user?.user_metadata?.full_name || "Mukul Sharma";
            const metaCompany = user?.user_metadata?.company_name || "INVENTROX";

            sessionStorage.setItem(
              "user_session",
              JSON.stringify({
                name: metaName,
                companyName: metaCompany,
                email,
                role: "Admin",
                mode: "Supabase"
              })
            );
            toast.success(`Welcome back, ${metaName}!`);
            navigate({ to: "/dashboard" });
          }
        } catch (err: any) {
          toast.error(`System error: ${err.message || String(err)}`);
          setLoading(false);
        }
      } else {
        // High-fidelity local simulation
        setTimeout(() => {
          sessionStorage.setItem(
            "user_session",
            JSON.stringify({
              name: "Mukul Sharma",
              companyName: "INVENTROX",
              email: "mukul@inventrox.com",
              role: "Admin",
              mode: "Local Simulation"
            })
          );
          toast.success("Welcome back, Mukul! (Local Offline Mode)");
          navigate({ to: "/dashboard" });
        }, 1000);
      }
    }
  };

  const handleGoogleLoginTrigger = async () => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) toast.error(`Google Auth Error: ${error.message}`);
      } catch (err: any) {
        toast.error(`OAuth error: ${err.message || String(err)}`);
      }
    } else {
      setShowGoogleSelector(true);
    }
  };

  const selectMockGoogleAccount = (accEmail: string, accName: string) => {
    setSelectedGoogleAccount(accEmail);
    setLoading(true);
    setShowGoogleSelector(false);

    setTimeout(() => {
      sessionStorage.setItem(
        "user_session",
        JSON.stringify({
          name: accName,
          companyName: "INVENTROX",
          email: accEmail,
          role: "Admin",
          mode: "Google Mock Auth"
        })
      );
      toast.success(`Signed in as ${accName} successfully via Google!`);
      navigate({ to: "/dashboard" });
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Aurora Ambient Backgrounds */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-1/4 left-1/4 h-[80vh] w-[60vw] aurora opacity-50 blur-3xl" />
        <div className="absolute top-[20%] right-[10%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] animate-orb-a" />
        <div className="absolute bottom-[20%] left-[10%] h-[350px] w-[350px] rounded-full bg-accent/8 blur-[120px] animate-orb-b" />
        <div className="absolute inset-0 starfield opacity-30" />
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md glass rounded-3xl border border-border/60 bg-card/25 p-8 shadow-2xl relative overflow-hidden animate-in fade-in duration-300">
        {/* Logo and Headings */}
        <div className="text-center space-y-2.5 mb-8">
          <img 
            src="/inventrox-icon.png" 
            className="mx-auto size-12 rounded-full bg-white p-0.5 border border-white/10 shadow-md object-contain drop-shadow-[0_0_8px_rgba(oklch(var(--accent)),0.15)]" 
            alt="INVENTROX Logo" 
          />
          <h2 className="text-2xl font-display font-700 tracking-tight text-foreground">
            INVENTROX <span className="italic text-gradient font-500">Business OS</span>
          </h2>
          <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-normal">
            {isSignUp 
              ? "Create a new operator account and register your business brand." 
              : "Enter your credentials or authenticate via Google to access your command dashboard."}
          </p>

          {isSupabaseConfigured ? (
            <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-600">
              <ShieldCheck className="size-3" /> Live Supabase Engine Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-600">
              <AlertCircle className="size-3" /> Running in Local Offline Mode
            </span>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-secondary/20 p-1 mb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`rounded-lg py-1.5 text-xs font-600 transition-all cursor-pointer ${
              !isSignUp
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`rounded-lg py-1.5 text-xs font-600 transition-all cursor-pointer ${
              isSignUp
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {loading && !showGoogleSelector ? (
          <div className="py-16 text-center space-y-4">
            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-muted-foreground font-medium animate-pulse">
              {selectedGoogleAccount 
                ? `Authorizing Google token for ${selectedGoogleAccount}...`
                : "Synchronizing business state databases..."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-150">
                  <div>
                    <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mukul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                      Business Brand Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. INVENTROX"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground transition-all"
                  />
                </div>
              </div>

              {!isSignUp && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handlePrefillDemo}
                    className="text-[10px] text-primary/85 hover:text-primary font-600 hover:underline transition-colors cursor-pointer"
                  >
                    Prefill Demo Operator Credentials
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground py-2.5 text-xs font-700 shadow-glow hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 mt-6 cursor-pointer"
              >
                {isSignUp ? "Create operator account" : "Sign in with credentials"}{" "}
                <ArrowRight className="size-3.5" />
              </button>
            </form>

            {/* Separator */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border/30"></div>
              <span className="flex-shrink mx-4 text-[9px] uppercase tracking-widest text-muted-foreground font-600">
                Or authenticate via
              </span>
              <div className="flex-grow border-t border-border/30"></div>
            </div>

            {/* Google Authentication Button */}
            <button
              onClick={handleGoogleLoginTrigger}
              className="w-full rounded-xl border border-border/80 hover:border-primary/45 bg-secondary/20 hover:bg-secondary/40 py-2.5 text-xs font-600 text-foreground transition-all flex items-center justify-center gap-2 cursor-pointer shadow-inner"
            >
              <Chrome className="size-4 text-red-400 fill-red-400/20" /> Continue with Google (Gmail)
            </button>
          </div>
        )}
      </div>

      {/* Mock Google Account Selector Modal */}
      {showGoogleSelector && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-card animate-in zoom-in-95 duration-150 text-foreground">
            <div className="text-center mb-6">
              <Chrome className="size-10 text-primary mx-auto mb-2 animate-bounce" />
              <h3 className="font-display font-700 text-base">Google Identity Account</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Choose a Gmail account to authenticate with INVENTROX:
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => selectMockGoogleAccount("mukul@inventrox.com", "Mukul Sharma")}
                className="w-full p-3 rounded-2xl border border-border/50 bg-secondary/35 hover:bg-secondary hover:border-primary/40 text-left transition-all duration-200 flex items-center gap-3 group"
              >
                <span className="grid size-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-sm font-600 text-primary-foreground group-hover:scale-105 transition-transform">
                  M
                </span>
                <div>
                  <p className="text-xs font-600 text-foreground">Mukul Sharma</p>
                  <p className="text-[10px] text-muted-foreground font-mono">mukul@inventrox.com</p>
                </div>
              </button>

              <button
                onClick={() => selectMockGoogleAccount("guest.operator@gmail.com", "Guest Operator")}
                className="w-full p-3 rounded-2xl border border-border/50 bg-secondary/35 hover:bg-secondary hover:border-primary/40 text-left transition-all duration-200 flex items-center gap-3 group"
              >
                <span className="grid size-9 place-items-center rounded-full bg-slate-700 text-sm font-600 text-white group-hover:scale-105 transition-transform">
                  G
                </span>
                <div>
                  <p className="text-xs font-600 text-foreground">Guest Operator</p>
                  <p className="text-[10px] text-muted-foreground font-mono">guest.operator@gmail.com</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowGoogleSelector(false)}
              className="w-full mt-5 rounded-xl border border-border py-2 text-xs font-600 hover:bg-secondary/40 transition-colors"
            >
              Cancel Authentication
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
