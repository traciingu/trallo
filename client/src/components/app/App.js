import './App.css';
import List from '../features/list/List';
import '@atlaskit/css-reset';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { loadBoard, updateBoard } from '../../store/index';
import { connect } from 'react-redux';
import { dummyItems } from './data';


function App(props) {
  const [tasks, setTasks] = useState(dummyItems.tasks);
  const [columns, setColumns] = useState(dummyItems.columns);
  const [columnOrder, setColumnOrder] = useState(dummyItems.columnOrder);

  const { loadBoard, updateBoard, title, listOrdering } = props;

  useEffect(() => {
    loadBoard("625a2e6ea978638034ee3850");
  }, [loadBoard]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    console.log(result)
    console.log(listOrdering)

    // Do nothing if component is dropped outside of DragDropContext
    if (!destination) {
      return;
    }

    // If component is dropped in the same starting position, do nothing
    if (destination.droppableId === source.droppableId &&
      destination.index === source.index) {
      return;
    }

    // Reordering logic for lists
    if (type.localeCompare("lists") === 0) {
      const orderingCpy = [...listOrdering];
      orderingCpy.splice(source.index, 1);
      orderingCpy.splice(destination.index, 0, draggableId);

      updateBoard({id: "625a2e6ea978638034ee3850", lists: orderingCpy});


      // const newListOrder = [...columnOrder];
      // newListOrder.splice(source.index, 1);
      // newListOrder.splice(destination.index, 0, draggableId);

      // setColumnOrder(newListOrder);


    }

    // Reordering logic for cards
    if (type.localeCompare("cards") === 0) {
      // const sourceTasks = columns[source.droppableId].taskIds;

      // if (source.droppableId.localeCompare(destination.droppableId) === 0) {
      //   sourceTasks.splice(source.index, 1);
      //   sourceTasks.splice(destination.index, 0, draggableId);

      //   const newColumn = {
      //     ...columns[destination.droppableId],
      //     taskIds: sourceTasks
      //   };

      //   setColumns({
      //     ...columns,
      //     [source.droppableId]: newColumn
      //   });
      } else {
        // const destTasks = columns[destination.droppableId].taskIds;
        // sourceTasks.splice(source.index, 1);
        // destTasks.splice(destination.index, 0, draggableId);

        // const sourceColumn = {
        //   ...columns[source.droppableId],
        //   taskIds: sourceTasks
        // };
        // const destColumn = {
        //   ...columns[destination.droppableId],
        //   taskIds: destTasks
        // };

        // setColumns({
        //   ...columns,
        //   [source.droppableId]: sourceColumn,
        //   [destination.droppableId]: destColumn
        // });
      // }

    }
  }

  const styles = (comp, droppableStyle) => {
    switch (comp) {
      case "list":
        return {
          padding: "50px"
        };

      case "listContainer":

        return {
          display: "flex",
          justifyContent: "space-around",
          ...droppableStyle
        };
    }
  }



  return (
    <div className="App">
      <h1>{title}</h1>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId='list-container' direction="horizontal" type="lists">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={styles("listContainer", provided.droppableProps.style)}
            >
              <List />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}


const mapStateToProps = state => {
  // console.log(Object.keys(state.lists).map((key) => state.lists[key].title))
  console.log(state.lists)
  return {
    title: state.board.title,
    listOrdering: state.lists.allIds
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadBoard: (id) => { dispatch(loadBoard(id)); },
    updateBoard: (info) => {dispatch(updateBoard(info))}
  }
};

// export default App;
export default connect(mapStateToProps, mapDispatchToProps)(App);
