const { reorderInSameList, reorderElements, reorderCards } = require("./helper")


// TODO Find better assertions for arrays
describe('reorderInSameList', () => {
    it('throws error when id does not exist in array of ids', () => {
        // Arrange
        const arrOfIds = { 1: [], 2: [], 3: [] };
        const source = { droppableId: 1, index: 1 };
        const destination = { droppableId: 1, index: 1 };
        const id = 1;

        // Act
        const shouldThrowErr = (() => reorderInSameList(arrOfIds, source, destination, id));

        // Assert
        expect(shouldThrowErr).toThrow(new Error('Id could not be found in array of ids'));
    })

    it('should throw error when source is empty', () => {
        // Arrange
        const arrOfIds = { 1: [1, 2], 2: [3, 4], 3: [5] };
        const source = {};
        const destination = { droppableId: 1, index: 1 };
        const id = 1;

        // Act
        const shouldThrowErr = (() => reorderInSameList(arrOfIds, source, destination, id));

        // Assert
        expect(shouldThrowErr).toThrow(new Error('Source should not be empty'));
    })

    it('moves a card in the same list', () => {
        // Arrange
        const arrOfIds = { 1: [1, 2], 2: [3, 4], 3: [5] };
        const source = { droppableId: 1, index: 0 };
        const destination = { droppableId: 1, index: 1 };
        const id = 1;

        // Act
        const result = reorderInSameList(arrOfIds, source, destination, id);
        console.log(result)

        // Assert
        expect(result[0]).toEqual([2, 1]);
    })
});

describe('reorderElements', () => {
    it('moves a card within same list', () => {
        // Arrange
        const sourceArr = [1, 2];

        const source = { droppableId: 1, index: 0 };
        const destination = { droppableId: 1, index: 1 };
        const id = 1;

        // Act
        const result = reorderElements(sourceArr, sourceArr, { source, destination, id });
        console.log(result);

        // Assert
        expect(result[0]).toEqual([2, 1]);
        expect(result[1]).toEqual([2, 1]);

    })

    it('moves a card from one list to another', () => {
        // Arrange
        const sourceArr = [1, 2];
        const destArr = [3, 4];

        const source = { droppableId: 1, index: 0 };
        const destination = { droppableId: 2, index: 0 };
        const id = 1;

        // Act
        const result = reorderElements(sourceArr, destArr, { source, destination, id });

        // Assert
        expect(result[0]).toEqual([2]);
        expect(result[1]).toEqual([1, 3, 4]);
    })
});

describe('reorderCards', () => {
    it('reorder cards between lists', () => {
         // Arrange
         const arrOfIds = { 1: [1, 2], 2: [3, 4], 3: [5] };

         const source = { droppableId: 1, index: 0 };
         const destination = { droppableId: 2, index: 0 };
         const id = 1;
 
         // Act
         const result = reorderCards(arrOfIds, { source, destination, id });
 
         // Assert
         expect(result[0]).toEqual([2]);
         expect(result[1]).toEqual([1, 3, 4]);
    })

    it('reorder cards in same list', () => {
        // Arrange
        const arrOfIds = { 1: [1, 2], 2: [3, 4], 3: [5] };

        const source = { droppableId: 1, index: 0 };
        const destination = { droppableId: 1, index: 1 };
        const id = 1;

        // Act
        const result = reorderCards(arrOfIds, { source, destination, id });

        // Assert
        expect(result[0]).toEqual([2, 1]);
        expect(result[1]).toEqual([2, 1]);
   })
})