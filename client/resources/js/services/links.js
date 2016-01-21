var _ = require("underscore");

var Links = {};

Links.makePretty = function (link) {
    if (link.indexOf('https://') === 0) {
        var end = link.length;
        link = link.substring(8, end);
    }

    if (link.indexOf('http://') === 0) {
        var end = link.length;
        link = link.substring(7, end);
    }

    if (link.indexOf('www.') === 0) {
        var end = link.length;
        link = link.substring(4, end);
    }

    if (link[link.length - 1] == '/') {
        link = link.substring(0, link.length - 1);
    }

    return link;
};

var iconToClassHash = {
    'facebook.com': 'fa-facebook',
    'fb.com': 'fa-facebook',
    'wordpress.com': 'fa-wordpress',
    'tumblr.com': 'fa-tumblr',
    'google.com': 'fa-google',
    'youtube.com': 'fa-youtube',
    'meetup.com': 'fa-meetup'
};

Links.getIcon = function (url) {
    var className = false;
    _.each(iconToClassHash, function (val, key) {
        if (url.indexOf(key) > -1) className = val;
    });
    return className;
};

module.exports = Links;