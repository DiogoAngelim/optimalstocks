$(document).ready(function() {

  function validate(target) {

    return $(target).closest('.splash-step').find('input, textarea, select').toArray().some((element) => {

      var text = $(target).val();
      var pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

      var emailQC = $(target).attr('type') === 'email' ? pattern.test(text) : true;

      var isValid = $(element).val().length !== 0 && emailQC;

      return isValid;
    });
  }

  function nextStep(event, target) {
    var step;

    if (event.keyCode === 13) {
      step = $('.splash-step:visible').index() + 1;
    } else {
      step = $(target).closest('.splash-step').index() + 1;
    }

    $('body').attr('data-current-step', step);
    $('.navigation-step').removeClass('current');

    $('.navigation-step').each(function(i, element) {
      if ($(element).index() < step) {
        $(element).addClass('completed').removeClass('current');
      }
    });

    if (step <= 0) {
      $('#splash-previous').hide();
    } else {
      $('#splash-previous').show();
    }

    $('.navigation-step:nth-child(' + (step + 1) + ')').addClass('current');

    $('.splash-step').hide();
    $('.splash-step:nth-child(' + (step + 1) + ')').fadeIn();
  }

  $('.splash-screen input').on('click', function() {

    if ($(this).attr('type') === 'radio') {
      $(this).closest('.splash-step').find('label').removeClass('active');
      $(this).closest('label').addClass('active');
    }

    if ($(this).attr('type') === 'checkbox') {
      $(this).parent().toggleClass('active');
    } else {}
  })

  $('.splash-screen input, .splash-screen textarea, .splash-screen select').on('keypress input keydown change click', function(event) {
    var isValid = validate(this);

    if (isValid) {
      $(this).closest('.splash-step').find('.next-step-button').removeClass('disabled');
    } else {
      $(this).closest('.splash-step').find('.next-step-button').addClass('disabled');
    }
  });

  $(document).on('keydown', function(event) {
    if (event.keyCode === 13 && !$('.splash-step:visible [data-step]').hasClass('disabled')) {
      nextStep(event, this);
    }
  });

  $(document).on('click', '.next-step-button:not(.disabled) a', function(event) {
    event.preventDefault();

    nextStep(event, this);
  });

  $('#splash-previous').on('click', function(event) {
    event.preventDefault();

    var step = Number($('body').attr('data-current-step'));

    if (step <= 1) {
      $('#splash-previous').hide();
    } else {
      $('#splash-previous').show();
    }

    $('body').attr('data-current-step', step - 1);
    $('.navigation-step').removeClass('current');

    $('.navigation-step').each(function(i, element) {
      if ($(element).index() < step) {
        $(element).removeClass('current');
      }
    });

    $('.navigation-step:eq(' + (step - 1) + ')').addClass('current');

    $('.splash-step').hide();
    $('.splash-step:eq(' + (step - 1) + ')').fadeIn();

    $('.navigation-step.current').removeClass('completed');
    $('.navigation-step.current').nextAll().removeClass('completed')

  });

  $(document).on('click', '.next-step-button.disabled a', function(event) {
    event.preventDefault();

    return false;
  });

  $('.splash-step:nth-last-child(3) .next-step-button a').on('click', function() {});

  $('.splash-step [name="First Name"]').on('keyup', function() {
    var name = $(this).val();

    $('.customer-name').text(name);
  });

  $('.investment-submit-button').on('mousedown', function(event) {
    event.preventDefault();

    localStorage.setItem('investment', JSON.stringify($(this).closest('form').serializeArray()));
  });

});