import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSubscriberSchema } from "@shared/schema";
import { useCreateSubscriber } from "@/hooks/use-subscribers";
import { GridBackground } from "@/components/GridBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { ArrowRight, Box, Shield, Zap, CheckCircle2, Loader2 } from "lucide-react";
import type { InsertSubscriber } from "@shared/schema";

const features = [
  {
    icon: <Box className="w-6 h-6 text-primary" />,
    title: "Scalable Solutions",
    description: "Cloud-native infrastructure that grows with your business needs automatically."
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "AI Automation",
    description: "Intelligent workflows that optimize your operations and reduce manual overhead."
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and security protocols built into every layer."
  }
];

export default function Landing() {
  const createSubscriber = useCreateSubscriber();
  
  const form = useForm<InsertSubscriber>({
    resolver: zodResolver(insertSubscriberSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: InsertSubscriber) => {
    createSubscriber.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative flex flex-col overflow-hidden transition-colors duration-300">
      <GridBackground />
      
      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-xl">E</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">ELIVIAR</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 bg-muted/50 backdrop-blur-sm border border-border rounded-full px-3 py-1 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Coming Soon</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Building intelligent <br className="hidden sm:block" />
              software for <span className="text-gradient">tomorrow.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              We're crafting the next generation of digital infrastructure. 
              Secure, scalable, and powered by advanced AI to transform how you work.
            </p>
          </motion.div>

          {/* Email Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md"
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
                  <input
                    {...form.register("email")}
                    type="email"
                    placeholder="Enter your email address"
                    disabled={createSubscriber.isPending}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50"
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1.5 text-sm text-destructive px-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={createSubscriber.isPending}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center space-x-2 hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  {createSubscriber.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : createSubscriber.isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <span>Notify Me</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground pl-1">
                Join {2500}+ others on the waitlist. No spam, ever.
              </p>
            </form>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold font-display mb-2 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2026 ELIVIAR. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
