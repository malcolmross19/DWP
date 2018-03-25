//Event Listeners

window.addEventListener('load', function() {
    //Instantiate variables
    let name = document.querySelector('#name').value;
    //let age = document.querySelector('#age').value;
    let position = document.querySelector('#position').value;
    let hours = document.querySelector('#hours').value;
    let vehicle = document.querySelector('#vehicle').value;
    let companyError = document.querySelector('#companyError');
    let nameError = document.querySelector('#nameError');
    //let ageError = document.querySelector('#ageError');
    let positionError = document.querySelector('#positionError');
    let hoursError = document.querySelector('#hoursError');
    let vehicleError = document.querySelector('#vehicleError');

    //Clear form
    name.value = "Your Name";
    //age.value = "Your Age";
    position.value = "Manager or Associate";
    hours.value = "Your Hours";
    vehicle.value = "Your Vehicle";

    //Initialize array to contain employees
    EmployeeRoster.employees = [];

    //Instantiate Employee Class
    let employeeRoster = new EmployeeRoster(EmployeeRoster.employees);

    //Create and assign the Employee class its company name.
    EmployeeRoster.companyName = document.querySelector('#company');

    //Add event listeners
    document.querySelector('#add').addEventListener('click', employeeRoster.addEmployee);
    document.querySelector('#done').addEventListener('click', employeeRoster.displayInfo);

    //Event handlers for form validation
    document.querySelector('#company').addEventListener('blur', function(){
        if(document.querySelector('#company').value == "Company Name" || document.querySelector('#company').value == ""){
            companyError.innerHTML = "<p class='errorText'>Please enter the company name!</p>";
        } else {
            companyError.innerHTML = "";
        }
    });
    document.querySelector('#name').addEventListener('blur', function(){
        if (document.querySelector('#name').value == "Your Name" || document.querySelector('#name').value == ""){
            nameError.innerHTML = "<p class='errorText'>Please enter a name!</p>";
            return false;
        } else {
            nameError.innerHTML = "";
        }
    });
    /*
    document.querySelector('#age').addEventListener('blur', function(){
        if(document.querySelector('#age').value == "Your Age" || document.querySelector('#age').value == "") {
            ageError.innerHTML = "<p class='errorText'>Please enter an age!</p>";
            return false;
        } else {
            ageError.innerHTML = "";
        }
    });
    */
    document.querySelector('#position').addEventListener('blur', function(){
        if(document.querySelector('#position').value == "Manager or Associate" || document.querySelector('#position').value == ""){
            positionError.innerHTML = "<p class='errorText'>Please enter a position!</p>";
            return false;
        } else {
            positionError.innerHTML = "";
        }
    });
    document.querySelector('#hours').addEventListener('blur', function(){
        if(document.querySelector('#hours').value == "Your Hours" || document.querySelector('#hours').value == ""){
            hoursError.innerHTML = "<p class='errorText'>Please enter employee hours!</p>";
            return false;
        } else {
            hoursError.innerHTML = "";
        }
    });
    document.querySelector('#vehicle').addEventListener('blur', function(){
        if(document.querySelector('#vehicle').value == "Your Vehicle" || document.querySelector('#vehicle').value == ""){
            vehicleError.innerHTML = "<p class='errorText'>Please enter a vehicle!</p>";
            return false;
        } else {
            vehicleError.innerHTML = "";
        }
    });
    document.querySelector('#name').addEventListener('focus', function(){
        document.querySelector('#name').value = "";
        document.querySelector('#name').style.color = '#000';
    });
    /*
    document.querySelector('#age').addEventListener('focus', function(){
        document.querySelector('#age').value = "";
        document.querySelector('#age').style.color = '#000';
    });
    */
    document.querySelector('#position').addEventListener('focus', function(){
        document.querySelector('#position').value = "";
        document.querySelector('#position').style.color = '#000';
    });
    document.querySelector('#hours').addEventListener('focus', function(){
        document.querySelector('#hours').value = "";
        document.querySelector('#hours').style.color = '#000';
    });
    document.querySelector('#vehicle').addEventListener('focus', function(){
        document.querySelector('#vehicle').value = "";
        document.querySelector('#vehicle').style.color = '#000';
    });
    console.log("Loaded...");
}, false);

/********************************************************************************************************************/

//App Class
class EmployeeRoster {
    constructor(employees){
        this.employees = employees;
    }

    addEmployee() {
        //Get the form
        let inputs = document.getElementsByTagName('input');
        let errors = [];

        //Check the input fields for empty values
        for(let i = 0; i < inputs.length; i++){
            if(inputs[i].value == "" || inputs[i].value == "Your Name" || /*inputs[i].value == "Your Age" || */
                inputs[i].value == "Manager or Associate" || inputs[i].value == "Your Hours" ||
                inputs[i].value == "Your Vehicle"){
                let error = "Field " + inputs[i].getAttribute('id') + " left blank.";
                errors.push(error);
                inputs[i].value = "You can not leave this blank!";
                inputs[i].style.color = 'red';
            }
        }

        if(errors.length < 1){
            let nameString = document.querySelector('#name').value;
            //let age = document.querySelector('#age').value;
            let position = document.querySelector('#position').value;
            let hours = document.querySelector('#hours').value;
            let vehicle = document.querySelector('#vehicle').value;
            if (document.querySelector('#position').value == "Manager" || document.querySelector('#position').value == 'manager') {
                let manager = new Manager(nameString, /*age,*/ position, hours, vehicle);
                manager.position = "Manager";
                EmployeeRoster.employees.push(manager);
            } else {
                let associate = new Associate(nameString, /*age,*/ position, hours, vehicle);
                associate.position = "Associate";
                EmployeeRoster.employees.push(associate);
            }
            document.querySelector('#name').value = "";
            //document.querySelector('#age').value = "";
            document.querySelector('#position').value = "";
            document.querySelector('#hours').value = "";
            document.querySelector('#vehicle').value = "";
            alert("Employee Added!");
        }
    }

    displayInfo(){
        let employees = EmployeeRoster.employees;
        let company = EmployeeRoster.companyName.value;
        if(employees){
            let employeesList = document.querySelector('#employeesList');
            let tableData = "<table><tr><td><strong>Company</strong></td><td><strong>Name</strong></td>" +
                /*"<td><strong>Age</strong></td>*/"<td><strong>Position</strong></td>" +
                "<td><strong>Avg Hours</strong></td><td><strong>Employee Vehicle</strong></td><tr>";

            for(let i = 0; i < employees.length; i++){
                let name = employees[i]['name'];
                //let age = Number.parseInt(employees[i]['age']);
                let position = employees[i]['position'];
                let hours = Utils.getAverage(employees[i]['hours'].split(','));
                if(position == 'Associate'){
                    let vehicle = employees[i]['vehicle'].value;
                } else {
                    let vehicle = employees[i]..toString();
                }

                tableData += "<tr><td>" + company + "</td><td>" + name +
                    "</td><td>" + /*age +*/ "</td><td>" + position + "</td>" +
                    "<td>" + hours + "</td><td>" + vehicle + "</td></tr>";
            }

            tableData += "</table>";
            employeesList.innerHTML = tableData;
        } else {
            let displayError = document.querySelector('#displayError');
            displayError.innerHTML = "<p class='error'>No Employees Available!</p>"
        }
    }
}


/********************************************************************************************************************/

//Super Class
class Employee {
    constructor(name/*, age*/) {
        this.name = name;
        //this.age = age;
    }
}

/********************************************************************************************************************/

//Derived classes
class Associate extends Employee {
    constructor(name, /*age,*/ position, hours, vehicle) {
        super(name/*, age*/);
        this.position = position;
        this.hours = hours;
        this.vehicle = vehicle;
    }

}

class Manager extends Employee {
    constructor(name, position, hours, vehicle){
        super(name);
        this.position = "Manager";
        this.hours =  hours;
        this.vehicle = new CompanyCar();
    }
}

/********************************************************************************************************************/

//Composition Classes

class CompanyCar {
    constructor(){
        this.make = "BMW";
        this.model = "3 Series"
        this.type = "Compact"
    }

    toString(){
        return '$[this.make}';
    }
}


/********************************************************************************************************************/

//Utility Class
class Utils{
    constructor(){

    }
    static getAverage(array){
        let total = 0;
        array.forEach(function(e){
            total += Number.parseInt(e);
        });
        return total / array.length;
    }
}

/********************************************************************************************************************/


