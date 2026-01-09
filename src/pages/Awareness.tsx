import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Snowflake, 
  Thermometer, 
  Brain, 
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb
} from "lucide-react";

const AwarenessPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-6">
              Learn
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              The Science of Recovery
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Understand the science behind cold & heat therapy and how it can 
              transform your health and performance.
            </p>
          </div>
        </div>
      </section>

      {/* What is Cold Therapy */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Snowflake className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                What is Cold Therapy?
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Cold therapy, also known as cryotherapy, involves exposing the body to 
                cold temperatures for therapeutic benefits. Ice baths are one of the most 
                effective forms of cold therapy, typically involving immersion in water 
                between 10-15°C (50-59°F) for 2-15 minutes.
              </p>
              <p className="text-muted-foreground text-lg">
                The practice has been used for centuries by athletes, warriors, and 
                wellness enthusiasts. Modern science has now validated what ancient 
                cultures knew intuitively – cold exposure triggers powerful healing 
                responses in the body.
              </p>
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Key Benefits of Ice Baths
                </h3>
                <ul className="space-y-4">
                  {[
                    "Reduces inflammation and muscle soreness",
                    "Boosts immune system function",
                    "Increases metabolic rate",
                    "Improves mental clarity and focus",
                    "Releases endorphins and dopamine",
                    "Builds mental resilience",
                    "Improves sleep quality",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Science Behind It */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              The Science Behind Ice Baths
            </h2>
            <p className="text-muted-foreground text-lg">
              Understanding what happens in your body during cold exposure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Vasoconstriction",
                description: "Cold causes blood vessels to constrict, reducing blood flow to extremities. When you warm up, fresh oxygenated blood rushes back, flushing out metabolic waste.",
              },
              {
                icon: Brain,
                title: "Norepinephrine Release",
                description: "Cold exposure triggers a significant release of norepinephrine, a hormone that improves focus, attention, and mood while reducing inflammation.",
              },
              {
                icon: Thermometer,
                title: "Brown Fat Activation",
                description: "Regular cold exposure activates brown adipose tissue, which burns calories to generate heat, potentially aiding in weight management.",
              },
            ].map((item) => (
              <Card key={item.title} className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Heat vs Cold */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Heat vs Cold Therapy
            </h2>
            <p className="text-muted-foreground text-lg">
              Both have unique benefits – learn when to use each.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-primary/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Snowflake className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Cold Therapy</h3>
                </div>
                <p className="text-muted-foreground mb-4">Best for:</p>
                <ul className="space-y-2">
                  {[
                    "Post-workout recovery",
                    "Reducing acute inflammation",
                    "Boosting energy and alertness",
                    "Building mental resilience",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-500/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Thermometer className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Heat Therapy</h3>
                </div>
                <p className="text-muted-foreground mb-4">Best for:</p>
                <ul className="space-y-2">
                  {[
                    "Muscle relaxation",
                    "Chronic pain relief",
                    "Stress reduction",
                    "Detoxification",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-orange-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Should Avoid */}
      <section className="py-20 bg-destructive/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <AlertTriangle className="w-10 h-10 text-destructive" />
              <h2 className="text-3xl font-bold text-foreground">
                Who Should Avoid Ice Baths?
              </h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8">
              While ice baths are generally safe for healthy individuals, certain 
              conditions require caution or medical consultation:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Cardiovascular disease or heart conditions",
                "Raynaud's disease",
                "Cold urticaria (cold allergy)",
                "Pregnancy",
                "Uncontrolled high blood pressure",
                "Open wounds or skin conditions",
                "Peripheral neuropathy",
                "Recent surgery",
              ].map((condition) => (
                <div key={condition} className="flex items-center gap-3 bg-background p-4 rounded-lg">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <span className="text-foreground">{condition}</span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-8">
              Always consult with a healthcare professional before starting any 
              new therapy, especially if you have pre-existing medical conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Myths */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Lightbulb className="w-10 h-10 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Recovery Myths Debunked
              </h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  myth: "Longer is always better",
                  fact: "Quality over quantity. 2-5 minutes in properly cold water is often more effective than 20 minutes in lukewarm water.",
                },
                {
                  myth: "You need to be an athlete to benefit",
                  fact: "Anyone can benefit from cold therapy. It's particularly helpful for mental health, stress reduction, and overall wellness.",
                },
                {
                  myth: "Cold therapy should hurt",
                  fact: "Discomfort is normal, but pain is not. You should be able to control your breathing and feel challenged but not in distress.",
                },
                {
                  myth: "Heat therapy is just for relaxation",
                  fact: "Heat therapy has measurable health benefits including improved cardiovascular health, detoxification, and pain relief.",
                },
              ].map((item) => (
                <Card key={item.myth}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          Myth: "{item.myth}"
                        </h4>
                        <p className="text-muted-foreground">
                          <strong className="text-primary">Fact:</strong> {item.fact}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AwarenessPage;
