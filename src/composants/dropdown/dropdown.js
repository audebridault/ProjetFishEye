class Dropdown {
  /**
   * le filter selectionné
   * @type {String}
   */
  activeFilter;

  /**
   * la liste des filtres possibles
   * @type {Array.<String>}
   */
  listFilters = [];

  /**
   * indicateur pour savoir si on affiche la liste ou non
   * @type {Boolean}
   */
  showList = false;

  /**
   * @param {HTMLElement}     domTarget   l'endroit où injecter le composant
   * @param {Array.<String>}  props       la liste des filtres possibles
   * @param {Function}        callback
   */
  constructor(domTarget, props, callback) {
    this.DOM = document.createElement("ul");
    domTarget.appendChild(this.DOM);
    this.listFilters = props;
    this.activeFilter = props[0];
    this.callback = callback;
    this.render();
  }

  render() {
    this.DOM.innerText = "";
    if (this.showList) {
      this.DOM.className = "dropdown list";
      for (let i = 0, size = this.listFilters.length; i < size; i++) {
        this.addLi(this.listFilters[i]);
      }
      return;
    }
    this.DOM.className = "dropdown selected";
    this.addLi(this.activeFilter);
  }

  addLi(filter) {
    const li = document.createElement("li");
    li.innerText = filter;
    li.onclick = ()=>this.click(filter);
    this.DOM.appendChild(li);
  }

  click(selected){
      if (this.showList) {
        this.activeFilter = selected;
        this.callback(selected);
      }
      this.showList = !this.showList;
      this.render();
  }
}
