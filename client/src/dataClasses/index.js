export class DraggableInfo {
    constructor(startLocation, dropLocation, id) {
        if (startLocation instanceof DraggableLocation &&
            dropLocation instanceof DraggableLocation &&
            typeof id === 'string') {
            this.startLocation = startLocation;
            this.dropLocation = dropLocation;
            this.id = id;
        } else {
            throw 'Failed to instantiate DraggableInfo';
        }
    }
};

export class DraggableLocation {
    constructor(droppableId, index) {
        if (typeof droppableId === 'string'
            && typeof index === 'number') {
            this.droppableId = droppableId;
            this.index = index;
        } else {
            throw 'Failed to instantiate DraggableLocation';
        }
    }
}

// const testfunc = () => {
//     const d1 = new DraggableLocation('123', 1);
//     const d2 = new DraggableLocation('456', 2);
//     const id = 12;

//     const dInfo = new DraggableInfo('foo', 12, '@#$%');
//     console.log(dInfo);

// }

// testfunc();