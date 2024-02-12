const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')


// const cors = require('cors');

// const { v4: uuidv4 } = require('uuid');

const multer = require('multer')
// const { v4: uuidv4 } = require('uuid');




const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();


// for windows
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },


    filename: function (req, file, cb) {
        // Get the current date as a formatted string (e.g., "2024-01-21")
        const formattedDate = new Date().toLocaleDateString('en-US');

        // Replace any non-alphanumeric characters with underscores
        const sanitizedDate = formattedDate.replace(/\W/g, '_');

        // Combine formatted date and timestamp with original filename
        const name = `${sanitizedDate}-${Date.now()}-${file.originalname}`;

        cb(null, name);

        // const name = Date.now() + file.originalname;
        // cb(null, name);
    }


});

// }; 
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};





app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next();
});

// app.use(cors());

app.use('/feed', feedRoutes)
// /feed/   

app.use('/auth', authRoutes)



app.use((error, _req, res, _next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data })
})


mongoose.connect('MongoDb_database_url')
    .then(

        result => {
            const server = app.listen(8080);
            const io = require('./socket').init(server);
            io.on('connection', socket => {
                console.log('Client Connected');
            })
        }
    )
    .catch(
        err => {
            console.log(err)
        }
    )