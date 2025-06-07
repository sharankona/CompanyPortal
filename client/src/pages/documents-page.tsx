import Sidebar from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { FileText, Plus, Edit, Eye, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const documentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "review", "published"]),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

export default function DocumentsPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch documents
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  // Document form
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      content: "",
      status: "draft",
    },
  });

  // Handle document creation
  const handleCreateDocument = async (values: DocumentFormValues) => {
    try {
      await apiRequest("POST", "/api/documents", values);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document created",
        description: "Your document has been created successfully.",
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create document",
        variant: "destructive",
      });
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusClasses = {
      published: "bg-green-100 text-green-700",
      draft: "bg-yellow-100 text-yellow-800",
      review: "bg-blue-100 text-blue-800",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Table columns
  const columns = [
    {
      accessorKey: "name" as keyof Document,
      header: "Name",
      cell: (document: Document) => (
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-muted-foreground" />
          <span className="font-medium">{document.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt" as keyof Document,
      header: "Created",
      cell: (document: Document) => formatDistanceToNow(new Date(document.createdAt), { addSuffix: true }),
    },
    {
      accessorKey: "updatedAt" as keyof Document,
      header: "Updated",
      cell: (document: Document) => formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true }),
    },
    {
      accessorKey: "status" as keyof Document,
      header: "Status",
      cell: (document: Document) => <StatusBadge status={document.status} />,
    },
  ];

  // Action items for each row
  const actions = [
    {
      label: "View",
      icon: <Eye size={14} />,
      onClick: (document: Document) => {
        toast({
          title: "View Document",
          description: `You clicked to view ${document.name}`,
        });
      },
    },
    {
      label: "Edit",
      icon: <Edit size={14} />,
      onClick: (document: Document) => {
        toast({
          title: "Edit Document",
          description: `You clicked to edit ${document.name}`,
        });
      },
    },
    {
      label: "Delete",
      icon: <Trash size={14} />,
      className: "text-destructive focus:text-destructive",
      onClick: (document: Document) => {
        toast({
          title: "Delete Document",
          description: `You clicked to delete ${document.name}`,
          variant: "destructive",
        });
      },
    },
  ];

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 min-w-0 overflow-auto">
        <MobileHeader />

        <div className="border-b border-border">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Documents</h1>
              <p className="text-muted-foreground mt-1">Manage company documents</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus size={16} />
                  <span>New Document</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Document</DialogTitle>
                  <DialogDescription>
                    Add a new document to the company portal
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateDocument)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter document name" {...field} />
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
                            <Textarea placeholder="Enter document content" rows={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="review">In Review</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Create Document</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-6">
          <DataTable
            data={documents || []}
            columns={columns}
            actions={actions}
            isLoading={isLoading}
            emptyMessage="No documents found"
          />
        </div>
      </main>
    </div>
  );
}