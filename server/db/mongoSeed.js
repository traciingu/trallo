const { MongoClient } = require('mongodb');

const client = new MongoClient("mongodb+srv://tracy:1234@cluster0.7rbuc.mongodb.net/trallo?retryWrites=true&w=majority");

// client.connect();

async function populate() {
    try {
        await client.connect();

        const db = client.db('trallo');
        const cards = db.collection('cards');

        const hello = {
            title: "Hello",
            description: "Goodbye"
        };

        const goodbye = {
            title: "Goodbye",
            description: "Hello"
        };

        const card = await cards.insertMany([hello, goodbye]);

        const todo = {
            title: "Todo",
            cards: Object.keys(card.insertedIds).map(key => card.insertedIds[key])
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

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close(() => console.log("Connection closed"));
    }
}

async function deleteAll() {
    try {
        await client.connect();
        const db = client.db('trallo');
        const cards = db.collection('cards');
        await cards.deleteMany({});

        const lists = db.collection('lists');
        await lists.deleteMany({});

        const boards = db.collection('boards');
        await boards.deleteMany({});

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close(() => console.log("Connection closed"));
    }
}


populate().catch(console.dir);
// deleteAll().catch(console.dir);

module.exports = { populate, deleteAll };
