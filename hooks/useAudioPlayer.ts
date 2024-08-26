import {useState, useRef, useEffect} from 'react';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

import {takePermissions} from '../utiles/permissions';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';

const dirs = RNFetchBlob.fs.dirs;

const audioSet = {
  AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
  AudioSourceAndroid: AudioSourceAndroidType.MIC,
  AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
  AVNumberOfChannelsKeyIOS: 2,
  AVFormatIDKeyIOS: AVEncodingOption.aac,
  OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
};

const useAudioPlayer = () => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const [fileIndex, setFileIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [recordings, setRecordings] = useState<string[]>([]);

  const [recording, setRecording] = useState({
    seconds: 0,
    time: '00:00:00',
  });

  const [playing, setPlaying] = useState({
    positionSec: 0,
    durationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
  });

  const getNewPath = () => {
    return `${dirs.DocumentDir}/audio_file_${fileIndex + 1}.m4a`;
  };

  const splitAudio = async (inputFilePath: string) => {
    // Define the FFmpeg command
    const command = `-i ${inputFilePath} -f segment -segment_time 10 -c copy ${dirs.DocumentDir}/output%03d.m4a`;

    try {
      const session = await FFmpegKit.execute(command);
      console.log('Session', session);

      const returnCode = await session.getReturnCode();
      // console.log('returnCode', returnCode);
      // return;
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('Audio split successfully:', session);
        await listOutputFiles(); // List output files after splitting
      } else {
        console.error('Error splitting audio:', session);
      }
    } catch (error) {
      console.error('FFmpeg execution error:', error);
    }
  };

  const updateRecording = async (e: {currentPosition: number}) => {
    const currentPosition = e.currentPosition;

    setRecording({
      seconds: currentPosition,
      time: audioRecorderPlayer.mmssss(Math.floor(currentPosition)),
    });
  };

  const listOutputFiles = async () => {
    try {
      // Specify the path to your folder
      const folderPath = RNFetchBlob.fs.dirs.DocumentDir;

      // Fetch files from the folder
      const files_ = await RNFetchBlob.fs
        .ls(folderPath)
        .then(fileNames => {
          return fileNames;
        })
        .catch(error => {
          console.error('Error fetching files:', error);
        });

      const outputFiles = files_.filter((file: {name: string}) => {
        return file.startsWith('output') && file.endsWith('.m4a');
      });

      setRecordings(outputFiles);
    } catch (error) {
      console.error('Error listing output files:', error);
    }
  };

  const startRecording = async () => {
    await takePermissions();
    const path = getNewPath();
    await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener(updateRecording);
  };

  const stopRecording = async () => {
    const recordedFilePath = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecording({seconds: 0, time: '00:00:00'});

    // Split the recorded audio
    await splitAudio(recordedFilePath);
  };

  const startPlaying = async () => {
    const path = recordings.length > 0 ? recordings[0] : getNewPath();
    await audioRecorderPlayer.startPlayer(path);
    await audioRecorderPlayer.setVolume(1.0);
    audioRecorderPlayer.addPlayBackListener(updatePlayback);
  };

  const stopPlaying = async () => {
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const updatePlayback = (e: {currentPosition: number; duration: number}) => {
    setPlaying({
      positionSec: e.currentPosition,
      durationSec: e.duration,
      playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
    });
  };

  const pauseRecording = async () => {
    await audioRecorderPlayer.pauseRecorder();
  };

  const resumeRecording = async () => {
    await audioRecorderPlayer.resumeRecorder();
  };

  const pausePlaying = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const resumePlaying = async () => {
    await audioRecorderPlayer.resumePlayer();
  };

  const seekTo = (touchX: number, screenWidth: number) => {
    const playWidth =
      (playing.positionSec / playing.durationSec) * (screenWidth - 56);
    const seekBy = touchX > playWidth ? 1000 : -1000;
    const newPosition = Math.round(playing.positionSec + seekBy);
    audioRecorderPlayer.seekToPlayer(newPosition);
  };

  useEffect(() => {
    audioRecorderPlayer.setSubscriptionDuration(0.1);
  }, [audioRecorderPlayer]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
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
  };
};

export default useAudioPlayer;
