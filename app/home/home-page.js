
var HomeViewModel = require("./home-view-model");
var view = require("ui/core/view");
var dialog = require("tns-core-modules/ui/dialogs");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var homeViewModel = new HomeViewModel();
var observableModule = require("data/observable");
const application = require("tns-core-modules/application");
const frameModule = require("tns-core-modules/ui/frame");
var drawer

function pageLoaded(args) {
  var page = args.object;

  var home = new Observable.fromObject({
  });
  home.set("login_status", "Login");
  drawer = view.getViewById(page, "sideDrawer");
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
  page.frame.navigate("page_login/page_login");
};