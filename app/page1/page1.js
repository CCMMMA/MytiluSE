var frameModule = require("ui/frame");
var dialog = require("tns-core-modules/ui/dialogs");
var Page1ViewModel = require("./page1-view-model");
var page1ViewModel = new Page1ViewModel();
var listViewModule = require("tns-core-modules/ui/list-view");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;

var search_data;
var place;
var array;
var location = ["VET0130", "VET0020", "VET0021", "VET0072", "VET0071", "VET0100", "VET0062", "VET0150", "VET0055", "VET0054", "VET0056", "VET0051", "VET0050", "VET0053", "VET0052", "VET0121", "VET0123", "VET0122", "VET0125", "VET0124", "VET0000", "VET0031", "VET0030", "VET0140", "VET0061", "VET0063", "VET0064", "VET0110", "VET0010", "VET0160", "VET0057", "VET0042", "VET0041"];
const appSettings = require("application-settings");
var pageData;

function pageLoaded(args) {
    var page = args.object;
    var flag = true;
    array = new ObservableArray();
    pageData = new Observable.fromObject({
        mytiluse2: array
    });
    search_data = page.navigationContext; //Read data from data_page


    console.log("LOG: " + isLogged);
    if (isLogged == 0)
        pageData.set("login_status", "Login");
    else if (isLogged > 0)
        pageData.set("login_status", "Logout");

    console.log("Privileges = " + appSettings.getNumber("mytiluse",0));

    for (place = 0; place < location.length; place++)
    {
        pageData.set("isBusy", true);//Load animation
        pageData.set("isHeigh", "25");
        //URL
        var url = api_base_url + "/products/rms3/forecast/" + location[place] + "?date=" + search_data + "&opt=place";

        //START FETCH
        fetch(url)
            .then((response) => response.json())
            .then((data) => { // FETCH RMS3
                if (data.result == "ok")
                {
                    var scs = data.forecast.scs;
                    var scm = data.forecast.scm.toString();
                    var id = data.place.id;
                    var name_place = data.place.long_name.it;

                    if (appSettings.getNumber("mytiluse",0) == 1) //Mytiluse privilege
                    {
                        var url_wcm3 = api_base_url + "/products/wcm3/forecast/" + id + "?date=" + search_data;
                        var status;
                        //WORKING!
                        fetch(url_wcm3)
                            .then((response) => response.json())
                            .then((json) => {
                                //console.log(json);



                                if(json.result == "ok")
                                {
                                    status = json.forecast.sts;
                                    array.push({
                                        "id": id,
                                        "name": name_place,
                                        "curDir": "~/images/arrow/" + scs + ".jpg",
                                        "curVal": scm + " m/sec",
                                        "status": "~/images/status/" + status + ".png"
                                    });
                                    array.sort(function (orderA, orderB) {
                                        var nameA = orderA.name;
                                        var nameB = orderB.name;
                                        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                                    });
                                }
                                else if(json.result == "error")
                                {
                                    array.push({
                                        "id": id,
                                        "name": name_place,
                                        "curDir": "~/images/arrow/" + scs + ".jpg",
                                        "curVal": scm + " m/sec",
                                        "status": "~/images/status/none.png"
                                    });
                                    array.sort(function (orderA, orderB) {
                                        var nameA = orderA.name;
                                        var nameB = orderB.name;
                                        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                                    });

                                    //dialog.alert({title : "Errore", message: "Status non disponibile", okButtonText: "OK"});
                                }
                            });
                    }
                    else {
                        array.push({
                            "id": id,
                            "name": name_place,
                            "curDir": "~/images/arrow/" + scs + ".jpg",
                            "curVal": scm + " m/sec",
                            "status": "~/images/status/none.png"
                        });
                        array.sort(function (orderA, orderB) {
                            var nameA = orderA.name;
                            var nameB = orderB.name;
                            return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                        });
                    }
                }
                else if (data.result == "error" && flag) {
                    dialog.alert({ title: "Errore", message: data.details, okButtonText: "OK" });
                    flag = false;
                    }
                })


            .then(function () {
                pageData.set("isBusy", false);
                pageData.set("isHeigh", "0");
            })
            .catch(error => console.error("[PAGE_1] ERROR ", error));
        // END FETCH

    }

    page.bindingContext = pageData;
};


//Navigation button -> PAGE1 to PAGE2
const Button = require("tns-core-modules/ui/button").Button;
const Page = require("tns-core-modules/ui/page").Page;
function onTap(args) {
    const index = args.index;
    const button = args.object;
    const page = button.page;

    const nav =
    {
        moduleName: "page_selection/page_selection",
        context: {
            send_data: search_data,
            send_ind: array.getItem(index).id,
            send_name: array.getItem(index).name
        }
    };

    page.frame.navigate(nav);
}
exports.onTap = onTap;


exports.pageLoaded = pageLoaded;

exports.onTapAbout = function(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("page_about/page_about");
};

exports.onTapLog = function(args) {
    const button = args.object;
    const pageData = button.page;

    if(isLogged == 0)
        pageData.frame.navigate("page_login/page_login");
    else
    {
        dialog.confirm({title: "Disconnessione", message: "Sicuro di voler rimuovere username e password?", okButtonText: "Si",cancelButtonText:"No"}).
        then(function (result) {
            if  (result)
            {
                //pageData.set("login_status", "Login");
                isLogged = 0;
                appSettings.remove("username");
                appSettings.remove("password");
                appSettings.setNumber("mytiluse", 0);

                //dialog.alert({ title: "", message: "Disconnesso!", okButtonText: "OK" });
                pageData.frame.navigate("home/home-page");
            }
        })

    }
};