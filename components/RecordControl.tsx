import React from 'react';
import {View} from 'react-native';
import Button from './Button';
import styles from '../style';

interface RecordControlsProps {
  onStartRecord: () => void;
  onPauseRecord: () => void;
  onResumeRecord: () => void;
  onStopRecord: () => void;
}

const RecordControls: React.FC<RecordControlsProps> = ({
  onStartRecord,
  onPauseRecord,
  onResumeRecord,
  onStopRecord,
}) => (
  <View style={styles.viewRecorder}>
    <View style={styles.recordBtnWrapper}>
      <Button style={styles.btn} onPress={onStartRecord} textStyle={styles.txt}>
        Record
      </Button>
      <Button
        style={[styles.btn, {marginLeft: 12}]}
        onPress={onPauseRecord}
        textStyle={styles.txt}>
        Pause
      </Button>
      <Button
        style={[styles.btn, {marginLeft: 12}]}
        onPress={onResumeRecord}
        textStyle={styles.txt}>
        Resume
      </Button>
      <Button
        style={[styles.btn, {marginLeft: 12}]}
        onPress={onStopRecord}
        textStyle={styles.txt}>
        Stop
      </Button>
    </View>
  </View>
);

export default RecordControls;
