/** Data cleaner that returns an array of coordinates set from the tables **/
function DataCleaner(weekday, timestamp){
    /** Define an array to store the cleaned data **/
    var dataReady = [];

    /** Set a time time parser to parse the time**/
    var parseTime = d3.timeParse("%d/%m/%Y %H:%M");
    var parseSelectedTime = d3.timeParse("%H:%M");

    /** Parse the selected time**/
    var selectedTimestamp = parseSelectedTime(timestamp);

    /**Check if the input timestamp is legal**/
    if(selectedTimestamp === null){
        alert("INVALID INPUT");
        document.getElementById("timestamp_input").value = "08:00";
        selectedTimestamp = parseSelectedTime("08:00");
    }
    var hour = selectedTimestamp.getHours();
    var minute = selectedTimestamp.getMinutes();
    if(minute % 10 !== 0 || hour < 8 || hour > 23){
        alert("INVALID, Time is from  8:00 AM to 23:00 PM");
        document.getElementById("timestamp_input").value = "08:00";
        selectedTimestamp = parseSelectedTime("08:00");
    }

    /** Identify the timestamp table depends on the input of weekday **/
    var currentTable;
    if(weekday === "Friday"){
        currentTable = TABLES["visitorsCountPerM_10mins_Fri"];
    }else if(weekday === "Saturday"){
        currentTable = TABLES["visitorsCountPerM_10mins_Sat"];
    }else{
        currentTable = TABLES["visitorsCountPerM_10mins_Sun"];
    }

    /** Data cleaner **/
    currentTable.forEach(function (d){
        /** Parse the timestamp in table for comparison **/
        var tableTimestamp = parseTime(d["Timestamp"])
        if(tableTimestamp.getHours() === selectedTimestamp.getHours() && tableTimestamp.getMinutes() === selectedTimestamp.getMinutes()){
            var currentTimestampData = Object.values(d);
            currentTimestampData.pop(); //remove the timpstamp node
            currentTimestampData.forEach(function (d){
                dataReady.push(
                    [
                        +d
                    ]
                )
            })
        }
    });
    return dataReady;
}

function decrement(){
    /** Get the value of timestamp from DOM **/
    var timestamp = document.getElementById("timestamp_input").value;

    /** Split the timestamp into hour and minute in integer **/
    var res = timestamp.split(":");//["08","00"]
    var hour = +res[0], minute = +res[1];

    if(minute === 0){
        if(hour === 8){
            alert("INVALID, Time is from  8:00 AM to 23:00 PM");
        } else{
            hour -= 1;
            minute = 60 -10;
        }
    }else{
        minute -= 10;
    }

    /** Format the Timestamp **/
    hour = hour.toString().padStart(2, "0");
    minute = minute.toString().padStart(2, "0");
    timestamp = hour + ":" + minute;

    /** Set incremented timestamp and call method to update graph **/
    document.getElementById("timestamp_input").value = timestamp;
    animatedSize();
}

function increment(){
    /** Get the value of timestamp from DOM**/
    var timestamp = document.getElementById("timestamp_input").value;

    /** Split the timestamp into hour and minute in integer **/
    var res = timestamp.split(":");//["08","00"]
    var hour = +res[0], minute = +res[1];

    if(hour < 23){ // From 8 am to 23 pm
        minute += 10; // increment minute by 10
        if(minute === 60){ // From 0 minute to 60 minute
            minute = 0;
            hour += 1;
        }
    } else{
        alert("INVALID, Time is from  8:00 AM to 23:00 PM");
    }
    /** Format the timestamp **/
    hour = hour.toString().padStart(2, "0");
    minute = minute.toString().padStart(2, "0");
    timestamp = hour + ":" + minute;

    /** Set incremented timestamp and call method to update graph **/
    document.getElementById("timestamp_input").value = timestamp;
    animatedSize();
}

function reset(){
    /** Reset the input timestamp **/
    document.getElementById("timestamp_input").value = "08:00";
    animatedSize();
}


