import Recorder from 'js-audio-recorder';
import { state } from '../store';

// == 初始化 ==
const recorder = new Recorder({
	sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
	sampleRate: 48000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
	numChannels: 1,
});

// == 开始录音 ==
const startRecorder = async () => {
	try {
		await recorder.start();
	} catch (error) {
		if (error) {
			console.log(error);
			return;
		}
	}
};
// == 转换 ==
const checkBuffer = (audioSource: ArrayBuffer) => {
	state().IsStartAudio = true;
	const audioContext = new AudioContext();
	const Source = audioContext.createBufferSource();
	audioContext.decodeAudioData(audioSource, (buffer) => {
		Source.buffer = buffer;
		Source.connect(audioContext.destination);
		Source.start();
		// 播放状态
		Source.addEventListener('ended', () => {
			// 播放完毕,就设置为未播放状态
			state().IsStartAudio = false;
		});
	});
};

export { startRecorder, checkBuffer, recorder };
