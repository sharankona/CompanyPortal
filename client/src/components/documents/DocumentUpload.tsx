import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext"; // Added import


const documentTypeOptions = [
  "PDF",
  "DOCX",
  "XLSX",
  "PPTX",
  "TXT",
  "CSV",
  "PNG",
  "JPG",
  "Other"
];

const documentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  type: z.string().min(1, "Document type is required"),
  description: z.string().optional(),
  fileUrl: z.string().min(1, "File is required"),
  accessLevel: z.enum(["employee", "management", "client", "admin"]).default("employee"),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

export default function DocumentUpload() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { addNotification } = useNotifications(); // Added addNotification

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      fileUrl: "",
      accessLevel: "employee",
    },
  });

  const uploadDocument = useMutation({
    mutationFn: async (values: DocumentFormValues) => {
      const response = await apiRequest("POST", "/api/documents", {
        ...values,
        uploadedById: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
      setOpen(false);
      form.reset();
      setFile(null);
      // Send notification -  This part needs context and might need adjustment based on the actual structure of the notification system
      addNotification({
        title: "Document Uploaded",
        message: `Your document ${file?.name} has been uploaded successfully.`,
        type: "success",
        link: "/documents" // Example link, adjust as needed
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload document",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // In a real app, you'd upload to cloud storage here and get a URL back
      const mockFileUrl = `https://example.com/files/${selectedFile.name}`;

      // Set file name and type based on selected file
      form.setValue("name", selectedFile.name);
      form.setValue("fileUrl", mockFileUrl);

      // Try to determine file type from extension
      const extension = selectedFile.name.split(".").pop()?.toUpperCase();
      if (extension) {
        switch (extension) {
          case "PDF":
            form.setValue("type", "PDF");
            break;
          case "DOC":
          case "DOCX":
            form.setValue("type", "DOCX");
            break;
          case "XLS":
          case "XLSX":
            form.setValue("type", "XLSX");
            break;
          case "PPT":
          case "PPTX":
            form.setValue("type", "PPTX");
            break;
          case "TXT":
            form.setValue("type", "TXT");
            break;
          case "CSV":
            form.setValue("type", "CSV");
            break;
          case "PNG":
            form.setValue("type", "PNG");
            break;
          case "JPG":
          case "JPEG":
            form.setValue("type", "JPG");
            break;
          default:
            form.setValue("type", "Other");
        }
      }
    }
  };

  const onSubmit = (values: DocumentFormValues) => {
    uploadDocument.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary bg-white hover:bg-primary-50">
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogDescription>
            Upload a document to share with the team. Supported formats include PDF, DOC, XLS, and more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add a brief description of this document..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                />
                {file && (
                  <p className="text-xs text-slate-500">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="accessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employee">All Employees</SelectItem>
                        <SelectItem value="management">Management Only</SelectItem>
                        <SelectItem value="client">Client Visible</SelectItem>
                        <SelectItem value="admin">Administrators Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploadDocument.isPending}
              >
                {uploadDocument.isPending ? "Uploading..." : "Upload Document"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}