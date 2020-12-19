function drawPieChart(){
    /** define mouse hover html elements **/
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var svg =group_svg.append("g")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("transform", `translate(${400}, ${450})`);

    /** Define color scale of pie chart **/
    const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb", "#e78ac3",
        "#a6d854","#ffd92f","#9e4d94"]);
    var pie = d3.pie().value(function(d) {return d["most_type"];}).padAngle(.03);

    var path = d3.arc()
        .outerRadius(280)
        .innerRadius(50);
    var outerRadius = height / 2 - 20,
        innerRadius = outerRadius / 3,
        cornerRadius = 10;
    var arc = d3.arc()
        .padRadius(outerRadius)
        .innerRadius(innerRadius);

    /** Add Pie chart to svg **/
    svg.selectAll("path")
        .data(pie(groups_and_type))
        .enter().append("path")
        .each(function(d) { d.outerRadius = outerRadius - 20; })
        .attr("d", arc)
        .attr("fill", function(d) {return color(d.data["most_type"]); })
        .on("mouseover", function (d){
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85')
            d3.select(this).transition().delay(0).attrTween("d", function(d) {
                var i = d3.interpolate(d.outerRadius, outerRadius);
                return function(t) { d.outerRadius = i(t); return arc(d); };
            });
            tooltip.transition()
                .duration(50)
                .style("opacity", 0.85);
            tooltip.html("Group Size: " + d.data["most_type"] + " People")
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY -15) + "px")
                .style("font-size", "12px");
        })
        .on("mouseout", function (d){
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
            d3.select(this).transition().delay(150).attrTween("d", function(d) {
                var i = d3.interpolate(d.outerRadius, outerRadius-20);
                return function(t) { d.outerRadius = i(t); return arc(d); };
            });
            tooltip.transition()
                .duration(50)
                .style("opacity", 0);
        })
        .on("click", function (d){
            drawTreeMap(d.data, color(d.data["most_type"]));
            displayModel();
        });

    /** Pie chart title **/
    svg.append("text")
        .attr("y", -350)
        .attr("text-anchor", "middle")
        .style("font-weight", "1000")
        .style("fill", "white")
        .style("font-size", "32px")
        .text("Size & Percentage of Each Group");

    /** Add Pie Chart legend **/
    var legendG = svg.selectAll(".legend")
        .data(pie(groups_and_type))
        .enter().append("g")
        .attr("transform", function(d,i){
            return "translate(" + (280) + "," + (i * 15 - 350) + ")";
        })
        .attr("class", "legend");

    legendG.append("rect") // make a matching color rect
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d, i) {
            return color(i);
        });

    legendG.append("text") // add the text
        .text(function(d){return d.data["index"];})
        .style("font-size", 14)
        .style("font-weight", 600)
        .style("fill", "white")
        .attr("y", 8)
        .attr("x", 15);
}

function drawAverageBarChart(){
    /** Remove all g element in svg first to redraw the chart **/
    averageBar_svg.selectAll("g").remove();

    /** Create svg in size of 600 x 600 for charts**/
    var svg = averageBar_svg.append('g')
        .attr("opacity", 1)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /** Create scale for X Y axis **/
    var xScale = d3.scaleBand()
        .domain(d3.map(averageRideAttend, function (d){
            return d.index;
        }))
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain([0,35])
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

    const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb", "#e78ac3",
        "#a6d854","#ffd92f","#9e4d94"]);

    /** Add the labels for X and Y **/
    svg.append("text")
        .text("Group")
        .style("font", "20px sans-serif")
        .style("font-weight", "1000")
        .style("text-anchor", "middle")
        .style("opacity", 0.5)
        .style("fill", "white")
        .attr("x", (width/2))
        .attr("y", (height + margin.top + 20));
    svg.append("text")
        .text("Average Visiting")
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
    var bar_svg = svg.selectAll(".slice")
        .data(averageRideAttend)
        .enter().append("g")
        .attr("class", "g");

    /** Define color ordinal **/
    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    bar_svg.append('rect')
        .attr("width", bars.bandwidth() * 35)
        .style("fill", "steelblue")
        .style("stroke", "steelblue")
        .style("fill", function(d) { return color(d.index) })
        // .style("stroke", function(d) { return color(d.parkIndex) })
        .style("stroke-width", 1.5)
        .attr("x", function(d) {
            var test =d;
            return xScale(d.index) })
        .attr("y", function(d) {return yScale(d.average)})
        .attr("height", function(d) { return height - yScale(0)})
        .attr("transform", "translate(28,-2)");

    bar_svg.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) {return yScale(d.average)})
        .attr("height", function(d) {return height - yScale(d.average)});

    /** Add the mouse event **/
    /** define mouse hover html elements **/
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    bar_svg.on("mouseover", function(d) {
        d3.select(this).select("rect")
            .style("fill", d3.rgb(color(d.index)).darker(2))
            .style("stroke", d3.rgb(color(d.index)).darker(2));
        tooltip.transition()
            .duration(50)
            .style("opacity", 1);

        /** App the tooltip content for displaying **/
        tooltip.html(d.index + " : " + d.average)
            .style("left", (d3.event.pageX - 40) + "px")
            .style("top", (d3.event.pageY - 50) + "px")
            .style("font-size", "12px");
        })
        .on("mouseout", function(d) {
            d3.select(this).select("rect")
                .style("fill", "steelblue")
                .style("stroke", "steelblue")
                .style("fill", color(d.index))
                .style("stroke", color(d.index));
            tooltip.transition()
                .duration(50)
                .style("opacity", 0);
        })
        .on("click", function (d){
            drawTreeMap(d, color(d.index));
            displayModel();
        });

    /** Add average bar chart legend **/
    var legendG = svg.selectAll(".legend")
        .data(averageRideAttend)
        .enter().append("g")
        .attr("transform", function(d,i){
            return "translate(" + (550) + "," + (i * 15 + 75) + ")";
        })
        .attr("class", "legend");

    legendG.append("rect") // make a matching color rect
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d, i) {
            return color(i);
        });

    legendG.append("text") // add the text
        .text(function(d){return d.index;})
        .style("font-size", 14)
        .style("font-weight", 600)
        .style("fill", "white")
        .attr("y", 8)
        .attr("x", 15);
}

function drawTreeMap(selected_group, color){
    /** Remove all g element first in groupVis svg**/
    groupVis_svg.selectAll("g").remove();

    /** Checking the pre-condition **/
    var group;
    if(selected_group === undefined){
        group = 'Fast&Furious';
    }else{
        group = selected_group.index;
    }
    if(color === undefined){color = "#66c2a5";}

    var dataReady = [];
    Top10VisualizeData.forEach(function (d){
        if(d.group === group){
            dataReady = [{
                "location": group,
                "parent":'',
                "numbers":'',
            }]
            for(let i =0;  i < 20; i++){
                if (i%2 === 0){
                    var tmp = {
                        "location": d[i.toString()],
                        "parent": group,
                        "numbers": d[(i+1).toString()]
                    }
                    dataReady.push(tmp)
                }
            }}
    });
    var root = d3.stratify()
        .id(function(d) { return d.location})
        .parentId(function(d) {return d.parent})
        (dataReady);
    root.sum(function(d) {  return +d.numbers })

    d3.treemap()
        .size([730, 580])
        .padding(4)
        (root)

    /** Create svg in size of 600 x 600 for charts**/
    var svg = groupVis_svg.append('g')
        .attr("opacity", 1)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        // .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .attr("transform", `translate(${35}, ${150})`);

    // use this information to add rectangles:
    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", color);

    // and to add the text labels
    svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+5})
        .attr("y", function(d){ return d.y0+25})
        .text(function(d){ return d.data.location})
        .attr("font-size", "15px")
        .attr("fill", "white");

    svg.selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+10})
        .attr("y", function(d){ return d.y0+40})
        .text(function(d){ return d.data.numbers + " People" })
        .attr("font-size", "12px")
        .attr("fill", "white");

    /** TreeMap title **/
    svg.append("text")
        .attr("x", 70)
        .attr("y", -50)
        // .style("text-anchor", "middle")
        .style("font-weight", "1000")
        .style("fill", "white")
        .style("font-size", "32px")
        .text("Top10 Attractions for the Groups");

    /** Add legend **/
    svg.append("rect") // make a matching color rect
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color)
        .attr("transform", "translate(" + 280 + "," + 590 + ")")

    svg.append("text") // add the text
        .text(group)
        .style("font-size", 20)
        .style("font-weight", 600)
        .style("fill", "white")
        .style("text-decoration", "underline")
        .attr("transform", "translate(" + 300 + "," + 600 + ")");
}

function displayModel(){
    var modal = document.getElementById("myModal");
    //var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];
    // btn.onclick = function() {
    modal.style.display = "block";
    // }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}