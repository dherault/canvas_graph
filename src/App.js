import React, { Component } from 'react';
import './App.css';

class App extends Component {

  componentDidMount() {
    canvasGraph(document.getElementById('canvas'), window.innerWidth - 40, window.innerHeight - 40).start();
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <canvas id="canvas" />
      </div>
    );
  }
}

function canvasGraph(canvasElement, width, height) {
  console.log('initializing canvasGraph');

  const _ = canvasElement.getContext('2d');

  _.canvas.width = width;
  _.canvas.height = height;

  const elements = [];
  const state = {
    mousePos: { x: 0, y: 0 },
  };

  function createElement(fn) {
    elements.push(fn(_));
  }

  // Not reactive programming yet
  canvasElement.addEventListener('mousemove', e => {
    state.mousePos.x = e.offsetX;
    state.mousePos.y = e.offsetY;
  });

  canvasElement.addEventListener('click', e => {
    const { offsetX, offsetY } = e;

    const clickedElements = elements.filter(el => el.onClick && el.isClicked && el.isClicked(offsetX, offsetY))

    if (clickedElements.length) clickedElements[clickedElements.length - 1].onClick(e);
  });

  createElement(_ => ({
    id: 'background',
    draw() {
      _.fillStyle = '#04070D';
      _.fillRect(0, 0, width, height);
    },
  }))

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 200; i > 0; i--) {
    // const c = '#' + Math.floor(Math.random() * 16777215).toString(16);
    createElement(_ => {
      let clickedState = false;
      const w = width * Math.random();
      const h = height * Math.random();
      const r = 70 * Math.random();

      return {
        id: Math.random(),
        zIndex: 5000 * Math.random(),
        draw() {
          _.beginPath();
          _.arc(w, h, r, 0, 2 * Math.PI);

          if (clickedState) {
            _.fillStyle = '#fff';
            _.fill();
          }
          else {
            _.strokeStyle = '#fff';
            _.stroke();
          }
        },
        isClicked: (x, y) => Math.pow(Math.abs(w - x), 2) + Math.pow(Math.abs(h - y), 2) <= r * r,
        onClick: () => clickedState = !clickedState,
      };
    });
  }

  function draw(tick) {
    _.clearRect(0, 0, width, height);

    elements.forEach(el => el.draw(tick));

    _.fillStyle = '#f00';

    _.beginPath();
    _.arc(state.mousePos.x, state.mousePos.y, 3, 0, 2 * Math.PI);
    _.fill();
  }

  let intervalId;
  let t = 0;
  const redrawPeriod = 50;

  return {
    start: () => intervalId = setInterval(() => draw(t += redrawPeriod), redrawPeriod),
    stop: () => clearInterval(intervalId),
  };
}

export default App;
