var PageAboutViewModel = require("./page_about-view-model");
var view = require("ui/core/view");
var dialog = require("tns-core-modules/ui/dialogs");
var Observable = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var homeViewModel = new PageAboutViewModel();
var observableModule = require("data/observable");
const application = require("tns-core-modules/application");
const frameModule = require("tns-core-modules/ui/frame");
var appversion = require("nativescript-appversion");
var utilityModule = require("utils/utils");


var description = "Il progetto di ricerca MytiluSE (Modelling mytilus farming System with Enhanced web technologies) nasce nel 2016 da una collaborazione tra il Dipartimento di Scienze e Tecnologie (DiST) dell’Università degli Studi di Napoli “Parthenope” e l'Unità Operativa Dirigenziale Prevenzione e Sanità Pubblica Veterinaria della Regione Campania. Le fase progettuali preliminari, iniziate nel 2012, hanno ricevuto il supporto anche da parte dell' Assessorato alla Sanità della Regione Campania (Settore Veterinario Area Generale di Coordinamento 20 – Assistenza Sanitaria settore 02 Veterinario) e dell'Istituto Zooprofilattico Sperimentale del Mezzogiorno di Portici (nell'ambito di un progetto di Ricerca Corrente)." +
    "\n" +
    "L'obiettivo della ricerca è lo sviluppo di un sistema software per la modellistica di eventi d’inquinamento marino basato su tecnologie di calcolo distribuito ad alte prestazioni, che abbia come fine ultimo quello di fornire uno strumento dedicato agli operatori del Servizio Sanitario Nazionale ai fini della sicurezza alimentare nel settore della molluschicoltura."

function pageLoaded(args) {
    var page = args.object;
    var about = new Observable.fromObject({
    });
    about.set("description_", description);
    appversion.getVersionName().then(function(v) {
        about.set("version", v);
    });
    page.bindingContext = about;
}
exports.pageLoaded = pageLoaded;

function meteo_web(args)
{
    utilityModule.openUrl("https://meteo.uniparthenope.it");
}
exports.meteo_web = meteo_web;

