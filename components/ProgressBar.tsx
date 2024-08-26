import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from '../style';

interface ProgressBarProps {
  onStatusPress: (e: React.TouchEvent) => void;
  playWidth: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  onStatusPress,
  playWidth,
}) => (
  <TouchableOpacity style={styles.viewBarWrapper} onPress={onStatusPress}>
    <View style={styles.viewBar}>
      <View style={[styles.viewBarPlay, {width: playWidth}]} />
    </View>
  </TouchableOpacity>
);

export default ProgressBar;
