var PageLoginViewModel = require("./page_login-view-model");
var Observable = require("data/observable");
const httpModule = require("http");


function pageLoaded(args) {
    var page = args.object;
    var login = new Observable.fromObject({});

    page.bindingContext = login;
}

exports.pageLoaded = pageLoaded;

exports.OnTapLogin= function(args)
{
    const button = args.object;
    const page = button.page;
    //page.frame.navigate("page_login/page_login");

    var url = api_base_url + "/user/login";
    httpModule.request({
        url: url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            name: "cirogiuseppe.devita01",
            pass: "Ccmmma2019!!"
        })
    }).then((response) =>
    {
        const result = response.content.toJSON();
        console.log(result.roles);
    },
        (e) =>
        {
            console.log("Error");
        });
};