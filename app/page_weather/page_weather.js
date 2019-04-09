var frameModule = require("ui/frame");
var PageWeatherViewModel = require("./page_weather-view-model");
var pageweatherViewModel = new PageWeatherViewModel();
var observableModule = require("data/observable");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var imageSource = require("image-source");
var dialog = require("tns-core-modules/ui/dialogs");
const appSettings = require("application-settings");
var page2;

function getDataCache() {
	var curr = new Date();
	var cache_data = " ";
	var a = curr.getFullYear();
	var m = curr.getMonth();
	if(m < 10)
		m = "0" + m;
	var g = curr.getDate();
	if(g < 10)
		g = "0" + g;
	var h = curr.getHours();
	if(h < 10)
		h = "0" + h;

	cache_data = a + "" + m + "" + g + "Z" + h;

	return cache_data;
}

function pageLoaded(args) {
	var page = args.object;

	var src_map;
	var src_map2;
	page2 = new Observable.fromObject({
		map: src_map,
		map2: src_map2
	});

	if (isLogged == 0)
		page2.set("login_status", "Login");
	else if (isLogged > 0)
		page2.set("login_status", "Logout");

	page2.set("isBusy", true);
	page2.set("isVisible", "visible");
	page2.set("isBusy2", true);
	page2.set("isVisible2", "visible");

	prec_data = page.navigationContext;
	var data = appSettings.getString("data");
	console.log("Data : ", data);
	console.log("ID : ", prec_data.send_ind);
	console.log("Nome : ", prec_data.send_name);

	var data_cache = getDataCache();
	//URLs
	var url_map = api_base_url + "/products/wrf5/forecast/" + prec_data.send_ind + "/plot/image?date=" + data + "&rand=" + data_cache;
	var url_map2 = api_base_url + "/products/wrf5/forecast/" + prec_data.send_ind + "/plot/image?output=wn1&date=" + data + "&rand=" + data_cache;
	var url = api_base_url + "/products/wrf5/forecast/" + prec_data.send_ind + "?date=" + data;


	// START FETCH MAP1
	imageSource.fromUrl(url_map)
		.then(function () { page2.map = url_map; })
		.then(function () {
			page2.set("isBusy", false);
			page2.set("isVisible", "collapsed");
		})
		.catch(err => {
			console.error("[PAGE_WEATHER] ERROR MAP ", error);
		})

	// START FETCH MAP2
	imageSource.fromUrl(url_map2)
		.then(function () { page2.map2 = url_map2; })
		.then(function () {
			page2.set("isBusy2", false);
			page2.set("isVisible2", "collapsed");
		})
		.catch(err => {
			console.error("[PAGE_WEATHER] ERROR MAP ", error);
		})

	// START FETCH DATA
	fetch(url)
		.then((response) => response.json())
		.then((data1) => {
			if (data1.result == "ok") {
				//ADD to listview
				ws10n = data1.forecast.ws10n.toString();
				page2.set("place", prec_data.send_ind);
				page2.set("loc", prec_data.send_name);
				page2.set("curVal", ws10n + " nodi");
				page2.set("curDir", "~/images/arrow/" + data1.forecast.winds + ".jpg");
				//console.log("Vento =", data1.forecast.winds);
				page2.set("temp", data1.forecast.t2c + " °C");
				page2.set("rain", data1.forecast.crh + " mm");
				page2.set("status", "~/images/meteo_icon/" + data1.forecast.icon);
				page2.set("status_name", data1.forecast.text.it);
				//array.push({ "place": prec_data.send_ind, "loc": prec_data.send_name, "curVal": ws10n + " nodi", "curDir": "~/images/arrow/" + data1.forecast.winds + ".png", "temp": data1.forecast.t2c + " °C", "rain": data1.forecast.crh + " mm", "status": "~/images/meteo_icon/" + data1.forecast.icon, "status_name":data1.forecast.text});
			}
			else if (data1.result == "error") {
				dialog.alert({ title: "Errore", message: data1.details, okButtonText: "OK" });
			}
		})
		.catch(error => console.error("[PAGE_WEATHER] ERROR DATA ", error));

	page.bindingContext = page2;
}

exports.pageLoaded = pageLoaded;


exports.onTapAbout = function(args) {
	const button = args.object;
	const page = button.page;
	page.frame.navigate("page_about/page_about");
};

exports.onTapLog = function(args) {
    const button = args.object;
    const page2 = button.page;

    if(isLogged == 0)
        page2.frame.navigate("page_login/page_login");
    else
    {
        dialog.confirm({title: "Disconnessione", message: "Sicuro di voler rimuovere username e password?", okButtonText: "Si",cancelButtonText:"No"}).
        then(function (result) {
            if  (result)
            {
                //page2.set("login_status", "Login");
                isLogged = 0;
                appSettings.remove("username");
                appSettings.remove("password");
                appSettings.setNumber("mytiluse", 0);

                //dialog.alert({ title: "", message: "Disconnesso!", okButtonText: "OK" });
                //page2.frame.goBack();
                page2.frame.navigate("home/home-page");
            }
        })
    }
};
