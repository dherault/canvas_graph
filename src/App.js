import React, { Component } from 'react';
// import { createStore } from 'redux';
import './App.css';

class App extends Component {

  componentDidMount() {
    canvasGraph(document.getElementById('canvas'), window.innerWidth - 40, window.innerHeight - 40);
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <canvas id="canvas" />
      </div>
    );
  }
}

// function entitiesReducer(state = {}, action) {
//   switch (action.type) {
//     case 'CREATE_ENTITY':
//
//       break;
//     default:
//       return state;
//   }
// }

function canvasGraph(canvasElement, width, height) {
  console.log('canvasGraph');

  const _ = canvasElement.getContext('2d');
  const state = {
    mousePos: { x: 0, y: 0 },
    elementCreators: [],
  };

  _.canvas.width = width;
  _.canvas.height = height;

  canvasElement.addEventListener('mousemove', e => {
    state.mousePos.x = e.offsetX;
    state.mousePos.y = e.offsetY;
  });

  state.elementCreators.push(_ => {
    _.fillStyle = '#04070D';
    _.fillRect(0, 0, width, height);
  });

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 200; i > 0; i--) {
    let w = width * Math.random();
    let h = height * Math.random();
    let ww = w;
    let hh = h;
    const r = 70 * Math.random();
    const t = 50 * Math.random();
    const k = Math.max(50, 200 * Math.random());
    const v = 5 * r;
    const o = Math.floor(1000 * Math.random());

    let temperature = 0;
    // const c = '#' + Math.floor(Math.random() * 16777215).toString(16);

    state.elementCreators.push((_, tick) => {
      w += (ww - w) / v;
      h += (hh - h) / v;

      if (!(tick % o)) {
        ww += (Math.random() > 0.5 ? -1 : 1) * getRandom(0, 100 * Math.random());
        hh += (Math.random() > 0.5 ? -1 : 1) * getRandom(0, 100 * Math.random());
      }

      _.strokeStyle = '#fff';
      _.beginPath();
      _.arc(w, h, r * Math.abs(Math.cos(tick / k + t)), 0, 2 * Math.PI);
      _.stroke();
    });
  }

  function draw(tick) {
    _.clearRect(0, 0, width, height);

    state.elementCreators.forEach(fn => fn(_, tick));

    _.fillStyle = '#f00';

    _.beginPath();
    _.arc(state.mousePos.x, state.mousePos.y, 3, 0, 2 * Math.PI);
    _.fill();
  }

  let i = 0;

  setInterval(() => draw(i++), 10);

  draw();
}

export default App;
