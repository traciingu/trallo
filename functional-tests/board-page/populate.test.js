const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, populate, checkBoard } = require('../helpers');

describe('Populate', () => {
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

    it("takes empty boardState", async () => {
        const boardState = [];

        const board = await populate(db, boardState);
        await navigateToBoard('h1', board.insertedId);

        await checkBoard([]);
    })

    it("takes a boardState with a single empty list", async () => {
        const boardState = [
            { title: "Test", cards: [] }
        ];

        const board = await populate(db, boardState);
        await navigateToBoard('[data-item-type="list"]', board.insertedId);

        await checkBoard(boardState);
    })

    it("takes boardState with multiple empty lists", async () => {
        const boardState = [
            { title: "Test", cards: [] },
            { title: "Test 2", cards: [] },
            { title: "Test 3", cards: [] },
        ];

        const board = await populate(db, boardState);
        await navigateToBoard('[data-item-type="list"]', board.insertedId);

        await checkBoard(boardState);
    })

    it("takes boardState with single list populated with one card", async () => {
        const boardState = [
            { title: "Test", cards: ["Test card"] },
        ];

        const board = await populate(db, boardState);
        await navigateToBoard('[data-item-type="list"]', board.insertedId);

        await checkBoard(boardState);
    })

    it("takes boardState with single list populated with multiple cards", async () => {
        const boardState = [
            { title: "Test", cards: ["Test A", "Test B", "Test C"] },
        ];

        const board = await populate(db, boardState);
        await navigateToBoard('[data-item-type="list"]', board.insertedId);

        await checkBoard(boardState);
    })

    it("takes boardState with multiples list. With only one list containing multiple cards", async () => {
        const boardState = [
            { title: "Test", cards: ["Test A", "Test B", "Test C"] },
            { title: "Test", cards: [] },
            { title: "Test", cards: [] },
        ];

        const board = await populate(db, boardState);
        await navigateToBoard('[data-item-type="list"]', board.insertedId);

        await checkBoard(boardState);
    })

    it("takes boardState with multiple lists populated with multiple cards", async () => {
        const boardState = [
            { title: "Test", cards: ["Test A", "Test B", "Test C"] },
            { title: "Test 2", cards: ["Test A", "Test B", "Test C"] },
            { title: "Test 3", cards: ["Test A", "Test B", "Test C"] },
        ];

        const board = await populate(db, boardState);
        await navigateToBoard('[data-item-type="list"]', board.insertedId);

        await checkBoard(boardState);
    });
});