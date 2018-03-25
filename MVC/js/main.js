/**
 * Created by malcolmross on 1/17/18.
 */

window.addEventListener('load', function() {
    console.log("Page Loaded!");

    Ross_DPW.getInstance();
});

class Ross_DPW {
    constructor() {
        console.log("Singleton Created");
        console.log("Start Code Here!!!!");
        this.controller = new Controller();
        Ross_DPW.glucoseDataArray = [];
    }

    static getInstance() {
        let ross_DPW = null; // Keeps track of current instance.

        //Check if there is an instance variable attached to the class.
        //If there is one, don't create another one. If not, then create one.
        if(!ross_DPW){
            //Create instance
            ross_DPW = new Ross_DPW();
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
        document.querySelector('#submit').addEventListener('click', this.IsValid.bind(this));
    }

    IsValid(){
        let name = document.querySelector('#name').value;
        let type = document.querySelector('#type').value;
        let glucose  = document.querySelector('#glucose').value;
        let nameError = document.querySelector('#nameError');
        let typeError = document.querySelector('#typeError');
        let glucoseError = document.querySelector('#glucoseError');

        let isValid = Model.Validate(name, type, glucose, nameError, typeError, glucoseError);

        if(isValid){
            this.Process(name, type, glucose);
        }
    }

    Process(name, type, glucose){
        let diabeticObject = this.model.ProcessData(name, type, glucose);
        let data;
        let feedback;
        let a1c;
        let avgGlucose;

        data = diabeticObject['data'];
        feedback = diabeticObject['feedback'];
        a1c = diabeticObject['a1c'];
        avgGlucose = diabeticObject['avgGlucose'];

        if(data && avgGlucose && feedback && a1c){
            this.AddData(data, avgGlucose, feedback, a1c);
        }
    }

    AddData(data, avgGlucose, feedback, a1c){
        if(data && avgGlucose && feedback && a1c){
            let glucoseDataObj = {
                data: data,
                avgGlucose: avgGlucose,
                feedback: feedback,
                a1c: a1c
            };
            Ross_DPW.glucoseDataArray.push(glucoseDataObj);
            this.view.DisplayGlucoseData();
        }
    }

}

class Model {
    constructor() {
        console.log("Model Created!");
    }

    //Validate form fields before further processing is done.
    static Validate(name, type, glucose, nameError, typeError, glucoseError) {
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

        return isValid;
    }

    //Process the data from the form.
    ProcessData(name, type, glucose){
        let data = new GlucoseDataObject(name, type, glucose);
        let goodFeedback = ["Keep up the good work!", "You're awesome at this!", "Looks like you have your health figured out!"];
        let carefulFeedback = ["You're doing well, but there's room for improvement", "It could be worse, but I'll take it.", "With a little work, you'll be perfect."];
        let poorFeedback = ["Looks like you could use some tips.", "I know you can do better.", "I've seen better."];
        let rand = Math.floor(Math.random() * 3);
        let feedback = "";
        let avgGlucose = Utils.getAverage(data['_glucoseVals'].split(","));
        let a1c = (46.7 + avgGlucose) / 28.7;

        if(a1c < 7){
            feedback = goodFeedback[rand];
        } else if (a1c > 7 && a1c < 8){
            feedback = carefulFeedback[rand];
        } else { // If we get here, we can safely assume the A1C is greater than 8, which is bad...
            feedback = poorFeedback[rand];
        }

        return {
            data: data,
            feedback: feedback,
            avgGlucose: avgGlucose.toFixed(2),
            a1c: a1c.toFixed(2)
        };
    }
}

class View {
    constructor() {
        console.log("View Created!");
        this.glucoseDataArray = [];
    }

    DisplayGlucoseData(){
        let glucoseData = document.querySelector('#glucoseData');
        glucoseData.innerHTML = "";
        let name;
        let type;
        let avgGlucose;
        let a1c;
        let feedback;
        let glucoseDataContent = "<table><thead><tr><th scope='col'><strong>Name</strong></th><th scope='col'><strong>Diabetes Type</strong></th><th scope='col'><strong>Avg Glucose</strong></th>" +
            "<th scope='col'><strong>A1C</strong></th><th scope='col'><strong>Feedback</strong></th></tr></thead><tbody>";

        for(let i = 0; i < Ross_DPW.glucoseDataArray.length; i++){
            name = Ross_DPW.glucoseDataArray[i]['data']['_name'];
            type = Ross_DPW.glucoseDataArray[i]['data']['_type'];
            avgGlucose = Ross_DPW.glucoseDataArray[i]['avgGlucose'];
            a1c = Ross_DPW.glucoseDataArray[i]['a1c'];
            feedback = Ross_DPW.glucoseDataArray[i]['feedback'];
        }

        glucoseDataContent += "<tr><th scope='row'>" + name + "</th><td>" + type + "</td><td>" + avgGlucose + "</td><td>" +
            a1c + "</td><td>" + feedback + "</td></tr>";

        glucoseDataContent += "</tbody></table>";
        glucoseData.innerHTML = glucoseDataContent;
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