import React from 'react';
import {Text, View} from 'react-native';

import styles from '../style';

interface AudioStatusProps {
  recordTime: string;
}

const AudioStatus: React.FC<AudioStatusProps> = ({recordTime}) => (
  <View>
    <Text style={styles.txtRecordCounter}>{recordTime}</Text>
  </View>
);

export default AudioStatus;
