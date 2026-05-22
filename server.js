const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'mySecretKeyForPrazdnikum',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.flash = req.session.flash || {};
    delete req.session.flash;
    next();
});

const reviewsFilePath = path.join(__dirname, 'data', 'reviews.json');

async function readReviews() {
    try {
        const data = await fs.readFile(reviewsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

async function writeReviews(reviews) {
    await fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2));
}

app.get('/', (req, res) => {
    res.render('home', { title: 'Главная', bodyClass: 'page-about' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'О нас', bodyClass: 'page-about' });
});

app.get('/services', (req, res) => {
    res.render('services', { title: 'Услуги', bodyClass: 'page-about' });
});

app.get('/reviews', async (req, res) => {
    try {
        const reviews = await readReviews();
        res.render('reviews', { title: 'Отзывы', reviews, bodyClass: 'page-about' });
    } catch (err) {
        res.status(500).render('error', { message: 'Ошибка загрузки отзывов', title: 'Ошибка', bodyClass: 'page-about' });
    }
});

app.post('/reviews/add', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const errors = [];
    if (!name) errors.push('Заполните имя');
    if (!email) errors.push('Заполните email');
    else if (!email.includes('@')) errors.push('Email должен содержать @');
    if (!phone) errors.push('Заполните телефон');
    if (!message) errors.push('Заполните сообщение');
    if (message && (message.length < 25 || message.length > 400))
        errors.push('Сообщение должно быть от 25 до 400 символов');

    if (errors.length > 0) {
        req.session.flash = { type: 'error', messages: errors };
        return res.redirect('/reviews');
    }

    try {
        const reviews = await readReviews();
        const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
        const newReview = { id: newId, name, email, phone, message, createdAt: new Date().toISOString() };
        reviews.push(newReview);
        await writeReviews(reviews);
        req.session.flash = { type: 'success', messages: ['Спасибо! Ваш отзыв добавлен)'] };
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        req.session.flash = { type: 'error', messages: ['Ошибка сервера. Попробуйте позже.'] };
        res.redirect('/reviews');
    }
});

app.use((req, res) => {
    res.status(404).render('error', { message: 'Страница не найдена', title: '404' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Внутренняя ошибка сервера', title: 'Ошибка' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT} контрлц для завершения`);
});