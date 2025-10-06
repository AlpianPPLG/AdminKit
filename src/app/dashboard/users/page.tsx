'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, updateUserSchema } from '@/lib/validations';
import { User } from '@/lib/types';
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Create user form
  const createForm = useForm<{ name: string; email: string; password: string; role?: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER'; avatar_url?: string | undefined; }>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'CUSTOMER',
      avatar_url: '',
    },
  });

  // Edit user form
  const editForm = useForm<{ name?: string; email?: string; password?: string; role?: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER'; avatar_url?: string | undefined; }>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'CUSTOMER',
      avatar_url: '',
    },
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      toast.error('An error occurred while fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const onCreateUser = async (data: { name?: string; email?: string; password?: string; role? : 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER'; avatar_url?: string | undefined; }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('User created successfully');
        setIsCreateDialogOpen(false);
        createForm.reset();
        fetchUsers();
      } else {
        toast.error(result.message || 'Failed to create user');
      }
    } catch (error) {
      toast.error('An error occurred while creating user');
    }
  };

  // Update user
  const onUpdateUser = async (data: { name?: string; email?: string; password?: string; role?: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER'; avatar_url?: string | undefined; }) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('User updated successfully');
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        editForm.reset();
        fetchUsers();
      } else {
        toast.error(result.message || 'Failed to update user');
      }
    } catch (error) {
      toast.error('An error occurred while updating user');
    }
  };

  // Delete user
  const onDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('User deleted successfully');
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error(result.message || 'Failed to delete user');
      }
    } catch (error) {
      toast.error('An error occurred while deleting user');
    }
  };

  // Open edit dialog
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'destructive';
      case 'ADMIN':
        return 'default';
      case 'CUSTOMER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DashboardLayout
        title="User Management"
        description="Manage users, roles, and permissions"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Users</h2>
              <p className="text-muted-foreground">
                Manage your users and their roles
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system with appropriate role.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={createForm.handleSubmit((data) => {
                    // Ensure role is set, default to 'CUSTOMER' if undefined
                    const fixedData = {
                      ...data,
                      role: data.role ?? 'CUSTOMER',
                    };
                    return onCreateUser(fixedData);
                  })}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...createForm.register('name')}
                      className={createForm.formState.errors.name ? 'border-red-500' : ''}
                    />
                    {createForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...createForm.register('email')}
                      className={createForm.formState.errors.email ? 'border-red-500' : ''}
                    />
                    {createForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...createForm.register('password')}
                      className={createForm.formState.errors.password ? 'border-red-500' : ''}
                    />
                    {createForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={createForm.watch('role')}
                      onValueChange={(value) => createForm.setValue('role', value as 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {createForm.formState.errors.role && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.role.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create User</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback>
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(user)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user information and role.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={editForm.handleSubmit((data) => {
                    // Ensure role is set, default to 'CUSTOMER' if undefined
                    const fixedData = {
                      ...data,
                      role: data.role ?? 'CUSTOMER',
                    };
                    return onUpdateUser(fixedData);
                  })} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    {...editForm.register('name')}
                    className={editForm.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {editForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    {...editForm.register('email')}
                    className={editForm.formState.errors.email ? 'border-red-500' : ''}
                  />
                  {editForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editForm.watch('role')}
                    onValueChange={(value) => editForm.setValue('role', value as 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {editForm.formState.errors.role && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.role.message}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete User Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete User</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this user? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    User: <span className="font-medium">{selectedUser.name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: <span className="font-medium">{selectedUser.email}</span>
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={onDeleteUser}>
                  Delete User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

