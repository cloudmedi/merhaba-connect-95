import { supabase } from "@/integrations/supabase/client";

export async function createPlaylistAssignmentNotification(
  recipientId: string,
  playlistName: string
) {
  const { error } = await supabase.from("notifications").insert({
    recipient_id: recipientId,
    title: "Yeni Playlist Atandı",
    message: `Size "${playlistName}" isimli yeni bir playlist atandı.`,
    type: "playlist_assignment",
    status: "unread",
    priority: "normal",
  });

  if (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}