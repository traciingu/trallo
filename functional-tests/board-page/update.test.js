const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, populate, checkBoard } = require('../helpers');

describe('Update', () => {
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

        it('updates a card title', async () => {
            await navigateToBoard('[data-item-type="list"]');

            const cardEditButton = await page.$('[data-edit-item-button="card"]');
            const cardEditButtonText = await cardEditButton.evaluate(element => element.value);
            expect(cardEditButtonText).toEqual('Edit');

            await page.click('[data-edit-item-button="card"]');
            await page.waitForSelector('[data-edit-item-form="card"]');

            const cardTitleText = boardState[0].cards[0];
            const cardTitle = await page.$(`[data-card-title="${cardTitleText}"]`);
            let cardTitleVisibility = await cardTitle.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(cardTitleVisibility).toEqual("none");

            const cardEditInput = await page.$('[data-edit-item-input="card"]');
            let cardEditInputText = await cardEditInput.evaluate(element => element.value);
            expect(cardEditInputText).toEqual(cardTitleText);

            await page.click('[data-edit-item-input="card"]');
            for (let i = 0; i < cardEditInputText.length; i++) {
                await page.keyboard.press('Backspace');
            }

            await cardEditInput.type("TEST");
            cardEditInputText = await cardEditInput.evaluate(element => element.value);
            expect(cardEditInputText).toEqual("TEST");

            await page.keyboard.press('Enter');
            await page.waitForSelector('[data-edit-item-form="card"]', { hidden: true });
            await page.waitForSelector('[data-card-title="TEST"]');

            const cardEditForm = await page.$('[data-edit-item-form="card"]');
            const cardEditFormVisibility = await cardEditForm.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            cardTitleVisibility = await cardTitle.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(cardEditFormVisibility).toEqual("none");
            expect(cardTitleVisibility).not.toEqual("none");

            const expectedLists = [
                { title: 'Todo', cards: ["TEST"] },
                { title: 'In progress', cards: [] },
                { title: 'Done', cards: [] },
            ];
            await checkBoard(expectedLists);

        });
    });

    describe("Starting with one empty list", () => {
        beforeEach(async () => {
            try {
                const boardState = [
                    { title: "Todo", cards: [] }
                ];

                await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it("updates a list title", async () => {
            await navigateToBoard('[data-item-type="list"]');

            const listEditButton = await page.$('[data-edit-item-button="list"]');
            const listEditButtonText = await listEditButton.evaluate(element => element.value);
            expect(listEditButtonText).toEqual("Edit");

            await page.click('[data-edit-item-button="list"]');
            await page.waitForSelector('[data-edit-item-input="list"]');

            const listEditInput = await page.$('[data-edit-item-input="list"]');
            let listEditInputText = await listEditInput.evaluate(element => element.value);
            expect(listEditInputText).toEqual("Todo");

            await page.click('[data-edit-item-input="list"]');
            for (let i = 0; i < listEditButtonText.length; i++) {
                await page.keyboard.press('Backspace');
            }

            await listEditInput.type("TEST");
            listEditInputText = await listEditInput.evaluate(element => element.value);
            expect(listEditInputText).toEqual("TEST");

            await page.keyboard.press('Enter');
            await page.waitForSelector('[data-list-title="TEST"]');

            const expectedLists = [
                { title: "TEST", cards: [] }
            ];

            await checkBoard(expectedLists);
        });
    });
});