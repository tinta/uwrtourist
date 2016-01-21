var _ = require("underscore");

var Links = require("./../../services/links.js");
var templates = {};

templates.renderLink = function (link) {
    var socialMediaIcon = Links.getIcon(link);
    var template = [];

    if (socialMediaIcon) {
        template = template.concat([
            '<a class="text-xs" href="', link, '">',
                "<span class='fa-stack'>"
        ]);

        if (socialMediaIcon !== "fa-meetup") {
            template.push("<i class='fa fa-stack-2x fa-circle-thin'></i>");
        }

        template = template.concat([
                    "<i class='fa fa-stack-1x ", socialMediaIcon, "'></i>",
                "</span>",
            "</a>"                        
        ]);

    } else {
        template = template.concat([
            '<div>',
                '<a href="', link, '">',
                    Links.makePretty(link),
                '</a>',
            '</div>'
        ]);
    }

    return template.join("");
};

templates.renderPopup = function (team) {
    var links = _.map(team.links, function (link) {
        return templates.renderLink(link.link);
    }).join("");

    var template = [
        "<div class='text-xs'>",
            team.name,
        "</div>",
        "<div class='spacer-sm'></div>",
        "<div class='spacer-1 bg-gray-dark'></div>",
        "<div class='spacer-sm'></div>",
        "<a ",
            "href='", window.location.origin, "/team/", team.id, "' ",
            "class='btn-blue pad-tb text-white text-xxs text-hover-white pressable'",
        ">View Profile</a>",
        "<div class='spacer-xs'></div>",
        links,
    ];

    return template.join("");
};

module.exports = templates;