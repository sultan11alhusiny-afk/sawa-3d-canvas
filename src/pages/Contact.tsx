import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@sawa.fashion",
    href: "mailto:hello@sawa.fashion",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Los Angeles, California",
    href: "#",
  },
];

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent!", {
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | SAWA - Custom 3D Fashion</title>
        <meta
          name="description"
          content="Get in touch with SAWA. We're here to help with orders, custom designs, and any questions you have."
        />
      </Helmet>
      <Layout>
        <section className="py-24">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Get in Touch
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-bold mt-2 mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have a question about your order, custom designs, or just want to
                say hello? We'd love to hear from you.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="bg-secondary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="bg-secondary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Order inquiry, Custom design, etc."
                      className="bg-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help..."
                      className="bg-secondary min-h-[150px]"
                      required
                    />
                  </div>
                  <Button variant="gold" size="lg" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div className="p-8 rounded-2xl bg-card border border-border">
                  <h2 className="text-2xl font-display font-bold mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    {contactInfo.map((info) => (
                      <a
                        key={info.label}
                        href={info.href}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold transition-colors">
                          <info.icon className="w-5 h-5 text-gold group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            {info.label}
                          </div>
                          <div className="font-medium group-hover:text-gold transition-colors">
                            {info.value}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/30">
                  <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-card border border-border">
                  <h3 className="text-xl font-semibold mb-4">Response Time</h3>
                  <p className="text-muted-foreground">
                    We typically respond within 24 hours during business days. For
                    urgent matters regarding orders, please include your order
                    number in the subject line.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
