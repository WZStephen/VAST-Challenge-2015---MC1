var global_parkIndex;
/** Draw the scatter plot on scatter plot svg**/
function drawImage() {
    var colorScale = d3.scaleOrdinal()
        .domain(ride_details.map(function (d){return d["type"]}))
        .range([
            "#FF00FF", "#fd5e00",  "#000080","#C0C0C0",
            "#00FFFF", "#008080", "#b8a101", "#317231",
            "#FFFF00", "#808000","#FF0000", "#0000FF",
            "#FFFFFF", "#13fc00"]);

    /** Load the park map as a image into svg in size of 800 x 800 **/
    image_svg.append('image')
        .attr("opacity", 0.4)
        .attr('xlink:href', 'images/park-map.jpg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    /** Scale linear of X & Y axis**/
    x = d3.scaleLinear()
        .domain([0,100]) //[0,99]
        .range([0, 800]); //[0, 800]

    y = d3.scaleLinear()
        .domain([0,100]) //[11,99]
        .range([800, 0]);//[88,792]

    var elemEnter = image_svg.selectAll("dot")
        .data(ride_details)
        .enter()
        .append('g')
        .attr("class", "circleEle");

    elemEnter.append("circle")
        .attr("cx", function (d){return x(+d['x-coor entrance']);})
        .attr("cy", function (d){return y(+d['y-coor entrance']);})
        .attr("r", 5)
        .attr("stroke", "black")
        .style("opacity", 0.8)
        .style("fill", function(d){return colorScale(d['type']);})
        .attr("id", function (d){return d['Park Guide Index']});

    /** define mouse hover html elements **/
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    image_svg.selectAll(".circleEle")
        .on("mouseover", function(d){
            //var r = +d3.select(this).select("circle").attr("r")
            d3.select(this).selectAll("circle")
                .transition()
                .duration(50)
                .style('opacity', 0.85)
                .attr("stroke-width", "3")
                .style("stroke", "steelblue")
                .attr("fill", "none")
                //.attr("r", (r+5).toString());
            tooltip.transition()
                .duration(50)
                .style("opacity", 0.85);
            tooltip.html(d["Real World Type"])
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY -15) + "px")
                .style("font-size", "12px")
                .style("font-weight", "700");
        })
        .on('mouseout', function() {
            //var r = +d3.select(this).select("circle").attr("r")
            d3.select(this).selectAll("circle")
                .transition()
                .duration(50)
                .style('opacity', 1)
                .attr("stroke-width", "0.5")
                .style("stroke", "black")
                .attr("fill", "none")
                //.attr("r", (r-5).toString());

            /** Cancel Hover text player event **/
            tooltip.transition()
                .duration(50)
                .style("opacity", 0);
        })
        .on('click', function (d,i){
            var statistics_selection = document.getElementById("statistics_selection").value;
            if(statistics_selection === "line_chart"){
                charSelection(selected_weekday, d["Park Guide Index"]);
            }else if(statistics_selection === "bar_chart"){
                charSelection(selected_weekday, d["Park Guide Index"]);
            }
        });

    /** Current year background indicator **/
    var selected_weekday = document.getElementById("week_days").value;
    var selected_timestamp = document.getElementById("timestamp_input").value;
    image_svg.append("text")
        .text(selected_weekday + " - " + selected_timestamp)
        .style("font-size", "30px")
        .style("font-weight", "700")
        .style("fill", "white")
        .style("text-decoration", "underline")
        .attr("id", "background_indicator")
        .attr('opacity', 0.9)
        .attr("transform", "translate(" + (100) + "," + (30) + ")")
        .style("text-anchor", "middle");

    /** Add legend **/
    image_svg.append("circle").attr("cx",20).attr("cy",50).attr("r", 6).style("fill", "#FF00FF").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",20).attr("cy",70).attr("r", 6).style("fill", "#fd5e00").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",20).attr("cy",90).attr("r", 6).style("fill", "#000080").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",20).attr("cy",110).attr("r", 6).style("fill", "#C0C0C0").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",20).attr("cy",130).attr("r", 6).style("fill", "#00FFFF").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",20).attr("cy",150).attr("r", 6).style("fill", "#008080").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",20).attr("cy",170).attr("r", 6).style("fill", "#b8a101").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",130).attr("cy",50).attr("r", 6).style("fill", "#317231").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",130).attr("cy",70).attr("r", 6).style("fill", "#FFFF00").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",130).attr("cy",90).attr("r", 6).style("fill", "#808000").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",130).attr("cy",110).attr("r", 6).style("fill", "#FF0000").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",130).attr("cy",130).attr("r", 6).style("fill", "#0000FF").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",130).attr("cy",150).attr("r", 6).style("fill", "#FFFFFF").attr("stroke", "black").attr("stroke-width", 2);
    image_svg.append("circle").attr("cx",130).attr("cy",170).attr("r", 6).style("fill", "#13fc00").attr("stroke", "black").attr("stroke-width", 2);

    image_svg.append("text").attr("x", 30).attr("y", 50).text("Thrill").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 30).attr("y", 70).text("Kiddie").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 30).attr("y", 90).text("Everybody").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 30).attr("y", 110).text("Pavilion").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 30).attr("y", 130).text("Beer Garden").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 30).attr("y", 150).text("Food").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 30).attr("y", 170).text("Sopping").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 140).attr("y", 50).text("Restroom").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 140).attr("y", 70).text("Info").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 140).attr("y", 90).text("Arcade").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 140).attr("y", 110).text("First Aid").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 140).attr("y", 130).text("Stage").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 140).attr("y", 150).text("Show Hall").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");
    image_svg.append("text").attr("x", 140).attr("y", 170).text("Entrance").style("font-size", "15px").style("font-weight", 700).style("fill", "white").attr("alignment-baseline","middle");

    /** Call animatedSize for initial animation **/
    animatedSize();
}

/** Animation of circle size **/
function animatedSize(){
    /** Extract the selected timestamp and weekdays from DOM **/
    var selected_weekday = document.getElementById("week_days").value;
    var selected_timestamp = document.getElementById("timestamp_input").value;

    /** Update value of background year year indicator **/
    backgroundIndicator(selected_weekday, selected_timestamp);

    /** Call the Datacleaner to extract an array from one of timestamp**/
    var dataReady = DataCleaner(selected_weekday, selected_timestamp);

    /** Define the radius scale **/
    var max = 0, min = 0;
    dataReady.forEach(function (d){
        if(d[0] > max){
            max = d[0];
        }
        if(d[0] <= min){
            min = d[0];
        }
    })
    radiusScale = d3.scaleLinear().domain([min, max]).range([7, 25]);

    image_svg.selectAll("circle")
        .data(dataReady)
        .transition()
        .duration(500)
        .attr("r", function (d){return radiusScale(d[0]);});
}

/** Play & Stop buttons event handler**/
function animatedPlay(){
    var currentWeekday = document.getElementById("week_days").value;
    var currentTimestamps = document.getElementById("timestamp_input").value;
    /** Handle play button event **/
    var t = d3.interval(function() {
            /** Update value of background year year indicator **/
            backgroundIndicator(currentWeekday, currentTimestamps);

            /**Get the array of current timestamp**/
            var dataReady = DataCleaner(currentWeekday, currentTimestamps);

            /**Update the size of circle**/
            image_svg.selectAll("circle")
                .data(dataReady)
                .transition()
                .duration(100)
                .attr("r", function (d){return radiusScale(d[0])});

            /**Update value of timestamp in text field**/
            increment();
            currentTimestamps = document.getElementById("timestamp_input").value;

            /**Stop event handler for stopping the animation at current index**/
            document.getElementById("stop_btn").onclick = function(){
                t.stop();
            }

            /** Condition for detecting to stop the animation**/
            if (currentTimestamps === "23:00"){
                t.stop();
            }
        }
        , 600);
}

function backgroundIndicator(weekday, timestamp){
    /** Update value of background year year indicator **/
    d3.select("#background_indicator")
        .text(weekday + " - " + timestamp);
}