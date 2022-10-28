const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongooes = require('mongoose');
const Post = require('./models/post');
const Contact = require('./models/contact');

const app = express();

const PORT = 3000;
const db = 'mongodb+srv://Ibraim:Pass123@cluster0.1j6pfke.mongodb.net/node-blog?retryWrites=true&w=majority';

mongooes
    .connect(db,  {useNewUrlParser: true, useUnifiedTopology: true})
    .then((res) => console.log('Connected to DB'))
    .catch((error) => console.log(error));

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`)

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log('listening port 3000');
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({extended: false}));

app.use(express.static('styles'));

app.get('/', (req, res) => {
    const title = 'Home';
    res.render(createPath('index'), {title});
})

app.get('/contacts', (req, res) => {
    const title = 'Contacts';
    Contact
        .find()
        .then((contacts) => res.render(createPath('contacts'), {title, contacts}))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), {title: 'Error'});
        })
})

app.use('/posts/:id', (req, res) => {
    const title = 'Post';
    const post = {
        id: '1',
        title: 'Title 1',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, delectus aut ut expedita ex tempore inventore totam ab quaerat minima? Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit nam modi atque laborum quidem dolorem dolores eos saepe doloribus impedit! Placeat, fugiat incidunt. Nisi sunt veniam accusantium repellendus. Unde fuga et nostrum perspiciatis veniam qui soluta ab neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, delectus aut ut expedita ex tempore inventore totam ab quaerat minima? Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit nam modi atque laborum quidem dolorem dolores eos saepe doloribus impedit! Placeat, fugiat incidunt. Nisi sunt veniam accusantium repellendus. Unde fuga et nostrum perspiciatis veniam qui soluta ab neque?', 
        date: '25.10.22',
    };
    res.render(createPath('post'), {title, post})
})

app.use('/posts', (req, res) => {
    const title = 'Posts';
    const posts   = [{
        id: '1',
        title: 'Title 1',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, delectus aut ut expedita ex tempore inventore totam ab quaerat minima? Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit nam modi atque laborum quidem dolorem dolores eos saepe doloribus impedit! Placeat, fugiat incidunt. Nisi sunt veniam accusantium repellendus. Unde fuga et nostrum perspiciatis veniam qui soluta ab neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, delectus aut ut expedita ex tempore inventore totam ab quaerat minima? Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit nam modi atque laborum quidem dolorem dolores eos saepe doloribus impedit! Placeat, fugiat incidunt. Nisi sunt veniam accusantium repellendus. Unde fuga et nostrum perspiciatis veniam qui soluta ab neque?', 
        date: '25.10.22',
    }];
    res.render(createPath('posts'), {title, posts})
})

app.post('/add-post', (req, res) => {
    const {title, name, text} = req.body;
    const post = new Post({title, name, text});
    post
        .save()
        .then((result) => res.send(result))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), {title: 'Error'});
        })
})

app.use('/add-post', (req, res) => {
    const title = 'Add post';
    res.render(createPath('add-post'), {title})
})

app.use((req, res) => {
    const title = 'Error Page';
    res
        .status(404)
        .render(createPath('error'), {title});
})