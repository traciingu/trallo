const router = require('express').Router();
const { Card } = require('../../db/models');

router.get('/:id', async (req, res, next) => {
    try {
        req.json(await Card.findById(req.params.id));
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        res.json(await new Card({
            title: req.body.title,
            description: req.body.description || null,
            list: req.body.list,
            prev: req.body.prev || null,
            next: req.body.next || null
        }));
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

        if (req.body.description) {
            updatedInfo = { ...updatedInfo, description: req.body.description };
        }

        if (req.body.list) {
            updatedInfo = { ...updatedInfo, list: req.body.list };
        }

        if (req.body.prev) {
            updatedInfo = { ...updatedInfo, title: req.body.prev };
        }

        if (req.body.next) {
            updatedInfo = { ...updatedInfo, title: req.body.next };
        }


        res.json(await Card.findByIdAndUpdate(req.params.id, { $set: updatedInfo }, { new: true }));
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        res.json(await Card.findByIdAndDelete(req.params.id));
    } catch (err) {
        next(err);
    }
});

module.exports = router;