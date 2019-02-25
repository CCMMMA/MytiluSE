var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var Observable = require("data/observable");
var PageSelectionPlaceViewModel = require("./page_selection_place-view-model");
var pageselectionPlaceViewModel = new PageSelectionPlaceViewModel();


function pageLoaded(args) {
    var page = args.object;
    var page2 = new Observable.fromObject({
    });

    page.bindingContext = page2;
}

const Button = require("tns-core-modules/ui/button").Button;
const Page = require("tns-core-modules/ui/page").Page;
// GO TO WEATHER PAGE
function onTapArea(args) {
    var button = args.object;
    const page = button.page;

    const nav =
        {
            moduleName: "page1/page1",
            context: {
                scelta: 0,
            }
        };
    page.frame.navigate(nav);
}
// GO TO SEA PAGE
function onTapBanchi(args) {
    var button = args.object;
    const page = button.page;
    const nav =
        {
            moduleName: "page1/page1",
            context: {
                scelta: 1,
            }
        };

    page.frame.navigate(nav);

}

exports.onTapArea = onTapArea;
exports.onTapBanchi = onTapBanchi;
exports.pageLoaded = pageLoaded;
