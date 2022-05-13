const { DraggableInfo, DraggableLocation } = require("../dataClasses");
const { moveCardInSameList, reorderElements, reorderCards } = require("./helper")


// TODO Find better assertions for arrays
describe('moveCardInSameList', () => {
    it('throws error when id does not exist in array of ids', () => {
        // Arrange
        const arrOfIds = { '1': [], '2': [], '3': [] };
        const source = new DraggableLocation( '1', 1 );
        const destination = new DraggableLocation( '1', 1 );
        const id = 1;

        const dInfo = new DraggableInfo(source, destination, id);

        // Act
        const shouldThrowErr = (() => moveCardInSameList(arrOfIds, dInfo));

        // Assert
        expect(shouldThrowErr).toThrow(new Error('Id could not be found in array of ids'));
    })

    it('moves a card in the same list', () => {
        // Arrange
        const arrOfIds = { '1': [1, 2], '2': [3, 4], '3': [5] };
        const source = new DraggableLocation( '1', 0 );
        const destination = new DraggableLocation( '1', 1 );
        const id = 1;

        const dInfo = new DraggableInfo(source, destination, id);

        // Act
        const result = moveCardInSameList(arrOfIds, dInfo);
        console.log(result)

        // Assert
        expect(result[0]).toEqual([2, 1]);
    })

    it("throws error if second argument isn't DraggableInfo", () => {
        // Arrange
        const arrOfIds = { 1: [], 2: [], 3: [] };
        const invalidArgument = {}

        // Act
        const shouldThrowErr = (() => moveCardInSameList(arrOfIds, invalidArgument));

        // Assert
        expect(shouldThrowErr).toThrow(new Error(`${invalidArgument} is not instance of DraggableInfo`));
    })
});

describe('reorderElements', () => {
    it('moves a card within same list', () => {
        // Arrange
        const sourceArr = [1, 2];

        const startLocation = { droppableId: 1, index: 0 };
        const dropLocation = { droppableId: 1, index: 1 };
        const id = 1;

        // Act
        const result = reorderElements(sourceArr, sourceArr, { startLocation, dropLocation, id });
        console.log(result);

        // Assert
        expect(result[0]).toEqual([2, 1]);
        expect(result[1]).toEqual([2, 1]);

    })

    it('moves a card from one list to another', () => {
        // Arrange
        const sourceArr = [1, 2];
        const destArr = [3, 4];

        const startLocation = { droppableId: 1, index: 0 };
        const dropLocation = { droppableId: 2, index: 0 };
        const id = 1;

        // Act
        const result = reorderElements(sourceArr, destArr, { startLocation, dropLocation, id });

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