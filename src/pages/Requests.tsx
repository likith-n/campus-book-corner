import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  MapPin, 
  Calendar,
  Send,
  Loader2,
  BookOpen,
  User
} from "lucide-react";
import { requestsAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

interface Request {
  request_id: number;
  listing_id: number;
  requester_id: number;
  owner_id: number;
  book_title: string;
  book_author: string;
  book_edition?: string;
  price: number;
  condition_type: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  requester_name?: string;
  requester_email?: string;
  requester_phone?: string;
  requester_rating?: number;
  requester_location?: string;
  owner_name?: string;
  owner_rating?: number;
  owner_location?: string;
}

const Requests = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | 'cancel'>('accept');
  const [responseMessage, setResponseMessage] = useState('');
  const [meetingDetails, setMeetingDetails] = useState({
    location: '',
    time: '',
    notes: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated, activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = activeTab === 'received' 
        ? await requestsAPI.getReceived()
        : await requestsAPI.getSent();
      
      console.log('📥 Requests result:', result);
      
      if (result.success) {
        setRequests(result.data || []);
      }
    } catch (error) {
      console.error('❌ Failed to fetch requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!selectedRequest) return;
    
    if (!meetingDetails.location || !meetingDetails.time) {
      toast.error('Please provide meeting location and time');
      return;
    }

    setActionLoading(true);
    try {
      const result = await requestsAPI.accept(selectedRequest.request_id);

      if (result.success) {
        toast.success('Request accepted! Buyer will be notified.');
        setActionDialogOpen(false);
        fetchRequests();
        resetDialogState();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const result = await requestsAPI.reject(selectedRequest.request_id);

      if (result.success) {
        toast.success('Request rejected');
        setActionDialogOpen(false);
        fetchRequests();
        resetDialogState();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const result = await requestsAPI.cancel(selectedRequest.request_id);

      if (result.success) {
        toast.success('Request cancelled');
        setActionDialogOpen(false);
        fetchRequests();
        resetDialogState();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (requestId: number) => {
    // Get the request details to get the price
    const request = requests.find(r => r.request_id === requestId);
    if (!request) return;

    setActionLoading(true);
    try {
      const result = await requestsAPI.complete(requestId, {
        amount: request.price,
        payment_method: 'cash',
        notes: 'Transaction completed'
      });

      if (result.success) {
        toast.success('Transaction completed!');
        fetchRequests();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete transaction');
    } finally {
      setActionLoading(false);
    }
  };

  const openActionDialog = (request: Request, action: 'accept' | 'reject' | 'cancel') => {
    setSelectedRequest(request);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const resetDialogState = () => {
    setSelectedRequest(null);
    setResponseMessage('');
    setMeetingDetails({ location: '', time: '', notes: '' });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary', icon: Clock, label: 'Pending' },
      accepted: { variant: 'default', icon: CheckCircle, label: 'Accepted' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
      completed: { variant: 'outline', icon: CheckCircle, label: 'Completed' },
      cancelled: { variant: 'outline', icon: XCircle, label: 'Cancelled' }
    };

    const config = variants[status as keyof typeof variants];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const RequestCard = ({ request }: { request: Request }) => {
    const isReceived = activeTab === 'received';
    const otherUser = isReceived 
      ? { 
          name: request.requester_name || 'Unknown', 
          email: request.requester_email || '',
          phone: request.requester_phone || '',
          rating: request.requester_rating,
          location: request.requester_location
        }
      : { 
          name: request.owner_name || 'Unknown',
          email: '',
          phone: '',
          rating: request.owner_rating,
          location: request.owner_location
        };

    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{request.book_title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <BookOpen className="h-3 w-3" />
                by {request.book_author}
              </CardDescription>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar>
              <AvatarFallback>
                {otherUser.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium flex items-center gap-2">
                <User className="h-3 w-3" />
                {otherUser.name}
              </p>
              <p className="text-sm text-muted-foreground">{otherUser.email}</p>
            </div>
          </div>

          {/* Book Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Price</p>
              <p className="font-medium">₹{request.price}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Condition</p>
              <p className="font-medium capitalize">{request.condition_type}</p>
            </div>
            {request.book_edition && (
              <div>
                <p className="text-muted-foreground">Edition</p>
                <p className="font-medium">{request.book_edition}</p>
              </div>
            )}
          </div>

          {/* Message */}
          {request.message && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1 flex items-center gap-2">
                <MessageSquare className="h-3 w-3" />
                Message
              </p>
              <p className="text-sm">{request.message}</p>
            </div>
          )}

          {/* Remove meeting details section since backend doesn't have these fields yet */}

          {/* Timestamp */}
          <p className="text-xs text-muted-foreground">
            Requested on {format(new Date(request.created_at), 'PPp')}
          </p>

          {/* Actions */}
          {isReceived && request.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => openActionDialog(request, 'accept')}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openActionDialog(request, 'reject')}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}

          {!isReceived && request.status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openActionDialog(request, 'cancel')}
              className="w-full"
            >
              Cancel Request
            </Button>
          )}

          {request.status === 'accepted' && (
            <Button
              size="sm"
              onClick={() => handleComplete(request.request_id)}
              disabled={actionLoading}
              className="w-full"
            >
              Mark as Completed
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view requests</p>
        <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">My Requests</h1>
        <p className="text-muted-foreground">
          Manage incoming and outgoing book requests
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'received' | 'sent')}>
        <TabsList className="mb-6">
          <TabsTrigger value="received">Received ({requests.length})</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <RequestCard key={request.request_id} request={request} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
                <p className="text-muted-foreground text-center">
                  When someone requests your books, they'll appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sent">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <RequestCard key={request.request_id} request={request} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Send className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests sent</h3>
                <p className="text-muted-foreground text-center">
                  Browse listings and request books you need
                </p>
                <Button className="mt-4" onClick={() => window.location.href = '/listings'}>
                  Browse Books
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'accept' && 'Accept Request'}
              {actionType === 'reject' && 'Reject Request'}
              {actionType === 'cancel' && 'Cancel Request'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'accept' && 'Provide meeting details to complete the request'}
              {actionType === 'reject' && 'Let the requester know why'}
              {actionType === 'cancel' && 'Are you sure you want to cancel this request?'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {actionType === 'accept' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="location">Meeting Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Library, Building A"
                    value={meetingDetails.location}
                    onChange={(e) => setMeetingDetails({ ...meetingDetails, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Meeting Time *</Label>
                  <Input
                    id="time"
                    type="datetime-local"
                    value={meetingDetails.time}
                    onChange={(e) => setMeetingDetails({ ...meetingDetails, time: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional instructions..."
                    rows={2}
                    value={meetingDetails.notes}
                    onChange={(e) => setMeetingDetails({ ...meetingDetails, notes: e.target.value })}
                  />
                </div>
              </>
            )}

            {(actionType === 'reject' || actionType === 'accept') && (
              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a message..."
                  rows={3}
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false);
                resetDialogState();
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={
                actionType === 'accept' ? handleAccept :
                actionType === 'reject' ? handleReject :
                handleCancel
              }
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                actionType === 'accept' ? 'Accept Request' :
                actionType === 'reject' ? 'Reject Request' :
                'Cancel Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;
