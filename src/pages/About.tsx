import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import heroBg from "@/assets/hero-bg.jpg";

const values = [
  {
    title: "Creativity",
    description:
      "We believe fashion is a canvas for self-expression. Every piece you create tells your unique story.",
  },
  {
    title: "Innovation",
    description:
      "Pioneering 3D customization technology that puts the power of design directly in your hands.",
  },
  {
    title: "Quality",
    description:
      "Premium materials, expert craftsmanship, and attention to detail in every stitch.",
  },
  {
    title: "Sustainability",
    description:
      "Made-to-order production means zero waste. Fashion that's kind to the planet.",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About SAWA | Our Story & Mission</title>
        <meta
          name="description"
          content="SAWA is a movement of creativity and identity. Learn about our mission to revolutionize custom fashion with 3D technology."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroBg}
              alt="SAWA Background"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
          </div>
          <div className="container relative z-10 px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Our Story
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mt-4 mb-6">
                Design Your <span className="text-gradient-gold">Identity</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                SAWA is not just a clothing brand. It is a movement of creativity
                and identity. Clothing is not just fabric – it is expression, art,
                and personality.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-card">
          <div className="container px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  The mission of SAWA is to allow people to express who they are
                  through custom fashion using advanced 3D technology.
                </p>
                <p className="text-lg text-muted-foreground">
                  We believe that everyone deserves clothing that truly represents
                  them. No more settling for mass-produced designs. With SAWA, you
                  become the designer of your own wardrobe.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-square rounded-2xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/30 p-8"
              >
                <div className="absolute inset-8 rounded-xl bg-secondary flex items-center justify-center">
                  <span className="text-8xl font-display font-bold text-gradient-gold">
                    S
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                What Drives Us
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mt-2">
                Our Values
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-gold/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
                    <span className="text-2xl font-display font-bold text-gold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-24 bg-card">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Made For You
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-6">
                Young. Creative. <span className="text-gradient-gold">Bold.</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                SAWA is built for young people who love fashion, technology,
                creativity, and uniqueness. If you refuse to blend in and insist on
                standing out, you're one of us.
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
