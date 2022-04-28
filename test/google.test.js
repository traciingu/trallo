describe('Google', () => {
    it('user can view board and move cards from list to list"', async () => {
        // User opens board
        await page.goto('http://localhost:3000');
        // Page title is Trallo
        await expect(page.title()).resolves.toMatch('Trallo');
        // Has three lists with names 'Todo', 'In progress', 'Done'
        await page.waitForSelector("h2");

        const listTitles = await page.$$eval('h2', nodes => nodes.map(n => n.innerText));
        expect(listTitles).toEqual([ 'Todo', 'Done', 'In progress' ]);
        
        // Inside 'Todo' it contains a card named 'Hello'
        //// Find the list with the list called "ToDo"
        const lists = await page.$$('.list');
        // Selects parent node of list
        const [parentListElement] = await page.$x('//div[text()="Hello"]/ancestor::div[@class="list"]')
        // TODO: get the h2 text from parentListElement and assert that it is "ToDo"
        // const titleHTML = await parentListElement.getProperty('innerHTML');
        // const innerHTMLTitle = await titleHTML.jsonValue();
        // console.log(innerHTMLTitle)

        const listHeader = await parentListElement.$eval('h2', node => node.innerText);
        // const listHeaderText = await listHeader.innerText();
        console.log(listHeader);

        expect(listHeader).toEqual('Todo');

        // const todoList = lists.find(list => list.$eval('h2', node => node.innerText) === 'Todo')
        // console.log(todoList)

    });
});


