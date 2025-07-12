import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Star, MessageSquare, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RequestSwapDialog from "@/components/RequestSwapDialog";
import { toast } from "@/hooks/use-toast";

export default function BrowseSkillsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Mock current user
  const currentUser = {
    id: "current-user-123",
    name: "John Doe",
    email: "john@example.com"
  };

  // Mock users data
  const mockUsers = [
    {
      id: "user-1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      location: "San Francisco, CA",
      rating: 4.8,
      bio: "Passionate web developer with 5+ years of experience in React and Node.js. Love teaching and learning new technologies.",
      skillsOffered: ["Web Development", "React", "JavaScript", "Node.js"],
      skillsWanted: ["Graphic Design", "UI/UX", "Figma"],
      availability: "Weekends",
      avatar: ""
    },
    {
      id: "user-2", 
      name: "Mike Chen",
      email: "mike@example.com",
      location: "New York, NY",
      rating: 4.9,
      bio: "Professional graphic designer specializing in brand identity and UI/UX design. Always excited to collaborate on creative projects.",
      skillsOffered: ["Graphic Design", "UI/UX", "Figma", "Brand Identity"],
      skillsWanted: ["Web Development", "JavaScript", "React"],
      availability: "Evenings",
      avatar: ""
    },
    {
      id: "user-3",
      name: "Emma Wilson",
      email: "emma@example.com", 
      location: "Austin, TX",
      rating: 4.7,
      bio: "Certified yoga instructor and wellness coach. Helping people find balance through movement and mindfulness practices.",
      skillsOffered: ["Yoga", "Meditation", "Wellness Coaching", "Nutrition"],
      skillsWanted: ["Photography", "Photo Editing", "Social Media Marketing"],
      availability: "Mornings",
      avatar: ""
    },
    {
      id: "user-4",
      name: "David Rodriguez",
      email: "david@example.com",
      location: "Miami, FL", 
      rating: 4.6,
      bio: "Professional photographer with expertise in portrait and event photography. Love capturing life's beautiful moments.",
      skillsOffered: ["Photography", "Photo Editing", "Lightroom", "Event Photography"],
      skillsWanted: ["Cooking", "Baking", "Spanish Language"],
      availability: "Flexible",
      avatar: ""
    },
    {
      id: "user-5",
      name: "Lisa Thompson",
      email: "lisa@example.com",
      location: "Seattle, WA",
      rating: 4.8,
      bio: "Experienced chef and cooking instructor. Passionate about teaching others to create delicious, healthy meals.",
      skillsOffered: ["Cooking", "Baking", "Nutrition", "Meal Planning"],
      skillsWanted: ["Music Theory", "Piano", "Guitar"],
      availability: "Weekends",
      avatar: ""
    },
    {
      id: "user-6",
      name: "Alex Kim",
      email: "alex@example.com",
      location: "Los Angeles, CA",
      rating: 4.9,
      bio: "Music producer and multi-instrumentalist. Teaching piano, guitar, and music production to all skill levels.",
      skillsOffered: ["Piano", "Guitar", "Music Theory", "Music Production"],
      skillsWanted: ["Data Analysis", "Python", "Machine Learning"],
      availability: "Evenings",
      avatar: ""
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRequestSwap = (user) => {
    if (!currentUser.id) {
      toast({
        title: "Error",
        description: "Please sign in to request swaps",
        variant: "destructive",
      });
      return;
    }
    setSelectedUser(user);
    setShowRequestDialog(true);
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "creative", label: "Creative Arts" },
    { value: "music", label: "Music" },
    { value: "fitness", label: "Fitness & Wellness" },
    { value: "cooking", label: "Cooking & Food" },
    { value: "language", label: "Languages" },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.skillsOffered.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    ) || user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
      user.skillsOffered.some(skill => {
        if (selectedCategory === "technology") return ["Web Development", "React", "JavaScript", "Programming", "Data Analysis"].includes(skill);
        if (selectedCategory === "creative") return ["Graphic Design", "UI/UX", "Figma", "Photography", "Photo Editing"].includes(skill);
        if (selectedCategory === "music") return ["Piano", "Music Theory", "Guitar"].includes(skill);
        if (selectedCategory === "fitness") return ["Yoga", "Meditation", "Wellness Coaching"].includes(skill);
        if (selectedCategory === "cooking") return ["Cooking", "Baking", "Nutrition"].includes(skill);
        return false;
      });
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Skills</h1>
          <p className="text-xl text-muted-foreground">
            Discover amazing skills offered by our community members
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills or people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-xl font-medium mb-2">Loading users...</h3>
              <p className="text-muted-foreground">
                Please wait while we fetch the latest skill offerings
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <Card 
                key={user.id} 
                className="border-0 shadow-soft hover:shadow-hover transition-all duration-300 animate-slide-up bg-gradient-card cursor-pointer"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.location}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{user.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{user.bio}</CardDescription>
                  <div>
                    <h4 className="font-medium mb-2">Skills Offered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skillsOffered.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="default" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Looking For:</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skillsWanted.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      Available: {user.availability}
                    </span>
                    <Button 
                      size="sm" 
                      className="group"
                      onClick={() => handleRequestSwap(user)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                      Request Swap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No skills found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all categories
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Request Swap Dialog */}
      {selectedUser && (
        <RequestSwapDialog
          isOpen={showRequestDialog}
          onClose={() => {
            setShowRequestDialog(false);
            setSelectedUser(null);
          }}
          targetUser={selectedUser}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}