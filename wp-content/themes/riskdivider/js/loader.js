const { ipcRenderer, remote } = require('electron');


if (ipcRenderer) {
  ipcRenderer.on('assets', (event, data) => {
    localStorage.setItem('assets', data);
  });

  ipcRenderer.on('investment', (event, data) => {
    localStorage.setItem('investment', data);
  });
}

$(document).ready(function() {

  $(document).on('click', '.steps-close-button, .tab', function(event) {
    event.preventDefault();

    if (!localStorage.assets) {
      return false;
    }
    
  });

  var options = {
      prefetch: true,
      cacheLength: 2,
      allowFormCaching: false,
      onBefore: function($currentTarget, $container) {},
      onStart: {
        duration: 250,
        render: function($container) {
          $container.addClass('is-exiting');
          smoothState.restartCSSAnimations();
        }
      },
      onReady: {
        duration: 0,
        render: function($container, $newContent) {
          $container.removeClass('is-exiting');
          $container.html($newContent);
          
          var isWizard =  window.location.pathname.split('/')[window.location.pathname.split('/').length-2].indexOf('new') <= 0;
          
          if (isWizard) {
            $('body').addClass( 'bg-pale-grey' ).removeClass( 'bg-gradient-to-br from-dark-slate-blue to-denim-blue to-[106%] bg-no-repeat' );

            $(document).on('click', '.next-page', function(event) {
              event.preventDefault();
              
              $('.tab.available').last().trigger('click');
            });

          } else {
            $('body').removeClass( 'bg-pale-grey' ).addClass( 'bg-gradient-to-br from-dark-slate-blue to-denim-blue to-[106%] bg-no-repeat' );
          }
        }
      },
      onAfter: function($container, $newContent) {
        var numScripts = 0;

        $('script', $newContent).each(function() {
          var script = this;
          
          if (script.src) {
            numScripts++;
            script.onload = function() {
              numScripts--;
              if (0 === numScripts) onReady();
            };
          }
        });
        if (0 === numScripts) onReady();
      }
    }

    smoothState = $('#main').smoothState(options).data('smoothState');
});

(function($) {
  "use strict";
  /** create mod exec controller */
  $.readyFn = {
    list: [],
    register: function(fn) {
      $.readyFn.list.push(fn);
    },
    execute: function(el) {
      el = el || document;
      for (var i = 0; i < $.readyFn.list.length; i++) {
        try {
          $.readyFn.list[i].call(el, $);
        } catch (e) {
          throw e;
        }
      };
    },
    clear: function() {
      $.readyFn.list.length = 0;
    }
  };
  /** run all functions */
  /*$(document).ready(function(){
      $.readyFn.execute();
  });*/
  /** register function */
  $.fn.jqReady = $.fn.ready;
  $.fn.ready = function(fn) {
    $.readyFn.register(fn);
    return this; // this is needed for .ready to work as expected in some cases
  };
  /** run all functions */
  $(document).jqReady(function() {
    $.readyFn.execute(this);
    $.readyFn.clear();
  });
})(jQuery);

function onReady(fn) {
  setTimeout(function() {
    // trigger ready listeners, if any
    // using jquery ready method as mod exec
    $.readyFn.execute();
    $.readyFn.clear();
    if (fn) fn();
  }, 20);
}