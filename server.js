require('dotenv').config();

const express = require('express');
const { createClient } = require('contentful');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

const app = express();
const path = require('path');

const port = 3000;

const log = data => console.log(JSON.stringify(data, null, 2));

app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('base');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
