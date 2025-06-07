import Sidebar from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { useQuery } from "@tanstack/react-query";
import { Announcement } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Announcement form schema
const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(["company", "important", "hr"]),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch announcements
  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  // Announcement form
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "company",
    },
  });

  // Handle announcement creation
  const handleCreateAnnouncement = async (values: AnnouncementFormValues) => {
    try {
      await apiRequest("POST", "/api/announcements", values);
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      toast({
        title: "Announcement created",
        description: "Your announcement has been created successfully.",
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create announcement",
        variant: "destructive",
      });
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryClasses = {
      company: "bg-primary text-primary-foreground",
      important: "bg-red-500 text-white",
      hr: "bg-blue-500 text-white",
    };
    
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryClasses[category as keyof typeof categoryClasses]} mb-3`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 min-w-0 overflow-auto">
        <MobileHeader />
        
        <div className="border-b border-border">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Announcements</h1>
              <p className="text-muted-foreground mt-1">Company announcements and updates</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus size={16} />
                  <span>New Announcement</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Add a new announcement to the company portal
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateAnnouncement)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter announcement title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter announcement content" rows={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="company">Company</SelectItem>
                              <SelectItem value="important">Important</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Create Announcement</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-opacity-50 border-t-primary rounded-full"></div>
            </div>
          ) : announcements?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No announcements found</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                Create your first announcement
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements?.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      {getCategoryBadge(announcement.category)}
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                    <CardTitle>{announcement.title}</CardTitle>
                    <CardDescription>
                      Posted on {format(new Date(announcement.createdAt), "MMMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-xs text-muted-foreground">
                    <span>ID: {announcement.createdById}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
