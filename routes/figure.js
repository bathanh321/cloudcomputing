var express = require('express');
const FigureModel = require('../models/FigureModels');
var router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, res) => {
        res(null, "./public/images");
    },
    filename: (req, file, res) => {
        res(null, file.originalname);
    },
});
var upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    var figures = await FigureModel.find();
    //res.send(figures);
    res.render('figure/figureList', { figures: figures })
})
router.get('/delete/:id', async (req, res) => {
    await FigureModel.findByIdAndDelete(req.params.id)
    res.redirect('/figure');
});
router.get('/add', async (req, res) => {
    res.render('figure/figureAdd')
})
router.post('/add', upload.single('image'), async (req, res) => {
    const figure = req.body;
    figure.image = req.file.filename;
    await FigureModel.create(figure)
        .then(console.log('Add product successfully'))
        .catch(err => console.log(err));
    res.redirect('/figure');
});
router.get('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var figure = await FigureModel.findById(id);
    var formattedFigure = {
        ...figure.toObject(),
        formattedDate: figure.date ? figure.date.toISOString().substring(0, 10) : "",
    }
    res.render('figure/figureEdit', { figures: formattedFigure });
});
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    var id = req.params.id;
    var figure = req.body;
    if (req.file) {
        figure.image = req.file.filename;
    }
    var originalFigure = await FigureModel.findById(id)

    Object.keys(figure).forEach((key) => {
        if (figure[key] !== "" && figure[key] !== undefined) {
            originalFigure[key] = figure[key];
        }
    })
    await originalFigure.save();
    res.redirect('/figure');
});
router.post('/search', async (req, res) => {
    var keyword = req.body.keyword;
    var figures = await FigureModel.find({ model: new RegExp(keyword, "i") })
    console.log(keyword);
    console.log(figures);
    res.render('figure/figureList', { figures: figures });
})

router.get('/sort/model/asc', async (req, res) => {
    var figures = await FigureModel.find().sort({ model: 1 });
    res.render('figure/figureList', { figures: figures });
})

router.get('/sort/model/desc', async (req, res) => {
    var figures = await FigureModel.find().sort({ model: -1 });
    res.render('figure/figureList', { figures: figures });
})

router.get('/sort/quantity/asc', async (req, res) => {
    var figures = await FigureModel.find().sort({ quantity: 1 });
    res.render('figure/figureList', { figures: figures });
})

router.get('/sort/quantity/desc', async (req, res) => {
    var figures = await FigureModel.find().sort({ quantity: -1 });
    res.render('figure/figureList', { figures: figures });
})

module.exports = router;