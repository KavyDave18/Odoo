import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, X, MapPin, Clock, Eye, EyeOff, Camera, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [isPublic, setIsPublic] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    location: "San Francisco, CA",
    bio: "Full-stack developer with 5 years experience. Love teaching coding and learning new creative skills!",
    avatar: "/placeholder-avatar.jpg",
    availability: "Weekends and evenings"
  });

  const [skillsOffered, setSkillsOffered] = useState([
    "Web Development", "React", "JavaScript", "Node.js", "Python"
  ]);
  
  const [skillsWanted, setSkillsWanted] = useState([
    "Graphic Design", "Photography", "Spanish Language"
  ]);

  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered("");
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted("");
    }
  };

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
  };

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  // Mock swap history data
  const swapHistory = [
    {
      id: 1,
      partnerName: "Mike Chen",
      skillGiven: "React Development",
      skillReceived: "Photography Basics",
      date: "2024-01-15",
      rating: 5,
      feedback: "Excellent teacher! Very patient and knowledgeable."
    },
    {
      id: 2,
      partnerName: "Emily Rodriguez",
      skillGiven: "JavaScript Fundamentals",
      skillReceived: "UI/UX Design",
      date: "2024-01-08",
      rating: 4,
      feedback: "Great session, learned a lot about design principles."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your skills and preferences
              </p>
            </div>
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="group"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                "Edit Profile"
              )}
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="history">Swap History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location (Optional)</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        disabled={!isEditing}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Input
                        id="availability"
                        value={profile.availability}
                        onChange={(e) => setProfile({...profile, availability: e.target.value})}
                        disabled={!isEditing}
                        placeholder="e.g., Weekends, Evenings"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Tell others about yourself and what you're passionate about..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Privacy Settings */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {isPublic ? <Eye className="h-5 w-5 text-primary" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
                      <div>
                        <Label htmlFor="public-profile" className="font-medium">
                          Public Profile
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to other users
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="public-profile"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Skills Offered */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-primary">Skills I Offer</CardTitle>
                    <CardDescription>
                      What can you teach others?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {skillsOffered.map((skill, index) => (
                        <Badge key={index} variant="default" className="group">
                          {skill}
                          {isEditing && (
                            <X
                              className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                              onClick={() => removeSkillOffered(skill)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                    
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a skill you can teach"
                          value={newSkillOffered}
                          onChange={(e) => setNewSkillOffered(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                        />
                        <Button onClick={addSkillOffered} size="sm">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Skills Wanted */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-secondary">Skills I Want</CardTitle>
                    <CardDescription>
                      What would you like to learn?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {skillsWanted.map((skill, index) => (
                        <Badge key={index} variant="outline" className="group">
                          {skill}
                          {isEditing && (
                            <X
                              className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                              onClick={() => removeSkillWanted(skill)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                    
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a skill you want to learn"
                          value={newSkillWanted}
                          onChange={(e) => setNewSkillWanted(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                        />
                        <Button onClick={addSkillWanted} size="sm">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Swap History</CardTitle>
                  <CardDescription>
                    Your past skill exchanges and feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {swapHistory.length > 0 ? (
                    <div className="space-y-4">
                      {swapHistory.map((swap) => (
                        <div key={swap.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Swap with {swap.partnerName}</h4>
                            <span className="text-sm text-muted-foreground">{swap.date}</span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">You taught:</span>
                              <Badge variant="default" className="ml-2">{swap.skillGiven}</Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground">You learned:</span>
                              <Badge variant="outline" className="ml-2">{swap.skillReceived}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Rating:</span>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < swap.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          {swap.feedback && (
                            <p className="text-sm text-muted-foreground italic">
                              "{swap.feedback}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No swap history yet. Start your first skill exchange!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}