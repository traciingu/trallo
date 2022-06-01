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

module.exports = getCoordinates;