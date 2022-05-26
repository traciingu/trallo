const { installMouseHelper } = require('./helpers/install-mouse-helper');

const { MongoClient } = require('mongodb');


// TODO Write FT for reordering lists
describe('Home page', () => {
    let connection;
    let db;

    // TODO setup installMouseHelper in beforeEach()

    beforeAll(async () => {
        try {
            connection = await MongoClient.connect("mongodb+srv://tracy:1234@cluster0.7rbuc.mongodb.net/trallo?retryWrites=true&w=majority");
            db = await connection.db("trallo");

            const cards = db.collection('cards');
            await cards.deleteMany({});

            const lists = db.collection('lists');
            await lists.deleteMany({});

            const boards = db.collection('boards');
            await boards.deleteMany({});

        } catch(err){
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

        } finally {
            
        }
    });

    describe("Starting Db with one card", () => {
        beforeEach(async () => {
            try {
                const cards = db.collection('cards');

                const hello = {
                    title: "Hello",
                    description: "Goodbye"
                };

                const card = await cards.insertOne(hello);

                const todo = {
                    title: "Todo",
                    cards: [card.insertedId]
                }

                const inProgress = {
                    title: "In progress",
                    cards: []
                }

                const done = {
                    title: "Done",
                    cards: []
                }

                const lists = db.collection('lists');
                const list = await lists.insertMany([todo, inProgress, done]);

                const dummy = {
                    title: "Dummy",
                    lists: Object.keys(list.insertedIds).map(key => list.insertedIds[key])
                }

                const boards = db.collection('boards');
                await boards.insertOne(dummy);
            } catch (err) {
                console.log(err);
            }
        })

        it('user can view board and move cards from list to list', async () => {

            await installMouseHelper(page);

            // User opens board
            await page.goto('http://localhost:3000');
            // Page title is Trallo
            await expect(page.title()).resolves.toMatch('Trallo');
            // Has three lists with names 'Todo', 'In progress', 'Done'
            await page.waitForSelector("h2");

            let expectedLists = [
                { title: "Todo", cards: ["Hello"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            // Click and drag 'Hello' card from 'Todo' to 'In Progress'
            // Refresh the browser
            // 'Hello' card now inside the 'In progress' list
            const helloCard = (await page.$x('//div[text()="Hello"]'))[0];
            const inProgressList = (await page.$x('//h2[text()="In progress"]//following-sibling::div'))[0];

            const helloBox = await helloCard.boundingBox();
            const inProgressBox = await inProgressList.boundingBox();


            const helloX = helloBox.x + helloBox.width / 2;
            const helloY = helloBox.y + helloBox.height / 2;
            const inProgressX = inProgressBox.x + inProgressBox.width;
            const inProgressY = inProgressBox.y + inProgressBox.height;

            await dragAndDrop({ x: helloX, y: helloY }, { x: inProgressX, y: inProgressY });

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

            await installMouseHelper(page);

            await page.goto('http://localhost:3000');
            await page.waitForSelector("h2");

            let expectedLists = [
                { title: "Todo", cards: ["Hello"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            const todoList = (await page.$x('//h2[text()="Todo"]'))[0];
            const inProgressList = (await page.$x('//h2[text()="In progress"]'))[0];

            const todoBox = await todoList.boundingBox();
            const inProgressBox = await inProgressList.boundingBox();

            const todoX = todoBox.x + (todoBox.width / 2);
            const todoY = todoBox.y + (todoBox.height / 2);

            const dropAreaX = inProgressBox.x + (inProgressBox.width/1.25);

            await dragAndDrop({ x: todoX, y: todoY }, { x: dropAreaX, y: todoY });

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

    describe("Starting Db with two cards", () => {
        beforeEach(async () => {
            try {
                const cards = db.collection('cards');

                const hello = {
                    title: "Hello",
                    description: "Goodbye"
                };

                const goodbye = {
                    title: "Goodbye",
                    description: "Hello"
                };

                const card = await cards.insertMany([hello, goodbye]);

                const todo = {
                    title: "Todo",
                    cards: Object.keys(card.insertedIds).map(key => card.insertedIds[key])
                }

                const inProgress = {
                    title: "In progress",
                    cards: []
                }

                const done = {
                    title: "Done",
                    cards: []
                }

                const lists = db.collection('lists');
                const list = await lists.insertMany([todo, inProgress, done]);

                const dummy = {
                    title: "Dummy",
                    lists: Object.keys(list.insertedIds).map(key => list.insertedIds[key])
                }

                const boards = db.collection('boards');
                await boards.insertOne(dummy);
            } catch (err) {
                console.log(err);
            }
        })

        it('can reorder cards within the same list', async () => {

            await installMouseHelper(page);

            await page.goto('http://localhost:3000');

            await page.waitForSelector("h2");

            const helloCard = (await page.$x('//div[text()="Hello"]'))[0];
            const helloBox = await helloCard.boundingBox();
            const helloX = helloBox.x + helloBox.width / 2;
            const helloY = helloBox.y + helloBox.height / 2;

            const goodbyeCard = (await page.$x('//div[text()="Goodbye"]'))[0];
            const goodbyeBox = await goodbyeCard.boundingBox();
            const goodbyeX = goodbyeBox.x + goodbyeBox.width / 2;
            const goodbyeY = goodbyeBox.y + goodbyeBox.height / 2;

            await dragAndDrop({ x: helloX, y: helloY }, { x: goodbyeX, y: goodbyeY });

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
            await installMouseHelper(page);

            await page.goto('http://localhost:3000');
            await page.waitForSelector("h2");

            let expectedLists = [
                { title: "Todo", cards: ["Hello", "Goodbye"] },
                { title: "In progress", cards: [] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            const helloCard = (await page.$x('//div[text()="Hello"]'))[0];
            let inProgressList = (await page.$x('//h2[text()="In progress"]//following-sibling::div'))[0];

            const helloBox = await helloCard.boundingBox();
            let inProgressBox = await inProgressList.boundingBox();

            const helloX = helloBox.x + helloBox.width / 2;
            const helloY = helloBox.y + helloBox.height / 2;
            const inProgressX = inProgressBox.x + inProgressBox.width;
            const inProgressY = inProgressBox.y + inProgressBox.height;

            await dragAndDrop({ x: helloX, y: helloY }, { x: inProgressX, y: inProgressY });

            await page.waitForTimeout(1000);

            expectedLists = [
                { title: "Todo", cards: ["Goodbye"] },
                { title: "In progress", cards: ["Hello"] },
                { title: "Done", cards: [] }
            ];

            await checkBoard(expectedLists);

            const todoList = (await page.$x('//h2[text()="Todo"]'))[0];
            inProgressList = (await page.$x('//h2[text()="In progress"]'))[0];

            const todoBox = await todoList.boundingBox();
            inProgressBox = await inProgressList.boundingBox();

            const todoX = todoBox.x + (todoBox.width / 2);
            const todoY = todoBox.y + (todoBox.height / 2);

            const dropAreaX = inProgressBox.x + (inProgressBox.width/1.25);

            await dragAndDrop({ x: todoX, y: todoY }, { x: dropAreaX, y: todoY });

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
                const dummy = {
                    title: "Dummy",
                    lists: []
                }

                const boards = db.collection('boards');
                await boards.insertOne(dummy);

            } catch (err) {
                console.log(err);
            }
        })

        it("can open and close create list form", async () => {
            await installMouseHelper(page);
            await page.goto('http://localhost:3000');
            await page.waitForSelector("h1");

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
            await installMouseHelper(page);
            await page.goto('http://localhost:3000');
            await page.waitForSelector("h1");

            const board = await page.$('.board');
            let listCreateButton = await board.$('[data-add-button="list"]');
            
            await page.click('[data-add-button="list"]');
            const createInputField = await board.$('[data-create-item-input="list"]');
            await createInputField.type('Test List');
            
            const createButton = await board.$('[data-create-item-confirm="list"]');
            const createButtonText = await createButton.evaluate(element => element.value);
            expect(createButtonText).toEqual('Add List');
            
            await page.click('[data-create-item-confirm="list"');
            await page.waitForTimeout(700);

            const expectedList = [
                {title: "Test List", cards: []},
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
                const todo = {
                    title: "Todo",
                    cards: []
                }

                const lists = db.collection('lists');
                const list = await lists.insertMany([todo]);

                const dummy = {
                    title: "Dummy",
                    lists: Object.keys(list.insertedIds).map(key => list.insertedIds[key])
                }

                const boards = db.collection('boards');
                await boards.insertOne(dummy);
            } catch (err) {
                console.log(err);
            }
        })

        it("can open and close the create card form", async () => {
            // TODO Helper function
            await installMouseHelper(page);
            await page.goto('http://localhost:3000');
            await page.waitForSelector('[data-item-type="list"]');

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



        })
    })

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

