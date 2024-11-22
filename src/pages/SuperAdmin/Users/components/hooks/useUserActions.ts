import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/users";
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export function useUserActions(user: User) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toggleStatusMutation = useMutation({
    mutationFn: () => userService.toggleUserStatus(user.id, !user.isActive),
    onSuccess: () => {
      toast.success(`Kullanıcı ${user.isActive ? 'pasif' : 'aktif'} duruma getirildi`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error("Kullanıcı durumu güncellenirken hata oluştu: " + error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => userService.deleteUser(user.id),
    onSuccess: () => {
      toast.success("Kullanıcı başarıyla silindi");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error("Kullanıcı silinirken hata oluştu: " + error);
    },
  });

  const handleNavigateToManager = async () => {
    if (user.role !== 'manager') {
      toast.error("Bu kullanıcı bir yönetici değil");
      return;
    }

    try {
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        toast.error("Oturum bulunamadı");
        return;
      }

      // Store the super admin's session
      localStorage.setItem('superAdminSession', JSON.stringify({
        token: currentSession.access_token,
        userId: currentSession.user.id
      }));

      // Store manager info for the switch
      localStorage.setItem('managerView', JSON.stringify({
        id: user.id,
        email: user.email,
        companyId: user.companyId,
        firstName: user.firstName,
        lastName: user.lastName
      }));

      // Navigate to manager dashboard
      navigate('/manager');
      toast.success("Yönetici paneline yönlendiriliyorsunuz");
    } catch (error) {
      console.error('Error switching to manager account:', error);
      toast.error("Hesap değiştirme işlemi başarısız oldu");
    }
  };

  const renewLicenseMutation = useMutation({
    mutationFn: () => userService.renewLicense(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleRenewLicense = async () => {
    try {
      await renewLicenseMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to renew license:', error);
      throw error;
    }
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isHistoryDialogOpen,
    setIsHistoryDialogOpen,
    isRenewalDialogOpen,
    setIsRenewalDialogOpen,
    toggleStatusMutation,
    deleteUserMutation,
    handleNavigateToManager,
    handleRenewLicense,
  };
}