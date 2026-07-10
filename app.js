const express = require('express');
const app= express();
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

app.get("/", (req, res) => {
    res.render("index");
});   

const server = http.createServer(app);
const io= socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function (socket){ // listen for a connection event from the client
    socket.on("sendlocation", (data)=>{ // listen for a sendlocation event from the client
        io.emit("receivelocation", {id: socket.id, ...data}); // emit a receivelocation event to all clients with the data received from the client 

    })
    socket.on("disconnect", ()=>{
        io.emit("user-disconnected", socket.id); // emit a disconnect event to all clients with the id of the disconnected client
    })
})


server.listen(3000, () => {
    console.log('Server is running on port 3000');
});