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
        const [parentListElement] = await page.$x('//div[text()="Hello"]/ancestor::div[@class="list"]')
        const listHeader = await parentListElement.$eval('h2', node => node.innerText);

        expect(listHeader).toEqual('Todo');

    });
});


