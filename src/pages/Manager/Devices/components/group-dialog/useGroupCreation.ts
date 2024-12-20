import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export function useGroupCreation() {
  const [isLoading, setIsLoading] = useState(false);

  const createGroup = async (
    groupName: string, 
    description: string, 
    selectedDevices: string[]
  ) => {
    if (!groupName.trim()) {
      toast.error("Lütfen grup adı girin");
      return false;
    }

    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return false;
    }

    try {
      setIsLoading(true);
      await api.post('/manager/branch-groups', {
        name: groupName,
        description,
        deviceIds: selectedDevices
      });

      toast.success("Grup başarıyla oluşturuldu");
      return true;
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error("Grup oluşturulurken bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createGroup
  };
}