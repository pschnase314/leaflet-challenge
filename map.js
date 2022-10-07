//provide the url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//request the data
d3.json(url).then(function (data) {
//make an array of depths
var depths = []    
for(var i = 0; i< data.features.length; i++){
    depths.push(data.features[i].geometry.coordinates[2])
    }
    //find the max and min depth (using Math.min and Math.max gave NaNs)
    depths.sort((a,b) => a-b)
    let minDepth = depths[0];
    let maxDepth = depths[depths.length-1];
    //create a color from #101010 to #999999 based on the depth (I could not be bothered to deal with the fact that those are hexadecimal digits.)
function getColor(depth) {
    d = parseInt((1-Math.sqrt(depth-minDepth)/Math.sqrt(maxDepth-minDepth))*89+10);
    return(`#${d}${d}${d}`)
}
    //declare the myMap variable
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
  });
  //make the layer with the map image and add it 
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    //loop over all of the earthquakes
    for(var i = 0; i< data.features.length; i++){
        //get the color for each earthquake
        c = getColor(data.features[i].geometry.coordinates[2]);
        if(i<10) {console.log(d);
        console.log(c)}
        //make a circle for each earthquake and label it with coordinates and magnitude
        L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
            fillOpacity: .75,
            color: c,
            fillColor: c,
            radius: 10000*data.features[i].properties.mag
        }).bindPopup(`<h3>Coordinates: ${data.features[i].geometry.coordinates}</h3> <hr> <h3>Magnitude: ${data.features[i].properties.mag}</h3>`).addTo(myMap);
    }
    //make the legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(map) {
        //make the divisions of depth shown on the legend
        g = [];
        for(i = 0; i <10; i++) {
            g.push((minDepth+i/9*(maxDepth-minDepth)).toFixed(2))
        }
        //make the legend html code
        var div = L.DomUtil.create('div', 'info legend'),
        grades = g,
        labels = [];
        div.innerHTML += "<h1>Depth</h1><br>"

        //loop over categories of depth and add legend entries for them
        //note that while the legend is presented as categorical, the colors can be anything (gray) from #101010 to #999999 that does not include hexadecimal digits a-f
        for (var i = 0; i < grades.length-1; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 0) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
//add the legend to the map
legend.addTo(myMap);
  });
