export const TRACK_SCHEMA = 'Track';

export const trackSchema = {
  name: TRACK_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    name: {type: 'string'},
    image: {type: 'string'},
    artist: {type: 'string'},
    genre: {type: 'string'},
  },
};

export const databaseOptions = {
  path: 'NarSinApp.realm',
  schema: [trackSchema],
  schemaVersion: 0,
};
