const { reorderInSameList, reorderElements } = require("./helper")

describe('reorderInSameList', () => {
    it('throws error when id does not exist in array of ids', () => {
        // Arrange
        const arrOfIds = { 1: [], 2: [], 3: [] };
        const source = {};
        const destination = { droppableId: 1, index: 1 };
        const id = 1;

        // Act
        const shouldThrowErr = (() => reorderInSameList(true, arrOfIds, source, destination, id));

        // Assert
        expect(shouldThrowErr).toThrow(new Error('Id could not be found in array of ids'));
    })

    it('reorders card in same list', () => {
        // Arrange
        const arrOfIds = { 1: [1, 2], 2: [3, 4], 3: [5] };
        const source = {};
        const destination = { droppableId: 1, index: 1 };
        const id = 1;

        // Act
        const result = reorderInSameList(true, arrOfIds, source, destination, id);

        // Assert
        expect(result).toEqual([2, 1]);
    })
});

describe('reorderElements', () => {
    it('moves a card from one list to another', () => {
        // Arrange
        const sourceArr = [1, 2];

        const source = {droppableId: 1, index: 0};
        const destination = { droppableId: 1, index: 1 };
        const id = 1;

        // Act
        const result = reorderElements(sourceArr, sourceArr, {source, destination, id});

        // Assert
        expect(result[0]).toEqual([2]);
        
    })
})