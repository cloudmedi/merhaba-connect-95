import { supabase } from "@/integrations/supabase/client";

export async function createPlaylistAssignmentNotification(
  recipientId: string,
  playlistName: string,
  playlistId: string,
  artworkUrl?: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  try {
    // First check if this is a new assignment that needs notification
    const { data: assignment } = await supabase
      .from("playlist_assignments")
      .select("notification_sent")
      .eq("playlist_id", playlistId)
      .eq("user_id", recipientId)
      .single();

    // Only send notification if it hasn't been sent yet
    if (assignment && !assignment.notification_sent) {
      const { error: notificationError } = await supabase.from("notifications").insert({
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

      if (notificationError) throw notificationError;

      // Mark notification as sent
      const { error: updateError } = await supabase
        .from("playlist_assignments")
        .update({ notification_sent: true })
        .eq("playlist_id", playlistId)
        .eq("user_id", recipientId);

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error("Error in createPlaylistAssignmentNotification:", error);
    throw error;
  }
}