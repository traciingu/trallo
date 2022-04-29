const { MongoClient } = require('mongodb');
const board = require('./models/board');

require('dotenv').config();

const client = new MongoClient("mongodb+srv://tracy:1234@cluster0.7rbuc.mongodb.net/trallo?retryWrites=true&w=majority");

async function populate() {
    try {
        await client.connect();

        const db = client.db('trallo');

        const cards = db.collection('cards');

        const hello = {
            title: "Hello",
            description: "Goodbye"
        };

        const card = await cards.insertOne(hello);

        const todo = {
            title: "Todo",
            cards: [card.insertedId]
        }

        const inProgress = {
            title: "In progress",
            cards: []
        }

        const done = {
            title: "Done",
            cards: []
        }

        const lists = db.collection('lists');
        const list = await lists.insertMany([todo, inProgress, done]);

        const dummy = {
            title: "Dummy",
            lists: Object.keys(list.insertedIds).map(key => list.insertedIds[key])
        }

        const boards = db.collection('boards');
        const board = await boards.insertOne(dummy);


        // console.log(board)
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function deleteAll() {
    try {
        await client.connect();
        const db = client.db('trallo');
        const cards = db.collection('cards');
        const card = await cards.deleteMany({});

        const lists = db.collection('lists');
        const list = await lists.deleteMany({});

        const boards = db.collection('boards');
        const board = await boards.deleteMany({});

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// deleteAll().catch(console.dir);
// populate().catch(console.dir);

module.exports = { populate, deleteAll };
