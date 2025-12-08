import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Creative Director",
    content: "The 3D customizer is incredible. I designed a hoodie for my team and the quality exceeded all expectations. SAWA is the future of fashion.",
    rating: 5,
    avatar: "AC",
  },
  {
    name: "Sarah Williams",
    role: "Fashion Blogger",
    content: "Finally, a brand that lets me express my creativity. The design process is so intuitive and the finished products are absolutely premium.",
    rating: 5,
    avatar: "SW",
  },
  {
    name: "Marcus Johnson",
    role: "Entrepreneur",
    content: "Ordered custom polos for my startup. The attention to detail is unmatched. Our team loves wearing them!",
    rating: 5,
    avatar: "MJ",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase">
            Customer Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-2">
            Loved by Creators
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-background border border-border hover:border-gold/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground text-lg mb-8 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
