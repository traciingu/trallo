const dragAndDrop = async (start, end) => {
    await page.mouse.move(start.x, start.y, { steps: 5 });
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 5 });
    await page.mouse.up();
};

module.exports = dragAndDrop;