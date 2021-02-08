// Set the dimensions of the canvas / graph

const margin = {top: 10, right: 20, bottom: 50, left: 50};
const width = 800 - margin.left - margin.right;
const height = 470 - margin.top - margin.bottom;

// parse the date / time
const parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
const xScale = d3.scaleLog()
                 .range([1, width]);
const yScale = d3.scaleLinear()
                  .range([height, 0]);

// define the line
const valueline = d3.line()
                    .x(function(d) { return xScale(d.date); })
                    .y(function(d) { return yScale(d.close); });

// append the svg object to the body of the page
// append a g (group) element to 'svg' and
// move the g element to the top+left margin
var colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain([1952,2007]);
var svg = d3.select(".center").append("svg").attr("align","center")
                           .attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom)
                           .append("g")
                           .attr("transform", `translate(${margin.left},${margin.top})`);
//d3.select(".center").attr("align","center");
// Get the data
d3.tsv("data/gapminderDataFiveYear.tsv").then(data => {

    // format the data such that strings are converted to their appropriate types
    data.forEach(function(d) {
        d.pop=+d.pop;
        d.year=+d.year;
        d.lifeExp = +d.lifeExp;
        d.gdpPercap = +d.gdpPercap;
    });

    // Set scale domains based on the loaded data
    xScale.domain(d3.extent(data, function(d) { return d.gdpPercap; }));
    yScale.domain([d3.min(data, function(d) { return d.lifeExp; }), d3.max(data, function(d) { return d.lifeExp; })]);
    
    var scale = d3.scaleLinear().domain([d3.min(data, function(d) { return d.pop; }), d3.max(data, function(d) { return d.pop; })]).range([ 4,10 ]);
    // Add the valueline
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);
    
    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .filter(function(d) { return d.year ==1952  ||d.year ==2007  })
        
        .style("fill",function(d){return colorScale(d.year);
            //if(d.year==1952){return colorScale(d.year);}
            //if(d.year==2007){return colorScale(d.year);}
            //else{return colorScale(d);};

        })
        
        //.filter(function(d) { return d.year = 1957 })
        
        .attr( 'r', function(d) { return scale(d.pop) })
        .attr("opacity", 0.8)
        .attr("cx", function(d) { return xScale(d.gdpPercap); })
        .attr("cy", function(d) { return yScale(d.lifeExp); });
    
    // Add the axes
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .call(yAxis);0
    const xAxis = d3.axisBottom(xScale).ticks(11,".0s");
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        // .call(xAxis.tickFormat(d3.format(".0s")));
    svg.append("rect")
        .attr("x", width-20)
        .attr("y", 20)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill",colorScale(1952));

    svg.append("text")
        .attr("x", width-5)
        .attr("y", 30)
        .text("1952")
        .style("font-family","sans-serif")
        .style("font-size","11px");

    svg.append("rect")
        .attr("x", width-20)
        .attr("y", 35)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill",colorScale(2007));
    
    svg.append("text")
        .attr("x", width-5)
        .attr("y", 45)
        .text("2007")
        .style("font-family","sans-serif")
        .style("font-size","11px");
    
    // text label for the x axis
    svg.append("text")             
        .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("GDP per Capita")
        .style("font-family","sans-serif")
        .style("font-weight", "700") 
        .style("font-size","14px");      
  
  
  
    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Life Expectancy")
        .style("font-family","sans-serif")
        .style("font-weight", "700") 
        .style("font-size","14px");    
        
    // text label for the title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top)+20)
        .attr("text-anchor", "middle")
        .style("font-family","sans-serif")
        .style("font-weight", "700")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("GDP vs Life Expectancy (1952, 2007)");
      ////////////////////////////////////////////////////////////////
    


    

});

    







