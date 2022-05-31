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