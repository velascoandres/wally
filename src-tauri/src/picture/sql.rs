pub const PLAYLIST_JOIN_QUERY: &str = "SELECT
    PLAYLIST.id,
    pictureOrder,
    pictureId,
    PICTURE.name as picture_name,
    PICTURE.file as picture_file,
    PLAYLIST.createdAt,
    PLAYLIST.updatedAt
FROM PLAYLIST INNER JOIN PICTURE";