$(document).ready(() => {
  
  function getFormattedPrice(data) {
    return Number(data).toFixed(2).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "currency",
      currency: "USD"
    });
  }

  function removeAsset(symbol) {
    var assetsList = JSON.parse(localStorage.getItem('assets'));

    assetsList = assets.filter((item) => {
      return item.symbol !== symbol;
    });

    assetsList = JSON.stringify(assetsList);
    localStorage.setItem('assets', assetsList);
  }
  
  async function addAsset(asset) {

    var { name, symbol, quantity, closePrices, dailyChange } = asset;

    name = name.toLowerCase();
    const chartId = symbol.replace('.SA', '');
    quantity = quantity ? quantity : 0;
  
    // TODO: calculate the minimum number of rows of all assets
    // data = data.split('\n').slice(-225);
  
    var openPrice = Math.round(closePrices[closePrices.length-2]);
    var closePrice = Math.round(closePrices[closePrices.length-1]);
    var change = closePrice - openPrice;
    
    change = getFormattedPrice(change);
    
    var variation = Math.round(dailyChange[dailyChange.length-1]);

    var signal = openPrice > closePrice ? '' : '+';
    var color = signal === '+' ? '#37c171' : '#ed0123';
    
    closePrice = '$' + getFormattedPrice(closePrice);
    openPrice = '$' + getFormattedPrice(openPrice);
    change = `${signal}${change} (${variation}%)`;
  
    var $asset = $(`#chart-${chartId}`);
  
    if ( $asset.length <= 0 ) {
      $('.assets-wrapper .grid').append(`
        <div>
          <div tabindex="1" id="chart-${chartId}" class="flex flex-col justify-between h-[240rem] w-[275rem] border-solid border-b-pale-grey-two border-[1px] rounded-[16rem] bg-white pt-[20rem] pl-[24rem] pr-[12rem] pb-[16rem]">
            <div>
              <svg height="14" viewBox="0 0 14 14" width="14" ><g fill="none" fill-rule="evenodd"><path d="m-5-5h24v24h-24z"/><path d="m13.3.71a.996.996 0 0 0 -1.41 0l-4.89 4.88-4.89-4.89a.996.996 0 1 0 -1.41 1.41l4.89 4.89-4.89 4.89a.996.996 0 1 0 1.41 1.41l4.89-4.89 4.89 4.89a.996.996 0 1 0 1.41-1.41l-4.89-4.89 4.89-4.89c.38-.38.38-1.02 0-1.4z" fill="#b8c4ce"/></g></svg>
              <div class="text-style-12 uppercase mb-[6rem]">${chartId}</div>
              <div class="text-custom-sm text-bluey-grey-three capitalize">${name}</div>
            </div>
            <div class="flex justify-between items-end">
              <div class="text-style-15 uppercase">1 year view</div>
              <div class="text-right">
                <div class="text-style-23">${closePrice}</div>
                <div class="text-custom-sm text-[${color}]">${change}</div>
              </div>
            </div>
          </div>
          <div class="add-asset">
            <input name="${symbol}"  data-quantity="${quantity}" value="${quantity}" data-value="${name}" class="text-style-20 bg-transparent text-center w-[112rem] text-black -top-[5rem] z-1 absolute left-[65rem] h-[50rem] flex items-center cursor-pointer h-[34rem]" placeholder="0" type="number"/>
            <span class="text-style-15 top-[30rem] z-1 absolute left-[50%] -translate-x-[50%] h-[0] flex items-center cursor-pointer justify-center">ADD THE QUANTITY</span>
          </div>
        </div>
    `);

      $('.add-asset input').trigger('change');
    } else {
      $asset.trigger('focus');
    }
    
    if ($('.assets-wrapper .grid > div').length >= 2) {
      $('.tab__investment').addClass('available');
    }
    
    data = asset.closePrices.map((price, index) => {
      var series = {};
      series.x = index;
      series.y = index === 0 ? 0 : Number(price);
  
      return series;
    });

    const element = document.querySelector(`#chart-${chartId}`);
    
    if (element) {
      const graph = new Rickshaw.Graph({
        element,
        renderer: 'area',
        interpolation: 'basis',
        width: 240,
        height: 275,
        series: [{
          color: 'url(#diagonal-stripe-1)',
          className: 'chart2-current',
          name: 'Portfolio atual',
          data,
        }]
      });
      graph.render();
    }
  }

  assets = localStorage.getItem('assets');

  assets = JSON.parse(assets);  

  if (assets && assets.length) {
    assets.map((asset) => {

      addAsset(asset);
  
      return asset;
    })
  }

  if (assets && assets.length > 1) {
    $('.tab.available').next().addClass('available');
  }

  $(document).on('click', '.add-asset span', function() {
    $(this).text('SHARES').css({ 'top': '43rem', 'z-index': 10 });
    $(this).prev().css('opacity', 1).trigger('focus');
  });


  $(document).on('change', '.add-asset input', function() {
    let quantity = $(this).val();
    let name = $(this).attr('name');

    $(this).attr('data-quantity', quantity);

    let assets = localStorage.getItem('assets');

    assets = assets && typeof JSON.parse(assets) === 'object' ? JSON.parse(assets).map((item) => {
      if (item.symbol === name) {
        item.quantity = Number(quantity);
      }

      return item;
    }) : null;

    assets = JSON.stringify(assets);

    localStorage.setItem('assets', assets);

    $(this).next().text('SHARES').css({ 'top': '43rem', 'z-index': 10 });
    $(this).css('opacity', 1);

    if ( $(this).val() == 1 ) {
      $(this).next().text('SHARE');
    } else {
      $(this).next().text('SHARES');
    }
  });

  $(document).on('click', '[id*="chart"] > div svg', function() {
    $(this).parent().parent().parent().remove();

    const symbol = $(this).parent().parent().next().find('input').attr('name');

    removeAsset(symbol);
    
  });

  var country = localStorage.getItem('investment') ? JSON.parse(localStorage.getItem('investment')).filter((input) => {
    return input.name === 'country';
})[0].value : null;

  var assetsSugestions = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace('name', 'symbol', 'market'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: 'https://177.205.193.143:8888/vesple/optimalstocks/vesple/optimalstocks/stocks_suggestion.php?country='+country+'&search=%QUERY',
      wildcard: '%QUERY',
    }
  });
  
  assetsSugestions.initialize();
  
  $('.typeahead').typeahead(null, {
    name: 'name',
    display: 'name',
    source: assetsSugestions.ttAdapter(),
    limit: 5,
    templates: {
      suggestion: function(object) {
        var image = object.image ? `<img src="${object.image}" />` : '';

        return `
        <div data-symbol="${object.symbol}" class="hover:bg-cornflower-blue px-[24rem] py-[10rem] flex items-center justify-between">
          <div class="flex items-center">
            <div class="mr-[20rem]">
              ${image}
            </div>
            <div class="w-[119rem] text-custom-lg font-semibold text-dark uppercase">${object.symbol}</div>
            <div class="text-custom-lg text-dark">${object.name}</div>
          </div>
          <div class="flex items-center justify-right text-right">
            <div class="text-custom-lg text-dark uppercase">${object.market}</div>
          </div>
        </div>
              `
      }
    }
  });

  $('.typeahead').on('typeahead:render', function() {
    $('.input-wrapper > div > svg path').addClass('fill-denim-blue');
  });

  $('.typeahead').on('typeahead:close', function() {
    $('.input-wrapper > div > svg path').removeClass('fill-denim-blue');
  });

  $('.typeahead').on('typeahead:select', async function(event, suggestion) {
    $('.typeahead').typeahead('val', '');

    let assets = JSON.parse(localStorage.getItem('assets'));

    if (assets && assets.length > 0 && assets.filter((asset) => {
      return asset.symbol === suggestion.symbol;
    }).length === 0) {
      assets.push(suggestion);
    } else {
      assets = [suggestion];
    }

    addAsset(suggestion);

    if (assets.length > 1) {
      $('.tab.available').next().addClass('available');
    }

    localStorage.setItem('assets', JSON.stringify(assets));
  });
});