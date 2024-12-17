import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  avatar_url?: string;
}

export default function Profile() {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    avatar_url: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      const updatedProfile = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        avatar_url: data.avatar_url
      };
      
      await updateProfile(updatedProfile);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium">First Name</label>
        <Input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Last Name</label>
        <Input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Avatar URL</label>
        <Textarea
          name="avatar_url"
          value={formData.avatar_url}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  );
}
