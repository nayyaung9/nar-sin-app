import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {apiEndpoint, spotifyEndpoint} from '@config/api';
import Header from '@components/Header';
import {SPOTIFY_TOKEN} from 'react-native-dotenv';
import {storeTrack} from '@database/mutation';
import {SongState} from 'src/interfaces';

const HomeScreen: React.FC = ({navigation}: any) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [songDetail, setSongDetail] = useState<SongState | any>({});
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  let audioPath = AudioUtils.MusicDirectoryPath + '/narsin.m4a';

  const getSongMetaData = async (songId: number, genre: string) => {
    try {
      const spotifyAPI = `${spotifyEndpoint}/v1/tracks/${songId}`;
      const res = await fetch(spotifyAPI, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SPOTIFY_TOKEN}`,
        },
      });

      console.log(res)

      if (res.ok) {
        setIsRecording(false);
        let json = await res.json();
        const payload = {
          id: json.id,
          name: json.name,
          image: json?.album.images[0]?.url,
          artist: json?.artists[0]?.name,
          genre,
        };
        storeTrack(payload);
        setSongDetail(payload);
      } else {
        console.log('failed');
      }
    } catch (err) {
      console.log('SPOTIFY ERRR', err);
    }
  };

  const onRecord = async () => {
    setIsRecording(true);
    const isGranted = await AudioRecorder.requestAuthorization();
    if (!isGranted) return;

    try {
      await AudioRecorder.prepareRecordingAtPath(audioPath, {
        AudioQuality: 'High',
      });

      await AudioRecorder.startRecording();

      setTimeout(async () => {
        const filePath = await AudioRecorder.stopRecording();

        let data = new FormData();
        data.append('file', {
          uri: `file://${filePath}`,
          name: 'file',
          type: 'audio/mp4',
        });

        fetch(`${apiEndpoint}/api/song-upload`, {
          method: 'post',
          body: data,
        })
          .then(res => res.json())
          .then(data => {
            setIsRecording(false);
            if (!data?.music[0].external_metadata?.spotify) {
              const songState = {
                id: data?.acrid,
                name: data?.music[0].title,
                image: null,
                artist: data?.music[0]?.artists[0].name,
                genre: data?.music[0]?.genres[0].name,
              };
              setSongDetail(songState);
              storeTrack(songState);

            }
            getSongMetaData(
              data?.music[0].external_metadata?.spotify.track.id,
              data?.music[0]?.genres[0].name,
            );
          })
          .catch(err => {
            setIsNotFound(true);
            setIsRecording(false);
          });
      }, 5000);
    } catch (e) {
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.root}>
      <Header />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => onRecord()}
          style={styles.searchSongBtn}>
          <Text style={styles.searchSongBtnText}>
            {isRecording ? 'Listening for music...' : 'Tap me'}
          </Text>
        </TouchableOpacity>
      </View>
      {isNotFound && (
        <View style={[styles.bottomSheet, styles.alignCenter]}>
          <Text style={styles.notFoundText}>Song Not Found {':('}</Text>
        </View>
      )}
      {songDetail && Object.keys(songDetail).length > 1 && (
        <TouchableOpacity
          style={styles.bottomSheet}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('HistoryList')}>
          <View style={styles.row}>
            <Image
              source={
                songDetail.image === null
                  ? require('@assets/images/song-banner.jpeg')
                  : {uri: songDetail.image}
              }
              style={{width: 80, height: 80, borderRadius: 10}}
            />
            <View style={styles.dataCol}>
              <Text style={styles.songTitle}>{songDetail?.name}</Text>
              <Text style={styles.artistText}>{songDetail?.artist}</Text>
              <Text style={styles.genreText}>{songDetail?.genre}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f2f0f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSongBtn: {
    backgroundColor: '#7944ed',
    width: 180,
    height: 180,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSongBtnText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,

    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowColor: '#000000',
    elevation: 4,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dataCol: {
    flex: 1,
    marginLeft: 16,
  },
  alignCenter: {
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
  },
  songTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
  },
  artistText: {
    fontFamily: 'Poppins-Regular',
  },
  genreText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
});
export default HomeScreen;
