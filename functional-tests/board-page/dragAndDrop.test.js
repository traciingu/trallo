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

            await navigateToBoard('[data-item-type="list"]');

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

            const helloCoors = await getCoordinates(helloCard, (x) => { return x / 2 }, (y) => { return y / 2 });
            const inProgressCoors = await getCoordinates(inProgressList);

            await dragAndDrop(helloCoors, inProgressCoors);

            await page.waitForFunction(() => {
                const destinationList = document.querySelector('[data-item-type="list"][data-list-title="In progress"]');
                const movedCard = destinationList.querySelector('[data-item-type="card"][data-card-title="Hello"]');
                return movedCard;
            });

            expectedLists = [
                { title: "Todo", cards: [] },
                { title: "In progress", cards: ["Hello"] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            await page.reload();
            await page.waitForSelector('[data-item-type="list"]');
            await checkBoard(expectedLists);

        });

        it('reorders the Todo list to be after the In Progress list', async () => {

            await navigateToBoard('[data-item-type="list"]');

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

            await page.waitForFunction(() => {
                const destinationList = document.querySelector('[data-list-property="title"]');
                return destinationList.innerText.localeCompare("In progress") === 0;
            });

            expectedLists = [
                { title: "In progress", cards: [] },
                { title: "Todo", cards: ["Hello"] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            await page.reload();
            await page.waitForSelector('[data-item-type="list"]');

            await checkBoard(expectedLists);
        });
    });

    describe("Starting Db with two cards", () => {
        const boardState = [
            { title: 'Todo', cards: ["Hello", "Goodbye"] },
            { title: 'In progress', cards: [] },
            { title: 'Done', cards: [] },
        ];

        beforeEach(async () => {
            try {
                await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        })

        it('can reorder cards within the same list', async () => {

            await navigateToBoard('[data-item-type="list"]');

            const helloCardText = boardState[0].cards[0];
            const helloCard = await page.$(`[data-card-title="${helloCardText}"]`);

            const goodbyeCardText = boardState[0].cards[1];
            const goodbyeCard = await page.$(`[data-card-title="${goodbyeCardText}"]`);

            const helloCoors = await getCoordinates(helloCard, (x) => { return x / 2 }, (y) => { return y / 2 });
            const goodbyeCoors = await getCoordinates(goodbyeCard, (x) => { return x / 2 }, (y) => { return y / 2 });

            await dragAndDrop(helloCoors, goodbyeCoors);

            await page.waitForFunction(() => {
                const destinationList = document.querySelector('[data-item-type="list"][data-list-title="Todo"]');
                const firstChild = destinationList.querySelector('[data-card-property="title"]');
                return firstChild.innerText.localeCompare("Goodbye") === 0;
            });


            let expectedLists = [
                { title: "Todo", cards: ["Goodbye", "Hello"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            await page.reload();
            await page.waitForSelector('[data-item-type="list"]');

            expectedLists = [
                { title: "Todo", cards: ["Goodbye", "Hello"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);
        });

        it('moves one card to a different list then reorder a list containing a card', async () => {
            await navigateToBoard('[data-item-type="list"]');

            let expectedLists = [
                { title: "Todo", cards: ["Hello", "Goodbye"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            const helloCardText = boardState[0].cards[0];
            const helloCard = await page.$(`[data-card-title="${helloCardText}"]`);
            let inProgressList = (await page.$x('//h2[text()="In progress"]//following-sibling::div'))[0];

            const helloCoors = await getCoordinates(helloCard, (x) => { return x / 2 }, (y) => { return y / 2 });
            let inProgressCoors = await getCoordinates(inProgressList, (x) => { return x / 2 }, (y) => { return y / 2 });

            await dragAndDrop(helloCoors, inProgressCoors);

            await page.waitForFunction(() => {
                const destinationList = document.querySelector('[data-item-type="list"][data-list-title="In progress"]');
                const movedCard = destinationList.querySelector('[data-item-type="card"][data-card-title="Hello"]');
                return movedCard;
            });

            expectedLists = [
                { title: "Todo", cards: ["Goodbye"] },
                { title: "In progress", cards: ["Hello"] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            const todoList = (await page.$x('//h2[text()="Todo"]'))[0];
            inProgressList = (await page.$x('//h2[text()="In progress"]'))[0];

            const todoCoors = await getCoordinates(
                todoList,
                (x) => { return x / 2 },
                (y) => { return y / 2 }
            );
            inProgressCoors = await getCoordinates(inProgressList);

            await dragAndDrop(todoCoors, inProgressCoors);

            await page.waitForFunction(() => {
                const destinationList = document.querySelector('[data-list-property="title"]');
                return destinationList.innerText.localeCompare("In progress") === 0;
            });

            expectedLists = [
                { title: "In progress", cards: ["Hello"] },
                { title: "Todo", cards: ["Goodbye"] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            await page.reload();
            await page.waitForSelector('[data-item-type="list"]');

            await checkBoard(expectedLists);

        })
    });
});