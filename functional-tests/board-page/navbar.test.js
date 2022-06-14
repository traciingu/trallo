const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, populate, checkBoard } = require('../helpers');

describe('Navbar', () => {
    let connection;
    let db;

    beforeAll(async () => {
        try {
            await installMouseHelper(page);

            connection = await MongoClient.connect("mongodb+srv://tracy:1234@cluster0.7rbuc.mongodb.net/trallo?retryWrites=true&w=majority");
            db = await connection.db("trallo");

            const cards = db.collection('cards');
            await cards.deleteMany({});

            const lists = db.collection('lists');
            await lists.deleteMany({});

            const boards = db.collection('boards');
            await boards.deleteMany({});

        } catch (err) {
            console.log(err);
        }
    });

    afterAll(async () => {
        await connection.close();
    })

    afterEach(async () => {
        try {
            const cards = db.collection('cards');
            await cards.deleteMany({});

            const lists = db.collection('lists');
            await lists.deleteMany({});

            const boards = db.collection('boards');
            await boards.deleteMany({});

        } catch (err) {
            console.log(err);
        }
    });

    describe('Start with one board', () => {
        const boardState = [];
        let board;

        beforeEach(async () => {
            try {
                board = await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it('Has a navbar', async () => {
            await page.goto(`http://localhost:3000/b/${board.insertedId}`);
            await page.waitForSelector('[data-component="navbar"]');

            const navbarHomeButton = await page.$('[data-navbar-button="home"]');
            const navbarHomeButtonText = await navbarHomeButton.evaluate(element => element.innerText);

            expect(navbarHomeButtonText).toEqual("Home");

            const createButton = await page.$('[data-create-item-button="board"]');
            await createButton.evaluate(element => element.value);
        });

        it('Navigates to home', async () => {
            await page.goto(`http://localhost:3000/b/${board.insertedId}`);
            await page.waitForSelector('[data-component="navbar"]');

            await page.click('[data-navbar-button="home"]');
            await page.waitForSelector('[data-component="navbar"]');

            const url = await page.url();
            expect(url).toEqual('http://localhost:3000/home');
        });
    });
});