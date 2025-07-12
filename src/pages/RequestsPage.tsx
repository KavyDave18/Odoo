import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, MessageSquare, Star, Trash2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function RequestsPage() {
  const [feedbackDialog, setFeedbackDialog] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser.id) return;

      try {
        // Fetch incoming requests
        const incomingResponse = await fetch(`http://localhost:3001/api/swaps/incoming/${currentUser.id}`);
        if (incomingResponse.ok) {
          const incomingData = await incomingResponse.json();
          setIncomingRequests(incomingData);
        }

        // Fetch outgoing requests
        const outgoingResponse = await fetch(`http://localhost:3001/api/swaps/outgoing/${currentUser.id}`);
        if (outgoingResponse.ok) {
          const outgoingData = await outgoingResponse.json();
          setOutgoingRequests(outgoingData);
        }

        // For now, completed swaps will be empty until we implement completion
        setCompletedSwaps([]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser.id]);

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/swaps/accept/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
        toast({
          title: "Request accepted!",
          description: "You can now coordinate the skill swap with your partner.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to accept request",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/swaps/reject/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
        toast({
          title: "Request rejected",
          description: "The request has been declined.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to reject request",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/swaps/cancel/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setOutgoingRequests(prev => prev.filter(req => req.id !== requestId));
        toast({
          title: "Request deleted",
          description: "Your swap request has been removed.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete request",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error",
        variant: "destructive",
      });
    }
  };

  const handleSubmitFeedback = () => {
    if (feedbackDialog) {
      setCompletedSwaps(prev => 
        prev.map(swap => 
          swap.id === feedbackDialog 
            ? { ...swap, rated: true }
            : swap
        )
      );
      setFeedbackDialog(null);
      setRating(0);
      setFeedback("");
      toast({
        title: "Feedback submitted!",
        description: "Thank you for rating your skill swap experience.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Swap Requests</h1>
            <p className="text-muted-foreground">
              Manage your incoming and outgoing skill swap requests
            </p>
          </div>

          <Tabs defaultValue="incoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="incoming" className="relative">
                Incoming
                {incomingRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                    {incomingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="incoming" className="space-y-4">
              {incomingRequests.length > 0 ? (
                incomingRequests.map((request) => (
                  <Card key={request.id} className="shadow-soft animate-slide-up">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.fromUser.avatar} />
                            <AvatarFallback>
                              {request.fromUser.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{request.fromUser.name}</CardTitle>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-muted-foreground">{request.fromUser.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {request.date}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">They offer:</Label>
                          <Badge variant="default" className="mt-1">{request.skillOffered}</Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">They want:</Label>
                          <Badge variant="outline" className="mt-1">{request.skillWanted}</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Message:</Label>
                        <p className="mt-1 text-sm">{request.message}</p>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 group"
                        >
                          <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-soft">
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No incoming requests</h3>
                    <p className="text-muted-foreground">
                      When someone wants to swap skills with you, their requests will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="outgoing" className="space-y-4">
              {outgoingRequests.length > 0 ? (
                outgoingRequests.map((request) => (
                  <Card key={request.id} className="shadow-soft animate-slide-up">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.toUser.avatar} />
                            <AvatarFallback>
                              {request.toUser.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{request.toUser.name}</CardTitle>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-muted-foreground">{request.toUser.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={request.status === 'accepted' ? 'default' : 'secondary'}
                            className="flex items-center"
                          >
                            {request.status === 'accepted' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {request.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{request.date}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">You offer:</Label>
                          <Badge variant="default" className="mt-1">{request.skillOffered}</Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">You want:</Label>
                          <Badge variant="outline" className="mt-1">{request.skillWanted}</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Your message:</Label>
                        <p className="mt-1 text-sm">{request.message}</p>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex justify-end pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Request
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-soft">
                  <CardContent className="text-center py-12">
                    <Send className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No outgoing requests</h3>
                    <p className="text-muted-foreground">
                      Browse skills and send requests to start skill swapping!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedSwaps.length > 0 ? (
                completedSwaps.map((swap) => (
                  <Card key={swap.id} className="shadow-soft animate-slide-up">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={swap.partner.avatar} />
                            <AvatarFallback>
                              {swap.partner.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{swap.partner.name}</CardTitle>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-muted-foreground">{swap.partner.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                          <span className="text-sm text-muted-foreground">{swap.date}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">You taught:</Label>
                          <Badge variant="default" className="mt-1">{swap.skillGiven}</Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">You learned:</Label>
                          <Badge variant="outline" className="mt-1">{swap.skillReceived}</Badge>
                        </div>
                      </div>
                      
                      {!swap.rated && (
                        <div className="flex justify-end pt-2">
                          <Dialog open={feedbackDialog === swap.id} onOpenChange={() => setFeedbackDialog(feedbackDialog === swap.id ? null : swap.id)}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Star className="h-4 w-4 mr-2" />
                                Rate & Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Rate Your Experience</DialogTitle>
                                <DialogDescription>
                                  How was your skill swap with {swap.partner.name}?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Rating</Label>
                                  <div className="flex space-x-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                                      >
                                        ★
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="feedback">Feedback (Optional)</Label>
                                  <Textarea
                                    id="feedback"
                                    placeholder="Share your experience..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="mt-2"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleSubmitFeedback} disabled={rating === 0}>
                                  Submit Review
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-soft">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No completed swaps yet</h3>
                    <p className="text-muted-foreground">
                      Complete your first skill swap to see it here and leave feedback.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}