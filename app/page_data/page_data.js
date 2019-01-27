var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var PageDataViewModel = require("./page_data-view-model");
var Observable = require("data/observable");
var pagedataViewModel = new PageDataViewModel();
var selected_data;
var year = "";
var month = "";
var day = "";
var date = "";

function pageLoaded(args) {
	var page = args.object;

	var page_data = new Observable.fromObject({
		selectedListPickerDate: 14,
		listPickerHour: ["00", "01", "02", "03", "04",
			"05", "06", "07", "08", "09", "10", "11",
			"12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
		//selectedListPickerIndex: hour
	});

	const TODAY = new Date();
	page_data.set("date_pick", TODAY); // the binded date property accepts Date object
	page_data.set("minDate", new Date(2018, 0, 29)); // the binded minDate property accepts Date object
	page_data.set("maxDate", new Date(2020, 4, 12)); // the binded maxDate property accepts Date object
	year =  TODAY.getUTCFullYear().toString();
	month =  TODAY.getUTCFullYear().toString()
	date = TODAY.getUTCFullYear().toString() + (TODAY.getUTCMonth().toString() + 1) + TODAY.getUTCDate().toString();
	console.log(date);
	page.bindingContext = page_data;

}

//Navigation button -> PAGE_DATA to PAGE1
const Button = require("tns-core-modules/ui/button").Button;
const Page = require("tns-core-modules/ui/page").Page;


function onTap(args) {
	var button = args.object;
	const page = button.page;
	var pref_hour = page.getViewById("hours_search");




	/*Creating string YYYYMMDDZHH00 */
	//console.log("[PAGE_DATA] SELECTED HOUR = ", page.listPickerHour[pref_hour.selectedIndex]);
	//const datePicker = args.object;

	date = year.toString() + month.toString() + day.toString();
	date = date + "Z" + "12" + "00";

	//Done, sending to page1
	const navigationEntry = {
		moduleName: "page1/page1",
		context: date,
		animated: true
	};
	console.log("[PAGE_DATA] SELECTED DATA = ", date);
	page.frame.navigate(navigationEntry);
}
exports.onTap = onTap;

function onDatePickerLoaded(args) {

	const datePicker = args.object;
	datePicker.on("dayChange", (args) => {
		if (day < 10) day = "0"+args.value;
		else day = args.value;
	});
	datePicker.on("monthChange", (args) => {
		if (month < 10) month = "0"+args.value;
		else month = args.value;
	});
	datePicker.on("yearChange", (args) => {
		year = args.value;
	});
}
exports.onDatePickerLoaded = onDatePickerLoaded;

exports.pageLoaded = pageLoaded;
