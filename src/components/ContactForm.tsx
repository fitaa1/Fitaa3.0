import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";

const formSchema = z.object({
  name:    z.string().min(2,  { message: "Name must be at least 2 characters." }),
  email:   z.string().email({ message: "Please enter a valid email address."  }),
  company: z.string().min(2,  { message: "Please tell us your company or project name." }),
  message: z.string().min(10, { message: "Tell us a little more — at least 10 characters." }),
});
type FormValues = z.infer<typeof formSchema>;

type State = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", company: "", message: "" },
  });

  async function onSubmit(data: FormValues) {
    setState("submitting");

    const formspreeId = siteConfig.contact.formspreeId;

    if (!formspreeId) {
      await new Promise((r) => setTimeout(r, 800));
      setState("success");
      form.reset();
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setState("success");
        form.reset();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  const inputClass =
    "bg-transparent border-border/40 focus-visible:ring-ruby rounded-none h-12 font-sans text-sm placeholder:text-muted-foreground/50";

  if (state === "success")
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-16 px-8"
      >
        <div className="w-14 h-14 bg-ruby/10 text-ruby rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={28} aria-hidden="true" />
        </div>
        <h4 className="text-2xl font-serif font-semibold text-foreground mb-2">Message Received</h4>
        <p className="text-muted-foreground font-sans font-light mb-8 max-w-xs">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setState("idle")}
          className="text-xs text-ruby hover:text-ruby/80 transition-colors uppercase tracking-wider font-sans"
        >
          Send Another
        </button>
      </motion.div>
    );

  if (state === "error")
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center text-center py-16 px-8"
      >
        <div className="w-14 h-14 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={28} aria-hidden="true" />
        </div>
        <h4 className="text-2xl font-serif font-semibold text-foreground mb-2">Something went wrong</h4>
        <p className="text-muted-foreground font-sans font-light mb-8 max-w-xs">
          Please try again or email us directly at{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="text-ruby underline">
            {siteConfig.contact.email}
          </a>
        </p>
        <button
          onClick={() => setState("idle")}
          className="text-xs text-ruby hover:text-ruby/80 transition-colors uppercase tracking-wider font-sans"
        >
          Try Again
        </button>
      </motion.div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Full Name</FormLabel>
                <FormControl><Input placeholder="Jane Smith" {...field} className={inputClass} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Email</FormLabel>
                <FormControl><Input placeholder="jane@company.com" type="email" {...field} className={inputClass} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Company / Project</FormLabel>
              <FormControl><Input placeholder="Your Brand or Project Name" {...field} className={inputClass} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Tell Us About Your Project</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What are you looking to achieve? Billboard campaign, website, branding...?"
                  className="min-h-[120px] bg-transparent border-border/40 focus-visible:ring-ruby rounded-none resize-none font-sans text-sm placeholder:text-muted-foreground/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full bg-ruby text-white py-4 font-sans font-medium hover:bg-ruby/85 transition-colors uppercase tracking-widest text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Submit your project enquiry"
        >
          {state === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>
      </form>
    </Form>
  );
}
