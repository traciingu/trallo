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
    const sourceArrCpy = [...sourceArr];
    const destArrCpy = [...destinationArr];
   
    sourceArrCpy.splice(draggable.source.index, 1);
    destArrCpy.splice(draggable.destination.index, 0, draggable.id);

    return [sourceArrCpy, destArrCpy];
};

const copyCollection = (obj, key) => {
    return [...obj[key]];
}

export const reorderCards = (cardOrdering, draggable) => {
    const { source, destination, id } = draggable;
    const sourceListIsNotEmpty = cardOrdering[source.droppableId].length > 0;
    const destListIsNotEmpty = cardOrdering[destination.droppableId].length > 0;
    const listIsNotSame = destination.droppableId !== source.droppableId;

    if (listIsNotSame) {
        let destCpy = [];
        let sourceCpy = [];

        if (sourceListIsNotEmpty) {
            sourceCpy = copyCollection(cardOrdering, source.droppableId);
            console.log(sourceCpy)
        }

        if (destListIsNotEmpty) {
            destCpy = copyCollection(cardOrdering, destination.droppableId);
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

// TODO get rid of boolean parameter
export function reorderInSameList(cardOrdering, source, destination, id) {

    if (Object.keys(source).length === 0) { throw 'Source should not be empty' }

    if (!cardOrdering[destination.droppableId].includes(id)) {
        throw 'Id could not be found in array of ids';
    }

    const listIsNotEmpty = cardOrdering[destination.droppableId].length > 0;

    let destCpy = [];

    if (listIsNotEmpty) {
        destCpy = copyCollection(cardOrdering, destination.droppableId);
    }

    reorderElements(destCpy, destCpy, { source, destination, id });

    return destCpy;
};

