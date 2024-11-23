import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const createPlaylistAssignmentNotification = async (
  recipientId: string,
  playlistName: string,
  playlistId: string,
  artworkUrl?: string
) => {
  console.log("Creating playlist assignment notification:", {
    recipientId,
    playlistName,
    playlistId,
    artworkUrl
  });

  try {
    const { error } = await supabase.from("notifications").insert({
      recipient_id: recipientId,
      title: "Yeni Playlist Atandı",
      message: `Size "${playlistName}" isimli playlist atandı.`,
      type: "playlist_assignment",
      metadata: {
        playlist_id: playlistId,
        artwork_url: artworkUrl
      }
    });

    if (error) {
      console.error("Error creating notification:", error);
      toast.error("Bildirim oluşturulurken bir hata oluştu");
      throw error;
    }

    console.log("Notification created successfully");
  } catch (error) {
    console.error("Error in createPlaylistAssignmentNotification:", error);
    throw error;
  }
};