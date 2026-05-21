import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
const formSchema = z.object({ name: z.string().min(2), email: z.string().email(), company: z.string().min(2), message: z.string().min(10) });
type FormValues = z.infer<typeof formSchema>;
export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: { name: "", email: "", company: "", message: "" } });
  function onSubmit(_data: FormValues) { setTimeout(() => { setIsSuccess(true); form.reset(); }, 1000); }
  const inputClass = "bg-transparent border-border/40 focus-visible:ring-ruby rounded-none h-12 font-sans text-sm";
  if (isSuccess) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 bg-ruby/10 text-ruby rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={32} /></div>
      <h4 className="text-2xl font-serif font-semibold text-foreground mb-2">Request Received</h4>
      <p className="text-muted-foreground font-sans font-light mb-8">Our team will review your details and contact you within 24 hours.</p>
      <button onClick={() => setIsSuccess(false)} className="text-sm text-ruby hover:text-ruby/80 transition-colors uppercase tracking-wider font-sans">Send Another</button>
    </motion.div>
  );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Full Name</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} className={inputClass} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Email</FormLabel><FormControl><Input placeholder="jane@company.com" type="email" {...field} className={inputClass} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <FormField control={form.control} name="company" render={({ field }) => (<FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Company</FormLabel><FormControl><Input placeholder="Your Company" {...field} className={inputClass} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="message" render={({ field }) => (<FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Project Details</FormLabel><FormControl><Textarea placeholder="Tell us about your objectives..." className="min-h-[120px] bg-transparent border-border/40 focus-visible:ring-ruby rounded-none resize-none font-sans text-sm" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-ruby text-foreground py-4 font-sans font-medium hover:bg-ruby/85 transition-colors uppercase tracking-widest text-sm disabled:opacity-50">
          {form.formState.isSubmitting ? "Sending..." : "Submit Inquiry"}
        </button>
      </form>
    </Form>
  );
}