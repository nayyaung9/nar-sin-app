import Realm from 'realm';
import {databaseOptions, TRACK_SCHEMA} from './schemas';

export const fetchSearchedTracks = () => {
  return new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        const tracks = realm.objects(TRACK_SCHEMA);
        resolve(tracks);
      })
      .catch(error => reject(error));
  });
};
