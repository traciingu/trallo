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
    const source = { ...draggable.source };
    const destination = { ...draggable.destination };
    const sourceListIsNotEmpty = cardOrdering.hasOwnProperty(source.droppableId);
    const destListIsNotEmpty = cardOrdering.hasOwnProperty(destination.droppableId);
    const listIsSame = destination.droppableId.localeCompare(source.droppableId) === 0;

    const startLocation = new DraggableLocation(source.droppableId, source.index);
    const dropLocation = new DraggableLocation(destination.droppableId, destination.index);
    const dragInfo = new DraggableInfo(startLocation, dropLocation, id);

    if (listIsSame) {
        return moveCardInSameList(cardOrdering, dragInfo);
    } else {
        let destCpy = [];
        let sourceCpy = [];

        if (sourceListIsNotEmpty) {
            sourceCpy = copyArrayAtObjectKey(cardOrdering, source.droppableId);
        }

        if (destListIsNotEmpty) {
            destCpy = copyArrayAtObjectKey(cardOrdering, destination.droppableId);
        }

        const result = reorderElements(sourceCpy, destCpy, dragInfo);

        return result;
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

