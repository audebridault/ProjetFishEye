class PhotographerPage{
     /**
     * @param   {HTMLElement}  domTarget  [domTarget description]
     * @param   {photographer}  dataManager       [dataManager description]
     * @param   {Number}        idPhotographer
     */
  constructor(domTarget, dataManager, idPhotographer) {
        this.data = dataManager;
        this.DOM = domTarget;
        this.id = idPhotographer;
        this.render();
    }
    async render(){
        this.DOM.innerText = "photohrapher "+this.id
  }
}