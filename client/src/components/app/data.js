export const dummyItems = {
    tasks: {
      't1': { id: 't1', content: 'Hello' },
      't2': { id: 't2', content: 'Goodbye' },
      't3': { id: 't3', content: 'Oh, why?' },
      't4': { id: 't4', content: 'I don\'t know why' },
      't5': { id: 't5', content: 'I say' },
      't6': { id: 't6', content: 'You say' }
    },
    columns: {
      'col1': {
        id: 'col1',
        title: 'To-do',
        taskIds: ['t1', 't2', 't3', 't4', 't5']
      },
      'col2': {
        id: 'col2',
        title: 'In progress',
        taskIds: ['t6']
      },
      'col3': {
        id: 'col3',
        title: 'Done',
        taskIds: []
      }
    },
    columnOrder: ['col1', 'col2', 'col3']
  };