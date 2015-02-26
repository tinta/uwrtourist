"use strict";

(function() {
    // Doing this so the map has time for the dom to load.
    window.setTimeout(loadMap, 1000);

    function loadMap() {
        // API pub key
        L.mapbox.accessToken = 'pk.eyJ1IjoieG11bm96IiwiYSI6IkN5MzZ1Y3MifQ.7lRhW5rm5NNZrt7zlIyoJQ';
        // Create a map in the div #map
        L.mapbox.map('map', 'xmunoz.hgclk828');
    }
})();
