var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;

function PageDataViewModel() {
    var array = [];

    //Date = max 15 days before actual day, max 7 days after actual day (23)
    var new_date = new Date();
    var hour = new_date.getUTCHours();
    new_date.setDate(new_date.getUTCDate() - 15); //Start point

    for (var i = 0; i < 22; i++) {
        new_date.setDate(new_date.getUTCDate() + 1);

        var temp_day = new_date.getUTCDate();
        var temp_month = new_date.getUTCMonth() + 1;
        //Control for day and months
        var temp
        if (temp_month >= 10 && temp_day < 10) {
            temp = new_date.getUTCFullYear().toString() + "-" + temp_month.toString() + "-0" + temp_day.toString();
        }
        else if (temp_month < 10 && temp_day < 10) {
            temp = new_date.getUTCFullYear().toString() + "-0" + temp_month.toString() + "-0" + temp_day.toString();
        }
        else if (temp_month < 10 && temp_day >= 10) {
            temp = new_date.getUTCFullYear().toString() + "-0" + temp_month.toString() + "-" + temp_day.toString();
        }
        else { 
            temp = new_date.getUTCFullYear().toString() + "-" + temp_month.toString() + "-" + temp_day.toString();
        }

        array.push(temp);
    }

    var viewModel = observableModule.fromObject({
        listPickerDate: array,
        selectedListPickerDate: 14,

        listPickerHour: ["00", "01", "02", "03", "04",
            "05", "06", "07", "08", "09", "10", "11",
            "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
        selectedListPickerIndex: hour
	});
    

	return viewModel;
}

module.exports = PageDataViewModel;
