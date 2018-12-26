const Plugin = require('./lib/plugin');
const player = require('play-sound')({});

const plugin = new Plugin();


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
  player.play('/home/sadm/git/test/public/1.wav', (err) => console.log(err));
});
