(function() {
    "use strict";

    let svg = document.querySelector('.map-draggable');
    if (null === svg) {
        return;
    }

    // If browser supports pointer events
    if (window.PointerEvent) {
        svg.addEventListener('pointerdown', onPointerDown, {passive: true}); // Pointer is pressed
        svg.addEventListener('pointerup', onPointerUp, {passive: true}); // Releasing the pointer
        svg.addEventListener('pointerleave', onPointerUp, {passive: true}); // Pointer gets out of the SVG area
        svg.addEventListener('pointermove', onPointerMove, {passive: true}); // Pointer is moving
    } else {
        // Add all mouse events listeners fallback
        svg.addEventListener('mousedown', onPointerDown, {passive: true}); // Pressing the mouse
        svg.addEventListener('mouseup', onPointerUp, {passive: true}); // Releasing the mouse
        svg.addEventListener('mouseleave', onPointerUp, {passive: true}); // Mouse gets out of the SVG area
        svg.addEventListener('mousemove', onPointerMove, {passive: true}); // Mouse is moving

        // Add all touch events listeners fallback
        svg.addEventListener('touchstart', onPointerDown, {passive: true}); // Finger is touching the screen
        svg.addEventListener('touchend', onPointerUp, {passive: true}); // Finger is no longer touching the screen
        svg.addEventListener('touchmove', onPointerMove, {passive: true}); // Finger is moving
    }

    // This variable will be used later for move events to check if pointer is down or not
    let isPointerDown = false;
    // This variable will contain the original coordinates when the user start pressing the mouse or touching the screen
    let pointerOrigin = {
        x: 0,
        y: 0
    };

    // We save the original values from the viewBox
    let origViewport = svg.getAttribute('viewBox').split(' ');
    let viewBox = {
        x: origViewport[0],
        y: origViewport[1],
        width: origViewport[2],
        height: origViewport[3]
    };

    // Set viewport depending on device width
    let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (deviceWidth <= 576) { // bootstrap small breakpoint
        viewBox.x = viewBox.x * 2.15;
        viewBox.width = viewBox.width * 0.75;
        viewBox.height = viewBox.height * 0.75;
        updateViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
    }

    // The distances calculated from the pointer will be stored here
    let newViewBox = {
        x: 0,
        y: 0
    };

    // Calculate the ratio based on the viewBox width and the SVG width
    let ratio = viewBox.width / svg.getBoundingClientRect().width;
    window.addEventListener('resize', function () {
        ratio = viewBox.width / svg.getBoundingClientRect().width;
    });

    // This function returns an object with X & Y values from the pointer event
    function getPointFromEvent(event) {
        let point = {
            x: 0,
            y: 0
        };

        // If even is triggered by a touch event, we get the position of the first finger
        if (event.targetTouches) {
            point.x = event.targetTouches[0].clientX;
            point.y = event.targetTouches[0].clientY;
        } else {
            point.x = event.clientX;
            point.y = event.clientY;
        }

        return point;
    }

    // Function called by the event listeners when user start pressing/touching
    function onPointerDown(event) {
        isPointerDown = true; // We set the pointer as down

        // We get the pointer position on click/touchdown so we can get the value once the user starts to drag
        let pointerPosition = getPointFromEvent(event);
        pointerOrigin.x = pointerPosition.x;
        pointerOrigin.y = pointerPosition.y;
    }

    // Function called by the event listeners when user start moving/dragging
    function onPointerMove(event) {
        // Only run this function if the pointer is down
        if (!isPointerDown) {
            return;
        }
        // This prevent user to do a selection on the page
        // event.preventDefault();

        // Get the pointer position
        let pointerPosition = getPointFromEvent(event);

        // We calculate the distance between the pointer origin and the current position
        // The viewBox x & y values must be calculated from the original values and the distances
        newViewBox.x = viewBox.x - ((pointerPosition.x - pointerOrigin.x) * ratio);
        newViewBox.y = viewBox.y - ((pointerPosition.y - pointerOrigin.y) * ratio);

        // We create a string with the new viewBox values
        // The X & Y values are equal to the current viewBox minus the calculated distances
        updateViewBox(newViewBox.x, newViewBox.y, viewBox.width, viewBox.height);
    }

    function onPointerUp() {
        // The pointer is no longer considered as down
        isPointerDown = false;

        // We save the viewBox coordinates based on the last pointer offsets
        viewBox.x = newViewBox.x;
        viewBox.y = newViewBox.y;
    }

    function updateViewBox(x, y, w, h) {
        let viewBoxString = `${x} ${y} ${w} ${h}`;

        // We apply the new viewBox values onto the SVG
        svg.setAttribute('viewBox', viewBoxString);
    }
})();