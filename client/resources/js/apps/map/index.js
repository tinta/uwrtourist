var _ = require("underscore");
var $ = require("jquery");
require('mapbox.js'); // <-- auto-attaches to window.L

module.exports = function () {
    var geojson = _.map(teams, function (team) {
        var teamData = {
            "geometry": {
                // 
                "coordinates": [ team.longitude, team.latitude ]
            },
            "properties": {
                "title": team.name,
                "description": _.map(team.links, function (link) { return link.link })
            }
        };
        return teamData;
    });

    var Mapbox = {};
    Mapbox.viewport = "map";
    Mapbox.$viewport = $('#' + Mapbox.viewport);
    Mapbox.load = function () {
        // API pub key
        window.L.mapbox.accessToken = 'pk.eyJ1IjoieG11bm96IiwiYSI6IkN5MzZ1Y3MifQ.7lRhW5rm5NNZrt7zlIyoJQ';
        // Create a map in the div #map
        window.L.mapbox.map(
            Mapbox.viewport,
            'xmunoz.hgclk828',
            {
                'worldCopyJump': true
            }
        )
        .featureLayer.setGeoJSON(this.geoJSON);
    };
    Mapbox.init = function (geoJSON) {
        this.setGeoJSON(geoJSON);
        Mapbox.$viewport.ready(this.load.bind(this));
    };
    Mapbox.setGeoJSON = function (geoJSON) {
        geoJSON.forEach(function(item) {
            item.type = "Feature";
            item.geometry.type = "Point";
            item.properties['marker-color'] = "#fc4353";
            item.properties['marker-size'] = "medium";
            item.properties['marker-symbol'] = "swimming";

            var desc = (function() {
                var _desc = [
                    "<div class='spacer-1 bg-gray-dark'></div>",
                    "<div class='spacer-xxs'></div>",
                ].join('');

                _.each(item.properties.description, function(desc) {
                    _desc += [
                        '<div>',
                        '<a href="', desc, '">',
                            desc, '99999', item.geometry.coordinates,
                        '</a>',
                        '</div>'
                    ].join('');
                });

                return _desc;
            })();

            item.properties.description = desc;
        });

        this.geoJSON = geoJSON;
    };

    Mapbox.init(geojson);

};
