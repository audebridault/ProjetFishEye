class PhotographerMain {
  /**
     * [constructor description]
     *
     * @param   {HTMLElement}  domTarget  [domTarget description]
     * @param   {photographer}  data       [data description]
     */
  constructor(domTarget, data) {
    this.DOM = document.createElement("article");
    this.DOM.className = "photographerMain";
    domTarget.appendChild(this.DOM);
    for (const [key, value] of Object.entries(data)) {
      this[key] = value;
    }
    this.render();
  }

  render() {
    this.DOM.innerHTML = `
    <a href="#"  onclick="window.changePage('photographer',${this.id})">
        <img src="./images/Portrait_${this.portrait}" />
        <h2>${this.name}</h2>
    </a>

    <summary>
        <h3>${this.city},${this.country}</h3>
        <p>${this.tagline}</p>
        <aside>${this.price}e/jour</aside>
    </summary>
    `;
    new NavTags(this.DOM, this.tags);
  }
}
