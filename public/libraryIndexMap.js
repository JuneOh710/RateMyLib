// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
const libraryCoordinates = document.querySelectorAll('.libraryCoordinate')
const libraryIds = document.querySelectorAll('.libraryId')
const libraryNames = document.querySelectorAll('.libraryName')
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-79.3957, 43.6629], // starting position [lng, lat]
    zoom: 14 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl())
map.scrollZoom.disable()

for (let index = 0; index < libraryIds.length; index += 1) {
    let popup = new mapboxgl.Popup({ offset: 25, focusAfterOpen: false }).setHTML(
        `<a href=/libraries/${libraryIds[index].textContent.trim()}>${libraryNames[index].textContent}</a>`
    )

    let marker = new mapboxgl.Marker()
        .setLngLat(libraryCoordinates[index].textContent.split(','))
        .setPopup(popup)
        .addTo(map);
}
