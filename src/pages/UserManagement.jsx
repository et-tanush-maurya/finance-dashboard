import React, { useState } from 'react';
import {
  UserPlus,
  Mail,
  Shield,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Dummy user data
const DUMMY_USERS = [
  {
    id: 1,
    name: 'Ahmed Al Mansouri',
    email: 'ahmed.almansouri@icp.ae',
    role: 'FinanceAdmin',
    status: 'Active',
    lastLogin: '2024-12-15',
    createdAt: '2024-01-10'
  },
  {
    id: 2,
    name: 'Fatima Hassan',
    email: 'fatima.hassan@icp.ae',
    role: 'FinanceAdmin',
    status: 'Active',
    lastLogin: '2024-12-14',
    createdAt: '2024-02-15'
  },
  {
    id: 3,
    name: 'Mohammed Khan',
    email: 'mohammed.khan@icp.ae',
    role: 'FinanceUser',
    status: 'Active',
    lastLogin: '2024-12-13',
    createdAt: '2024-03-20'
  },
  {
    id: 4,
    name: 'Sara Abdullah',
    email: 'sara.abdullah@icp.ae',
    role: 'FinanceUser',
    status: 'Active',
    lastLogin: '2024-12-12',
    createdAt: '2024-04-05'
  },
  {
    id: 5,
    name: 'Omar Rashid',
    email: 'omar.rashid@icp.ae',
    role: 'FinanceUser',
    status: 'Active',
    lastLogin: '2024-12-10',
    createdAt: '2024-05-18'
  },
  {
    id: 6,
    name: 'Layla Ahmed',
    email: 'layla.ahmed@icp.ae',
    role: 'FinanceAdmin',
    status: 'Inactive',
    lastLogin: '2024-11-20',
    createdAt: '2024-06-22'
  },
  {
    id: 7,
    name: 'Khalid Ibrahim',
    email: 'khalid.ibrahim@icp.ae',
    role: 'FinanceUser',
    status: 'Active',
    lastLogin: '2024-12-15',
    createdAt: '2024-07-11'
  },
  {
    id: 8,
    name: 'Noura Salem',
    email: 'noura.salem@icp.ae',
    role: 'FinanceUser',
    status: 'Active',
    lastLogin: '2024-12-14',
    createdAt: '2024-08-30'
  }
];

const ROLES = ['FinanceAdmin', 'FinanceUser'];
const STATUSES = ['Active', 'Inactive'];

export default function UserManagement() {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'FinanceUser',
    status: 'Active'
  });

  const filteredUsers = users;

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: users.length + 1,
        ...newUser,
        lastLogin: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'financeUser', status: 'Active' });
      setDialogOpen(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'FinanceAdmin':
        return 'bg-red-100 text-red-700';
      case 'FinanceUser':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user access and permissions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900 hover:bg-gray-800">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with appropriate permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@icp.ae"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} className="bg-gray-900 hover:bg-gray-800">
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {users.filter(u => u.status === 'Active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Finance Admin</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {users.filter(u => u.role === 'FinanceAdmin').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Finance User</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {users.filter(u => u.role === 'FinanceUser').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              No users found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
