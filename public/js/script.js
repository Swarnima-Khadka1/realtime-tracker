const socket= io(); // connect to the server

//step 1, 2 and 3
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position)=>{ //watchPosition is used to continuously track the user's location, and it provides 3 parameters: a success callback, an error callback, and an options object.
        const {latitude, longitude} = position.coords;
        socket.emit("sendlocation", {latitude, longitude});

    }, (error)=>{
        console.log(error);
    },{
        enableHighAccuracy: true, // use GPS for more accurate location
        timeout: 5000, // wait for 5 seconds before timing out
        maximumAge: 0 //no caching of location
    }
);
}

//step 5
const map= L.map("map").setView([0, 0], 13); // create a map and set its initial view to [0, 0] with a zoom level of 13

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Swarnima Khadka"
}).addTo(map); // add the tile layer to the map

//step 6: creating object marker to represent the user's location on the map

const marker= {};

socket.on("receivelocation", (data)=>{
    const {id, latitude, longitude}= data;
    map.setView([latitude, longitude], 15); // set the view of the map to the user's location
    if(!marker[id]){
        marker[id]= L.marker([latitude, longitude]).addTo(map); // create a new marker for the user if it doesn't exist
    } else{
        marker[id].setLatLng([latitude, longitude]).addTo(map); // update the marker's position if it already exists
    }
})

socket.on("user-disconnected", (id) =>{
    if(marker[id]){
        map.removeLayer(marker[id]); // remove the marker from the map if the user disconnects
        delete marker[id]; // delete the marker from the marker object
    }

})
