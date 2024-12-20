import api from '@/lib/api';

export async function createPlaylistAssignmentNotification(
  recipientId: string,
  playlistName: string,
  playlistId: string,
  artworkUrl?: string
) {
  try {
    const { data: assignment } = await api.get(`/playlist-assignments/${playlistId}/${recipientId}`);

    if (assignment && !assignment.notification_sent) {
      await api.post('/notifications', {
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

      await api.put(`/playlist-assignments/${playlistId}/${recipientId}`, {
        notification_sent: true
      });
    }
  } catch (error) {
    console.error("Error in createPlaylistAssignmentNotification:", error);
    throw error;
  }
}