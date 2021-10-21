class ImageComponent {
  id;
  photographerId;
  title;
  image;
  tags;
  likes;
  date;
  description;
  price;

  constructor(domTarget, props) {
    this.DOM = document.createElement("article");
    domTarget.appendChild(this.DOM);
    for (const [key, value] of Object.entries(props)) {
      this[key] = value;
    }
    this.render();
  }

  render(){
      this.DOM.innerHTML = `
      
      <img src="./images/${this.image}" alt="${this.description}" title="${this.title}">
      <h2>${this.title}</h2>

      
      `;


  }
}
