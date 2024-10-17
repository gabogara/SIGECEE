const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const multer = require('multer');
const Seeder = require('./seeds/seeder');
const path = require('path');
let User = require('./models/user.model');
const fs = require('fs');
const history = require('connect-history-api-fallback');
const sched = require('./routes/schedules');
let Url = require("./models/url.model");

const corsOptions = {
  origin: true,
  credentials: true
}

// Multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/media/avatars')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var storageB = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/media/post')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})


var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Solo formatos .png, .jpg and .jpeg permitidos'));
    }
  }
})

var uploadB = multer({
  storage: storageB,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Solo formatos .png, .jpg and .jpeg permitidos!'));
    }
  }
})

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

Seeder.Seeder();

app.options('*', cors(corsOptions)); // preflight OPTIONS; put before other routes
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const usersRouter = require('./routes/users');
const rolesRouter = require('./routes/roles');
const schoolsRouter = require('./routes/schools');
const questionsRouter = require('./routes/questions');
const structsRouter = require('./routes/structs');
const censusRouter = require('./routes/census');
const populationsRouter = require('./routes/populations');
const surveysRouter = require('./routes/surveys');
const dashboardRouter = require('./routes/dashboard');
const studiesRouter = require('./routes/studies');
const instrumentRouter = require('./routes/instrument');
const blogRouter = require('./routes/blog');
const urlsRouter = require('./routes/redirect');
const BlogEntry = require('./models/blogEntry.model');

app.use('/user', usersRouter);
app.use('/role', rolesRouter);
app.use('/school', schoolsRouter);
app.use('/question', questionsRouter);
app.use('/struct', structsRouter);
app.use('/population', populationsRouter);
app.use('/census', censusRouter);
app.use('/survey', surveysRouter);
app.use('/dashboard', dashboardRouter);
app.use('/study', studiesRouter);
app.use('/instrument', instrumentRouter);
app.use('/blog', blogRouter);
app.use('/redirect', urlsRouter);

app.use(history());
app.use('/public', express.static(path.join(__dirname, './public/')));
app.use(express.static(path.join(__dirname, './public/build')));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB DB connection established successfully!")
});


app.post("/user/profile", upload.single('image'), async function (req, res) {

  await User.findOne({ _id: req.body._id }).then(user => {
    if (user) {
      let newpath = ''
      if (req.file === undefined) {
        newpath = user.image;
      } else {
        if (user.image) {
          fs.unlink(user.image, (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        }
        newpath = 'public/media/avatars/' + req.file.filename
      }
      user.image = newpath
      user.name = req.body.name
      user.save().then(user_saved =>
        res.status(200).json({ message: 'Usuario editado exitosamente.', user: user_saved }),
      ).catch(err => res.status(400).json({ message: 'Error: ' + err }));
    } else {
      return res.status(400).json({ message: 'Error: ' + message })
    }
  });
})

app.post("/blog/add", uploadB.single('image'), async function (req, res) {
  try {
    const newEntry = new BlogEntry({
      ins_type: req.body.ins_type,
      ...(req.body.ins_type === 'Censo' && { census: req.body.ins_id }),
      ...(req.body.ins_type === 'Encuesta' && { survey: req.body.ins_id }),
      study: req.body.id_study,
      title: req.body.title,
      description: req.body.description,
      text: req.body.text,
      image: 'public/media/post/' + req.file.filename,
      status: 1,
      createdBy: req.body.createdBy,
    });

    newEntry.save().then(entry_saved =>
      res.status(201).json({ message: 'Publicación realizada exitosamente.', entry: entry_saved }),
    );
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error agregando la publicación." });
  }
})

app.post("/blog/edit", uploadB.single('image'), async function (req, res) {
  try {
    await BlogEntry.findOne({ _id: req.body._id }).then(entry => {
      if (entry) {
        let newpath = ''
        if (req.file === undefined) {
          newpath = entry.image;
        } else {
          if (entry.image) {
            fs.unlink(entry.image, (err) => {
              if (err) {
                console.error(err)
                return
              }
            })
          }
          newpath = 'public/media/post/' + req.file.filename
        }
        entry.title = req.body.title
        entry.description = req.body.description
        entry.text = req.body.text
        entry.image = newpath

        entry.save().then(entry_saved =>
          res.status(200).json({ message: 'Publicación editada exitosamente.', entry: entry_saved }),
        ).catch(err => res.status(400).json({ message: 'Error: ' + err }));
      } else {
        return res.status(400).json({ message: 'Error: ' + message })
      }
    });
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error agregando la publicación." });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});