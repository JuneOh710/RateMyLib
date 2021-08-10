// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: libraryCoordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
    .setLngLat(libraryCoordinates)
    .addTo(map);