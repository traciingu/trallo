export const reorderLists = (listOrdering, draggable) => {
    const orderingCpy = [...listOrdering];
    // orderingCpy.splice(source.index, 1);
    // orderingCpy.splice(destination.index, 0, draggableId);
    reorderElements(orderingCpy, orderingCpy, {
        sourceIndex: draggable.sourceIndex,
        destinationIndex: draggable.destinationIndex,
        id: draggable.id
    });

    return orderingCpy;
};

const reorderElements = (sourceArr, destinationArr, draggable) => {
    sourceArr.splice(draggable.sourceIndex, 1);
    destinationArr.splice(draggable.destinationIndex, 0, draggable.id);

    return { sourceArr, destinationArr };
};

const copyCollection = (obj, key) => {
    return [...obj[key]];
}

export const reorderCards = (cardOrdering, draggable) => {
    const {source, destination, id } = draggable;
    const listIsNotEmpty = cardOrdering[destination.droppableId] && cardOrdering[source.droppableId];
    const listIsNotSame = destination.droppableId !== source.droppableId;

    if (listIsNotSame) {
        let destCpy = [];
        let sourceCpy = [];

        if (listIsNotEmpty) {
            destCpy = copyCollection(cardOrdering, destination.droppableId);
            sourceCpy = copyCollection(cardOrdering, source.droppableId);
        }

        reorderElements(sourceCpy, destCpy, { source, destination, id });

        return { destCpy, sourceCpy };
    } else {
        let destCpy = [];

        if (listIsNotEmpty) {
            destCpy = copyCollection(cardOrdering, destination.droppableId);
        }

        reorderElements(destCpy, destCpy, { source, destination, id });

        return destCpy;
    }
};

