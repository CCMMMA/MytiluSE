var HomeViewModel = require("./home-view-model");
var view = require("ui/core/view");
var dialog = require("tns-core-modules/ui/dialogs");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var homeViewModel = new HomeViewModel();
var observableModule = require("data/observable");
const application = require("tns-core-modules/application");
const frameModule = require("tns-core-modules/ui/frame");
const appSettings = require("application-settings");
const httpModule = require("http");
var drawer;
var home;
var firstTime = true;

function pageLoaded(args) {
  var page = args.object;
   home = new Observable.fromObject({
  });

   const user = appSettings.getString("username");
   const pass = appSettings.getString("password");
   console.log("Previus Info: USER = "+ user + " PASS =" + pass );
   const url_login = api_base_url + "/user/login";

   if (user != null && pass != null && isLogged == 0 && firstTime)
   {
     httpModule.request({
       url: url_login,
       method: "POST",
       headers: {"Content-Type": "application/json"},
       content: JSON.stringify({
         name: user,
         pass: pass
       })
     }).then((response) => {
           const result = response.content.toJSON();
           console.log(result.message);
           //Disattiva rotellina

           if (result.message == null) { //LOGIN SUCCESS
             console.log("Logged as: USER = "+ user + " PASS =" + pass );
             isLogged = 1;
             dialog.alert({title: "", message: "Connesso!", okButtonText: "OK"});
             home.set("login_status", "Logout");
             firstTime = false;
           } else { //LOGGIN INSUCCESS
             dialog.alert({title: "Error", message: result.message, okButtonText: "OK"});
           }
         },
         (e) => {
           console.log("Error");
         });
   }

  if (isLogged == 0)
    home.set("login_status", "Login");
  else if (isLogged > 0)
    home.set("login_status", "Logout");

  //url
  var url = api_base_url + "/products";
  var url_policy = api_base_url + "/legal/discaimer";

  fetch(url_policy)
    .then((response) => response.json())
    .then((data1) => {
      home.set("policy", data1.discaimer.it);
    })
    .catch(error => console.error("[PAGE_SEA] ERROR DATA ", error));

  fetch(url).then(function (response) {
    if (response.status != 200) {
      dialog.alert({ title: "Errore", message: "Impossibile connettersi al server", okButtonText: "OK" });
    }
  });

  page.bindingContext = home;
}

exports.pageLoaded = pageLoaded;

//Navigation button -> HOMPAGE to DATA_PAGE
const Button = require("tns-core-modules/ui/button").Button;
const Page = require("tns-core-modules/ui/page").Page;

function onTap(args) {
  const button = args.object;
  const page = button.page;
  page.frame.navigate("page_data/page_data");
}
exports.onTap = onTap;

exports.onTapAbout = function(args) {
  const button = args.object;
  const page = button.page;
  page.frame.navigate("page_about/page_about");
};

exports.onTapLog = function(args) {
  const button = args.object;
  const page = button.page;

  if(isLogged == 0)
    page.frame.navigate("page_login/page_login");
  else
    {
      dialog.confirm({title: "Disconnessione", message: "Sicuro di voler rimuovere username e password?", okButtonText: "Si",cancelButtonText:"No"}).
      then(function (result) {
        if  (result)
        {
          home.set("login_status", "Login");
          isLogged = 0;
          appSettings.remove("username");
          appSettings.remove("password");
          appSettings.setNumber("mytiluse", 0);

          dialog.alert({ title: "", message: "Disconnesso!", okButtonText: "OK" });
        }
      })

    }
};