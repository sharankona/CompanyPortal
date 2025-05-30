
import { MobileHeader } from "@/components/mobile-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Plus, UserCog, Trash } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";

// User form schema
const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(2, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UsersPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch users
  const { data: users, isLoading, isError, error } = useQuery<Omit<User, "password">[]>({
    queryKey: ["/api/users"],
    onError: (err) => {
      console.error("Error fetching users:", err);
      toast({
        title: "Error fetching users",
        description: err instanceof Error ? err.message : "Failed to load users",
        variant: "destructive",
      });
    }
  });

  // User form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      fullName: "",
      password: "",
      role: "user",
    },
  });

  // User deletion state and handlers
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Handle user creation
  const handleCreateUser = async (values: UserFormValues) => {
    try {
      await apiRequest("POST", "/api/register", values);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "User created",
        description: "The user has been created successfully.",
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive",
      });
    }
  };

  // Handle user role update
  const handleEditUser = async (user: User, newRole: string) => {
    try {
      await apiRequest("PATCH", `/api/users/${user.id}`, { role: newRole });
      await queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "User updated",
        description: `${user.fullName}'s role has been updated to ${newRole}.`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: number) => {
    if (!userId) {
      console.error("Invalid user ID for deletion");
      toast({
        title: "Error",
        description: "Cannot delete user: Invalid user ID",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log(`Attempting to delete user with ID: ${userId}`);
      
      // Make the DELETE request with explicit error handling
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete user (Status: ${response.status})`);
      }
      
      console.log(`User ${userId} deleted successfully`);
      
      // Force refresh the users list
      await queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      await queryClient.refetchQueries({ queryKey: ["/api/users"] });
      
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully."
      });
      
      // Reset state
      setUserToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error deleting user:", errorMessage);
      toast({
        title: "Error deleting user",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Improved error handling for user registration
  const handleRegistrationError = (error: unknown) => {
    let errorMessage = "Failed to register user";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String((error as any).message);
    }
    
    toast({
      title: "Registration Failed",
      description: errorMessage,
      variant: "destructive",
    });
  };

  // Table columns
  const columns = [
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <UserAvatar user={user} size="sm" />
            <span className="font-medium">{user.fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return <span className="capitalize">{user.role || "user"}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        const user = row.original;
        return user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A";
      },
    },
  ];

  // Action items for each row
  const actions = [
    {
      label: "Edit Role",
      icon: <UserCog size={14} />,
      onClick: (user: User) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: "Delete",
      icon: <Trash size={14} />,
      className: "text-destructive focus:text-destructive",
      onClick: (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
      },
    },
  ];

  if (isError) {
    return (
      <div className="flex min-h-screen">
        <main className="flex-1 min-w-0 overflow-auto">
          <MobileHeader />
          <div className="p-6">
            <div className="text-red-500">
              Error loading users: {error instanceof Error ? error.message : "Unknown error"}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 min-w-0 overflow-auto">
        <MobileHeader />

        <div className="border-b border-border">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="text-muted-foreground mt-1">Manage company users</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus size={16} />
                  <span>New User</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the company portal
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Administrator</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Create User</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Edit User Role Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User Role</DialogTitle>
                  <DialogDescription>
                    Change {selectedUser?.fullName}'s role
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  {selectedUser && (
                    <Select 
                      defaultValue={selectedUser.role} 
                      onValueChange={(value) => {
                        if(selectedUser) {
                          // Update the local state first
                          setSelectedUser({...selectedUser, role: value});
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={() => {
                      if (selectedUser) {
                        handleEditUser(selectedUser, selectedUser.role);
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete User Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
              setIsDeleteDialogOpen(open);
              // Clear user to delete if dialog is closed
              if (!open) setUserToDelete(null);
            }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {userToDelete?.fullName}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      if (userToDelete && userToDelete.id) {
                        handleDeleteUser(userToDelete.id);
                      } else {
                        toast({
                          title: "Error",
                          description: "Cannot delete: User information is missing",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-6">
          <DataTable
            data={users || []}
            columns={columns}
            actions={user?.role === 'admin' ? actions : undefined}
            isLoading={isLoading}
            emptyMessage="No users found"
          />
        </div>
      </main>
    </div>
  );
}
