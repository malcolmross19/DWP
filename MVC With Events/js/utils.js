/**
 * Created by malcolmross on 1/21/18.
 */
//Utility Class
class Utils {
    constructor() {
        console.log("Utils Created!");
    }

    static getAverage(array) {
        let total = 0;
        array.forEach(function (e) {
            total += Number.parseInt(e);
        });
        return total / array.length;
    }
}