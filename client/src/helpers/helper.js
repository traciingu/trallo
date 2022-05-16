import { DraggableInfo, DraggableLocation } from "../dataClasses";

export const reorderLists = (listOrdering, draggable) => {
    const orderingCpy = [...listOrdering];

    reorderElements(orderingCpy, orderingCpy, {
        sourceIndex: draggable.sourceIndex,
        destinationIndex: draggable.destinationIndex,
        id: draggable.id
    });

    return orderingCpy;
};

export const reorderElements = (sourceArr, destinationArr, draggable) => {
    if (sourceArr === destinationArr) {
        const sourceArrCpy = [...sourceArr];

        sourceArrCpy.splice(draggable.startLocation.index, 1);
        sourceArrCpy.splice(draggable.dropLocation.index, 0, draggable.id);

        return [sourceArrCpy, sourceArrCpy];

    } else {
        const sourceArrCpy = [...sourceArr];
        const destArrCpy = [...destinationArr];

        sourceArrCpy.splice(draggable.startLocation.index, 1);
        destArrCpy.splice(draggable.dropLocation.index, 0, draggable.id);

        return [sourceArrCpy, destArrCpy];
    }
};

const copyArrayAtObjectKey = (obj, key) => {
    return [...obj[key]];
}

// TODO Refactor variable names
// TODO Type check parameters with data class
export const reorderCards = (cardOrdering, draggable, moveCardInSameList) => {
    const { id } = draggable;
    const startLocation = { ...draggable.source };
    const dropLocation = { ...draggable.destination };
    const sourceListIsNotEmpty = cardOrdering.hasOwnProperty(startLocation.droppableId);
    const destListIsNotEmpty = cardOrdering.hasOwnProperty(dropLocation.droppableId);
    const listIsNotSame = dropLocation.droppableId.localeCompare(startLocation.droppableId) !== 0;

    const startDragLocation = new DraggableLocation(startLocation.droppableId, startLocation.index);
    const dropDragLocation = new DraggableLocation(dropLocation.droppableId, dropLocation.index);
    const dragInfo = new DraggableInfo(startDragLocation, dropDragLocation, id);

    if (listIsNotSame) {
        let destCpy = [];
        let sourceCpy = [];

        if (sourceListIsNotEmpty) {
            sourceCpy = copyArrayAtObjectKey(cardOrdering, startLocation.droppableId);
            console.log("Copying source list");
        }

        if (destListIsNotEmpty) {
            destCpy = copyArrayAtObjectKey(cardOrdering, dropLocation.droppableId);
            console.log("Copying destination list");
        }

        const result = reorderElements(sourceCpy, destCpy, { startLocation, dropLocation, id });

        return result;
    } else {
       return moveCardInSameList(cardOrdering, dragInfo);
    }
};

export function moveCardInSameList(cardOrdering, draggableInfo) {

    if (!(draggableInfo instanceof DraggableInfo)) { throw `${draggableInfo} is not instance of DraggableInfo` }

    const { startLocation, dropLocation, id } = draggableInfo;

    if (!cardOrdering[dropLocation.droppableId].includes(id)) {
        throw 'Id could not be found in array of ids';
    }


    const listIsNotEmpty = cardOrdering[dropLocation.droppableId].length > 0;

    let destCpy = [];

    if (listIsNotEmpty) {
        destCpy = copyArrayAtObjectKey(cardOrdering, dropLocation.droppableId);
    }

    const result = reorderElements(destCpy, destCpy, { startLocation, dropLocation, id });

    return result;
};

