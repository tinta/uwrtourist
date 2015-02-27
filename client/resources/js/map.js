(function() {
    "use strict";

    var Map = {};
    Map.viewport = "map";
    Map.$viewport = $('#' + Map.viewport);
    Map.load = function () {
        // API pub key
        window.L.mapbox.accessToken = 'pk.eyJ1IjoieG11bm96IiwiYSI6IkN5MzZ1Y3MifQ.7lRhW5rm5NNZrt7zlIyoJQ';
        // Create a map in the div #map
        window.L.mapbox.map(Map.viewport, 'xmunoz.hgclk828');
    };
    Map.init = function () {
        Map.$viewport.ready(Map.load);
    };

    Map.init();

})();
