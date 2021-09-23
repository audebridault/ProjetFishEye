class PhotographerMainPage {
  /**
     * [constructor description]
     *
     * @param   {[type]}  domTarget  [domTarget description]
     * @param   {Object}  data       [data description]
     * @param   {String}  data.name      "Ellie-Rose Wilkens",
     * @param   {Number}  data.id      930,
     * @param   {String}  data.city      "Paris",
     * @param   {String}  data.country      "France",
     * @param   {Array}  data.tags      ["sports", "architecture"],
     * @param   {String}  data.tagline      "Capturer des compositions complexes",
     * @param   {Number}  data.price      250,
     * @param   {String}  data.portrait      "EllieRoseWilkens.jpg"
     *
     * @return  {[type]}             [return description]
     */
  constructor(domTarget, data) {
    this.DOM = document.createElement("article");
    domTarget.appendChild(this.DOM);
    for (const [key, value] of Object.entries(data)) {
      this[key] = value;
    }
    this.render();
  }

  render() {
    this.DOM.innerHTML = `
        <a href="index.html"><img alt="Fisheye Home Page" src="./images/logo.png" /></a>
    <h1>Nos photographes</h1>
    `;
    new NavTags(this.DOM, this.tags);
  }
}
