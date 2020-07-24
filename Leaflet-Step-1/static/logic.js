var geojson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"


d3.json(geojson, function(data) {
  equakeInfo = data.features
  console.log(equakeInfo)

  equakeInfo.forEach(getdata)
  function getdata(data) {
      console.log(data.id),
      console.log(data.geometry.coordinates[0]),
      console.log(data.geometry.coordinates[1]),
      console.log(data.properties.mag)
  };


  var myMap = L.map("map", {
    center: [17.5739 , -3.9861],
    zoom: 2.5,
  });


  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}" , {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 500,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);


  L.geoJSON((data) , {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, myStyle(feature))
      .bindPopup(`Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag}`)   
  }}).addTo(myMap);


  function mapmagnitude (magnitude) {
    if (magnitude < 1) {
    return 2}
    return 1.55 ** magnitude
  };


  function getColor(d) {
    return d < 3 ? '#ffffcc':
           d < 4 ? '#ffeda0':
           d < 5 ? '#fed976':
           d < 6 ? '#feb24c':
           d < 7 ? '#fd8d3c':
           d < 8 ? '#fc4e2a':
           d < 9 ? '#e31a1c':
           d < 10 ? '#bd0026':
                    "#800026";    
    };


  function myStyle(feature) {
      return {
          fillColor: (getColor(feature.properties.mag)),
          weight: 0.8,
          opacity: 1,
          color: 'black',
          fillOpacity: 1,
          radius: (mapmagnitude(feature.properties.mag))
      };
  }


  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [3, 4, 5, 6, 7, 8, 9, 10],
        labels = [];

    for (var i = 0; i < magnitude.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
          magnitude[i] + (magnitude[i + 1] ? '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);

});