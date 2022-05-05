import Board from './Board';
import React from 'react';
// import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import store from '../../app/store';
import { Provider } from 'react-redux';
import { create, act } from 'react-test-renderer';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});


describe("Smoke test", () => {
  it("Board", () => {
    act(() => {
      render(<Provider store={store}><Board /> </Provider>, container);
    });
  });

  it("Board", () => {
    // act(() => {
    //     render(<Provider store={store}><Board /> </Provider>, container);
    //   });

    let root;
    
    act(() => {
      root = create(<Provider store={store}><Board title="HELLO" /> </Provider>);
    });

    console.log(root.toJSON())

    expect(root.toJSON()[0].props.className).toEqual("board");
    // const tr = create(<Provider store={store}><Board title="HELLO" /> </Provider>);
    // const testInstance = tr.root;
    
    // console.log(tr);
  });
});