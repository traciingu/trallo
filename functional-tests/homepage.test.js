const { installMouseHelper } = require('./helpers/install-mouse-helper');
// const { populate, deleteAll } = require("../server/db/mongoSeed");

const { MongoClient } = require('mongodb');

const client = new MongoClient("mongodb+srv://tracy:1234@cluster0.7rbuc.mongodb.net/trallo?retryWrites=true&w=majority");


describe('Home page', () => {
    beforeAll(async () => {
        // await populate();

        try {
            await client.connect(() => console.log("Connection opened"));
    
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


    
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close(() => console.log("Connection closed"));
            // done();
        }
    });

    afterAll(async () => {
        // await deleteAll();

        try {
            await client.connect(() => console.log("Connection opened"));
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
            // done();
        }
    });

    it('user can view board and move cards from list to list"', async (done) => {
        await installMouseHelper(page);

        // User opens board
        await page.goto('http://localhost:3000');
        // Page title is Trallo
        await expect(page.title()).resolves.toMatch('Trallo');
        // Has three lists with names 'Todo', 'In progress', 'Done'
        await page.waitForSelector("h2");

        const listTitles = await page.$$eval('h2', nodes => nodes.map(n => n.innerText));
        expect(listTitles).toEqual(['Todo', 'In progress', 'Done']);

        // Inside 'Todo' it contains a card named 'Hello'
        let [parentListElement] = await page.$x('//div[text()="Hello"]/ancestor::div[@class="list"]')
        let listHeader = await parentListElement.$eval('h2', node => node.innerText);

        expect(listHeader).toEqual('Todo');

        // Click and drag 'Hello' card from 'Todo' to 'In Progress'
        // Refresh the browser
        // 'Hello' card now inside the 'In progress' list
        const helloCard = (await page.$x('//div[text()="Hello"]'))[0];
        const inProgressList = (await page.$x('//h2[text()="In progress"]//following-sibling::div'))[0];

        const helloBox = await helloCard.boundingBox();
        const inProgressBox = await inProgressList.boundingBox();


        const helloX = helloBox.x + helloBox.width / 2;
        const helloY = helloBox.y + helloBox.height / 2;
        const inProgressX = inProgressBox.x + inProgressBox.width;
        const inProgressY = inProgressBox.y + inProgressBox.height;


        await page.mouse.move(helloX, helloY, { steps: 5 });
        await page.mouse.down();
        await page.mouse.move(inProgressX, inProgressY, { steps: 5 });
        await page.mouse.up();

        await page.waitForTimeout(500);
        await page.reload();
        await page.waitForSelector("h2");

        [parentListElement] = await page.$x('//div[text()="Hello"]/ancestor::div[@class="list"]');
        listHeader = await parentListElement.$eval('h2', node => node.innerText);

        expect(listHeader).toEqual('In progress');

        done();

    });
});




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

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

async function deleteAll() {
    try {
        // await client.connect();
        const db = client.db('trallo');
        const cards = db.collection('cards');
        await cards.deleteMany({});

        const lists = db.collection('lists');
        await lists.deleteMany({});

        const boards = db.collection('boards');
        await boards.deleteMany({});

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}