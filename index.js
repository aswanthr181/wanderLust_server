const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const socketIo = require('socket.io')

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
const router = require('./route/userRoute')
app.use('/', router)

//const mongoconnection='mongodb+srv://aswanthr:Nostalgic2000@18@cluster0.vxuzs9l.mongodb.net/NETSTRATUM'
const mongoconnection = 'mongodb://127.0.0.1:27017/NETSTRATUM'
mongoose.connect(mongoconnection).then(() => {
    console.log('dB connected success')
}).catch((error) => {
    console.log('dB connection failed', error)
})

const PORT = 3000
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
})

io.on('connection', (socket) => {
    console.log(`New client connected ${socket.id}`);

    socket.on('joinRoom', (room) => {
        console.log(`join using ${room}`)
        socket.join(room)
    })

    socket.on('sendMessage', ({ room, messageData }) => {
        console.log(`Received message in room:${room}, ${messageData.text}`);
        socket.to(room).emit("sendMessage", messageData)
        // socket.broadcast.emit("sendMessage",message)
        // io.emit('sendMessage', message);
    });

    socket.on('audioStream', (audioData) => {
        socket.broadcast.emit('audioStream', audioData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});















// const url='https:books.toscrape.com'
// const url = 'https://holidayz.makemytrip.com/holidays/india/search?dest=Thailand'


























// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST"],

//     }
// });

// // app.get('/', (req, res) => {
// //     res.send('Hello World!');
// // });

// io.on('connection', (socket) => {
//      console.log(`New client connected ${socket.id}`);

//     socket.on('joinRoom',(room)=>{
//         console.log(`join using ${room}`)
//         socket.join(room)
//     })

//     socket.on('sendMessage', ({room,messageData}) => {
//         console.log(`Received message in room:${room}, ${messageData.text}`);
//         socket.to(room).emit("sendMessage",messageData)
//         // socket.broadcast.emit("sendMessage",message)
//         // io.emit('sendMessage', message);
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

// const port = 3000;
// server.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// })

//  //io.on is way we listen to events.   connection event is the moment a user connect to server immediately this will start running.  socket variable
//    //sendMessage is an event





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// app.get('/location',async(req,res)=>{
//     try {
//         console.log('fetch');
//         const apiKey = 'AIzaSyAahmuWUt-CcnHoId-8sCI0fNKCYu0L20s'
//         const location = req.query.location || '12.9716,77.5946'; // Default to Bangalore coordinates
//         const radius = req.query.radius || 5000; // Default radius in meters
//         const type = req.query.type || 'tourist_attraction'; // Default to tourist attractions

//         // Perform the API request
//         const response = await axios.get(
//             `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`
//         );
// console.log('res',response.data);

//         // Send the response data back to the client
//         res.json(response.data.results);
//     } catch (error) {
//         console.error('Error fetching data from Google Places API:', error);
//         res.status(500).json({ error: 'Failed to fetch data from Google Places API' });
//     }
// })