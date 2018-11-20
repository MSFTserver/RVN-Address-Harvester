let fs = require('fs');
let socketClient = require('socket.io-client');
console.log('MSFTservers Raven Address Harvester!');
console.log('-------------------------');
console.log('Initiated!');
let eventToListenTo = 'raven/tx';
let room = 'raven';
let socket = socketClient('https://ravencoin.network/');
socket.on('connect', function() {
  socket.emit('subscribe', room);
});
socket.on(eventToListenTo, function(data) {
  if (!data.isRBF) {
    console.log('tx recieved...')
    var vinAddresses = [];
    var voutAddresses = [];
    var vin = data.vin;
    var vout = data.vout;
    for (i = 0; i < vin.length; i++) {
      vinAddy = new Object();
      vinAddy = vin[i].address;
      vinAddresses.push(vinAddy);
      // console.log(vinAddy);
    }
    for (l = 0; l < vout.length; l++) {
      voutAddy = new Object();
      voutAddy = vout[l].address;
      voutAddresses.push(voutAddy);
      // console.log(voutAddy);
    }
    var array = vinAddresses.concat(voutAddresses);
    var newarray = uniq_fast(array);
    var str = JSON.stringify(newarray, null);
    str = str.replace(/\"/g, '')
    .replace(/]/g, '')
    .replace(/\[/g, '')
    .replace(/,/g, '\n');
    fs.appendFile('harvested.txt', '\n'+ str, function(err){
    if(err) {
        console.log(err)
    } else {
        console.log('KAWWWWW, ' + newarray.length + ' addresses saved to file!');
    }
});
  }
})
function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}
