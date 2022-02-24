import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';

type HeaderProps = {
  title?: string;
};
const Header = ({title}: HeaderProps) => {
  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={'#7944ed'} />
      <Text style={styles.appTitle}>{title || 'Shwe Music Discovery App'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#7944ed',
    padding: 16,
  },
  appTitle: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
});

export default Header;