import Board from './Board';
import React from 'react';
import { act } from 'react-dom/test-utils';
import {render} from 'react-dom';
import store from '../../app/store';
import { Provider } from 'react-redux';
import di from '../../injection_container';

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
});