const fetch = require('node-fetch');
const fs = require('fs');
const cron = require('node-cron');

const lists = [ 'br', 'crypro', 'forex', 'US', 'ETF' ];
const fromTimestamp = Math.round(new Date(new Date().setFullYear(new Date().getFullYear() - 2)).valueOf() / 1000);
const toTimestamp = Math.round(new Date().valueOf() / 1000);

async function fetchData(symbol, market) {

    try {
      let result;
      let data;

      result = await fetch( `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${fromTimestamp}&period2=${toTimestamp}&interval=1d&events=history&includeAdjustedClose=true`);
      data = await result.text(); 

      fs.writeFileSync(`../data/${market}/${symbol}.csv`, data, { encoding: 'utf8', flag: 'w' });
    } catch (error) {
      console.log('retrying ', symbol);
      var path = `../data/${market}/${symbol}.csv`;
      var stat = fs.statSync(path);

      if ( stat && stat.size < 1000 ) {
        fetchData(symbol, market);
      } 
    }
}


cron.schedule('0 22 * * 1-5', () => {
  console.log('At 22:00 on every day-of-week from Monday through Friday.');

  for (let index = 0; index < lists.length; index++) {
    let rawdata = fs.readFileSync('stocks_list_'+ lists[index] +'.json');
    let assets = JSON.parse(rawdata);

    for (let index = 0; index < assets.length; index++) {
      const symbol = assets[index].symbol;
    
      fetchData(symbol, lists[index]);
    
    }
  }
});