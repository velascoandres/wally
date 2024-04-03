pub const PICTURE_TABLE_SQL: &str = "(
    id VARCHAR2 PRIMARY KEY,
    name VARCHAR2 not null,
    description VARCHAR2 not null,
    file BLOB not null,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)";

pub const PLAYLIST_TABLE_SQL: &str = "(
    id VARCHAR2 PRIMARY KEY,
    pictureOrder INTEGER NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    pictureId VARCHAR2,
    FOREIGN KEY(pictureId) REFERENCES PICTURE(id)
)";