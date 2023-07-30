const bgHex = '#858AE3';
const plumHex = '#F7AEF8';
let monoFont;
let fs;
let allGreetingCards;

function preload() {
  monoFont = loadFont('assets/PressStart2P-Regular.ttf');
}

function setup() {
  colorMode(HSL, 255);
  createCanvas(250, 250);
  textSize(32);
  textFont(monoFont);
}

class ExpandingCircle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.createdAt = millis();
  }
  draw() {
    const age = millis() - this.createdAt;
    if (age > 3000) return;
    noStroke();
    colorMode(HSL, 255);
    const col = color(plumHex);
    col.setAlpha()
    col.setAlpha(255 - age*0.5)
    fill(col);
    circle(this.x, this.y, exp(age / 40));
  }
}

class DroppingCard {
  constructor({ ltr, text, dropzone }) {
    this.text = text;
    this.height = 300;
    this.width = 400;
    this.dropzone = dropzone - this.height;
    this.x = ltr ? width / 5 : width - width / 5;
    this.y = -this.height;
    this.speedX = ltr ? 2 : -2;
    this.speedY = 10;
    this.thrownAt = null;
  }
  ageInSecs() {
    if (!this.thrownAt) return 0;
    else return (millis() - this.thrownAt) / 1000;
  }
  updateLocation() {
    this.speedX
    this.y = Math.min(this.dropzone, this.y + this.speedY * this.ageInSecs() + 0.5 * 9.82 * Math.pow(this.ageInSecs(), 2));
    this.x = this.x + this.speedX * this.ageInSecs();
  }
  draw() {
    const w = this.width;
    const h = this.height;
    this.updateLocation();
    fill('#202A2555');
    noStroke();
    rect(this.x, this.y, w, h, 15);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(-0.3*this.text.length + 36);
    text(this.text, this.x + w/2, this.y + h/2);
  }
  throw() {
    if (this.thrownAt) return;
    this.thrownAt = millis();
    bassDrop();
  }
}

let started;
const bdCircles = [];
const snrCircles = [];
let bdOffset, bdHita2lzc2EyOffset, snrOffset, snrHitOffset, hatOffset, hatHitOffset, titleHitOffset, greetingHitOffset, whitenoiseCommentOffset;
let lastBd = 0;
let lastSnr = 0; 
let lastHat = 0;
let bassPlaying = false;
const greetingTitleText = 'DROP\nTHE BASS\n&\nGREETINGZ';

function draw() {
  textSize(16);
  fill(255);
  const w50 = width / 2;
  const h50 = height / 2;
  if (!started) {
    background(bgHex);
    textAlign(CENTER, CENTER);
    text('Click\nhere\nto\nstart', w50, h50);
    if (mouseIsPressed) {
      fs = fullscreen(true);
      noCursor();
      started = millis();
      comp();
    }
  } else { // showtime
    textAlign(LEFT);
    background(bgHex);
    text((millis() - started).toString(), 20, 50);
    text(measures(), 20, 80);
    textAlign(CENTER, CENTER);
    textSize(48);
    if (measures() < 4) {
      text('Graffathon 2023'.substring(0, beats.hits), w50, h50);
    } else if (measures() < 8) {
      if (!titleHitOffset) {
        titleHitOffset = beats.hits;
      }
      text('"Noice Drumz"\n\nby\n\nsape'.substring(0, beats.hits - titleHitOffset), w50, h50);
      bdOffset = beats.bd;
      bdHitOffset = beats.hits;
    } else if (measures() < 16) {
      const bdBeats = beats.bd - bdOffset;
      const currentHits = beats.hits - bdHitOffset;
      if (bdBeats > lastBd) {
        bdCircles.push(new ExpandingCircle((width / 16 * bdCircles.length), (height / 16 * bdCircles.length)));
      }
      bdCircles.forEach((c) => c.draw());
      fill(255);
      textSize(64);
      text('BASS DRUM'.substring(0, bdBeats), w50, h50/4);
      textAlign(LEFT, TOP);
      textSize(18);
      text((bdSynthCode + '\n' + bdCode + '\n' + bdLoopCode).substring(0, currentHits * 6), w50/3, h50/2);
      lastBd = bdBeats;
      snrOffset = beats.snr;
      snrHitOffset = beats.hits;
    } else if (measures() < 24) {
      const snrBeats = beats.snr - snrOffset;
      const currentHits = beats.hits - snrHitOffset;
      if (snrBeats > lastSnr) {
        snrCircles.push(new ExpandingCircle(width - (width / 32 * snrCircles.length), (height / 32 * snrCircles.length)));
      }
      snrCircles.forEach((c) => c.draw());
      fill(255);
      textSize(64);
      text('SNARE DRUM'.substring(0, snrBeats), w50, h50/4);
      if (measures() === 18 || measures() === 19) {
        if (!whitenoiseCommentOffset) whitenoiseCommentOffset = beats.hits;
        text("IT'S JUST\nWHITE NOISE", width / 10 * 7 + (beats.hits % 3) * 4, height - height / 3 + (beats.snr % 5) * 2);
        textSize(24);
        if (beats.hits - whitenoiseCommentOffset > 10) text('And you can\nhear it...', width - 200, height - 200);
      }
      textAlign(LEFT, TOP);
      textSize(18);
      const snrOscCode = `
const snrFilter = new Tone.Filter(550, 'bandpass').toDestination();
const snrOsc = new Tone.Noise({type: 'white', volume: -Infinity })
                       .connect(snrFilter).start();
`;
      text((snrOscCode + '\n' + snrCode + '\n' + snrLoopCode).substring(0, currentHits * 10), width / 10, h50/2);
      lastSnr = snrBeats;
      hatOffset = beats.hats;
      hatHitOffset = beats.hits;
    } else if (measures() < 32) {
      const hatBeats = beats.hats - hatOffset;
      const currentHits = beats.hits - hatHitOffset;
      if (hatBeats > lastHat) {
        bdCircles.push(new ExpandingCircle(width - (width / 16 * bdCircles.length), (height / 16 * bdCircles.length)));
      }
      bdCircles.forEach((c) => c.draw());
      fill(255);
      textSize(64);
      text('HI-HAT'.substring(0, hatBeats), w50, h50/4);
      textAlign(LEFT, TOP);
      textSize(18);
      const hatOscCode = `
const hatsFilter = new Tone.Filter(15000, 'bandpass').toDestination();
const hatsOsc = new Tone.Noise({type: 'white', volume: -Infinity})
                        .connect(hatsFilter).start();
`;
      text((hatOscCode + '\n' + hatCode + '\n' + hatLoopCode).substring(0, currentHits * 10), width / 10, h50/2);
      lastHat = hatBeats;
      greetingHitOffset = beats.hits;
    }
    else if (measures() < 44) {
      if (!allGreetingCards) allGreetingCards = [
        "Team\nTwo Bad",
        "Graffathon\nCrew",
        "Friends\n&\nFamily", "The guy who\ntold me one can\nmake drums just\nout of noise",
        "(these are not\nas good as\nit gets)"
      ].map((s, i) => new DroppingCard({ text: s, ltr: i % 2 === 0, dropzone: height }))
      if (!bassPlaying) {
        bassLoop.start(0);
        bassPlaying = true;
      }
      textSize(64);
      const xOffset = measures() >= 36 ? (beats.hits % 2 === 0 ? (-1) : 1) * beats.hits % beats.hats : 0;
      const yOffset = measures() >= 36 ? (beats.bd % 2 === 0 ? (-1) : 1) * beats.bd % beats.hits + millis() % 28 : 0;
      const titleChopped = greetingTitleText.substring(0, beats.hits - greetingHitOffset);
      const titleMaybeReversed = beats.hits % 13 === 0 ? titleChopped.split('').reverse().join('') : titleChopped;
      text(titleMaybeReversed, w50 + xOffset * 2, h50 + yOffset);

      // display greeting cards
      if (measures() >= 36) {
        allGreetingCards[Math.min(allGreetingCards.length - 1, measures() - 36)].throw();
        allGreetingCards.forEach((card) => card.draw());
      }
    } else if (measures() < 52) {
      const maxL = 97;
      for (let i = 20; i > 0; i--) {
        beats.hats % Math.floor(i/2) === 0 ? fill(color(`hsl(${130 - i}, 84%, ${maxL - i}%)`)) : fill(color(`hsl(${299 - i}, 84%, ${maxL - i}%)`));
        circle(w50 + (0.5 - Math.random()) * exp((measures() - 44) * 0.8), h50-i*22, (i + 1)*32);
      }
      for (let i = 20; i > 0; i--) {
        beats.hats % Math.floor(i/4) === 0 ? fill(color(`hsl(${130 - i}, 84%, ${maxL - i}%)`)) : fill(color(`hsl(${299 - i}, 84%, ${maxL - i}%)`));
        circle(w50 + (0.5 - Math.random()) * exp((measures() - 44) * 1.1), h50+i*22, (i + 1)*32);
      }
      for (let i = 20; i > 0; i--) {
        beats.hits % Math.floor(i/3) === 0 ? fill(color(plumHex)) : fill(color(`hsl(${130 - i}, 84%, ${maxL - i}%)`));
        circle(w50 + (i)*30, h50 + (beats.hits % i === 0 ? 60 : 0), (i + 1)*32);
      }
      for (let i = 20; i > 0; i--) {
        beats.hits % Math.floor(i/3) === 0 ? fill(color(plumHex)) : fill(color(`hsl(${130 - i}, 84%, ${maxL - i}%)`));
        circle(w50 - (i)*30, h50 + (beats.snr % i === 0 ? 60 : 0), (i + 1)*32);
      }
      const xOffset = (beats.hits % 2 === 0 ? (-1) : 1) * beats.hits % beats.hats;
      const yOffset = (beats.snr % 2 === 0 ? (-1) : 1) * beats.hits % beats.hats;
      const thz = beats.total % 4 === 3 ? 'kiitos' : 'THANKZ';
      const thankText = beats.hits % 8 === 0 ? thz.split('').reverse().join('') : thz;
      fill(beats.hits % 9 === 0 ? 255 : 0);
      text(thankText, w50 + xOffset * 2, h50 + yOffset);
    } else {
      // teardown
      Tone.Transport.stop();
      fullscreen(false);
      document.location.reload();
      started = null;
    }
  }
}

function windowResized() {
  if (started)
    resizeCanvas(windowWidth, windowHeight);
}
