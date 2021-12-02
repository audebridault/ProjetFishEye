class Like {


    /**
     * [constructor description]
     *
     * @param   {HTMLElement}  domTarget  [domTarget description]
     * @param   {Number}       likes      le nombre de mike par defaut
     * @param   {Function}     callback   [callback description]
     *
     * @constructor
     */
  constructor(domTarget, likes, callback) { 
    console.log(domTarget)     
    this.likes = likes;
    this.callback = callback;
    this.liked = false;
    this.DOM = document.createElement("aside");
    this.DOM.className = "likes";
    this.DOM.onclick= this.click.bind(this);
    domTarget.appendChild(this.DOM);
    this.render();
  }
  render(){
    this.DOM.innerText = this.likes.toString();
  }

  click(){
    this.liked = ! this.liked;
    this.likes += this.liked? 1 : -1;
    this.DOM.classList.toggle("liked");
    this.callback(this.liked);
    this.render();
  }
}
