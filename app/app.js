var application = require("application");

global.api_base_url = "https://api.meteo.uniparthenope.it"
global.isLogged = 0;

application.start({ moduleName: "home/home-page" });
