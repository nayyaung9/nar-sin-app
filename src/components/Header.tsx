import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type HeaderProps = {
  title?: string;
};

const Header = ({title}: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={'#7944ed'} />
      <View style={styles.row}>
        <Text style={styles.appTitle}>
          {title || 'Shwe Music Discovery App'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('HistoryList')}>
          <Icon name="playlist-music-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Header;
