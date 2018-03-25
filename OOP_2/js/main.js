/**
 * Created by malcolmross on 1/11/18.
 *
 * Static Property Located On Line 39. The value of this static property is validated on line 145 to be sure that it has
 * been set.
 *
 * Composition Located On Line 249
 */

// Load event handler
window.addEventListener('load', function(){
    console.log("Page Loaded!");

    // Instantiate Singleton Class
    Main.getInstance();
});

/************************************************ Singleton Class Begin *************************************************/
var Main = (function() { //Singleton class
    var main = null; // To keep track of current instance

    function Main(){
        console.log("Main Created");
    }

    Main.getInstance = function(){ // Checks if main has been instantiated. If not, create it.
        if(!main){
            //Create Instance
            main = new Main();

            //Clear Form
            clearForm();

            return main;
        }
    };

    //Instantiate array to contain employee objects
    Main.employeesArray = [];

    Main.companyName = null;

/****************************************************** Functions *****************************************************/
    // Add employee
    var addEmployee = function(){
        //Variables for form fields and error divs
        var company = document.querySelector('#company').value;
        var name = document.querySelector('#name').value;
        var position = document.querySelector('#position').value;
        var hours = document.querySelector('#hours').value;
        var vehicle = document.querySelector('#vehicle').value;
        var companyError = document.querySelector('#companyError');
        var nameError = document.querySelector('#nameError');
        var positionError = document.querySelector('#positionError');
        var hoursError = document.querySelector('#hoursError');
        var vehicleError = document.querySelector('#vehicleError');

        if(validate(company, name, position, hours, vehicle)){ // Validate form fields before adding
            if(position == "Associate"){
                var associate = new Associate(name, position, hours, vehicle);
                Main.employeesArray.push(associate); // Adds employee to static employeesArray
            } else {
                var manager = new Manager(name, position, hours);
                Main.employeesArray.push(manager); // Adds manager to static employeesArray
            }
        }
        //alert("Employee Added!");
        clearForm(name, position, hours, vehicle, companyError, nameError, positionError, hoursError, vehicleError);
    };


    var clearForm = function (name, position, hours, vehicle, companyError, nameError, positionError, hoursError, vehicleError){
        // Clears all form fields
        if(!name || name !== ""){
            document.querySelector('#name').value = "";
        }

        if(position !== "Choose Position"){
            document.querySelector('#position').value = "Choose Position";
        }

        if(!hours || hours !== ""){
            document.querySelector('#hours').value = "";
        }

        if(!vehicle || vehicle !== ""){
            document.querySelector('#vehicle').value = "";
        }

        // Clear any error messages.
        if(companyError){
            companyError.innerHTML = "";
        }

        if(nameError){
            nameError.innerHTML = "";
        }

        if(positionError){
            positionError.innerHTML = "";
        }

        if(hoursError){
            hoursError.innerHTML = "";
        }

        if(vehicleError){
            vehicleError.innerHTML = "";
        }
        console.log("Cleared!");
    };

    var displayInfo = function () {
        if(Main.employeesArray){
            var employeesList = document.querySelector('#employeesList');
            var tableData = "<table><tr><td><strong>Company</strong></td><td><strong>Name</strong></td>" +
                "<td><strong>Position</strong></td><td><strong>Avg Hours</strong></td><td><strong>Employee Vehicle</strong></td><tr>";
            var company = Main.companyName;

            for(var i = 0; i < Main.employeesArray.length; i++){
                var name = Main.employeesArray[i]['_name'];
                var position = Main.employeesArray[i]['_position'];
                var hours = Utils.getAverage(Main.employeesArray[i]['_hours'].split(','));
                if(position == 'Manager'){
                    var vehicle = Main.employeesArray[i]['_vehicle']._make;
                } else {
                    var vehicle = Main.employeesArray[i]['_vehicle'];
                }

                tableData += "<tr><td>" + company + "</td><td>" + name + "</td><td>" + position + "</td>" +
                    "<td>" + hours + "</td><td>" + vehicle + "</td></tr>";
            }

            tableData += "</table>";
            employeesList.innerHTML = tableData;
        } else {
            var displayError = document.querySelector('#displayError');
            displayError.innerHTML = "<p class='error'>No Employees Available!</p>"
        }
        console.log("We've got info!");
    };

    // Validate
    var validate = function (company, name, position, hours, vehicle) { // Checks to see if form fields are filled out. If there is an error, display it to the
        var isValid;                                                        // user.

        if(!company || company == ""){
            document.querySelector('#companyError').innerHTML = "<p class='errorText'>Please enter the company name!</p>";
            isValid = false;
        } else {
            isValid = true;
        }

        if(!name || name == ""){
            document.querySelector('#nameError').innerHTML = "<p class='errorText'>Please enter a name!</p>";
            isValid = false;
        } else {
            isValid = true;
        }

        if(!position || main.position == ""){
            document.querySelector('#positionError').innerHTML = "<p class='errorText'>Please enter a position!</p>";
            isValid = false;
        } else {
            isValid = true;
        }

        if(!hours || hours == ""){
            document.querySelector('#hoursError').innerHTML = "<p class='errorText'>Please enter employee hours!</p>";
            isValid = false;
        } else {
            isValid = true;
        }

        if(!vehicle || vehicle == ""){
            document.querySelector('#vehicleError').innerHTML = "<p class='errorText'>Please enter a vehicle!</p>";
            isValid = false;
        } else {
            isValid = true;
        }
        return isValid;
    };

/*************************************************** End Functions ****************************************************/

/*************************************************** Main Classes *****************************************************/
    //Classes

    //Employee Class (Super Class)
    var Employee = (function() {
        function Employee(name){
            console.log("Employee Created!");
            this._name = name;
        }

        Employee.prototype.toString = function(){
            return "My name is ${this._name} + and I'm an employee!";
        };

        return Employee;
    })();

    //Associate Class (Derived Class)
    var Associate = (function() {
        Associate.prototype = Object.create(Employee.prototype);

        function Associate(name, position, hours, vehicle){
            Employee.call(this, name);
            this._position = position;
            this._hours = hours;
            this._vehicle = vehicle;
            alert(this.toString());
        }

        Associate.prototype.toString = function(){
            return "My name is " + this._name + ". I am a(n) " + this._position + " at " + Main.companyName + "!";
        };

        return Associate;
    })();

    //Manager Class (Derived Class)
    var Manager = (function() {
        Manager.prototype = Object.create(Employee.prototype);

        function Manager(name, position, hours){
            Employee.call(this, name);
            this._position = position;
            this._hours = hours;
            this._vehicle = new CompanyCar();
            alert(this.toString());
        }

        function CompanyCar(){
            this._make = "BMW";
            this._model = "3 Series";
            this._type = "Compact";
            console.log("Company Car Created!");
        }

        Manager.prototype.toString = function(){
            return "My name is " + this._name + ". I am a(n) " + this._position + " at " + Main.companyName + "!" +
                " I drive a " + this._vehicle._make + "!";
        };

        return Manager;
    })();

    //Composition Class
    var CompanyCar = (function(){
        function CompanyCar(){
            this._make = "BMW";
            this._model = "3 Series";
            this._type = "Compact";
            console.log("Company Car Created!");
        }

        CompanyCar.prototype.toString = function(){
            return this._make;
        }
    })();

    //Event Listeners
    document.querySelector('#add').addEventListener('click', addEmployee);
    document.querySelector('#done').addEventListener('click', displayInfo);

    document.querySelector('#company').addEventListener('blur', function(){
        Main.companyName = document.querySelector('#company').value;
    });

    return Main
})();
/*************************************************** Main Classes End *************************************************/

/************************************************** Utility Class Begin ************************************************/

//Utility Class
class Utils {
    constructor() {

    }

    static getAverage(array) {
        let total = 0;
        array.forEach(function (e) {
            total += Number.parseInt(e);
        });
        return total / array.length;
    }
}