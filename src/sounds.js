const BPM = 174;
const beats = {
  total: 0,
  hits: 0,
  bd: 0,
  snr: 0,
  hats: 0,
}

const measures = () => Math.floor((beats.total - 1) / 4);

const bdSynthCodeB = `new Tone.MembraneSynth().toDestination();`;
const bdSynthCode = 'const bdSynth = ' + bdSynthCodeB; 
const bdSynth = eval(bdSynthCodeB);

const snrFilter = new Tone.Filter(550, 'bandpass').toDestination();
const snrOsc = new Tone.Noise({type: 'white', volume: -Infinity }).connect(snrFilter).start();

const hatsFilter = new Tone.Filter(15000, 'bandpass').toDestination();
const hatsOsc = new Tone.Noise({type: 'white', volume: -Infinity}).connect(hatsFilter).start();

const bdCode = `
function bd() {
  beats.bd++;
  beats.hits++;
  bdSynth.triggerAttack(10);
  bdSynth.triggerRelease('+0.3');
}`

const snrCode = `
function snr(beat) {
  beats.snr++;
  beats.hits++;
  snrOsc.volume.value = [7, 9].includes(beat) ? -5 - beat : -9
  Tone.Transport.scheduleOnce(() => {
    snrOsc.volume.rampTo(-Infinity, 0.015);
  }, "+0.005");
}`

const hatCode = `
function hats() {
  beats.hats++;
  beats.hits++;
  hatsOsc.volume.value = -12;
  hatsOsc.volume.rampTo(-Infinity, 0.12);
}`

eval(bdCode);
eval(snrCode);
eval(hatCode);

const bdLoopCode = `
const bdLoop = new Tone.Loop((time) => {
  const beat = Math.floor(time / 60 * BPM * 4) % 16;
  if (beat == 0 || beat == 10) bd();
}, '16n').start(0);`

const snrLoopCode = `
const snrLoop = new Tone.Loop((time) => {
  const beat = Math.floor(time / 60 * BPM * 4) % 16;
  if ([4, 7, 9, 12, 15].includes(beat)) snr(beat);
}, '16n').start(0);`

const hatLoopCode = `
const hatLoop = new Tone.Loop((time) => {
  const beat = Math.floor(time / 60 * BPM * 4) % 16;
  if ([2, 6, 8, 14].includes(beat)) hats();
}, '16n').start(0);`

function comp() {
  eval(bdLoopCode);
  eval(snrLoopCode);
  eval(hatLoopCode);
  const counterLoop = new Tone.Loop((time) => {
    beats.total++;
  }, '4n').start(0);
  Tone.Transport.bpm.value = BPM;
  Tone.start();
  Tone.Transport.start();
}

const bassSynth = new Tone.AMSynth().toDestination();
bassSynth.volume.value = 9;
playBassNote = ({ note, time }) => {
  // bassSynth.triggerAttack(note, '+0.1', 1);
  // bassSynth.triggerRelease(time == '4n' ? '+0.34' : '+0.25');
  bassSynth.triggerAttackRelease(note, time);
}
const bassLoop = new Tone.Loop((time) => {
  const beat = Math.floor(time / 60 * BPM * 4) % 128;
  if (beat == 4 || beat == 10) {
    playBassNote({ note: 'A#0', time: '4n' });
  } else if (beat == 16 || beat == 22 || beat == 28) {
    playBassNote({ note: 'A0', time: '4n' });
  } else if (beat == 36 || beat == 42) {
    playBassNote({ note: 'Ab0', time: '4n' });
  } else if (beat == 48 || beat == 54 || beat == 60) {
    playBassNote({ note: 'D0', time: '4n' });
  } else if (beat == 64 || beat == 68 || beat == 96 || beat == 100) {
    playBassNote({ note: 'D#0', time: '8n' });
  } else if (beat == 120) {
    playBassNote({ note: 'F#0', time: '8n' });
  } else if (beat == 124) {
    playBassNote({ note: 'G#0', time: '8n' });
  }
}, '16n');

const bassDropSynth = new Tone.Oscillator(80, 'sine').toDestination();
const bassDrop = () => {
  const duration = 1.3;
  bassDropSynth.frequency.value = 130;
  bassDropSynth.start();
  bassDropSynth.frequency.exponentialRampTo(50, duration);
  bassDropSynth.volume.exponentialRampTo(0, duration);
  Tone.Transport.scheduleOnce((time) => {
    bassDropSynth.stop(time);
  }, `+${duration}`);
};
