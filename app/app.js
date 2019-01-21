var application = require("application");

global.api_base_url = "https://api.meteo.uniparthenope.it"

application.start({ moduleName: "home/home-page" });
