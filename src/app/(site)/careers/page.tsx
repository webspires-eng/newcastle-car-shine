import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Heart, TrendingUp, Users, Coffee } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Sell My Car Newcastle team. View our current job openings in Newcastle.",
  alternates: { canonical: "/careers" },
};

const benefits = [
  { icon: Heart, title: "Healthcare", description: "Comprehensive health insurance for you and your family" },
  { icon: TrendingUp, title: "Career Growth", description: "Clear progression paths and professional development opportunities" },
  { icon: Users, title: "Great Team", description: "Work with passionate, talented people who love what they do" },
  { icon: Coffee, title: "Work-Life Balance", description: "Flexible working hours and generous holiday allowance" },
];

const openPositions = [
  { title: "Senior Car Valuation Specialist", location: "Newcastle", type: "Full-time", department: "Operations" },
  { title: "Customer Success Manager", location: "Newcastle", type: "Full-time", department: "Customer Service" },
  { title: "Digital Marketing Manager", location: "Newcastle / Remote", type: "Full-time", department: "Marketing" },
  { title: "Software Engineer", location: "Newcastle / Remote", type: "Full-time", department: "Technology" },
  { title: "Vehicle Collection Driver", location: "Newcastle", type: "Full-time", department: "Logistics" },
];

export default function CareersPage() {
  return (
    <main>
      <section className="py-20 bg-hero-yellow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">Join Our Team</h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Help us make car selling simple and fair for everyone in Newcastle and beyond.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Work With Us?</h2>
            <p className="text-lg text-muted-foreground">
              We&apos;re building something special, and we want talented people to be part of our journey. Here at Sell My Car Newcastle, we&apos;re not just colleagues – we&apos;re a family.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
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
          </div>
        </div>
      </section>

      <section className="py-20 bg-hero-yellow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-foreground/80 mb-8">Join our team and help us revolutionize the car selling experience in Newcastle.</p>
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
