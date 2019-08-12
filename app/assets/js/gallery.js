let blueimpGallery = require('blueimp-gallery/js/blueimp-gallery.min.js');

let galleries = document.querySelectorAll('.blueimp-gallery');
galleries.forEach(function (gallery) {
    blueimpGallery(JSON.parse(gallery.getAttribute('data-sources')), {
        container: '#' + gallery.getAttribute('id'),
        carousel: true,
    });
});
