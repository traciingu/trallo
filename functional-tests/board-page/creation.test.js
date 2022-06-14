const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, populate, checkBoard } = require('../helpers');

describe('Creation', () => {
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

    describe("Starting with empty board", () => {
        const boardState = [];
        let boardDb;

        beforeEach(async () => {
            try {
                boardDb = await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it('creates a new list', async () => {
            await navigateToBoard('[data-item-type="board"]', boardDb.insertedId);

            const board = await page.$('[data-item-type="board"]');

            await page.click('[data-add-button="list"]');
            const createInputField = await board.$('[data-create-item-input="list"]');
            await createInputField.type('Test List');

            const createButton = await board.$('[data-create-item-confirm="list"]');
            const createButtonText = await createButton.evaluate(element => element.value);
            expect(createButtonText).toEqual('Add List');

            await page.waitForSelector('[data-create-item-confirm="list"]');
            await page.click('[data-create-item-confirm="list"]');
            await page.waitForSelector('[data-item-type="list"]');

            const expectedList = [
                { title: "Test List", cards: [] },
            ];

            await checkBoard(expectedList);

            await page.reload();
            await page.waitForSelector('[data-item-type="list"]');

            await checkBoard(expectedList);
        }, 10000);

        it("can open and close create list form", async () => {
            await navigateToBoard('[data-item-type="board"]', boardDb.insertedId);

            let expectedLists = [];
            await checkBoard(expectedLists);

            const board = await page.$('.board');
            let listCreateButton = await board.$('[data-add-button="list"]');
            const listButtonText = await listCreateButton.evaluate(btn => btn.value);

            expect(listButtonText).toEqual("Add list");

            const createListContainer = await board.$('[data-create-item-container="list"]');
            let createListContainerVisibility = await createListContainer.evaluate(element => getComputedStyle(element).getPropertyValue('display'));

            expect(createListContainerVisibility).toEqual("none");

            await page.click('[data-add-button="list"]');
            await page.waitForSelector('[data-create-item-container="list"]', { visible: true });

            let listCreateButtonVisibility = await listCreateButton.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            createListContainerVisibility = await createListContainer.evaluate(element => getComputedStyle(element).getPropertyValue('display'));

            expect(listCreateButtonVisibility).toEqual("none");
            expect(createListContainerVisibility).not.toEqual("none");

            const createInputField = await createListContainer.$('[data-create-item-input="list"]');
            const createInputFieldType = await createInputField.evaluate(element => element.type);
            expect(createInputFieldType).toEqual('text');

            const cancelButton = await createListContainer.$('[data-create-item-cancel="list"]');
            const cancelButtonType = await cancelButton.evaluate(element => element.type);
            const cancelButtonText = await cancelButton.evaluate(element => element.value);
            expect(cancelButtonType).toEqual('button');
            expect(cancelButtonText).toEqual('Cancel');

            await page.waitForTimeout(300); // Test currently doesn't work without t/o. Needs to removed
            await page.click('[data-create-item-cancel="list"]');
            await page.waitForSelector('[data-create-item-container="list"]', {visible: false});
            createListContainerVisibility = await createListContainer.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            listCreateButtonVisibility = await listCreateButton.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(createListContainerVisibility).toEqual('none');
            expect(listCreateButtonVisibility).not.toEqual('none');
        });
    });

    describe("Starting with one empty list", () => {
        let board;

        beforeEach(async () => {
            try {
                const boardState = [
                    { title: "Todo", cards: [] }
                ];

                board = await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it("create and persist a new card", async () => {
            await navigateToBoard('[data-item-type="list"]', board.insertedId);

            const firstList = await page.$('[data-item-type="list"]');
            const newCardTitle = 'Test Card';

            await page.click('[data-add-button="card"]');
            const createInputField = await firstList.$('[data-create-item-input="card"]');
            await createInputField.type(newCardTitle);

            const createButton = await firstList.$('[data-create-item-confirm="card"]');
            const createButtonText = await createButton.evaluate(element => element.value);
            expect(createButtonText).toEqual('Add Card');

            await page.click('[data-create-item-confirm="card"]');
            await page.waitForSelector('[data-item-type="card"]');

            const expectedList = [
                { title: "Todo", cards: ["Test Card"] },
            ];

            await checkBoard(expectedList);
        });

        it("can open and close the create card form", async () => {
            await navigateToBoard('[data-item-type="list"]', board.insertedId);

            const firstList = await page.$('[data-item-type="list"]');
            const addCardButton = await firstList.$('[data-add-button="card"]');

            const addCardButtonType = await addCardButton.evaluate(btn => btn.type);
            const addCardButtonText = await addCardButton.evaluate(btn => btn.value);

            expect(addCardButtonType).toEqual("button");
            expect(addCardButtonText).toEqual("Add card");

            const addCardContainer = await firstList.$('[data-create-item-container="card"]');
            let addCardContainerVisibility = await addCardContainer.evaluate(element => getComputedStyle(element).getPropertyValue('display'));

            expect(addCardContainerVisibility).toEqual("none");

            await page.click('[data-add-button="card"]');
            await page.waitForSelector('[data-create-item-container="card"][data-create-item-container-visibility=true]');

            let addCardButtonVisibility = await addCardButton.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            addCardContainerVisibility = await addCardContainer.evaluate(element => getComputedStyle(element).getPropertyValue('display'));

            expect(addCardButtonVisibility).toEqual("none");
            expect(addCardContainerVisibility).not.toEqual("none");

            const createInputField = await addCardContainer.$('[data-create-item-input="card"]');
            const createInputFieldType = await createInputField.evaluate(element => element.type);
            expect(createInputFieldType).toEqual('text');

            const cancelButton = await addCardContainer.$('[data-create-item-cancel="card"]');
            const cancelButtonType = await cancelButton.evaluate(element => element.type);
            const cancelButtonText = await cancelButton.evaluate(element => element.value);
            expect(cancelButtonType).toEqual('button');
            expect(cancelButtonText).toEqual('Cancel');

            await page.click('[data-create-item-cancel="card"]');
            await page.waitForSelector('[data-create-item-container="card"][data-create-item-container-visibility=false]');

            addCardButtonVisibility = await addCardButton.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            addCardContainerVisibility = await addCardContainer.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(addCardContainerVisibility).toEqual('none');
            expect(addCardButtonVisibility).not.toEqual('none');

        });
    });
});