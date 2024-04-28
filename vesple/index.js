const fetch = require('node-fetch');
const fs = require('fs');
const cron = require('node-cron');

const fromTimestamp = Math.round(new Date(new Date().setFullYear(new Date().getFullYear() - 2)).valueOf() / 1000);
const toTimestamp = Math.round(new Date().valueOf() / 1000);

async function fetchData(symbol, market) {

    try {
      let result;
      let data;

      result = await fetch( `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${fromTimestamp}&period2=${toTimestamp}&interval=1d&events=history&includeAdjustedClose=true`);
      data = await result.text();
      
      if ( data === '404 Not Found: No data found, symbol may be delisted' || data === 'Edge: Not Found' ) {
        throw new Error('Asset not found ', symbol);
      } else if ( data === 'Too Many Requests' ) {
        setTimeout(() => {
          console.log('retrying ', symbol);
          fetchData(symbol, market);
        }, 1000 * 60 * 60);
      } else {
        fs.writeFileSync(`../data/${market}/${symbol}.csv`, data, { encoding: 'utf8', flag: 'w' });
      }

    } catch (error) {
      fetchData(symbol, market);
    }
}


cron.schedule('0 * * * *', () => {
  console.log('At minute 0.');

  const lists = [ 'BR', 'AU', 'CA', 'CH', 'crypto', 'DE', 'forex', 'IN', 'JP', 'UK', 'US', 'HK', 'KSA' ];

  for (let market = 0; market < lists.length; market++) {
    let rawdata = fs.readFileSync('stocks_list_'+ lists[market] +'.json');
    let assets = JSON.parse(rawdata);

    console.log('Fetching ', lists[market]);

    for (let index = 0; index < assets.length; index++) {
      const symbol = assets[index].symbol;
    
      fetchData(symbol, lists[market]);

      console.log('Downloading ', symbol);
    
    }
  }
});