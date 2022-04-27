describe('Google', () => {
    it('user can view board and move cards from list to list"', async () => {
        // User opens board
        await page.goto('http://localhost:3000');
        // Page title is Trallo
        await expect(page.title()).resolves.toMatch('Trallo');
        // Has three lists with names 'Todo', 'In progress', 'Done'
        // const listTitles = 
        await page.waitForSelector("h2")
        // const boardHandle = await page.$('.board');
        // console.log(boardHandle)

        const listTitles = await page.$$eval('h2', nodes => nodes.map(n => n.innerText));
        expect(listTitles).toEqual([ 'Todo', 'Done', 'In progress' ]);
        // listTitles.map(title => console.log(title))
        // const listTitles = listsHandle.eval
        // expect(
        //     await boardHandle.$$eval('.list', (nodes) => nodes.map((n) => n.innerText))
        // ).toEqual(['Todo', 'In progress', 'Done']);
    });
});


