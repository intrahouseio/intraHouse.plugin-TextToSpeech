const crypto = require('crypto');
const fs = require('fs');

const player = require('play-sound')({});
const yandex_speech = require('yandex-speech');

const Plugin = require('./lib/plugin');


const plugin = new Plugin();


function yandex_tts(hash, text) {
  yandex_speech.TTS({
    text,
    developer_key: '069b6659-984b-4c5f-880e-aaedcfd84102',
    file: `./cache/${hash}.wav`,
    format: 'wav',
    emotions: 'neutral',
  }, () => player.play(`./cache/${hash}.wav`));
}

function say() {
  const text = 'Привет, мир!';
  const hash = crypto.createHash('md5').update(text).digest("hex");
  const path = `./cache/${hash}.wav`;

  fs.exists(path, exists => {
    if (exists) {
      player.play(path)
    } else {
      yandex_tts(hash, text);
    }
  });
}

plugin.on('device_action', (device) => {
    plugin.debug("incomming action: " + device.id + " / " + device.command);
})

plugin.on('toolbar_command', (command) => {
  switch (command.type) {
    case 'test':
      break;
    default:
      break;
  }
})

plugin.on('start', () => {
  say();
});
