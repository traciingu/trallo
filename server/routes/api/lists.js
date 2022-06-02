const router = require('express').Router();
const { List, Board, Card } = require('../../db/models');

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        res.json(await List.findById(id));
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newList = await new List({
            title: req.body.title,
        }).save();

        await Board.findByIdAndUpdate(req.body.boardId, { $push: {lists: [newList.id]} });
        res.json(newList);
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

        if (req.body.card) {
            updatedInfo = { ...updatedInfo, cards: [...req.body.card] };
        }

        console.log(updatedInfo)

        await List.findByIdAndUpdate(req.params.id, { $set: updatedInfo }, { new: true });
        res.json(await List.find({}));
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const list = await List.findById(req.params.id);
        await Card.deleteMany({id: list.cards});
        res.json(await List.findByIdAndDelete(req.params.id));
    } catch (err) {
        next(err);
    }
});

module.exports = router;