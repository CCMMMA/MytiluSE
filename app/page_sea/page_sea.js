var frameModule = require("ui/frame");
var PageSeaViewModel = require("./page_sea-view-model");
var pageseaViewModel = new PageSeaViewModel();
var observableModule = require("data/observable");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var imageSource = require("image-source");
var dialog = require("tns-core-modules/ui/dialogs");
const appSettings = require("application-settings");

function pageLoaded(args) {
	var page = args.object;
	var src_map;
	var src_map2;
	var src_map_sal;
	var src_map_temp;

	var page2 = new Observable.fromObject({
		map_wcm3: src_map,
		map_sal: src_map_sal,
		map_temp: src_map_temp,
		map_rms3: src_map2
	});
	if (appSettings.getNumber("mytiluse",0) == 1)
	{
		page2.set("isBusy_WCM3", true);
		page2.set("visible_WCM3", "visible");
	}
	page2.set("isBusy_SAL", true);
	page2.set("visible_SAL", "visible");
	page2.set("isBusy_TEMP", true);
	page2.set("visible_TEMP", "visible");
	page2.set("isBusy_RMS3", true);
	page2.set("visible_RMS3", "visible");

	prec_data = page.navigationContext;
	console.log("Data : ", prec_data.send_data);
	console.log("ID : ", prec_data.send_ind);
	console.log("Nome : ", prec_data.send_name);

	var url_map_wcm3 = api_base_url + "/products/wcm3/forecast/" + prec_data.send_ind + "/plot/image?date=" + prec_data.send_data;
	var url_sal = api_base_url + "/products/rms3/forecast/" + prec_data.send_ind + "/plot/image?output=sss&date=" + prec_data.send_data;
	var url_temp = api_base_url +"/products/rms3/forecast/" + prec_data.send_ind + "/plot/image?output=sst&date=" + prec_data.send_data;

	var url_map_rms3 = api_base_url + "/products/rms3/forecast/" + prec_data.send_ind + "/plot/image?date=" + prec_data.send_data;
	var url = api_base_url + "/products/rms3/forecast/" + prec_data.send_ind + "?date=" + prec_data.send_data;
	var url_status = api_base_url + "/products/wcm3/forecast/" + prec_data.send_ind + "?date=" + prec_data.send_data;


	// START FETCH MAP RMS3
	imageSource.fromUrl(url_map_rms3)
		.then(function () {
			page2.map_rms3 = url_map_rms3;
		})
		.then(function () {
			page2.set("isBusy_RMS3", false);
			page2.set("visible_RMS3", "collapsed");
		})
		.catch(err => {
			// console.log("Somthing went wrong!");
		})
	// START FETCH MAP SAL
	imageSource.fromUrl(url_sal)
		.then(function () {
			page2.map_sal = url_sal;
		})
		.then(function () {
			page2.set("isBusy_SAL", false);
			page2.set("visible_SAL", "collapsed");
		})
		.catch(err => {
			// console.log("Somthing went wrong!");
		})
	// START FETCH MAP TEMP
	imageSource.fromUrl(url_temp)
		.then(function () {
			page2.map_temp = url_temp;
		})
		.then(function () {
			page2.set("isBusy_TEMP", false);
			page2.set("visible_TEMP", "collapsed");
		})
		.catch(err => {
			// console.log("Somthing went wrong!");
		})
	if (appSettings.getNumber("mytiluse",0) == 1) {
		// START FETCH MAP WCM3
		imageSource.fromUrl(url_map_wcm3)
			.then(function () {
				page2.map_wcm3 = url_map_wcm3;
			})
			.then(function () {
				page2.set("isBusy_WCM3", false);
				page2.set("visible_WCM3", "collapsed");
			})
			.catch(err => {
				// console.log("Somthing went wrong!");
			})
	}
	else {
		page2.set("visible_WCM3_map", "collapsed");
		page2.set("visible_WCM3_bar", "collapsed");
	}
	// START FETCH STATUS
	if (appSettings.getNumber("mytiluse",0) == 1) {
		fetch(url_status)
			.then((response) => response.json())
			.then((data) => {
				if (data.result == "ok") {
					var stat = data.forecast.sts;
					switch (stat) {
						case 0:
							page2.set("statVal", "Absent");
							break;
						case 1:
							page2.set("statVal", "Very low");
							break;
						case 2:
							page2.set("statVal", "Low");
							break;
						case 3:
							page2.set("statVal", "Medium");
							break;
						case 4:
							page2.set("statVal", "High");
							break;
						case 5:
							page2.set("statVal", "Very High");
							break;
						case 6:
							page2.set("statVal", "Forbidden");
							break;
					}
					page2.set("status", "~/images/status/" + stat + ".png");
				} else if (data.result == "error") {
					dialog.alert({title: "Errore", message: data1.details, okButtonText: "OK"});
				}
			})
			.catch(error => console.error("[PAGE_SEA] ERROR DATA ", error));
	}
	else {
		page2.set("statVal", "N/A");
		page2.set("status", "~/images/status/none.png");
	}
	// START FETCH DATA
	fetch(url)
		.then((response) => response.json())
		.then((data1) => {
			if (data1.result == "ok") {

				page2.set("place", prec_data.send_ind);
				page2.set("loc", prec_data.send_name);
				page2.set("curVal", data1.forecast.scm + " m/sec");
				page2.set("curDir", "~/images/arrow/" + data1.forecast.scs + ".jpg");
				page2.set("T_Sup", data1.forecast.sst + " °C");
				page2.set("S_Sup", data1.forecast.sss + " [1/1000]");
			}
			else if (data1.result == "error") {
				dialog.alert({ title: "Errore", message: data1.details, okButtonText: "OK" });
			}
		})
		.catch(error => console.error("[PAGE_SEA] ERROR DATA ", error));

	page.bindingContext = page2;
}

exports.pageLoaded = pageLoaded;