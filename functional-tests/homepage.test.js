const { installMouseHelper } = require('./helpers/install-mouse-helper');

const { MongoClient } = require('mongodb');
const board = require('../server/db/models/board');


// TODO Write FT for reordering lists
describe('Home page', () => {
    let connection;
    let db;

    // TODO setup installMouseHelper in beforeEach()

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
        })

        it('user can view board and move cards from list to list', async () => {

            await navigateToBoard("h2");

            await expect(page.title()).resolves.toMatch('Trallo');

            let expectedLists = [
                { title: "Todo", cards: ["Hello"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            // Click and drag 'Hello' card from 'Todo' to 'In Progress'
            // Refresh the browser
            // 'Hello' card now inside the 'In progress' list
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

        it('updates a card title', async () => {
            await navigateToBoard("h2");

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

        it('deletes a card', async () => {
            await navigateToBoard('h2');

            await page.click('[data-edit-item-button="card"]');
            await page.waitForSelector('[data-delete-item="card"]');

            const cardDeleteButton = await page.$('[data-delete-item="card"]');
            const cardDeleteButtonText = await cardDeleteButton.evaluate(element => element.value);
            expect(cardDeleteButtonText).toEqual("Delete");

            await page.click('[data-delete-item="card"]');
            await page.waitForTimeout(700);

            const expectedLists = [
                { title: 'Todo', cards: [] },
                { title: 'In progress', cards: [] },
                { title: 'Done', cards: [] },
            ];

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

            await navigateToBoard("h2");

            const helloCardText = boardState[0].cards[0];
            const helloCard = await page.$(`[data-card-title="${helloCardText}"]`);

            const goodbyeCardText = boardState[0].cards[1];
            const goodbyeCard = await page.$(`[data-card-title="${goodbyeCardText}"]`);

            const helloCoors = await getCoordinates(helloCard);
            const goodbyeCoors = await getCoordinates(goodbyeCard);

            await dragAndDrop(helloCoors, goodbyeCoors);

            await page.waitForTimeout(1000);

            let expectedLists = [
                { title: "Todo", cards: ["Goodbye", "Hello"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            await page.reload();
            await page.waitForSelector("h2");
            await page.waitForTimeout(1000);

            expectedLists = [
                { title: "Todo", cards: ["Goodbye", "Hello"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);
        });

        it('moves one card to a different list then reorder a list containing a card', async () => {
            await navigateToBoard("h2");

            let expectedLists = [
                { title: "Todo", cards: ["Hello", "Goodbye"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            const helloCardText = boardState[0].cards[0];
            const helloCard = await page.$(`[data-card-title="${helloCardText}"]`);
            let inProgressList = (await page.$x('//h2[text()="In progress"]//following-sibling::div'))[0];

            const helloCoors = await getCoordinates(helloCard);
            let inProgressCoors = await getCoordinates(inProgressList);

            await dragAndDrop(helloCoors, inProgressCoors);

            await page.waitForTimeout(1000);

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

            await page.waitForTimeout(700);

            expectedLists = [
                { title: "In progress", cards: ["Hello"] },
                { title: "Todo", cards: ["Goodbye"] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            await page.reload();
            await page.waitForSelector("h2");

            await checkBoard(expectedLists);

        })
    });

    describe("Starting with empty board", () => {
        beforeEach(async () => {
            try {
                const boardState = [];
                await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        })

        it("can open and close create list form", async () => {
            await navigateToBoard("h1");

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
            await page.waitForTimeout(700);

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

            await page.click('[data-create-item-cancel="list"]');
            await page.waitForTimeout(700);
            listCreateButtonVisibility = await listCreateButton.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            createListContainerVisibility = await createListContainer.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(createListContainerVisibility).toEqual('none');
            expect(listCreateButtonVisibility).not.toEqual('none');
        });

        it('creates a new list', async () => {
            await navigateToBoard("h1");

            const board = await page.$('.board');

            await page.click('[data-add-button="list"]');
            const createInputField = await board.$('[data-create-item-input="list"]');
            await createInputField.type('Test List');

            const createButton = await board.$('[data-create-item-confirm="list"]');
            const createButtonText = await createButton.evaluate(element => element.value);
            expect(createButtonText).toEqual('Add List');

            await page.click('[data-create-item-confirm="list"');
            await page.waitForTimeout(700);

            const expectedList = [
                { title: "Test List", cards: [] },
            ];

            await checkBoard(expectedList);

            await page.reload();
            await page.waitForSelector("h2");

            await checkBoard(expectedList);

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

        it("can open and close the create card form", async () => {
            await navigateToBoard('[data-item-type="list"]');

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
            await page.waitForTimeout(700);

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
            await page.waitForTimeout(700);

            addCardButtonVisibility = await addCardButton.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            addCardContainerVisibility = await addCardContainer.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(addCardContainerVisibility).toEqual('none');
            expect(addCardButtonVisibility).not.toEqual('none');

        });

        it("create and persist a new card", async () => {
            await navigateToBoard("h2");

            const firstList = await page.$('[data-item-type="list"]');

            await page.click('[data-add-button="card"]');
            const createInputField = await firstList.$('[data-create-item-input="card"]');
            await createInputField.type('Test Card');

            const createButton = await firstList.$('[data-create-item-confirm="card"]');
            const createButtonText = await createButton.evaluate(element => element.value);
            expect(createButtonText).toEqual('Add Card');

            await page.click('[data-create-item-confirm="card"');
            await page.waitForTimeout(700);

            const expectedList = [
                { title: "Todo", cards: ["Test Card"] },
            ];

            await checkBoard(expectedList);
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
    })

    describe("Populate", () => {
        it("takes empty boardState", async () => {
            const boardState = [];

            await populate(db, boardState);
            await navigateToBoard('h1');

            await checkBoard([]);
        })

        it("takes a boardState with a single empty list", async () => {
            const boardState = [
                { title: "Test", cards: [] }
            ];

            await populate(db, boardState);
            await navigateToBoard('h2');

            await checkBoard(boardState);
        })

        it("takes boardState with multiple empty lists", async () => {
            const boardState = [
                { title: "Test", cards: [] },
                { title: "Test 2", cards: [] },
                { title: "Test 3", cards: [] },
            ];

            await populate(db, boardState);
            await navigateToBoard('h2');

            await checkBoard(boardState);
        })

        it("takes boardState with single list populated with one card", async () => {
            const boardState = [
                { title: "Test", cards: ["Test card"] },
            ];

            await populate(db, boardState);
            await navigateToBoard('h2');

            await checkBoard(boardState);
        })

        it("takes boardState with single list populated with multiple cards", async () => {
            const boardState = [
                { title: "Test", cards: ["Test A", "Test B", "Test C"] },
            ];

            await populate(db, boardState);
            await navigateToBoard('h2');

            await checkBoard(boardState);
        })

        it("takes boardState with multiples list. With only one list containing multiple cards", async () => {
            const boardState = [
                { title: "Test", cards: ["Test A", "Test B", "Test C"] },
                { title: "Test", cards: [] },
                { title: "Test", cards: [] },
            ];

            await populate(db, boardState);
            await navigateToBoard('h2');

            await checkBoard(boardState);
        })

        it("takes boardState with multiple lists populated with multiple cards", async () => {
            const boardState = [
                { title: "Test", cards: ["Test A", "Test B", "Test C"] },
                { title: "Test 2", cards: ["Test A", "Test B", "Test C"] },
                { title: "Test 3", cards: ["Test A", "Test B", "Test C"] },
            ];

            await populate(db, boardState);
            await navigateToBoard('h2');

            await checkBoard(boardState);
        })
    })

    const populate = async (db, boardState) => {
        try {
            const cardsCollection = db.collection('cards');
            const listsCollection = db.collection('lists');
            let lists = { insertedIds: {} };
            if (boardState.length > 0) {
                let listStateCopy = [];
                for (let i = 0; i < boardState.length; i += 1) {
                    let cards = { insertedIds: {} };
                    if (boardState[i].cards.length > 0) {
                        const cardsJson = boardState[i].cards.map(card => {
                            return { title: card, description: null };
                        });
                        cards = await cardsCollection.insertMany(cardsJson);
                    }

                    listStateCopy.push({
                        ...boardState[i],
                        cards: Object.keys(cards.insertedIds).map(key => cards.insertedIds[key])
                    });
                }

                lists = await listsCollection.insertMany(listStateCopy);
            }

            const state = {
                title: "Dummy",
                lists: Object.keys(lists.insertedIds).map(key => lists.insertedIds[key]),
            };

            const boards = db.collection('boards');
            await boards.insertOne(state);

        } catch (err) {
            console.log(err);
        }

        const selector = boardState.length > 0 ? 'h2' : 'h1';
        await navigateToBoard(selector);
        await checkBoard(boardState);
    };

    const navigateToBoard = async (selector) => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector(selector);
    };

    const getCoordinates = async (
        elementHandle,
        widthModifier = (x) => { return x },
        heightModifier = (y) => { return y }
    ) => {
        const elementBox = await elementHandle.boundingBox();
        const elementBoxX = elementBox.x + widthModifier(elementBox.width);
        const elementBoxY = elementBox.y + heightModifier(elementBox.height);

        return { x: elementBoxX, y: elementBoxY };
    }

    const dragAndDrop = async (start, end) => {
        await page.mouse.move(start.x, start.y, { steps: 5 });
        await page.mouse.down();
        await page.mouse.move(end.x, end.y, { steps: 5 });
        await page.mouse.up();
    };

    const checkBoard = async (expectedLists) => {
        const actualLists = [];
        const lists = await page.$$('.list');

        for (let i = 0; i < lists.length; i++) {
            const title = (await lists[i].$$eval('h2', nodes => nodes.map(n => n.innerText)))[0];
            const cards = await lists[i].$$('.card');
            const newCards = [];
            for (let j = 0; j < cards.length; j++) {
                const cardText = await cards[j].evaluate((card) => card.textContent);
                newCards.push(cardText);
            }

            actualLists.push({ title, cards: newCards });
        }

        expect(expectedLists).toEqual(actualLists);

    };

});

