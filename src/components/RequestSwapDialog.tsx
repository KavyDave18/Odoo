import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface RequestSwapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    name: string;
    skillsOffered: string[];
    skillsWanted: string[];
  };
  currentUser: {
    id: string;
    name: string;
    skillsOffered: string[];
    skillsWanted: string[];
  };
}

export default function RequestSwapDialog({ isOpen, onClose, targetUser, currentUser }: RequestSwapDialogProps) {
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock skills for current user
  const mockCurrentUserSkills = [
    "Web Development",
    "React", 
    "JavaScript",
    "Node.js",
    "Python",
    "Data Analysis"
  ];

  const handleSubmit = async () => {
    if (!skillOffered || !skillWanted || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      toast({
        title: "Success! 🎉",
        description: `Swap request sent to ${targetUser.name}! They will review your proposal.`,
      });
      
      // Reset form
      setSkillOffered("");
      setSkillWanted("");
      setMessage("");
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Skill Swap with {targetUser.name}</DialogTitle>
          <DialogDescription>
            Propose a skill exchange. Choose what you can offer and what you'd like to learn.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-offered">I can offer:</Label>
            <Select value={skillOffered} onValueChange={setSkillOffered}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill you can teach" />
              </SelectTrigger>
              <SelectContent>
                {mockCurrentUserSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-wanted">I want to learn:</Label>
            <Select value={skillWanted} onValueChange={setSkillWanted}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill you want to learn" />
              </SelectTrigger>
              <SelectContent>
                {targetUser.skillsOffered.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to {targetUser.name}:</Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 