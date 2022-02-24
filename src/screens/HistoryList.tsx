import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {fetchSearchedTracks} from '@database/query';

const HistoryList = () => {
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
        <Text>History</Text>
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
        <View>
          <Text>Songssss</Text>
        </View>
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
});
export default HistoryList;
