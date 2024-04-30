const fetch = require('node-fetch');
const fs = require('fs');
const cron = require('node-cron');
const { IncomingWebhook } = require('@slack/webhook');

const url = 'https://hooks.slack.com/services/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'
const webhook = new IncomingWebhook(url);


var count = 0;

cron.schedule('13 */2 * * *', () => {
  console.log('Cron: At minute 0 past every 2nd hour.');

  const lists = [ 'BR', 'AU', 'CA', 'CH', 'crypto', 'DE', 'forex', 'IN', 'JP', 'UK', 'US', 'HK', 'KSA' ];

  for (let market = 0; market < lists.length; market++) {
    let rawdata = fs.readFileSync('stocks_list_'+ lists[market] +'.json');
    let assets = JSON.parse(rawdata);

    console.log('Fetching ', lists[market]);

    for (let index = 0; index < assets.length; index++) {
      const symbol = assets[index].symbol;
    
      if (count < 2000) {
        fetchData(symbol, lists[market]);
        console.log('Downloading ', symbol);

        count++;
      } else {
        setTimeout(function () {
          count = 0;
        }, 1000 * 60 * 60 * 60 );
      }

    
    }
  }
});

async function fetchData(symbol, market) {
    const fromTimestamp = Math.round(new Date(new Date().setFullYear(new Date().getFullYear() - 2)).valueOf() / 1000);
    const toTimestamp = Math.round(new Date().valueOf() / 1000);
    
    try {
      let result;
      let data;

      result = await fetch( `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${fromTimestamp}&period2=${toTimestamp}&interval=1d&events=history&includeAdjustedClose=true`);
      data = await result.text();
      
      if ( data === '404 Not Found: No data found, symbol may be delisted' || data === 'Edge: Not Found') {
        throw { 
          code: 404, 
          message: `${symbol} Not Found`
        };
      } else if ( data === 'Too Many Requests') {
        throw {
          code: 429,
          message: `Too Many Requests (${count})`
        };
      } else {
        fs.writeFileSync(`../data/${market}/${symbol}.csv`, data, { encoding: 'utf8', flag: 'w' });
      }

    } catch (error) {
      webhook.send({
        text: 'There was an error fetching the data: ' + error.message + ' ('+ error.code +')',
      });
    }
}