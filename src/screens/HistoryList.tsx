import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

const HistoryList = () => {
  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={'#7944ed'} />
      <View style={styles.appBar}>
        <Text>History</Text>
        <Text style={styles.appTitle}>History</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
});
export default HistoryList;
