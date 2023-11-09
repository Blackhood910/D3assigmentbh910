var width = 960,
    height = 1160;

var tempsvg;         // global variable for svg made in the funnction D3Draw 
var input_of_cities; // global variable for number of cities you select in the slider made in the funcntion onRangeChanged
var tempsource;       // global variable to store the link of the upadted jason feed after the use of the slider


// this function is use to draw the map of the uk 
d3Draw();

function d3Draw(){

    var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

   d3.json("uk.json", function(error, uk) {
   if (error) return console.error(error);

var subunits = topojson.feature(uk, uk.objects.subunits);

var projection = d3.geo.albers()
    .center([0, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(5000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);
    
svg.append("path")
    .data(subunits)
    .attr("d", path);

svg.selectAll(".subunit")
    .data(topojson.feature(uk, uk.objects.subunits).features)
    .enter().append("path")
    .attr("class", function(d) { return "subunit " + d.id; })
    .attr("d", path);

svg.append("path")
    .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return (a !== b && a.id !== "IRL"); }))
    .attr("d", path)
    .attr("class", "subunit-boundary");

svg.append("path")
    .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return (a === b && a.id !== "IRL"); }))
    .attr("d", path)
    .attr("class", "subunit-boundary");

svg.append("path")
    .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a !== b && a.id === "IRL"; }))
    .attr("d", path)
    .attr("class", "subunit-boundary IRL");

    tempsvg=svg;
    tempproj=projection;
    temppath=path;
    // here we are calling the function to get the default value of the cites from the slider
    onRangeChanged();
    // here we are calling the function to display the default value for the first time
    refresh(); 
});
}

// this function is use to map all the locations , lable them and install any other features related with the ploting 
//of the location like tooltip
function maptown(){

    svg_2=tempsvg;
    projection=tempproj;
    path=temppath;
   console.log(tempsource);
   
     var source =  tempsource;
     console.log(source);
d3.json(source, function(error,towns)
{

    if (error) return console.error(error);
// here we are maping the labels of the city
    svg_2.selectAll(".labels")
    .data(towns)
    .enter().append("text")
    .attr("class", "labels")
    .text(function(d) { return d.Town; })
    .attr("x", function(d){
     return projection([d.lng , d.lat])[0];
    })
    .attr("y", function(d){
     return projection([d.lng , d.lat])[1];
    })
   .attr("dx", "1em");
 
   //.attr("dy", "-0.1em")
   // ploting circle points
   feature = svg_2.selectAll('circle').data(towns)
   .enter().append('circle')
   .attr("id", "towncircle123")
   .attr('cx',function(d){
    return projection([d.lng , d.lat])[0];
   })
   .attr('cy',function(d){
    return projection([d.lng , d.lat])[1];
   })
   .attr("r",5)
   .style({
    fill: 'black',
    opacity: 0.8
   })

   //Tooltip creation
   var tooltip = d3.select("body").append("div")
   .attr("class", "tooltip")
   .style('opacity', 0)
   .style('position', 'absolute')
   .style('padding', '0 10px')
   .style('border', 'solid 2px black')
   .style('background-color', 'white')
   .style('border-radius', '10px')
   .style(' text-align', 'center')
    .style(' width', '40px')
    .style('height' , '150px')

   // tool tip implementation
   feature.on('mouseover', function (d) {
    d3.select(this)
    .transition()
    .ease("elastic")
    .duration(300)
    .attr("r", 5*2)
    .style({
     fill: 'red',
     opacity: 0.8,
     stroke: 'black'
     
    })
    tooltip .transition()
    .duration(300)
    .style("stroke", "black")
    .style('opacity', .9)
    .style("visibility", "visible")
    tooltip.html("<h3><img width=30 height=32 src='./images/population.png'>   Population: " + d.Population + "</h3><h3><img width=30 height=32 src='./images/place.gif'>  County :" + d.County + "</h3>") // make tooltip hover
    .style('left', (d3.event.pageX ) + 'px')
    .style('top', (d3.event.pageY )  + 'px')

})
feature.on('mouseout', function (d) {
     d3.select(this)
    .transition()
    .ease("elastic")
    .duration(300)
    .attr("r", 5)
    .style({
        fill: 'black',
        opacity: 0.8,
        stroke: 'black'
        
       })
           
    tooltip.transition()
    .duration(300)
    .style("stroke", "none")
    .style("visibility", "hidden")
   
})

})
}

// This function  get the value from the slider 
function onRangeChanged() {

document.getElementById("slider").oninput = function() {
   onRangeChanged();

}
        var val_1 = document.getElementById("slider").value;
        document.getElementById('rangeValue').innerHTML = val_1;
        input_of_cities = val_1;       
       }

       
// this function is call when the refresh button is clicked    
function refresh(){
    tempsource = "http://34.38.72.236/Circles/Towns/"+ input_of_cities;
    d3.json(tempsource, function(error,towns)
{
    if (error) return console.error(error);

        tempsvg.selectAll("circle")
        .remove()
        tempsvg.selectAll(".labels")
        .remove()
        tempsource = "http://34.38.72.236/Circles/Towns/"+ input_of_cities;
        maptown( )
      }  )  
    }


window.onload = maptown;
window.onload = d3Draw;
