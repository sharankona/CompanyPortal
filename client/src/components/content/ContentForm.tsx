import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Define form schema
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
  contentType: z.string(),
  assignedTo: z.string().optional(),
  deadline: z.date().optional(),
});

type ContentFormValues = z.infer<typeof formSchema>;

interface ContentFormProps {
  initialData?: ContentFormValues;
  onSubmit: (data: ContentFormValues) => void;
  workflows?: any[];
}

export default function ContentForm({ initialData, onSubmit, workflows }: ContentFormProps) {
  // Get users for assignments
  const { data: users } = useQuery({
    queryKey: ["/api/users"],
    select: (data: any) => {
      return data.map((user: any) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    },
  });

  // Initialize form
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      contentType: "blog",
      assignedTo: "",
      deadline: undefined,
    },
  });

  // Handle form submission
  const handleSubmit = (values: ContentFormValues) => {
    // Convert form values to the format expected by the API
    const formattedValues = {
      ...values,
      assignedTo: values.assignedTo === "unassigned" ? null : values.assignedTo
    };

    onSubmit(formattedValues);
  };

  // Get steps based on content type
  const getWorkflowSteps = (contentType: string) => {
    if (!workflows) return null;

    const workflow = workflows.find(wf => wf.contentType === contentType);
    if (!workflow) return null;

    try {
      return JSON.parse(workflow.steps);
    } catch (e) {
      console.error("Error parsing workflow steps:", e);
      return null;
    }
  };

  const selectedContentType = form.watch("contentType");
  const workflowSteps = getWorkflowSteps(selectedContentType);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">X (Twitter)</SelectItem>
                    <SelectItem value="product">Product Listing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to team member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="unassigned">Not Assigned</SelectItem>
                    {users?.map((user: any) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {workflowSteps && (
          <div className="bg-slate-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Workflow Steps</h3>
            <ul className="space-y-2">
              {workflowSteps.map((step: string, index: number) => (
                <li key={index} className="flex items-center text-sm">
                  <span className="flex items-center justify-center w-5 h-5 bg-primary text-white rounded-full text-xs mr-2">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit">
            {initialData ? "Update Content" : "Create Content"}
          </Button>
        </div>
      </form>
    </Form>
  );
}