class Like {


    /**
     * [constructor description]
     *
     * @param   {HTMLElement}  domTarget  [domTarget description]
     * @param   {Number}  props      le nombre de mike par defaut
     * @param   {Function}  callback   [callback description]
     *
     * @constructor
     */
  constructor(domTarget, props, callback) {      
    this.likes = props;
    this.callback = callback;
    this.liked = false;
    this.DOM = document.createElement("i");
    this.DOM.className = "likes";
    this.DOM.onclick= this.click.bind(this);
    domTarget.appendChild(this.DOM);
  }

  click(){
    this.liked = ! this.liked;
    this.DOM.classList.toggle("liked");
    this.callback(this.liked);
  }
}
