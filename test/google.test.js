const { installMouseHelper } = require('./helpers/install-mouse-helper');
const { dbSetup, dbTeardown } = require('./helpers/db-setup-teardown');
const mongoose = require('mongoose');

require('dotenv').config();

const { Board, List, Card } = require('../server/db/models');
const { populate, deleteAll } = require("../server/db/mongoSeed");

// TODO: DB Setup and teardown

// beforeAll(async () => {
//     await mongoose.connect(process.env.MONGO_URI_TEST);
//     mongoose.connection.on('connecting', () => {
//         console.log(mongoose.connection.readyState);
//     })
//     // console.log(process.env.MONGO_URI_TEST)
// });

// afterAll(async () => {
//     await mongoose.connection.close();
// });

describe('Google', () => {
    beforeAll(async () => {
       await populate();
    });

    afterAll(async () => {
        await deleteAll();
    });

    it('user can view board and move cards from list to list"', async () => {
        await installMouseHelper(page);

        // User opens board
        await page.goto('http://localhost:3000');
        // Page title is Trallo
        await expect(page.title()).resolves.toMatch('Trallo');
        // Has three lists with names 'Todo', 'In progress', 'Done'
        await page.waitForSelector("h2");

        const listTitles = await page.$$eval('h2', nodes => nodes.map(n => n.innerText));
        expect(listTitles).toEqual(['Todo', 'In progress', 'Done']);

        // Inside 'Todo' it contains a card named 'Hello'
        let [parentListElement] = await page.$x('//div[text()="Hello"]/ancestor::div[@class="list"]')
        let listHeader = await parentListElement.$eval('h2', node => node.innerText);

        expect(listHeader).toEqual('Todo');

        // Click and drag 'Hello' card from 'Todo' to 'In Progress'
        // Refresh the browser
        // 'Hello' card now inside the 'In progress' list
        const helloCard = (await page.$x('//div[text()="Hello"]'))[0];
        const innerHTML = await (await helloCard.getProperty('innerHTML')).jsonValue();
        // console.log(innerHTML)

        const inProgressList = (await page.$x('//h2[text()="In progress"]//following-sibling::div'))[0];
        // console.log(inProgressList)


        const helloBox = await helloCard.boundingBox();
        console.log(helloBox)

        const inProgressBox = await inProgressList.boundingBox();

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const helloX = helloBox.x + helloBox.width / 2;
        const helloY = helloBox.y + helloBox.height / 2;
        const inProgressX = inProgressBox.x + inProgressBox.width / 2;
        const inProgressY = inProgressBox.y + inProgressBox.height / 2;

        // await page.mouse.dragAndDrop({x: helloX, y: helloY}, {x: inProgressX, y: inProgressY});

        await page.mouse.move(helloBox.x + helloBox.width / 2,
            helloBox.y + helloBox.height / 2, { steps: 10 });
        await page.mouse.down();
        await page.mouse.move(
            inProgressBox.x + inProgressBox.width,
            inProgressBox.y + inProgressBox.height,
            { steps: 10 }
        );
        await page.mouse.up();

        await page.waitForTimeout(500);
        await page.reload();
        await page.waitForSelector("h2");

        [parentListElement] = await page.$x('//div[text()="Hello"]/ancestor::div[@class="list"]');
        listHeader = await parentListElement.$eval('h2', node => node.innerText);

        expect(listHeader).toEqual('In progress');


    });
});


