var PageLoginViewModel = require("./page_login-view-model");
var view = require("ui/core/view");
var dialog = require("tns-core-modules/ui/dialogs");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var homeViewModel = new PageLoginViewModel();
var observableModule = require("data/observable");
const application = require("tns-core-modules/application");
const frameModule = require("tns-core-modules/ui/frame");

function pageLoaded(args) {
    var page = args.object;
    var login = new Observable.fromObject({
    });

    page.bindingContext = login;
}

exports.pageLoaded = pageLoaded;