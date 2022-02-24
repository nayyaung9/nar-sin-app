import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {apiEndpoint, spotifyEndpoint} from '@config/api';
import Header from '@components/Header';
import {SPOTIFY_TOKEN} from 'react-native-dotenv';

const HomeScreen: React.FC = ({navigation}: any) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [songDetail, setSongDetail] = useState({});
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  let audioPath = AudioUtils.DownloadsDirectoryPath + '/narsin.m4a';

  const getSongMetaData = async (songId: number) => {
    try {
      const spotifyAPI = `${spotifyEndpoint}/v1/tracks/${songId}`;
      const res = await fetch(spotifyAPI, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SPOTIFY_TOKEN}`,
        },
      });

      if (res.ok) {
        setIsRecording(false);
        let json = await res.json();
        setSongDetail(json);
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
          // body: JSON.stringify(data),
        })
          .then(res => res.json())
          .then(data => {
            console.log('data', data?.music);
            setIsRecording(false);
            setSongDetail({});
            getSongMetaData(data?.music[0].external_metadata?.spotify.track.id);
          })
          .catch(err => {
            console.log('err', err);
            setIsNotFound(true);
            setIsRecording(false);
          });
      }, 8000);
    } catch (e) {
      console.log('ERROR', e);
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
        <View style={styles.bottomSheet}>
          <View style={styles.row}>
            <Image
              source={{uri: songDetail.album.images[1].url}}
              style={{width: 80, height: 80, borderRadius: 4}}
            />
            <View style={styles.dataCol}>
              <Text>{songDetail?.name}</Text>
              <Text>{songDetail?.album.artists[0].name}</Text>
            </View>
          </View>
        </View>
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
    // alignItems: 'center',
  },
  dataCol: {
    marginLeft: 8,
  },
  alignCenter: {
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
  },
});
export default HomeScreen;
