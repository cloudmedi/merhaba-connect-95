import { supabase } from "@/integrations/supabase/client";

export async function createPlaylistAssignmentNotification(
  recipientId: string,
  playlistName: string,
  playlistId: string,
  artworkUrl?: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

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
      message: `"${playlistName}" isimli yeni bir çalma listesi hesabınıza tanımlandı. İşletmenizin atmosferine uygun müzik deneyiminin keyfini çıkarın.`,
      type: "playlist_assignment",
      status: "unread",
      priority: "normal",
      metadata: {
        playlist_id: playlistId,
        artwork_url: artworkUrl || "/placeholder.svg"
      }
    });

    if (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in createPlaylistAssignmentNotification:", error);
    throw error;
  }
}