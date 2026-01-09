import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Quote, Heart, Target, Users, ArrowRight } from "lucide-react";

const FounderPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              The Heart Behind ChillThrive
            </h1>
            <p className="text-xl text-muted-foreground">
              Every great journey begins with a personal transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image placeholder - would use real founder photo */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Founder Photo</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl bg-primary/10 -z-10" />
            </div>

            {/* Story Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Journey of Resilience
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg">
                <p>
                  ChillThrive was born from a personal transformation. Like many, 
                  I found myself caught in the relentless pace of modern life – 
                  stressed, burnt out, and searching for something to help me 
                  reclaim my energy and mental clarity.
                </p>
                <p>
                  My discovery of cold therapy came at a crucial moment. That 
                  first ice bath was uncomfortable, challenging, and ultimately 
                  life-changing. In those few minutes of controlled discomfort, 
                  I found something I had been missing – the ability to be fully 
                  present, to quiet the mental noise, and to prove to myself that 
                  I was capable of more than I believed.
                </p>
                <p>
                  What started as a personal practice quickly became a passion. 
                  I dove deep into the science, trained with experts, and 
                  experienced firsthand how combining cold and heat therapy could 
                  transform not just physical recovery, but mental resilience and 
                  overall well-being.
                </p>
                <p>
                  ChillThrive is my mission to share this transformation with 
                  others. We've created a space where science meets serenity, 
                  where you can challenge yourself in a supportive environment, 
                  and where recovery is treated as the essential practice it truly is.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="w-16 h-16 mx-auto mb-8 opacity-30" />
            <blockquote className="text-2xl md:text-3xl font-medium italic mb-8">
              "True recovery isn't just about healing the body – it's about 
              building the mental resilience to thrive in all areas of life. 
              Every cold plunge is a choice to grow stronger."
            </blockquote>
            <p className="text-primary-foreground/80">
              — Founder, ChillThrive
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Mission & Values
            </h2>
            <p className="text-muted-foreground text-lg">
              The principles that guide everything we do at ChillThrive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description: "To make premium wellness accessible and to help every individual unlock their potential through the transformative power of temperature therapy.",
              },
              {
                icon: Heart,
                title: "Our Vision",
                description: "A world where recovery is valued as highly as performance, and where everyone has the tools to build physical and mental resilience.",
              },
              {
                icon: Users,
                title: "Our Community",
                description: "We believe in the power of shared experience. Our community supports, motivates, and celebrates each other's wellness journeys.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button asChild size="lg">
              <Link to="/booking">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FounderPage;
