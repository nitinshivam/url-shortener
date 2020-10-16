const mongoose = require('mongoose');
const validator = require('validator');
const express = require('express');
const { nanoid } = require('nanoid');
const app = express();
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const userSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isURL(value, { require_protocol: true })) {
                throw new Error('URL is invalid');
            }
        }
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        maxlength: 7,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9_-]+$/.test(v);
            },
            message: props => `${props.value} is not a valid Slug`
        },
    }
});
const user = mongoose.model('url', userSchema, 'urls')

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index', { outputText: '' });
})

app.post('/', async(req, res) => {
    const inputData = {
        url: req.body.url,
        slug: req.body.slug
    }
    if (!inputData.slug) {
        inputData.slug = nanoid(5);
    }
    const insert = new user(inputData);

    try {
        await insert.save().then(() => {
            console.log(insert);
        });
        res.render('index', { outputText: `https://shorrtner.herokuapp.com/${insert.slug}` });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            res.render('index', { outputText: 'Slug is already used.Please Try again!' })
        } else {
            res.render('index', { outputText: error })
        }
    }

})


app.get('/:url', (req, res) => {
    user.findOne({ slug: req.params.url })
        .then((data) => {
            if (data == null) {
                res.status(404).send('URL not found');
            } else {
                res.redirect(data.url)
            }
        })
        .catch((err) => {
            console.log(err);
        })
})


app.listen(process.env.PORT || 3000);