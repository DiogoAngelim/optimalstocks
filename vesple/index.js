const fetch = require('node-fetch');
const fs = require('fs');
const cron = require('node-cron');


let rawdata = fs.readFileSync('stocks_list_BR.json');
let assets = JSON.parse(rawdata);

async function fetchData(symbol) {

    try {
      let result;
      let data;

      result = await fetch( `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=1657465580&period2=1696901586&interval=1d&events=history&includeAdjustedClose=true`);
      data = await result.text(); 

      fs.writeFileSync(`../data/${symbol}.csv`, data, { encoding: 'utf8', flag: 'w' });
    } catch (error) {
      console.log('retrying ', symbol);
      var path = `../data/${symbol}.csv`;
      var stat = fs.statSync(path);

      if ( stat && stat.size < 1000 ) {
        fetchData(symbol);
      } 
    }
}


cron.schedule('0 22 * * 1-5', () => {
  console.log('At 22:00 on every day-of-week from Monday through Friday.');

  for (let index = 0; index < assets.length; index++) {
    const symbol = assets[index].symbol;
  
    fetchData(symbol);
  
  }
});