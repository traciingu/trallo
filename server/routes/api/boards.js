const router = require('express').Router();
const { Board, List, Card } = require('../../db/models');

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        res.json(await Board.findById(id).populate({
            path: 'lists',
            model: List,
            populate: { path: 'cards', model: Card }
        }));
    } catch (err) {
        next(err);
    }

});

router.get('/', async (req, res, next) => {
    try {
        const boards = await Board.find({});
        const payload = boards.map(board => ({ id: board.id, title: board.title }));
        res.json(payload);
    } catch (err) {
        next(err);
    }

});

router.post('/', async (req, res, next) => {
    try {
        const title = req.body.title;
        const background = req.body.background || "#ffffff";

        console.log(title)
        res.json(await new Board({
            title: title,
            background: background
        }).save());

    } catch (err) {
        next(err);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        let updatedInfo = {};

        if (req.body.title) {
            updatedInfo = { ...updatedInfo, title: req.body.title };
        }

        if (req.body.background) {
            updatedInfo = { ...updatedInfo, background: req.body.background };
        }

        if (req.body.lists) {
            updatedInfo = { ...updatedInfo, lists: [...req.body.lists] };
        }

        res.json(await Board.findByIdAndUpdate(req.params.id, { $set: updatedInfo }, { new: true }));
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        res.json(await Board.findByIdAndDelete(req.params.id));
    } catch (err) {
        next(err);
    }
});

module.exports = router;