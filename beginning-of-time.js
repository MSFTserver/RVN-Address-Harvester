let fs = require('fs');
let needle = require('needle');
let _ = require('underscore-node');
console.log('MSFTservers Raven Address Harvester!');
console.log('-------------------------');
console.log('Initiated!\nthis may take a whole hell of a long time indexing all blocks in chain and gatthering addresses!');
needle.get(
  'https://ravencoin.network/api/status',
  function(error, response) {
    if (response.statusCode !== 200) {
      msg.channel.send(
        getError(response.statusCode)
      );
    } else {
      var end = response.body.info.blocks;
      var start = 0;
      for (i = 1; i < end; i++) {
        setTimeout(function timer(){
          start++
          if (start < 10000) {
            console.log('Block: ' + start);
          } else {
            console.log('Block: ' + start + ' (my Lord!)');
          }
          getAddy(start);
        }, i*500)
      }
    }
  }
);
function getAddy(height){
  needle.get(
    'https://ravencoin.network/api/txs?block=' + height,
    function(error, response) {
      if (response.statusCode !== 200) {
        msg.channel.send(
          getError(response.statusCode)
        );
      } else {
        var txArray = response.body.txs;
        //console.log(txArray)
        var addresses = [];
        var getVinAddys = _.pluck(txArray, 'vin');
        var getVoutAddys = _.pluck(txArray, 'vout');
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
        fs.appendFile('beginning-of-time.txt', '\n'+ str, function(err){
          if(err) {
            console.log(err)
          } else {
            //console.log('KAWWWWW, ' + newarray.length + ' addresses saved to file!');
          }
        });
      }
      }
    }
  );
}
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
