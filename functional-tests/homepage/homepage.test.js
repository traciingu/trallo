const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, backspace, populate, checkBoard } = require('../helpers');

describe('Homepage', () => {
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

    describe("Starts without board components", () => {
        const boardState = [];

        let board;

        beforeEach(async () => {
            try {
                board = await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it('Does not display lists', async () => {
            await page.goto(`http://localhost:3000/home`);
            await page.waitForSelector('[data-component="navbar"]');

            const listExists = await page.$eval('[data-item-type="list"]', () => true).catch(() => false);
            expect(listExists).toEqual(false);

        });

        it('Has empty homepage message and button', async () => {
            await page.goto(`http://localhost:3000/home`);
            await page.waitForSelector('[data-component="navbar"]');

            const placeholder = await page.$('[data-placeholder="empty-homepage"]');
            const placeholderText = await placeholder.evaluate(element => element.innerText);

            expect(placeholderText).toEqual("You have no boards");

            const createButton = await page.$('[data-medium-button="homepage-create-board"]');
            const createButtonText = await createButton.evaluate(element => element.value);

            expect(createButtonText).toEqual("Create Board");

            await page.click('[data-medium-button="homepage-create-board"]');
            await page.waitForSelector('[data-modal-type="board"]', { visible: true });

            


        });
    });

    // describe("Starts without board components", () => {
    //     const boardState = [];

    //     let board;

    //     beforeEach(async () => {
    //         try {
    //             board = await populate(db, boardState);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     });
    // });
});
