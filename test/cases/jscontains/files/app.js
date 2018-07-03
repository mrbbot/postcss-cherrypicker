/* eslint-disable no-unused-vars,no-undef,max-len */
const thing = '<h2>Before</h2><div class="hello"><span class="nested">Hello how are you?</span></div><h1>Sibling</h1>';

const element = document.createElement('span');
element.id = 'random-id';
element.classList.add('random-class');
document.body.appendChild(element);
