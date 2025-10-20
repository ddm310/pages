$(document).ready(function () {
  if ($(window).width() > 768) {
    $('body').append('<div class="upbtn"></div>');

    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $('.upbtn').css({
          right: '-120px',
          bottom: '-120px'
        });
      } else {
        $('.upbtn').css({
          right: '-220px',
          bottom: '-220px'
        });
      }
    });

    $('.upbtn').on('click', function () {
      $('html, body').animate({
        scrollTop: 0
      }, 500);
      return false;
    });
  }
});
