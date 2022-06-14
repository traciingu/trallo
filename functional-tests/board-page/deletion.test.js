const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, populate, checkBoard } = require('../helpers');

describe('Deletion', () => {
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
    });

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
            { title: 'In progress', cards: [] },
            { title: 'Done', cards: [] },
        ];

        let board;

        beforeEach(async () => {
            try {
                board = await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it('deletes a card', async () => {
            await navigateToBoard('[data-item-type="list"]', board.insertedId);

            await page.click('[data-edit-item-button="card"]');
            await page.waitForSelector('[data-delete-item="card"]');

            const cardDeleteButton = await page.$('[data-delete-item="card"]');
            const cardDeleteButtonText = await cardDeleteButton.evaluate(element => element.value);
            expect(cardDeleteButtonText).toEqual("Delete");

            await page.click('[data-delete-item="card"]');
            await page.waitForFunction(() => !document.querySelector('[data-item-type="card"]'));

            const expectedLists = [
                { title: 'Todo', cards: [] },
                { title: 'In progress', cards: [] },
                { title: 'Done', cards: [] },
            ];

            await checkBoard(expectedLists);

        });

        it('deletes a list', async () => {
            await navigateToBoard('[data-item-type="list"]', board.insertedId);

            await page.click('[data-edit-item-button="list"]');
            await page.waitForSelector('[data-delete-item="list"]');

            const listDeleteButton = await page.$('[data-delete-item="list"]');
            const listDeleteButtonText = await listDeleteButton.evaluate(element => element.value);
            expect(listDeleteButtonText).toEqual("Delete");

            await page.click('[data-delete-item="list"]');
            await page.waitForFunction(() => !document.querySelector('[data-list-title="Todo"]'));

            const expectedLists = [
                { title: 'In progress', cards: [] },
                { title: 'Done', cards: [] },
            ];

            await checkBoard(expectedLists);
        });
    });
});