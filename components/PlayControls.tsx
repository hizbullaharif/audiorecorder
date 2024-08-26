import React from 'react';
import {View, Text} from 'react-native';
import Button from './Button';
import styles from '../style';

interface PlayControlsProps {
  onStartPlay: () => void;
  onPausePlay: () => void;
  onResumePlay: () => void;
  onStopPlay: () => void;
  playTime: string;
  duration: string;
}

const PlayControls: React.FC<PlayControlsProps> = ({
  onStartPlay,
  onPausePlay,
  onResumePlay,
  onStopPlay,
  playTime,
  duration,
}) => (
  <View style={styles.viewPlayer}>
    <Text style={styles.txtCounter}>
      {playTime} / {duration}
    </Text>
    <View style={styles.playBtnWrapper}>
      <Button style={styles.btn} onPress={onStartPlay} textStyle={styles.txt}>
        Play
      </Button>
      <Button
        style={[styles.btn, {marginLeft: 12}]}
        onPress={onPausePlay}
        textStyle={styles.txt}>
        Pause
      </Button>
      <Button
        style={[styles.btn, {marginLeft: 12}]}
        onPress={onResumePlay}
        textStyle={styles.txt}>
        Resume
      </Button>
      <Button
        style={[styles.btn, {marginLeft: 12}]}
        onPress={onStopPlay}
        textStyle={styles.txt}>
        Stop
      </Button>
    </View>
  </View>
);

export default PlayControls;
