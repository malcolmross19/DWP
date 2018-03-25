/**
 * Created by malcolmross on 1/17/18.
 */

// Malcolm Ross
// Static Variable Used On Line 166

window.addEventListener('load', function() {
    console.log("Page Loaded!");

    Assignment.getInstance();
});

class Assignment {
    constructor() {
        console.log("Singleton Created");
        console.log("Start Code Here!!!!");
        this.controller = new Controller();
        Assignment.glucoseDataArray = [];
    }

    static getInstance() {
        let assignment = null; // Keeps track of current instance.

        //Check if there is an instance variable attached to the class.
        //If there is one, don't create another one. If not, then create one.
        if(!assignment){
            //Create instance
            assignment = new Assignment();
        }

        document.querySelector('#name').addEventListener('blur', function() {
            if(document.querySelector('#name').value){
                document.querySelector('#nameError').innerHTML = "";
                document.querySelector('#nameError').style.display = "none";
            }
        });

        document.querySelector('#type').addEventListener('blur', function() {
            if(document.querySelector('#type').value){
                document.querySelector('#typeError').innerHTML = "";
                document.querySelector('#typeError').style.display = "none";
            }
        });

        document.querySelector('#glucose').addEventListener('blur', function() {
            if(document.querySelector('#glucose').value){
                document.querySelector('#glucoseError').innerHTML = "";
                document.querySelector('#glucoseError').style.display = "none";
            }
        });
    }
}

class Controller {
    constructor() {
        console.log("Controller Created!");
        this.model = new Model();
        this.view = new View();
        Controller.glucoseDataArray = [];
        document.addEventListener('data-processed', this.AddData);

        Controller.__proto__.IsValid = function () {
            let evt = new Event('form-submit');
            evt.nameField = document.querySelector('#name').value;
            evt.glucoseTypeField = document.querySelector('#type').value;
            evt.glucoseValsField = document.querySelector('#glucose').value;
            document.dispatchEvent(evt);
        };

        //Click event on form submit button
        document.querySelector('#submit').addEventListener('click', this.IsValid);
    }

    IsValid(){
        let submitEvt = new Event('form-submit');
        let nameField = document.querySelector('#name').value;
        let glucoseTypeField = document.querySelector('#type').value;
        let glucoseValsField = document.querySelector('#glucose').value;
        submitEvt.glucoseDataObject = new GlucoseDataObject(nameField, glucoseTypeField, glucoseValsField);
        document.dispatchEvent(submitEvt);

        let isValid;

        if(isValid){
            document.dispatchEvent(new Event('form-validated'));
        }
    }

    AddData(e){
        let nameVal = e['nameVal'];
        let typeVal = e['typeVal'];
        let avgGlucose = e['avgGlucose'];
        let a1c = e['a1c'];
        let feedback = e['feedback'];

        Controller.glucoseDataArray.push({nameVal, typeVal, avgGlucose, a1c, feedback});

        let dataAdded = new Event('data-added');
        dataAdded.data = Controller.glucoseDataArray;
        document.dispatchEvent(dataAdded);
    }

}

class Model {
    constructor() {
        console.log("Model Created!");
        document.addEventListener('form-submit', this.Validate);
        document.addEventListener('form-validated', this.ProcessData);
    }

    //Validate form fields before further processing is done.
    Validate(e) {
        let name = e['glucoseDataObject']['_name'];
        let type = e['glucoseDataObject']['_type'];
        let glucose  = e['glucoseDataObject']['_glucoseVals'];
        let nameError = document.querySelector('#nameError');
        let typeError = document.querySelector('#typeError');
        let glucoseError = document.querySelector('#glucoseError');
        let isValid;

        if(!name || name == ""){
            nameError.style.display = "inline-block";
            nameError.innerHTML = "<p class='errorText'>Name field can not be left blank!</p>"
            isValid = false;
        } else {
            isValid = true;
        }

        if(!type || type == ""){
            typeError.style.display = "inline-block";
            typeError.innerHTML = "<p class='errorText'>Diabetes type can not be left blank!</p>";
            isValid = false;
        } else {
            isValid = true;
        }

        if(!glucose || glucose == ""){
            glucoseError.style.display = "inline-block";
            glucoseError.innerHTML = "<p class='errorText'>Glucose field can not be left blank!</p>";
            isValid = false;
        } else {
            isValid = true;
        }

        if(isValid){
            let formValidated = new Event('form-validated');
            formValidated.nameVal = name;
            formValidated.typeVal = type;
            formValidated.glucoseVals = glucose;
            document.dispatchEvent(formValidated);
        }
    }

    //Process the data from the form.
    ProcessData(e){ //Change this so Data Object is created in Controller and then passed to the Model
        let nameVal = e['nameVal'];
        let typeVal = e['typeVal'];
        let glucoseVals = e['glucoseVals'];
        let goodFeedback = ["Keep up the good work!", "You're awesome at this!", "Looks like you have your health figured out!"];
        let carefulFeedback = ["You're doing well, but there's room for improvement", "It could be worse, but I'll take it.", "With a little work, you'll be perfect."];
        let poorFeedback = ["Looks like you could use some tips.", "I know you can do better.", "I've seen better."];
        let rand = Math.floor(Math.random() * 3);
        let feedback = "";
        let avgGlucose = Utils.getAverage(glucoseVals.split(","));
        let a1c = (46.7 + avgGlucose) / 28.7;

        if(a1c < 7){
            feedback = goodFeedback[rand];
        } else if (a1c > 7 && a1c < 8){
            feedback = carefulFeedback[rand];
        } else { // If we get here, we can safely assume the A1C is greater than 8, which is bad...
            feedback = poorFeedback[rand];
        }

        //Fire custom event here
        let dataProcessed = new Event('data-processed');
        dataProcessed.nameVal = nameVal;
        dataProcessed.typeVal = typeVal;
        dataProcessed.avgGlucose = avgGlucose.toFixed(2);
        dataProcessed.a1c = a1c.toFixed(2);
        dataProcessed.feedback = feedback;
        document.dispatchEvent(dataProcessed);
    }
}

class View {
    constructor() {
        console.log("View Created!");
        document.addEventListener('data-added', this.DisplayGlucoseData);
    }

    DisplayGlucoseData(e){
        let glucoseData = document.querySelector('#glucoseData');
        let form = document.querySelector('#glucoseTracker');
        glucoseData.innerHTML = "";
        let glucoseDataContent = "<table><thead><tr><th scope='col'><strong>Name</strong></th><th scope='col'><strong>Diabetes Type</strong></th><th scope='col'><strong>Avg Glucose</strong></th>" +
            "<th scope='col'><strong>A1C</strong></th><th scope='col'><strong>Feedback</strong></th></tr></thead><tbody>";

        for(let i = 0; i < e.data.length; i++){
            glucoseDataContent += "<tr><th scope='row'>" + e['data'][i]['nameVal'] + "</th><td>" + e['data'][i]['typeVal'] +
                "</td><td>" + e['data'][i]['avgGlucose'] + "</td><td>" + e['data'][i]['a1c'] + "</td><td>" +
                e['data'][i]['feedback'] + "</td></tr>";
        }

        glucoseDataContent += "</tbody></table>";
        glucoseData.innerHTML = glucoseDataContent;

        form.reset();
    }
}

class GlucoseDataObject {
    constructor(name, type, glucoseVals) {
        console.log("Data Object Created!");
        this._name = name;
        this._type = type;
        this._glucoseVals = glucoseVals;
    }
}

