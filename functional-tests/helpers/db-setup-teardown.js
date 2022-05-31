const mongoose = require('mongoose');

require('dotenv').config();

// mongoose.connect(process.env.MONGO_URI, {useFindAndModify: true});

// const { Board, List, Card } = require('../../server/db/models');

async function dbSetup(Board, List, Card) {

    const hello = await new Card({
            title: "Hello",
            description: "Goodbye"
        }).save();
    
    const todo = await new List({
        title: "Todo",
        cards:[hello.id]
    }).save();

    const inProgress = await new List({
        title: "In progress",
        cards:[]
    }).save();

    const done = await new List({
        title: "Done",
        cards:[]
    }).save();

    await new Board({
            title: "Dummy",
            background: "#000000",
            lists: [todo.id, inProgress.id, done.id]
        }).save();

}

async function dbTeardown(Board, List, Card) {
    await Card.deleteMany({});
    await List.deleteMany({});
    await Board.deleteMany({});
}

module.exports = {dbSetup, dbTeardown};