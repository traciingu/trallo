const { installMouseHelper } = require('./install-mouse-helper');
const navigateToBoard = require('./navigateToBoard');
const populate = require('./populate');
const checkBoard = require('./checkBoard');
const getCoordinates = require('./getCoordinates');
const dragAndDrop = require('./dragAndDrop');
const backspace = require('./backspace');

module.exports = {
    installMouseHelper,
    navigateToBoard,
    populate,
    checkBoard,
    getCoordinates,
    dragAndDrop,
    backspace
};