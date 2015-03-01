(function() {
    "use strict";

    var geojson = [
        {
            "geometry": {
                "coordinates": [-121.975961, 37.22349]
            },
            "properties": {
                "title": "San Francisco Sea Bass",
                "description": [
                    "Los Gatos High School",
                    "Los Gatos, CA, United States"
                ],
            }
        },
        {
            "geometry": {
                "coordinates": [-122.415816, 37.713316]
            },
            "properties": {
                "title": "San Francisco Sea Bass",
                "description": [
                    "Coffman Pool",
                    "San Francisco, CA United States"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-73.6225436, 45.5510891]
            },
            "properties": {
                "title": "CAMO Rugby Sous-Marin",
                "description": [
                    "Piscine Joseph-Charbonneau",
                    "Montreal, QC, Canada"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-74.185856, 40.731617]
            },
            "properties": {
                "title": "JFK Recreation Center",
                "description": [
                    "JFK Recreation Center",
                    "Newark, NJ, United States"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-74.142423, 40.726272]
            },
            "properties": {
                "title": "Ironbound Recreation Center",
                "description": [
                    "JFK Recreation Center",
                    "Newark, NJ, United States"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-71.04928, 42.29439]
            },
            "properties": {
                "title": "Quincy Narwhals",
                "description": [
                    "Leahy Holloran Community Center",
                    "Dorchester, MA, United States"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-71.011324, 42.242683]
            },
            "properties": {
                "title": "Quincy Narwhals",
                "description": [
                    "Lincoln-Hancock Community School",
                    "Quincy, MA, United States"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-80.265255, 43.167425]
            },
            "properties": {
                "title": "Club Liberation",
                "description": [
                    "Wayne Gretzky Sports Centre",
                    "Brantford, ON, Canada"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-79.71235, 43.708466]
            },
            "properties": {
                "title": "Club Liberation",
                "description": [
                    "Balmoral Recreation Centre",
                    "Brampton, ON, Canada",
                    "<a href='http://www.quelonios.com/'>Official Website</a>"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-76.541778, 3.431038]
            },
            "properties": {
                "title": "Club Quelonios",
                "description": [
                    "Piscinas Alberto Galindo",
                    "Cali, Valle del Cauca, Columbia",
                    "<a href='http://www.quelonios.com/'>Official Website</a>"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-75.590782, 6.254874]
            },
            "properties": {
                "title": "Orcas",
                "description": [
                    "Complejo Acuático",
                    "Medellin, Antioquia, Columbia",
                    "<a href='https://www.facebook.com/orcasuwrugby'>Official Website</a>"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-74.083199, 4.654931]
            },
            "properties": {
                "title": "Club Castores",
                "description": [
                    "Complejo Acuático Simón Bolívar",
                    "Bogotá, Cundinamarca, Columbia",
                    "<a href='http://www.castoresuwr.com/'>Official Website</a>"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-79.3992555, 43.7373677]
            },
            "properties": {
                "title": "Toronto UWR Club",
                "description": [
                    "Rosedale Heights School of the Arts Pool",
                    "Toronto, ON, Columbia",
                    "<a href='http://www.meetup.com/Toronto-Underwater-Rugby-Club/'>Official Website</a>"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-79.3992555, 43.7373677]
            },
            "properties": {
                "title": "PURE",
                "description": [
                    "Rosedale Heights School of the Arts Pool",
                    "Toronto, ON, Columbia",
                    "<a href='http://www.meetup.com/Toronto-Underwater-Rugby-Club/'>Official Website</a>"
                ]
            }
        },
        {
            "geometry": {
                "coordinates": [-0.228477, 51.46356]
            },
            "properties": {
                "title": "PURE",
                "description": [
                    "Putney Leisure Centre",
                    "London, United Kingdom",
                    "<a href='http://www.meetup.com/Toronto-Underwater-Rugby-Club/'>Official Website</a>"
                ]
            }
        },
    ];

    var Mapbox = {};
    Mapbox.viewport = "map";
    Mapbox.$viewport = $('#' + Mapbox.viewport);
    Mapbox.load = function () {
        // API pub key
        window.L.mapbox.accessToken = 'pk.eyJ1IjoieG11bm96IiwiYSI6IkN5MzZ1Y3MifQ.7lRhW5rm5NNZrt7zlIyoJQ';
        // Create a map in the div #map
        window.L.mapbox.map(Mapbox.viewport, 'xmunoz.hgclk828')
            .featureLayer.setGeoJSON(this.geoJSON);
    };
    Mapbox.init = function (geoJSON) {
        this.setGeoJSON(geoJSON);
        Mapbox.$viewport.ready(this.load.bind(this));
    };
    Mapbox.setGeoJSON = function (geoJSON) {
        geoJSON.forEach(function(item) {
            item.type = "Feature";
            item.geometry.type = "Point"
            item.properties['marker-color'] = "#fc4353";
            item.properties['marker-size'] = "large";
            item.properties['marker-symbol'] = "swimming";
            var desc = (function() {
                var _desc = [
                    "<div class='spacer-1 bg-gray-dark'></div>",
                    "<div class='spacer-xxs'></div>",
                ].join('');

                item.properties.description.forEach(function(item) {
                    _desc += [
                        '<div>', item, '</div>'
                    ].join('');
                });

                return _desc;
            })();

            item.properties.description = desc;
        });

        this.geoJSON = geoJSON;
    }

    Mapbox.init(geojson);

})();
