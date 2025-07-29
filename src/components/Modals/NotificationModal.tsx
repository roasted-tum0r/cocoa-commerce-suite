import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Package, Star, Gift, AlertCircle } from "lucide-react";

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const notifications = [
  {
    id: 1,
    type: "order",
    title: "Order Delivered",
    message: "Your order #12345 has been delivered successfully!",
    time: "2 hours ago",
    unread: true,
    icon: Package,
  },
  {
    id: 2,
    type: "promo",
    title: "Special Offer",
    message: "Get 20% off on all organic fruits this weekend!",
    time: "1 day ago",
    unread: true,
    icon: Gift,
  },
  {
    id: 3,
    type: "review",
    title: "Review Request",
    message: "How was your experience with Premium Mangoes?",
    time: "2 days ago",
    unread: false,
    icon: Star,
  },
  {
    id: 4,
    type: "alert",
    title: "Stock Alert",
    message: "Organic Almonds are back in stock!",
    time: "3 days ago",
    unread: false,
    icon: AlertCircle,
  },
];

export const NotificationModal = ({ open, onOpenChange }: NotificationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.unread ? "bg-accent/20 border-accent" : "bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.unread ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {notification.unread && (
                          <Badge variant="destructive" className="text-xs px-1 py-0">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};