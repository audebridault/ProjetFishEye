class ImageComponent {
  constructor(domTarget, props, callback) {
    const DOM = document.createElement("article");
    domTarget.appendChild(DOM);
    DOM.innerHTML = `
      <img src="./images/${props.image}" alt="${props.description}" title="${props.title}">
      <h2>${props.title}</h2>
      `;
    new Like(DOM, props.likes, callback);
  }
}
