const crypto = require('crypto');
const fs = require('fs');

const player = require('play-sound')({ });
const yandex_speech = require('yandex-speech');

const Plugin = require('./lib/plugin');


const plugin = new Plugin();

const plugin_path = __dirname;

function clearCache(callback) {
  fs.readdir(`${plugin_path}/cache`, (err, files) => {
    files.forEach(i => {
      const stats = fs.statSync(`${plugin_path}/cache/${i}`)
      if (i !== 'test.wav' && stats.isFile()) {
        fs.unlinkSync(`${plugin_path}/cache/${i}`)
      }
    });
  });
  callback();
}

function checkCache(path, size = 5, callback) {
  fs.readdir(path, (err, files) => {
    let total = 0;
    let temp = [];
    files.forEach(i => {
      const stats = fs.statSync(`${path}/${i}`)
      if (i !== 'test.wav' && stats.isFile()) {
        total = total + stats.size;
        temp.push({ path: `${path}/${i}`, size: stats.size / 1024 / 1024 });
      }
    });
    const stotal = total / 1024 / 1024;
    if (stotal > size) {
      const rlist = [];
      let x = 0;
      temp.forEach(i => {
        if ((stotal - x) > (size / 2)) {
          x = x + i.size
          rlist.push(i.path);
        }
      });
       rlist.forEach(i => fs.unlinkSync(i));
    }
    callback();
  })
}

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

function say(text) {
  const hash = crypto.createHash('md5').update(text).digest("hex");
  const path = `${plugin_path}/cache/${hash}.wav`;

  fs.exists(path, exists => {
    if (exists) {
      player.play(path);
    } else {
      const settings = plugin.getSettings();
      checkCache(`${plugin_path}/cache`, settings.cache_size, () => yandex_tts(hash, text));
    }
  });
}

plugin.on('info', (data) => {
  say(data.txt)
})

plugin.on('toolbar_command', (command) => {
  switch (command.type) {
    case 'TEST_SAY':
      player.play(`${plugin_path}/cache/test.wav`, command.done);
      break;
    case 'CLEAR_CAHCE':
      clearCache(command.done);
      break;
    default:
      break;
  }
})

plugin.on('start', () => {
});
