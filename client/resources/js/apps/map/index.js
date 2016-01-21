var _ = require("underscore");
var $ = window.$ = window.jQuery = require("jquery"); // Required for cdn scripts
require('mapbox.js'); // <-- auto-attaches to window.L

var templates = require("./templates.js");

var Mapbox = {};
Mapbox.load = function () {
    // API pub key
    window.L.mapbox.accessToken = 'pk.eyJ1IjoieG11bm96IiwiYSI6IkN5MzZ1Y3MifQ.7lRhW5rm5NNZrt7zlIyoJQ';
    // Create a map in the div #map
    var map = window.L.mapbox.map(
        Mapbox.viewport,
        'xmunoz.hgclk828',
        {
            'worldCopyJump': true
        }
    );

    map.featureLayer.setGeoJSON(this.geoJSON);
};

Mapbox.init = function (teams, viewport) {
    // Process data
    var geojson = _.map(teams, function (team) {
        var teamData = {
            "geometry": {
                "type": "Point",
                "coordinates": [ team.longitude, team.latitude ]
            },
            "properties": {
                'marker-color': "#fc4353",
                'marker-size': "medium",
                'marker-symbol': "swimming"
            },
            type: "Feature"
        };

        teamData.properties.description = templates.renderPopup(team);

        return teamData;
    });

    // Initialize view
    this.viewport = viewport;
    this.$viewport = $('#' + this.viewport);
    this.geoJSON = geojson;
    this.$viewport.ready(this.load.bind(this));
};

module.exports = function () {
    Mapbox.init(window.teams, "map");
};
