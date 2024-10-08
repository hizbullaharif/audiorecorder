// Page.tsx
import React, {useRef} from 'react';
import {Dimensions, FlatList, SafeAreaView, Text, View} from 'react-native';
import ProgressBar from './components/ProgressBar';
import RecordControls from './components/RecordControl';
import PlayControls from './components/PlayControls';
import AudioStatus from './components/AudioStatus';
import styles from './style';
import useAudioPlayer from './hooks/useAudioPlayer';

const screenWidth = Dimensions.get('screen').width;

const Page: React.FC = () => {
  const {
    recording,
    playing,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    startPlaying,
    stopPlaying,
    pausePlaying,
    resumePlaying,
    seekTo,
    recordings,
  } = useAudioPlayer();

  const handleStatusPress = (e: React.TouchEvent) => {
    const touchX = e.nativeEvent.locationX;
    seekTo(touchX, screenWidth);
  };

  const playWidth =
    (playing.positionSec / playing.durationSec) * (screenWidth - 56) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <AudioStatus recordTime={recording.time} />
      <RecordControls
        onStartRecord={startRecording}
        onPauseRecord={pauseRecording}
        onResumeRecord={resumeRecording}
        onStopRecord={stopRecording}
      />
      <ProgressBar onStatusPress={handleStatusPress} playWidth={playWidth} />
      <PlayControls
        onStartPlay={startPlaying}
        onPausePlay={pausePlaying}
        onResumePlay={resumePlaying}
        onStopPlay={stopPlaying}
        playTime={playing.playTime}
        duration={playing.duration}
      />

      {console.log('recordings', recordings)}

      <View
        style={{
          backgroundColor: 'white',
        }}>
        <FlatList
          data={recordings}
          renderItem={({item}) => <Text>{item}</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

export default Page;
