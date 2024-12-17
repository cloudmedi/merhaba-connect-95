import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type UserUpdateInput = {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  password?: string;
};

interface EditUserDialogProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UserRole = "admin" | "manager" | "user"; // Removed super_admin as it's not allowed

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const [formData, setFormData] = useState<UserUpdateInput>({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    password: ""
  });

  const handleSubmit = async (data: UserUpdateInput) => {
    try {
      const updateData: UserUpdateInput = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role as UserRole,
        is_active: data.is_active
      };

      if (data.password) {
        updateData.password = data.password;
      }

      await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      toast.success("User updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Failed to update user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(formData);
        }}>
          <Input
            label="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <Input
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
