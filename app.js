const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { etag: false, maxAge: 0 }));

// Routes
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const profileRouter = require('./routes/profile');

app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/profile', profileRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});