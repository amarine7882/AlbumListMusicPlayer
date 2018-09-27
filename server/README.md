# dotThen API

> An overview of dotThen API usage

## Table of Contents

1. [Data Shape](#Data)
2. [API Usage](#Usage)
3. [Get](#Get)
4. [Post](#Post)
5. [Put](#Put)
6. [Delete](#Delete)

## Data Shape

This data shape is what will be returned by the server on get requests. This data shape must also be used when submitting new artists to the database.

```sh
{
  artistID: Number,
  artistName: String,
  albums: [
    {
      albumID: Number,
      albumName: String,
      albumImage: String,
      publishedYear: Number,
      songs: [
        {
          songID: Number,
          songName: String,
          streams: Number,
          length: Number,
          popularity: Number,
          addedToLibrary: Boolean,
        },
      ],
    },
  ],
}
```

## API Usage

### Get

```sh
/artists/:artistID/albums
```

get requests to this endpoint return the following info for an artist of given ID:

- Artist name and a list of their albums
- Album names and basic album information for us in the albums display
- Songs in each album, and song information for use in the album songs display

### Post

```sh
/artists
```

post requests to this endpoint will enter an artist or artists and all artist, album and song info into the database.
data must be complete and follow the given data shape.

### Put

```sh
/artists/:artistID
```

put requests to this endpoint will update any number of given fields on the targeted artist ID. New fields may not be added to an artist. Only existing fields may be modified. New data must be sent in the request body as a "data" property and must adhere to the following shape:

```sh
req.body.data = {
  <fieldToModify>: <newValue>,
  <fieldToModify>: <newValue>,
  <fieldToModify>: <newValue>,
  <...>
}
```

### Delete

```sh
/artists/:artistID
```

Delete requests to this endpoint will delete all of this artists info, their album info and their song info from the database
