let fs = require('fs');
let socketClient = require('socket.io-client');
let _ = require('underscore-node');
console.log('MSFTservers Raven Address Harvester!');
console.log('-------------------------');
console.log('Initiated!');
console.log('waiting for block to be solved...')
let eventToListenTo = 'raven/block';
let room = 'raven';
let socket = socketClient('https://ravencoin.network/');
socket.on('connect', function() {
  socket.emit('subscribe', room);
});
socket.on(eventToListenTo, function(data) {
    console.log('block recieved...');
    var addresses = [];
    var getVinAddys = _.pluck(data.transactions, 'vin');
    var getVoutAddys = _.pluck(data.transactions, 'vout');
    for (i = 0; i < getVinAddys.length; i++) {
      if (getVinAddys[i][0].addr) {
        vinAddy = new Object();
        vinAddy = getVinAddys[i][0].addr;
        addresses.push(vinAddy);
        // console.log(vinAddy);
      }
    }
    for (j = 0; j < getVoutAddys.length; j++) {
        voutAddy = new Object();
        voutAddy = getVoutAddys[j][0].scriptPubKey.addresses;
          if (voutAddy) {
          for (h = 0; h < voutAddy.length; h++) {
            addresses.push(voutAddy[h]);
            // console.log(voutAddy[h]);
        }
      }
    }
    var newarray = uniq_fast(addresses);
    if (newarray.length > 0) {
    var str = JSON.stringify(newarray, null);
    str = str.replace(/\"/g, '')
    .replace(/]/g, '')
    .replace(/\[/g, '')
    .replace(/,/g, '\n');
    fs.appendFile('harvested-block.txt', '\n'+ str, function(err){
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
