const router = require('express').Router();

router.use('/boards', require('./boards'));
router.use('/lists', require('./lists'));
router.use('/cards', require('./cards'));

router.use((req, res) => res.status(404).send("Path not found"));

module.exports = router;