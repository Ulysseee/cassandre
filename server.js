require('dotenv').config();

const express = require('express');
const { createClient } = require('contentful');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

const app = express();
const path = require('path');

const port = 3000;

const log = data => console.log(JSON.stringify(data, null, 2));

const initCMS = () => createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const handleRequest = async CMS => {
    const global = await CMS.getEntry('5cKjWZGhvzmSnnLK8Npv96');
    const footer = await CMS.getEntry('2nsk60KEJQkGM7SFWFfpfQ');

    return {
        global: global.fields,
        footer: footer.fields,
    };
};

const handleColorName = col => {
    const [color] = col;
    if (color === 'Beige') return 'beige';
    if (color === 'Bleu ciel') return 'lightblue';
    if (color === 'Bleu électrique') return 'blue';
    if (color === 'Vert') return 'green';
    if (color === 'Vert clair') return 'lightgreen';
    if (color === 'Rose pale') return 'rose';
    if (color === 'Orange') return 'orange';
    return 'beige';
};

const handleLinkResolver = data => {
    if (data.sys.contentType.sys.id === 'work') {
        return `/creation/${data.fields.slug}`;
    }

    if (data.sys.contentType.sys.id === 'contact') {
        return '/about';
    }

    if (data.sys.contentType.sys.id === 'home') {
        return '/';
    }

    return '/';
};

app.use((req, res, next) => {
    res.locals.renderRichText = documentToHtmlString;
    res.locals.getColorName = handleColorName;
    res.locals.getLinkUrl = handleLinkResolver;

    next();
});
app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
    const CMS = await initCMS();
    const defaults = await handleRequest(CMS);
    const home = await CMS.getEntry('3MspXo6cNqu83f6mwIBXWD');
    const works = await CMS.getEntries({
        content_type: 'work',
        order: '-fields.year',
    });

    res.render('pages/home', {
        ...defaults,
        home: home.fields,
        works: works.items,
    });
});

app.get('/ui', (req, res) => {
    res.render('pages/ui');
});

app.get('/projects', async (req, res) => {
    res.render('pages/projects');
});

app.get('/about', async (req, res) => {
    res.render('pages/about');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
