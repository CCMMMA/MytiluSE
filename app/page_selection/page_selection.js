var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var Observable = require("data/observable");
var PageSelectionViewModel = require("./page_selection-view-model");
var pageselectionViewModel = new PageSelectionViewModel();

var title;
var prec_data ;

function pageLoaded(args) {
	var page = args.object;
	var page2 = new Observable.fromObject({
		title_menu: title
	});
	prec_data = page.navigationContext;
	page2.title_menu = prec_data.send_name;
	page.bindingContext = page2;
}

const Button = require("tns-core-modules/ui/button").Button;
const Page = require("tns-core-modules/ui/page").Page;
// GO TO WEATHER PAGE
function onTapMeteo(args) { 
	var button = args.object;
	const page = button.page;

	const nav =
		{
			moduleName: "page_weather/page_weather",
			context: {
				send_data: prec_data.send_data,
				send_ind: prec_data.send_ind,
				send_name: prec_data.send_name,
			}
		};
	page.frame.navigate(nav);
}
// GO TO SEA PAGE
function onTapSea(args) {
	var button = args.object;
	const page = button.page;
	const nav =
		{
			moduleName: "page_sea/page_sea",
			context: {
				send_data: prec_data.send_data,
				send_ind: prec_data.send_ind,
				send_name: prec_data.send_name,
			}
		};

	page.frame.navigate(nav);

}

exports.onTapMeteo = onTapMeteo;
exports.onTapSea = onTapSea;
exports.pageLoaded = pageLoaded;
