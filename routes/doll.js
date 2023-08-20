var express = require('express');
const dollModel = require('../models/DollModels');
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
    var dolls = await dollModel.find();
    //res.send(dolls);
    res.render('doll/dollList', { dolls: dolls })
})
router.get('/delete/:id', async (req, res) => {
    await dollModel.findByIdAndDelete(req.params.id)
    res.redirect('/doll');
});
router.get('/add', async (req, res) => {
    res.render('doll/dollAdd')
})
router.post('/add', upload.single('image'), async (req, res) => {

    const doll = req.body;
    doll.image = req.file.filename;
    await dollModel.create(doll)
        .then(console.log('Add product successfully'))
        .catch(err => console.log(err));
    res.redirect('/doll');
});
router.get('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var doll = await dollModel.findById(id);
    var formatteddoll = {
        ...doll.toObject(),
        formattedDate: doll.date ? doll.date.toISOString().substring(0, 10) : "",
    }
    res.render('doll/dollEdit', { dolls: formatteddoll });
});
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    var id = req.params.id;
    var doll = req.body;
    if (req.file) {
        doll.image = req.file.filename;
    }
    var originaldoll = await dollModel.findById(id)

    Object.keys(doll).forEach((key) => {
        if (doll[key] !== "" && doll[key] !== undefined) {
            originaldoll[key] = doll[key];
        }
    })
    await originaldoll.save();
    res.redirect('/doll');
});
router.post('/search', async (req, res) => {
    var keyword = req.body.keyword;
    var dolls = await dollModel.find({ model: new RegExp(keyword, "i") })
    console.log(keyword);
    console.log(dolls);
    res.render('doll/dollList', { dolls: dolls });
})

router.get('/sort/model/asc', async (req, res) => {
    var dolls = await dollModel.find().sort({ model: 1 });
    res.render('doll/dollList', { dolls: dolls });
})

router.get('/sort/model/desc', async (req, res) => {
    var dolls = await dollModel.find().sort({ model: -1 });
    res.render('doll/dollList', { dolls: dolls });
})

router.get('/sort/quantity/asc', async (req, res) => {
    var dolls = await dollModel.find().sort({ quantity: 1 });
    res.render('doll/dollList', { dolls: dolls });
})

router.get('/sort/quantity/desc', async (req, res) => {
    var dolls = await dollModel.find().sort({ quantity: -1 });
    res.render('doll/dollList', { dolls: dolls });
})

module.exports = router;