var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var PageDataViewModel = require("./page_data-view-model");
var pagedataViewModel = new PageDataViewModel();
var selected_data;

function pageLoaded(args) {
	var page = args.object;
	
	page.bindingContext = pagedataViewModel;
}

//Navigation button -> PAGE_DATA to PAGE1
const Button = require("tns-core-modules/ui/button").Button;
const Page = require("tns-core-modules/ui/page").Page;

function onTap(args) {
	var button = args.object;
	const page = button.page;
	var dat = page.getViewById("date_search");
	var pref_hour = page.getViewById("hours_search");

	/*Creating string YYYYMMDDZHH00 */
	//console.log("[PAGE_DATA] SELECTED HOUR = ", pagedataViewModel.listPickerHour[pref_hour.selectedIndex]);
	var temp = pagedataViewModel.listPickerDate[pagedataViewModel.selectedListPickerDate];
	temp = temp.replace("-", "");
	temp = temp.replace("-", "");
	selected_data = temp + "Z" + pagedataViewModel.listPickerHour[pref_hour.selectedIndex] + "00";

	//Done, sending to page1
	const navigationEntry = {
		moduleName: "page1/page1",
		context: selected_data,
		animated: true
	};
	console.log("[PAGE_DATA] SELECTED DATA = ", selected_data);
	page.frame.navigate(navigationEntry);
}
exports.onTap = onTap;
exports.pageLoaded = pageLoaded;
