import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const deleteUser = async (userId: string) => {
  try {
    // Önce profili sil
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    // Kullanıcıya ait lisansları sil
    const { error: licenseError } = await supabase
      .from('licenses')
      .delete()
      .eq('user_id', userId);

    if (licenseError) throw licenseError;

    return { success: true };
  } catch (error: any) {
    toast.error("Kullanıcı silinirken bir hata oluştu: " + error.message);
    throw error;
  }
};
