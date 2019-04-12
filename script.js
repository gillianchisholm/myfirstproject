// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {
  center: [43.7, -79.3],
  zoom: 11
});

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: '4e56055b7aff0ba5b95d7113be4a443857fddf0f',
  username: 'gchisholm'
});

// Initialze source data
var source = new carto.source.SQL('SELECT * FROM tchcbuilding_6unitsor_more_wgs84');

// Create style for the data
var style = new carto.style.CartoCSS(`
  
#layer {
    marker-width: ramp([rgi_unit], range(1, 25), quantiles(5));
    marker-fill: #EE4D5A;
    marker-fill-opacity: 0.9;
    marker-allow-overlap: true;
    marker-line-width: 1;
    marker-line-color: #FFFFFF;
    marker-line-opacity: 1;
    marker-comp-op: multiply;
  }
`);

// Combine style and data to make a layer
//
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var layer = new carto.layer.Layer(source, style);


// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);


// Make SQL to get the summary data you want
var countSql = 'SELECT COUNT (*) FROM gchisholm.tchcbuilding_6unitsor_more_wgs84 WHERE rgi_unit >= 40 AND mrkt_unit = 0';

// Request the data from Carto using fetch.
// You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
fetch('https://gchisholm.carto.com/api/v2/sql/?q=' + countSql)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // All of the data returned is in the response variable
    console.log(data);

    // The sum is in the first row's sum variable
    var count = data.rows[0].count;

    // Get the sidebar container element
    var sidebarContainer = document.querySelector('.sidebar-feature-content');

    // Add the text including the sum to the sidebar
    sidebarContainer.innerHTML = '<div>There are <b>' + count + ' </b>buildings in Toronto that contain over 40 rent-geared-to-income units and zero market rate units </div>';
  });


    