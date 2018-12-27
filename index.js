const crypto = require('crypto');
const fs = require('fs');

const player = require('play-sound')({});
const yandex_speech = require('yandex-speech');

const Plugin = require('./lib/plugin');


const plugin = new Plugin();

const plugin_path = __dirname;


function yandex_tts(hash, text, callback) {
  const settings = plugin.getSettings();
  yandex_speech.TTS({
    text,
    developer_key: settings.yandex_token || '069b6659-984b-4c5f-880e-aaedcfd84102',
    file: `${plugin_path}/cache/${hash}.wav`,
    format: 'wav',
    emotions: settings.yandex_emotion,
    speaker: settings.yandex_speaker,
    lang: settings.yandex_lng,
  }, () => player.play(`${plugin_path}/cache/${hash}.wav`, callback));
}

function say() {
  const text = 'Привет, мир!';
  const hash = crypto.createHash('md5').update(text).digest("hex");
  const path = `${plugin_path}/cache/${hash}.wav`;

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
    case 'TEST_SAY':
      yandex_tts('test', 'Интра Хаус', command.done);
      break;
    default:
      break;
  }
})

plugin.on('start', () => {
});
