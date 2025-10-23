import { useState } from "react";
import { mockRequests } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("sent");

  const sentRequests = mockRequests.filter(r => r.requesterId === "1");
  const receivedRequests = mockRequests.filter(r => r.ownerId === "1");

  const statusColors = {
    pending: { bg: "bg-secondary", icon: Clock, text: "Pending" },
    accepted: { bg: "bg-success", icon: CheckCircle2, text: "Accepted" },
    rejected: { bg: "bg-destructive", icon: XCircle, text: "Rejected" },
    completed: { bg: "bg-primary", icon: CheckCircle2, text: "Completed" },
  };

  const RequestCard = ({ request, type }: { request: typeof mockRequests[0], type: "sent" | "received" }) => {
    const status = statusColors[request.status];
    const StatusIcon = status.icon;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                <Link to={`/listings/${request.bookId}`} className="hover:text-primary transition-colors">
                  {request.bookTitle}
                </Link>
              </CardTitle>
              <CardDescription>
                {type === "sent" ? `To: ${request.requesterName}` : `From: ${request.requesterName}`}
              </CardDescription>
            </div>
            <Badge className={status.bg}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm">{request.message}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
            
            {type === "received" && request.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" variant="default">
                  Accept
                </Button>
                <Button size="sm" variant="outline">
                  Decline
                </Button>
              </div>
            )}
            
            {type === "sent" && (
              <Button size="sm" variant="ghost" className="gap-1">
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">My Requests</h1>
        <p className="text-muted-foreground">Manage your book requests and inquiries</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({receivedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="mt-6 space-y-4">
          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">No requests sent yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Browse books and send requests to connect with sellers
                </p>
                <Button asChild>
                  <Link to="/listings">Browse Books</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            sentRequests.map((request) => (
              <RequestCard key={request.id} request={request} type="sent" />
            ))
          )}
        </TabsContent>

        <TabsContent value="received" className="mt-6 space-y-4">
          {receivedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">No requests received</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  List your books to start receiving requests from interested buyers
                </p>
                <Button asChild>
                  <Link to="/sell">List a Book</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            receivedRequests.map((request) => (
              <RequestCard key={request.id} request={request} type="received" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Requests;
