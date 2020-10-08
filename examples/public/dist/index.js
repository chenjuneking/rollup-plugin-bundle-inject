'use strict';

function sum(a, b) {
  return a + b;
}

const result = sum(1, 2);
document.body.appendChild(document.createTextNode(`1 + 2 = ${result}`));
