const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, populate, checkBoard, getCoordinates, dragAndDrop } = require('../helpers');

describe('Drag and drop', () => {
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
            { title: 'In progress', cards: [] },
            { title: 'Done', cards: [] },
        ];

        beforeEach(async () => {
            try {
                await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it('user can view board and move cards from list to list', async () => {

            await navigateToBoard("h2");

            await expect(page.title()).resolves.toMatch('Trallo');

            let expectedLists = [
                { title: "Todo", cards: ["Hello"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            const helloCardText = boardState[0].cards[0];
            const helloCard = await page.$(`[data-card-title="${helloCardText}"]`);
            const inProgressList = (await page.$x('//h2[text()="In progress"]//following-sibling::div'))[0];

            const helloCoors = await getCoordinates(helloCard);
            const inProgressCoors = await getCoordinates(inProgressList);

            await dragAndDrop(helloCoors, inProgressCoors);

            await page.waitForTimeout(700);
            await page.reload();
            await page.waitForSelector("h2");

            expectedLists = [
                { title: "Todo", cards: [] },
                { title: "In progress", cards: ["Hello"] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

        });

        it('reorders the Todo list to be after the In Progress list', async () => {

            await navigateToBoard("h2");

            let expectedLists = [
                { title: "Todo", cards: ["Hello"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            const todoList = (await page.$x('//h2[text()="Todo"]'))[0];
            const inProgressList = (await page.$x('//h2[text()="In progress"]'))[0];

            const todoCoors = await getCoordinates(
                todoList,
                (x) => { return x / 2 },
                (y) => { return y / 2 }
            );
            const inProgressCoors = await getCoordinates(inProgressList, (x) => { return x / 1.25 });

            await dragAndDrop(todoCoors, inProgressCoors);

            await page.waitForTimeout(700);

            expectedLists = [
                { title: "In progress", cards: [] },
                { title: "Todo", cards: ["Hello"] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            await page.reload();
            await page.waitForSelector("h2");

            await checkBoard(expectedLists);
        });
    });
});