import Sidebar from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/context/NotificationContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved.",
    });
    
    addNotification({
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      type: "success"
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
    
    addNotification({
      title: "Settings Changed",
      message: "Your notification preferences have been updated.",
      type: "info"
    });
  };
  
  const handleSaveAppearance = () => {
    toast({
      title: "Appearance Settings Updated",
      description: "Your appearance preferences have been saved.",
    });
    
    addNotification({
      title: "Appearance Changed",
      message: "Your appearance settings have been updated successfully.",
      type: "info"
    });
  };
  
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 min-w-0 overflow-auto">
        <MobileHeader />
        
        <div className="border-b border-border">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings</p>
          </div>
        </div>
        
        <div className="p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <UserAvatar user={user} size="lg" />
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" defaultValue={user?.fullName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue={user?.username} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" defaultValue={user?.role} disabled />
                    </div>
                  </div>
                  
                  <div>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Choose what notifications you receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="document-updates">Document Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when documents are updated
                        </p>
                      </div>
                      <Switch id="document-updates" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="announcements">Announcements</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify for new company announcements
                        </p>
                      </div>
                      <Switch id="announcements" defaultChecked />
                    </div>
                  </div>
                  
                  <div>
                    <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize how the portal looks for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" size="sm">Light</Button>
                          <Button variant="outline" className="flex-1" size="sm">Dark</Button>
                          <Button variant="default" className="flex-1" size="sm">System</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="flex gap-2">
                          <Button variant="default" className="flex-1" size="sm">Blue</Button>
                          <Button variant="outline" className="flex-1" size="sm">Green</Button>
                          <Button variant="outline" className="flex-1" size="sm">Purple</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compact-mode">Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Use a more compact layout
                        </p>
                      </div>
                      <Switch id="compact-mode" />
                    </div>
                  </div>
                  
                  <div>
                    <Button onClick={handleSaveAppearance}>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
