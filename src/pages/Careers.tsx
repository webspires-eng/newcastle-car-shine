import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Heart, TrendingUp, Users, Coffee } from "lucide-react";

const Careers = () => {
  useEffect(() => { document.title = "Careers | Sell My Car Newcastle"; }, []);
  const benefits = [
    {
      icon: Heart,
      title: "Healthcare",
      description: "Comprehensive health insurance for you and your family"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Clear progression paths and professional development opportunities"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with passionate, talented people who love what they do"
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Flexible working hours and generous holiday allowance"
    }
  ];

  const openPositions = [
    {
      title: "Senior Car Valuation Specialist",
      location: "Newcastle",
      type: "Full-time",
      department: "Operations"
    },
    {
      title: "Customer Success Manager",
      location: "Newcastle",
      type: "Full-time",
      department: "Customer Service"
    },
    {
      title: "Digital Marketing Manager",
      location: "Newcastle / Remote",
      type: "Full-time",
      department: "Marketing"
    },
    {
      title: "Software Engineer",
      location: "Newcastle / Remote",
      type: "Full-time",
      department: "Technology"
    },
    {
      title: "Vehicle Collection Driver",
      location: "Newcastle",
      type: "Full-time",
      department: "Logistics"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-hero-yellow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                Join Our Team
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed">
                Help us make car selling simple and fair for everyone in Newcastle and beyond.
              </p>
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-6">Why Work With Us?</h2>
              <p className="text-lg text-muted-foreground">
                We're building something special, and we want talented people to be part of our journey.
                Here at Sell My Car Newcastle, we're not just colleagues – we're a family.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-16 h-16 rounded-full bg-hero-yellow flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Open Positions</h2>

              <div className="space-y-4">
                {openPositions.map((position, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{position.title}</h3>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span>{position.location}</span>
                            <span>•</span>
                            <span>{position.type}</span>
                            <span>•</span>
                            <span>{position.department}</span>
                          </div>
                        </div>
                        <Button className="bg-hero-yellow text-foreground hover:bg-hero-yellow/90 whitespace-nowrap">
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Don't see the right role? We're always looking for talented people.
                </p>
                <Button variant="outline" size="lg">
                  Send Us Your CV
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Company Culture */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-8 text-center">Our Culture</h2>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Innovation & Growth</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We encourage creative thinking and continuous improvement. Your ideas matter here,
                      and we give you the freedom to experiment and grow professionally.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Customer First</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Everything we do is focused on making our customers' experience better.
                      We celebrate wins together and learn from challenges as a team.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Diversity & Inclusion</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We're proud to be an equal opportunity employer. We celebrate diversity and
                      are committed to creating an inclusive environment for all employees.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-hero-yellow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-foreground/80 mb-8">
                Join our team and help us revolutionize the car selling experience in Newcastle.
              </p>
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                View Open Positions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
