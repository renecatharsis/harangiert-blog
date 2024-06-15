(function() {
  "use strict";

  // Show the navbar when the page is scrolled up
  let MQL = 992;

  //primary navigation slide-in effect
  if (document.documentElement.clientWidth > MQL) {
    let previousTop = 0;
    let mainNavStyles = getComputedStyle(document.getElementById('mainNav'));
    let headerHeight = parseInt(mainNavStyles.height.replace('px', ''))
        - parseInt(mainNavStyles.paddingTop.replace('px', ''))
        - parseInt(mainNavStyles.paddingBottom.replace('px', ''))
        - parseInt(mainNavStyles.borderBottomWidth.replace('px', ''));

    window.addEventListener('scroll', function() {
          let currentTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
          let mainNav = document.getElementById('mainNav');
          //check if user is scrolling up
          if (currentTop < previousTop) {
            //if scrolling up...
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
              mainNav.classList.add('is-visible');
            } else {
              mainNav.classList.remove('is-visible');
              mainNav.classList.remove('is-fixed');
            }
          } else if (currentTop > previousTop) {
            //if scrolling down...
            mainNav.classList.remove('is-visible');
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
              mainNav.classList.add('is-fixed');
            }
          }

          previousTop = currentTop;
        }, {passive: true});
  }
})();
