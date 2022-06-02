const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, populate, checkBoard } = require('../helpers');

describe('Card modal', () => {
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

    describe("Starting Db with one card", () => {
        const boardState = [
            { title: 'Todo', cards: ["Hello"] },
        ];

        beforeEach(async () => {
            try {
                await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it('displays card modal when card is clicked', async () => {
            await navigateToBoard('[data-item-type="card"]');

            await page.waitForSelector('[data-modal-type="card"]', {visible: false});
            await page.click('[data-item-type="card"]');
            await page.waitForSelector('[data-modal-type="card"]', {visible: true});
            
        });
    });
});