var frameModule = require("ui/frame");
var PageLoginViewModel = require("./page_login-view-model");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
const httpModule = require("http");
var view = require("ui/core/view");
var homeViewModel = new PageLoginViewModel();
var utilityModule = require("utils/utils");
var dialog = require("tns-core-modules/ui/dialogs");
const appSettings = require("application-settings");

function pageLoaded(args) {
    var page = args.object;
    var login = new Observable.fromObject({});

    page.bindingContext = login;
}

exports.pageLoaded = pageLoaded;

exports.OnTapLogin = function(args)
{
    const button = args.object;
    const page = button.page;

    var Username = view.getViewById(page, "username");
    var user = Username.text;
    var Password = view.getViewById(page, "password");
    var pass = Password.text;
    var id;
    var url_login = api_base_url + "/user/login";

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

                if (result.message == null) { //LOGIN SUCCESS
                    isLogged = 1;
                    appSettings.setString("username", user);
                    appSettings.setString("password", pass);


                    if (result.roles[1] == null) id = 0;
                    else id = 1;
                    appSettings.setNumber("mytiluse", id);

                    page.frame.goBack();

                } else { //LOGGIN INSUCCESS
                    dialog.alert({title: "Error", message: result.message, okButtonText: "OK"});
                }
            },
            (e) => {
                console.log("Error");
            });
};

exports.resetAccount = function(args)
{
    utilityModule.openUrl("https://meteo.uniparthenope.it/user/password");
};