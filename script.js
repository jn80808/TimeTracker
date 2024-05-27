// table row from body 
const tableBodyTrs = document
    .querySelector(".tableBody")
    .querySelectorAll(".tr");
//console.log(tableBodyTrs);


function createForm() {
    let form = document.createElement("form");

    form.innerHTML = `
    <th>
        <input type="text" class="pink" placeholder="Enter Task " />
    </th>

    <td>
    <input type="Date" class="blackRed" id="Date" />
    </td>

    <td>
        <input type="time" class="green" id="Start-Time" />
    </td>
    <td>
        <input type="time" class="blue" id="Start-Break" />
    </td>
    <td>
        <input type="time" class="blue" id="end-Break" />
    </td>
    <td>
        <input type="time" class="green" id="end-Time" />
    </td>
    <td>
        <input  class="workedHours purple" value="00:00" disabled/>
    </td>
    <td> <button class="btn" type="submit"> Add </button> </td>
`

return form; 

}

//console.log(createForm());

// List Form for each row 
(async () => {
    tableBodyTrs.forEach(tr => tr.appendChild(createForm()))

})();


// List of Element 
const forms = document.querySelectorAll("form");
console.log(forms);

forms.forEach(form => form.addEventListener("submit", function(e){
    e.preventDefault();

    const AddTask = e.target.children[0].value;
    const Date = e.target.children[1].value
    const StartTime = e.target.children[2].value;
    const StartBreak = e.target.children[3].value;
    const EndBreak = e.target.children[4].value;
    const EndTime = e.target.children[5].value;
    let workedHD = e.target.children[6];
    let submitBtn = e.target.children[7];
/*
    console.log("AddTask: ",AddTask)
    console.log("StartTime: ",StartTime)
    console.log("StartBreak: ",StartBreak)
    console.log("EndBreak: ",EndBreak)
    console.log("EndTime: ",EndTime)
    console.log("workedHD: ",workedHD)
    console.log("submitBtn: ",submitBtn)
*/

    //Validation
    ValidateSubmission(AddTask,StartTime,EndTime,submitBtn);

    //Calculation for daily hours worked 
    workedHD.value = CalcDailyWorkedHours(StartTime,EndTime,StartBreak,EndBreak);

    //Calc Total Hours worked 
    calculatedTotalWorkedHours();

}))


//Creat Function Implementing Form Validation on Submission
function ValidateSubmission(AddTask, StartTime, EndTime, submitBtn){
    if (AddTask ==="" || StartTime === "" || EndTime === "") {
        alert("Input Error: Missing values in 'AddTask', 'StartTime', or 'EndTime'. Please provide the required information.");
    }else {
        submitBtn.classList.add("btn-green");
        submitBtn.innerHTML = "&#10004"; //  Character Entities :for check icon 
        return true
    }

}


//Create a Function to Calculate Daily Worked Hours

function CalcDailyWorkedHours(StartTime, EndTime, StartBreak, EndBreak){
    StartTime = StartTime.split(":")
    EndTime = EndTime.split(":")
    StartBreak = StartBreak.split(":")
    EndBreak = EndBreak.split(":")


    //------StartTimeDate & EndTimeDate------//
    //convert  array to date format 
    const StartTimeDate = new Date(0,0,0,StartTime[0], StartTime [1], 0);
    const EndTimeDate = new Date(0,0,0,EndTime[0], EndTime[1], 0);

    //calculate difference StartTimeDate & EndTimeDate 
    const diffSETime = EndTimeDate.getTime() - StartTimeDate.getTime();
    console.log("difference StartTimeDate & EndTimeDate : ", diffSETime);

    //------StartBreakDate & EndBreakDate------//
    //convert  array to date format 
    const StartBreakDate = new Date(0,0,0,StartBreak[0], StartBreak [1], 0);
    const EndBreakDate = new Date(0,0,0,EndBreak[0], EndBreak[1], 0);
    console.log(EndBreakDate)
    //calculate difference StartBreakDate & EndBreakDate
    const diffBreakTime = EndBreakDate.getTime() - StartBreakDate.getTime();
    console.log("difference StartBreakDate & EndBreakDate : ", diffBreakTime);

    //Final Calculation Time

    let diffFinalCalcTime = (isNaN(diffSETime)? 0 : diffSETime) -  (isNaN(diffBreakTime)? 0 : diffBreakTime) ;


    // convert into hours and minutes
    let hours = Math.floor(diffFinalCalcTime / 1000 / 60 / 60);
    let minutes = Math.floor((diffFinalCalcTime % (1000 * 60 * 60)) / 1000 / 60);

    console.log("diffFinalCalcTime", diffFinalCalcTime);

    // Format hours and minutes to be 2 digits
    let formattedHours = hours < 10 ? "0" + hours : hours;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    let calctime = formattedHours + ":" + formattedMinutes;

    console.log("calctime", calctime);

    return calctime;
}



//Create a Function to calculate total worked hourse 

function calculatedTotalWorkedHours(){

    const allWorkedHours = document.querySelectorAll(".workedHours");
    //console.log("allWorkedHours",allWorkedHours);

    let arrayOfWorkedHours = Array.from(allWorkedHours);
    //console.log(arrayOfWorkedHours);

    let newWorkedHours = arrayOfWorkedHours.map((workedhours) => workedhours.value);
    console.log("newWorkedHours",newWorkedHours);

    let arrWork =[];
    arrWork.push(newWorkedHours); //arrayworked
    console.log(arrWork);

    //hours+minutes 
    let convertedHours = newWorkedHours.map((el) => {
        const [hours,minutes] =el.split(":");
        return parseInt(hours)*60 + parseInt(minutes);
    });
    console.log("convertedHours",convertedHours)

    let calcTotalHoursWorked = convertedHours.reduce(
        (partialSum,a) => parseInt (partialSum + a),0 );

    document.getElementById("totalWorkedHours").value = minuteToHoursAndMinutes(calcTotalHoursWorked);
}

function minuteToHoursAndMinutes (minutes){
    const hours = Math.floor(minutes / 60) ;
    const mins = minutes % 60 ;
    return (hours+"").padStart(2,"0") + ":" + (mins + "").padStart (2,"0");
}