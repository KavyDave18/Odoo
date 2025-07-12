import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { ArrowRight, Users, MessageSquare, Star, Shield, Search, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Find Skills",
      description: "Browse and search for skills offered by community members"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-secondary" />,
      title: "Request Swaps",
      description: "Send and receive skill swap requests with ease"
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Rate & Review",
      description: "Build trust through ratings and feedback after swaps"
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: "Secure Platform",
      description: "Safe and moderated environment for skill sharing"
    }
  ];

  const popularSkills = [
    "Web Development", "Graphic Design", "Photography", "Language Teaching", 
    "Music Lessons", "Cooking", "Writing", "Marketing", "Yoga", "Tutoring"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Share Skills, Build Community
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with your neighbors and trade skills. Learn something new while sharing what you know best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group" asChild>
                <Link to="/browse">
                  Browse Skills
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signin">Create Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start sharing and learning new skills
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-hover transition-all duration-300 animate-slide-up bg-gradient-card" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-muted/50">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Skills</h2>
            <p className="text-xl text-muted-foreground">
              Discover what's trending in our community
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {popularSkills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer animate-bounce-in"
                style={{animationDelay: `${index * 50}ms`}}
              >
                {skill}
              </Badge>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/browse">
                <Search className="mr-2 h-4 w-4" />
                Browse All Skills
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <Heart className="h-16 w-16 mx-auto mb-6 animate-bounce-in" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Swapping?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community of learners and teachers. Your next skill is just a swap away!
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signin">
                Create Your Profile Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <Link to="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SkillSwap
            </Link>
          </div>
          <p className="text-muted-foreground">
            Built with ❤️ for the community
          </p>
        </div>
      </footer>
    </div>
  );
}