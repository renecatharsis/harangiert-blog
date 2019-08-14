(function() {
    "use strict";

    let toggle = document.getElementsByClassName('navbar-toggler')[0];
    let collapse = document.getElementsByClassName('navbar-collapse')[0];

    toggle.addEventListener('click', toggleMenu, false);

    function toggleMenu() {
        collapse.classList.toggle('collapse');
        collapse.classList.toggle('in');
    }
})();