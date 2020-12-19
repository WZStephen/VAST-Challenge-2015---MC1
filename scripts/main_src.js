var image_svg, chart_svg,group_svg, averageBar_svg,groupVis_svg;
var margin = { top: 20, right: 60, bottom: 60, left: 100 };
var width = 800 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;
var x, y;
var radiusScale;

var TABLES;
var ride_details;
var visitorsCountPerM_Fri;
var visitorsCountPerM_Sat;
var visitorsCountPerM_Sun;
var visitorsCountPerM_10mins_Fri;
var visitorsCountPerM_10mins_Sat;
var visitorsCountPerM_10mins_Sun;
var visitorsCountPerM_10mins;
var groups_and_type;
var Top10VisualizeData;
var averageRideAttend;
/** This runs when the page is loaded **/
document.addEventListener('DOMContentLoaded', function() {
    image_svg = d3.select("#image-svg");
    chart_svg = d3.select("#chart-svg");
    group_svg = d3.select("#groups-svg");
    groupVis_svg = d3.select("#groupVis-svg");
    averageBar_svg = d3.select("#averageBar-svg");

    /** Load both files before doing anything else **/
    Promise.all(
        [
            d3.csv("datacleaner/data/Ride-Details.csv"),
            d3.csv("datacleaner/data/visitorsCountPerM_Fri.csv"),
            d3.csv("datacleaner/data/visitorsCountPerM_Sat.csv"),
            d3.csv("datacleaner/data/visitorsCountPerM_Sun.csv"),
            d3.csv("datacleaner/data/visitorsCountPerM_10mins_Fri.csv"),
            d3.csv("datacleaner/data/visitorsCountPerM_10mins_Sat.csv"),
            d3.csv("datacleaner/data/visitorsCountPerM_10mins_Sun.csv"),
            d3.csv("datacleaner/data/visitorsCountPerM_10mins.csv"),
            d3.csv("datacleaner/data/groups_and_type.csv"),
            d3.csv("datacleaner/data/Top10VisualizeData.csv"),
            d3.csv("datacleaner/data/averageRideAttend.csv")
        ]
    ).then(function(values){
        ride_details = values[0];
        visitorsCountPerM_Fri = values[1];
        visitorsCountPerM_Sat = values[2];
        visitorsCountPerM_Sun = values[3];
        visitorsCountPerM_10mins_Fri = values[4];
        visitorsCountPerM_10mins_Sat = values[5];
        visitorsCountPerM_10mins_Sun = values[6];
        visitorsCountPerM_10mins = values[7];
        groups_and_type = values[8];
        Top10VisualizeData = values[9];
        averageRideAttend = values[10];
        TABLES = {
            "ride_details": ride_details,
            "visitorsCountPerM_Fri": visitorsCountPerM_Fri,
            "visitorsCountPerM_Sat": visitorsCountPerM_Sat,
            "visitorsCountPerM_Sun": visitorsCountPerM_Sun,
            "visitorsCountPerM_10mins_Fri": visitorsCountPerM_10mins_Fri,
            "visitorsCountPerM_10mins_Sat": visitorsCountPerM_10mins_Sat,
            "visitorsCountPerM_10mins_Sun": visitorsCountPerM_10mins_Sun,
            "visitorsCountPerM_10mins": visitorsCountPerM_10mins
        }
        /** 1st Row **/
        drawImage();
        charSelection("Friday", "1"); // This is an initial vis when load in the page

        /** 2nd  Row**/
        drawPieChart();
        drawTreeMap();
        drawAverageBarChart();
    })
});
