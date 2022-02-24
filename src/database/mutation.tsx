import Realm from 'realm';
import {databaseOptions, TRACK_SCHEMA} from './schemas';

/**
 * Insert article into db after user search found
 * @param { id: int, title: string, content: string, image: string, topics: string }
 */
export const storeTrack = track => {
  return new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(TRACK_SCHEMA, track);
          resolve(track);
        });
      })
      .catch(error => reject(error));
  });
};
