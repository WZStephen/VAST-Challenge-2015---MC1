var global_parkIndex;
function charSelection(selected_weekday, park_index){
    /** Get the selection from users **/
    var chart_selection = document.getElementById("statistics_selection").value;
    var week_day = document.getElementById("week_days").value;

    /** Remove all element in chart_svg first **/
    d3.select("#chart-svg").selectAll("g").remove();

    /** Check if the user is changing the statistics technique **/
    if(selected_weekday === undefined){selected_weekday = week_day;}
    if(park_index === undefined){park_index = global_parkIndex;}

    /** Input selection to vis **/
    if(chart_selection === "line_chart"){
        drawLineChart(selected_weekday, park_index);
    }else if(chart_selection === "bar_chart"){
        drawBarChart(selected_weekday, park_index);
    }
    global_parkIndex = park_index;
}
function drawLineChart(weekday, park_index){
    /** Remove all g element in svg first to redraw the chart **/
    chart_svg.selectAll("g").remove();

    /** Defined a time parser **/
    var parseTime = d3.timeParse("%m/%d/%Y %H:%M");

    // /** Check if user want to update the chart **/
    // if(park_index === undefined){park_index = "1";}

    /** Identify the timestamp table depends on the input of weekday **/
    var currentTable;
    if(weekday === "Friday"){
        currentTable = TABLES["visitorsCountPerM_10mins_Fri"];
    }else if(weekday === "Saturday"){
        currentTable = TABLES["visitorsCountPerM_10mins_Sat"];
    }else{
        currentTable = TABLES["visitorsCountPerM_10mins_Sun"];
    }

    /** Define the range of chart based on index **/
    var range = [];
    currentTable.forEach(function (d){
        range.push(parseInt(d[park_index]))
    })
    var rangeFORindex = d3.extent(range)

    /** Create svg in size of 800 x 800 for charts**/
    var g = chart_svg.append('g')
        .attr("opacity", 1)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /** Create scale for X Y axis **/
    var xScale = d3.scaleTime()
        .domain(d3.extent(currentTable, function(d){return parseTime(d["Timestamp"]);
        }))//  06/06/2014 8:00 --- 06/06/2014 24:00
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain(rangeFORindex)
        .range([height, 0]);
    var xAxis = d3.axisBottom(xScale)
        .ticks(20);
    var yAxis = d3.axisLeft(yScale)
        .ticks(10);

    /** Append X Y axis and add label **/
    g.append("g")
        .attr("class","x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    g.append("g")
        .attr("class","y_axis")
        .call(yAxis);

    /** Add the labels for X and Y **/
    var name = "";
    ride_details.forEach(function (d){if(d["Park Guide Index"] === park_index){name = d["DinoFun World Name"];}});
    if(name === ""){name = "Entrance"}

    g.append("text")
        .text("Timestamp")
        .style("font", "20px sans-serif")
        .style("font-weight", "1000")
        .style("text-anchor", "middle")
        .style("opacity", 0.5)
        .style("fill", "white")
        .attr("x", (width/2))
        .attr("y", (height + margin.top + 20));
    g.append("text")
        .text("Count Changes At " + name)
        .style("font", "20px sans-serif")
        .style("font-weight", "1000")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .attr("transform", "rotate(-90)")
        .style("opacity", 0.5)
        .attr("x", 0 - height/2)
        .attr("y", 0 - margin.left + 30)
        .attr("dy", "12px");

    /** Draw the path/lines **/
    var valueLine = d3.line()//.curve(d3.curveCardinal)
        .x(function(d) { return xScale(parseTime(d["Timestamp"])) })
        .y(function(d) { return yScale(d[park_index]) });
    g.append("path")
        .datum(currentTable)
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d",valueLine);
}

function drawBarChart(weekday, park_index){
    /** Remove all g element in svg first to redraw the chart **/
    chart_svg.selectAll("g").remove();

    /** Defined a time parser **/
    var parseTime = d3.timeParse("%m/%d/%Y %H:%M");

    // /** Check if we want to update the chart **/
    // if(park_index === undefined){
    //     park_index = "1";
    // }

    /** Identify the timestamp table depends on the input of weekday **/
    var currentTable;
    if(weekday === "Friday"){
        currentTable = TABLES["visitorsCountPerM_10mins_Fri"];
    }else if(weekday === "Saturday"){
        currentTable = TABLES["visitorsCountPerM_10mins_Sat"];
    }else{
        currentTable = TABLES["visitorsCountPerM_10mins_Sun"];
    }

    /** Define the range of chart based on index **/
    var range = [];
    currentTable.forEach(function (d){
        range.push(parseInt(d[park_index]))
    })
    var rangeFOIndex = d3.extent(range);

    /** Create svg in size of 600 x 600 for charts**/
    var svg = chart_svg.append('g')
        .attr("opacity", 1)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /** Create scale for X Y axis **/
    var xScale = d3.scaleTime()
        .domain(d3.extent(currentTable, function(d){return parseTime(d["Timestamp"]);}))
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain(rangeFOIndex)
        .range([height, 0]);
    var xAxis = d3.axisBottom(xScale)
        .ticks(10);
    var yAxis = d3.axisLeft(yScale)
        .ticks(10);

    /** Append X Y axis and add label **/
    svg.append("g")
        .attr("class","x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class","y_axis")
        .call(yAxis);

    /** Add the labels for X and Y **/
    var name = "";
    ride_details.forEach(function (d){if(d["Park Guide Index"] === park_index){name = d["DinoFun World Name"];}});
    if(name === ""){name = "Entrance"}
    svg.append("text")
        .text("Time")
        .style("font", "20px sans-serif")
        .style("font-weight", "1000")
        .style("text-anchor", "middle")
        .style("opacity", 0.5)
        .style("fill", "white")
        .attr("x", (width/2))
        .attr("y", (height + margin.top + 20));
    svg.append("text")
        .text("Count Changes At " + name)
        .style("font", "20px sans-serif")
        .style("font-weight", "1000")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .attr("transform", "rotate(-90)")
        .style("opacity", 0.5)
        .attr("x", 0 - height/2)
        .attr("y", 0 - margin.left + 30)
        .attr("dy", "12px");

    /** Add the bars **/
    var bars = d3.scaleBand();

    var dataReady = d3.map(currentTable,function (d,i){
        return {key: i, values: [{"Timestamp": d["Timestamp"], "totalCount": d[park_index]}]}
    });

    var bar_svg = svg.selectAll(".slice")
        .data(dataReady)
        .enter().append("g")
        .attr("class", "g");

    /** Define color ordinal **/
    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    bar_svg.selectAll("rect")
        .data(function(d){
            return d.values;
        })
        .enter().append('rect')
        .attr("width", bars.bandwidth() * 3)
        .style("fill", "steelblue")
        .style("stroke", "steelblue")
        // .style("fill", function(d) { return color(d.parkIndex) })
        // .style("stroke", function(d) { return color(d.parkIndex) })
        .style("stroke-width", 1.5)
        .attr("x", function(d) {
            var test =d;
            return xScale(parseTime(d.Timestamp)) })
        .attr("y", function(d) {return yScale(d.totalCount)})
        .attr("height", function(d) { return height - yScale(0)})
        .attr("transform", "translate(3,-3)");

    bar_svg.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) {return yScale(d.totalCount)})
        .attr("height", function(d) {return height - yScale(d.totalCount)});

    /** Add the mouse event **/
    /** define mouse hover html elements **/
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    bar_svg.on("mouseover", function(d) {
        d3.select(this).select("rect")
            .style("fill", "grey")
            .style("stroke", "grey")

        // .style("fill", d3.rgb(color(d.parkIndex)).darker(2))
            // .style("stroke", d3.rgb(color(d.parkIndex)).darker(2));
        tooltip.transition()
            .duration(50)
            .style("opacity", 1);

        /** App the tooltip content for displaying **/
        var value = d.values[0]; //current selected bar
        tooltip.html("Timestamp: " + value.Timestamp + "<br>" + "Total Count: " + value.totalCount)
            .style("left", (d3.event.pageX - 40) + "px")
            .style("top", (d3.event.pageY - 50) + "px")
            .style("font-size", "12px");
        })
        .on("mouseout", function(d) {
            d3.select(this).select("rect")
                .style("fill", "steelblue")
                .style("stroke", "steelblue");
                // .style("fill", color(d.parkIndex))
                // .style("stroke", color(d.parkIndex));
            tooltip.transition()
                .duration(50)
                .style("opacity", 0);
        });
}