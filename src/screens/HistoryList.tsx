import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {fetchSearchedTracks} from '@database/query';
import {SongState} from 'src/interfaces';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const HistoryList = () => {
  const navigation = useNavigation();

  const [songs, setSongs] = useState<any>([]);
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    fetchSearchedTracks()
      .then(data => {
        setSongs(data);
      })
      .catch(err => {
        setError(true);
      });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={'#7944ed'} />
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="md-chevron-back" color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.appTitle}>History</Text>
      </View>
      {songs && songs.length === 0 ? (
        <View style={styles.rootAlign}>
          <Text style={styles.themeText}>No Song has listed.</Text>
        </View>
      ) : error ? (
        <View style={styles.rootAlign}>
          <Text style={styles.themeText}>Error {': ('}</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {songs &&
            songs.map((song: SongState, i: number) => (
              <View style={styles.songCard} key={i}>
                <Image
                  source={
                    song.image === null
                      ? require('@assets/images/song-banner.jpeg')
                      : {uri: song.image}
                  }
                  style={styles.songImage}
                />
                <View style={styles.songMetaCol}>
                  <Text style={styles.songTitle}>{song?.name}</Text>
                  <Text style={styles.artistText}>{song?.artist}</Text>
                  <View style={styles.songGenre}>
                    <Text style={styles.genreText}>{song?.genre}</Text>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appBar: {
    display: 'flex',
    backgroundColor: '#7944ed',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    flex: 1,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  rootAlign: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeText: {
    fontFamily: 'Poppins-Medium',
    color: '#7944ed',
  },
  scrollContainer: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  songCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  songImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  songMetaCol: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'column',
  },
  songTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  artistText: {
    fontFamily: 'Poppins-Regular',
  },
  songGenre: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  genreText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
});
export default HistoryList;
