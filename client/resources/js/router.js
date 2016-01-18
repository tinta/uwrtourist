(function () {
    var apps = {
        "addTeam": require("./apps/addTeam/index.js"),
        "teamsList": require("./apps/teamsList/index.js"),
        "map": require("./apps/map/index.js")
    };

    switch (window.location.pathname) {
        case "/":
            apps.map();
            break;
    }
})();