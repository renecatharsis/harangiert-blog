(function() {
    "use strict";

    let cookieAlert = document.querySelector(".cookiealert");
    let acceptCookies = document.querySelectorAll(".cookie-button");
    let cookieName = 'acceptCookies';

    cookieAlert.offsetHeight; // Force browser to trigger reflow (https://stackoverflow.com/a/39451131)

    // Show the alert if we cant find the "acceptCookies" cookie
    if (document.cookie.indexOf(cookieName + '=') === -1) {
        cookieAlert.classList.add("show");
    }

    // When clicking on the agree button, create a 1 year
    // cookie to remember user's choice and close the banner
    for (let i = 0; i < acceptCookies.length; i++) {
        acceptCookies[i].addEventListener("click", function (event) {
            let accepted = event.target.getAttribute('data-cookie');

            setCookie(cookieName, accepted, 365);
            cookieAlert.classList.remove("show");
        });
    }

    // Cookie functions from w3schools
    function setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
})();
