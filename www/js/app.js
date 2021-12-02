/**
 * @typedef    {Object}  photographer
 * @property   {String}  name      "Ellie-Rose Wilkens",
 * @property   {Number}  id      930,
 * @property   {String}  city      "Paris",
 * @property   {String}  country      "France",
 * @property   {Array}    tags      ["sports", "architecture"],
 * @property   {String}  tagline      "Capturer des compositions complexes",
 * @property   {Number}  price      250,
 * @property   {String}  portrait      "EllieRoseWilkens.jpg"
 */

/**
 * @typedef {Object} singleMedia
 * @property   {String}  id        exemple:23394384,
 * @property   {Number}  photographerId        exemple:925,
 * @property   {String}  title        exemple:"Musical Festival Keyboard",
 * @property   {String}  image        exemple:"Event_KeyboardCheck.jpg",
 * @property   {Array}  tags        exemple:["events"],
 * @property   {Number}  likes        exemple:52,
 * @property   {String}  date        exemple:"2019-07-18",
 * @property   {Number}  price        exemple:70
 */

/**
 * @typedef  {Object} allData
 * @property {Array.<photographer>}  photographers
 * @property {Array.<singleMedia>}  media
 */

class DataManager {
  /**
   * toutes nos données
   * @type {allData | null}
   */
  data = null;

  constructor(src) {
    this.src = src;
  }

  /**
   * recupère toutes les données
   *
   * @return  {Promise.<void>}  enregistrer les données dans this.data
   */
  async getAllData() {
    const response = await fetch(this.src);
    this.data = await response.json();
  }

  /**
   * permet d'avoir la liste de tous les tags possible en fonction des tags de chaque photographe
   *
   * @return  {Promise.<Array>}  retourne la liste des tags
   */
  async photographersTags() {
    if (this.data === null) await this.getAllData();
    let tags = [];
    this.data.photographers.forEach((photographer) => {
      tags = tags.concat(photographer.tags);
    });
    return [...new Set(tags)];
  }

  /**
   * permet d'avoir la liste des photographes
   * @param  {Array.<String>}  filters  la liste des tags actifs
   *
   * @return  {Array.<photographer>}  la liste des photographes
   */
  photographersList(filters) {
    if (filters.length === 0 ) return this.data.photographers;
    const list=[];
    this.data.photographers.forEach(photographe => {
      filters.forEach(filtre=>{
        if(photographe.tags.indexOf(filtre) >= 0) list.push(photographe);
      })
    });
    return [...new Set(list)];
  }

  async photographerInformation(id){
    if (this.data === null) await this.getAllData();
    for( const photographer of this.data.photographers){
      if (photographer.id === id) return photographer;
    }
  }

  photographerMedia(id, order){
    const list = [];
    this.data.media.forEach(media => {
      if (media.photographerId === id) list.push(media);
    });
    console.log(list)
    list.sort((a, b) => {
      if (order === "Popularité") return b.likes - a.likes;
      if (order === "Date") return new Date(a.date) - new Date(b.date);
      if (order === "Titre") return this.sortText(a, b);
    });
    return list;
  }

  sortText(a, b){
    const fa = a.toLowerCase(),
      fb = b.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  }
}

class Router{

    /**
     * @type {DataManager}
     */
    dataManager;

    /**
     * @type {HTMLElement}
     */
    DOM;

    /**
     * [constructor description]
     *
     * @param   {HTMLElement}  domTarget  le noeud DOM dans lequel on veut injecté la page
     */
    constructor(domTarget){
        this.DOM = domTarget;
        this.dataManager = new DataManager("./data.json")
        window.changePage = this.changePage.bind(this);
        const [page, args] = window.location.search.slice(1).split("/");
        this.showPage(page === ""? "index" : page, args);
    }


    showPage(newPage, args){
        switch (newPage){
            case "index" : 
                this.DOM.className = "indexPage";
                this.page = new IndexPage(this.DOM, this.dataManager)
                break;
            case "photographer" :
                this.DOM.className = "photographerPage";
                this.page = new PhotographerPage(this.DOM, this.dataManager, args);
                break;
            default : 
                this.DOM.className = "404";
                this.DOM.innerText = "404";
                break;
        }

    }

    changePage(newPage, args){
        //manipuler l'historique
        this.showPage(newPage, args)
    }
} 
class IndexPage{
    /**
     * [constructor description]
     *
     * @param   {HTMLElement}  domTarget    [domTarget description]
     * @param   {DataManager}  dataManager  [dataManager description]
     */
    constructor(domTarget, dataManager){
        this.data = dataManager;
        this.DOM = domTarget;
        this.activeFilters = [];
        this.allFilters = [];
        this.render();
    }
    async render(){
        this.DOM.innerText = "";
        if( this.allFilters.length === 0) this.allFilters = await this.data.photographersTags();
        new Header(this.DOM, this.allFilters, this.click.bind(this));
        const main = document.createElement("main");
        this.DOM.appendChild(main);
        const photographers = this.data.photographersList(this.activeFilters);
        photographers.forEach(photographer => {
            new PhotographerMain(main, photographer);
        });
    }

    click(tag){
        const index = this.activeFilters.indexOf(tag);
        if (index === -1) this.activeFilters.push(tag);
        else this.activeFilters.splice(index, 1);
        this.render();
    }
}
    
class PhotographerPage {
  information;
  filtersList = ["Popularité", "Date", "Titre"];

  /**
   * @param   {HTMLElement}  domTarget  [domTarget description]
   * @param   {DataManager}  dataManager      [dataManager description]
   * @param   {Number}        idPhotographer
   */
  constructor(domTarget, dataManager, idPhotographer) {
    this.data = dataManager;
    this.DOM = domTarget;
    this.id = idPhotographer;
    this.DOM.className = "photographerPage";
    this.totalLikes = 0;
    this.totalLikesDOM = document.createElement("aside");

    // this.DOM.innerHTML = `
    //   <a href="photographerPage.html">
    //  '
    this.render();
  }
  async render() {
    this.DOM.innerText = "chargement...";
    if (!this.information)
      this.information = await this.data.photographerInformation(this.id);
    this.DOM.innerHTML = `
      <header>
        <a href="index.html"><img alt="Fisheye Home Page" src="./images/logo.png" /></a>
      </header>
    `;
    const main = document.createElement("main");
    this.DOM.appendChild(main);
    new PhotographerMain(main, this.information);
    main.innerHTML += `
      <button class="contact">Contactez-moi</button>
      `;
    new Dropdown(main, this.filtersList, this.updateMedia.bind(this));
    this.mediaContainer = document.createElement("div");
    this.mediaContainer.className = "imgPhotographers";
    main.appendChild(this.mediaContainer);
    this.DOM.appendChild(this.totalLikesDOM);
    this.updateMedia(this.filtersList[0]);
  }

  updateMedia(newFilter) {
    this.mediaContainer.innerText = "";
    const media = this.data.photographerMedia(this.id, newFilter);
    media.forEach((element) => {
      if (element.video)
        new VideoComponent(
          this.mediaContainer,
          element,
          this.changeTotalLikes.bind(this)
        );
      if (element.image)
        new ImageComponent(
          this.mediaContainer,
          element,
          this.changeTotalLikes.bind(this)
        );
      this.totalLikes += element.likes;

      this.totalLikesRender();
    });
  }

  /**
   * [changeTotalLikes description]
   *
   * @param   {Boolean}  liked  [liked description]
   *
   * @return  {void}        met à jour le nombre de like
   */
  changeTotalLikes(liked) {
    this.totalLikes += liked ? 1 : -1;
    this.totalLikesRender();
  }

  totalLikesRender() {
    this.totalLikesDOM.innerHTML = `
    ${this.totalLikes} <i class="fas fa-heart"></i> 
    ${this.information.price}€/jour
    `;
  }
}

/*
 
    <main>
    <%- include( "../composants/headerPhotographerPage/headerPhotographerPage.html" , {
              "name": "Mimi Keel",
      "id": 243,
      "city": "London",
      "country": "UK",
      "tags": ["portrait", "events", "travel", "animals"],
      "tagline": "Voir le beau dans le quotidien",
      "price": 400,
      "portrait": "MimiKeel.jpg"
    } ); %>

    



<div class="imgPhotographers">
<img src="../images/Mimi/Animals_Rainbow.jpg" alt="Arc-en-ciel" />
<img src="../images/Mimi/Travel_Lonesome.jpg" alt="Solitude" />
</div>
    </main>
 */
class Header {
  constructor(domTarget, tags, tagAction) {
    this.DOM = document.createElement("header");
    domTarget.appendChild(this.DOM);
    this.DOM.innerHTML = `
        <a href="index.html"><img alt="Fisheye Home Page" src="./images/logo.png" /></a>
    <h1>Nos photographes</h1>
    `;
    new NavTags(this.DOM, tags, tagAction);
  }
}

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

class ImageComponent {
  constructor(domTarget, props, callback) {
    const DOM = document.createElement("article");
    DOM.innerHTML = `
      <img src="./images/${props.image}" alt="${props.description}" title="${props.title}">
      <h2>${props.title}</h2>
      `;
    new Like(DOM, props.likes, callback);
    domTarget.appendChild(DOM);
  }
}

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

class NavTags{
    constructor(domTarget, tags, tagAction = null){
        this.DOM = document.createElement("nav");
        domTarget.appendChild(this.DOM);
        tags.forEach(tag => {
            new Tag(this.DOM, tag, tagAction);
        });
    }
}
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

class Tag{
    constructor(domTarget, tag, tagAction=null){
        this.name = tag;
        this.DOM = document.createElement("tag");
        domTarget.appendChild(this.DOM);
        this.DOM.className = "tag";
        if (tagAction !== null) this.DOM.onclick = ()=>{
            tagAction(this.name);
        } 
        this.DOM.innerText="#"+tag;
    }
}

/* <a aria-label="Photographers categories" class="tag" href="index.html">#<%- text %></a> */
class VideoComponent {
    
  id;
  photographerId;
  title;
  video;
  tags;
  likes;
  date;
  description;
  price;

  constructor(domTarget, props) {
    this.DOM = document.createElement("video");
    domTarget.appendChild(this.DOM);
    for (const [key, value] of Object.entries(props)) {
      this[key] = value;
    }
    this.DOM.src = this.video;
  }
}

/*
      "id": 8328953,
      "photographerId": 82,
      "title": "Wooden Horse Sculpture",
      "video": "Art_Wooden_Horse_Sculpture.mp4",
      "tags": ["art"],
      "likes": 24,
      "date": "2011-12-08",
      "price": 100
 */
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFNYW5hZ2VyLmpzIiwicm91dGVyLmpzIiwicGFnZXMvaW5kZXhQYWdlLmpzIiwicGFnZXMvcGhvdG9ncmFwaGVyUGFnZS5qcyIsImNvbXBvc2FudHMvaGVhZGVyL2hlYWRlci5qcyIsImNvbXBvc2FudHMvZHJvcGRvd24vZHJvcGRvd24uanMiLCJjb21wb3NhbnRzL2ltYWdlQ29tcG9uZW50L2ltYWdlQ29tcG9uZW50LmpzIiwiY29tcG9zYW50cy9saWtlL2xpa2UuanMiLCJjb21wb3NhbnRzL25hdlRhZ3MvbmF2VGFncy5qcyIsImNvbXBvc2FudHMvcGhvdG9ncmFwaGVyTWFpbi9waG90b2dyYXBoZXJNYWluLmpzIiwiY29tcG9zYW50cy90YWcvdGFnLmpzIiwiY29tcG9zYW50cy92aWRlb0NvbXBvbmVudC92aWRlb0NvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEB0eXBlZGVmICAgIHtPYmplY3R9ICBwaG90b2dyYXBoZXJcclxuICogQHByb3BlcnR5ICAge1N0cmluZ30gIG5hbWUgICAgICBcIkVsbGllLVJvc2UgV2lsa2Vuc1wiLFxyXG4gKiBAcHJvcGVydHkgICB7TnVtYmVyfSAgaWQgICAgICA5MzAsXHJcbiAqIEBwcm9wZXJ0eSAgIHtTdHJpbmd9ICBjaXR5ICAgICAgXCJQYXJpc1wiLFxyXG4gKiBAcHJvcGVydHkgICB7U3RyaW5nfSAgY291bnRyeSAgICAgIFwiRnJhbmNlXCIsXHJcbiAqIEBwcm9wZXJ0eSAgIHtBcnJheX0gICAgdGFncyAgICAgIFtcInNwb3J0c1wiLCBcImFyY2hpdGVjdHVyZVwiXSxcclxuICogQHByb3BlcnR5ICAge1N0cmluZ30gIHRhZ2xpbmUgICAgICBcIkNhcHR1cmVyIGRlcyBjb21wb3NpdGlvbnMgY29tcGxleGVzXCIsXHJcbiAqIEBwcm9wZXJ0eSAgIHtOdW1iZXJ9ICBwcmljZSAgICAgIDI1MCxcclxuICogQHByb3BlcnR5ICAge1N0cmluZ30gIHBvcnRyYWl0ICAgICAgXCJFbGxpZVJvc2VXaWxrZW5zLmpwZ1wiXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IHNpbmdsZU1lZGlhXHJcbiAqIEBwcm9wZXJ0eSAgIHtTdHJpbmd9ICBpZCAgICAgICAgZXhlbXBsZToyMzM5NDM4NCxcclxuICogQHByb3BlcnR5ICAge051bWJlcn0gIHBob3RvZ3JhcGhlcklkICAgICAgICBleGVtcGxlOjkyNSxcclxuICogQHByb3BlcnR5ICAge1N0cmluZ30gIHRpdGxlICAgICAgICBleGVtcGxlOlwiTXVzaWNhbCBGZXN0aXZhbCBLZXlib2FyZFwiLFxyXG4gKiBAcHJvcGVydHkgICB7U3RyaW5nfSAgaW1hZ2UgICAgICAgIGV4ZW1wbGU6XCJFdmVudF9LZXlib2FyZENoZWNrLmpwZ1wiLFxyXG4gKiBAcHJvcGVydHkgICB7QXJyYXl9ICB0YWdzICAgICAgICBleGVtcGxlOltcImV2ZW50c1wiXSxcclxuICogQHByb3BlcnR5ICAge051bWJlcn0gIGxpa2VzICAgICAgICBleGVtcGxlOjUyLFxyXG4gKiBAcHJvcGVydHkgICB7U3RyaW5nfSAgZGF0ZSAgICAgICAgZXhlbXBsZTpcIjIwMTktMDctMThcIixcclxuICogQHByb3BlcnR5ICAge051bWJlcn0gIHByaWNlICAgICAgICBleGVtcGxlOjcwXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmICB7T2JqZWN0fSBhbGxEYXRhXHJcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHBob3RvZ3JhcGhlcj59ICBwaG90b2dyYXBoZXJzXHJcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHNpbmdsZU1lZGlhPn0gIG1lZGlhXHJcbiAqL1xyXG5cclxuY2xhc3MgRGF0YU1hbmFnZXIge1xyXG4gIC8qKlxyXG4gICAqIHRvdXRlcyBub3MgZG9ubsOpZXNcclxuICAgKiBAdHlwZSB7YWxsRGF0YSB8IG51bGx9XHJcbiAgICovXHJcbiAgZGF0YSA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNyYykge1xyXG4gICAgdGhpcy5zcmMgPSBzcmM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWN1cMOocmUgdG91dGVzIGxlcyBkb25uw6llc1xyXG4gICAqXHJcbiAgICogQHJldHVybiAge1Byb21pc2UuPHZvaWQ+fSAgZW5yZWdpc3RyZXIgbGVzIGRvbm7DqWVzIGRhbnMgdGhpcy5kYXRhXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0QWxsRGF0YSgpIHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godGhpcy5zcmMpO1xyXG4gICAgdGhpcy5kYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcGVybWV0IGQnYXZvaXIgbGEgbGlzdGUgZGUgdG91cyBsZXMgdGFncyBwb3NzaWJsZSBlbiBmb25jdGlvbiBkZXMgdGFncyBkZSBjaGFxdWUgcGhvdG9ncmFwaGVcclxuICAgKlxyXG4gICAqIEByZXR1cm4gIHtQcm9taXNlLjxBcnJheT59ICByZXRvdXJuZSBsYSBsaXN0ZSBkZXMgdGFnc1xyXG4gICAqL1xyXG4gIGFzeW5jIHBob3RvZ3JhcGhlcnNUYWdzKCkge1xyXG4gICAgaWYgKHRoaXMuZGF0YSA9PT0gbnVsbCkgYXdhaXQgdGhpcy5nZXRBbGxEYXRhKCk7XHJcbiAgICBsZXQgdGFncyA9IFtdO1xyXG4gICAgdGhpcy5kYXRhLnBob3RvZ3JhcGhlcnMuZm9yRWFjaCgocGhvdG9ncmFwaGVyKSA9PiB7XHJcbiAgICAgIHRhZ3MgPSB0YWdzLmNvbmNhdChwaG90b2dyYXBoZXIudGFncyk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBbLi4ubmV3IFNldCh0YWdzKV07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBwZXJtZXQgZCdhdm9pciBsYSBsaXN0ZSBkZXMgcGhvdG9ncmFwaGVzXHJcbiAgICogQHBhcmFtICB7QXJyYXkuPFN0cmluZz59ICBmaWx0ZXJzICBsYSBsaXN0ZSBkZXMgdGFncyBhY3RpZnNcclxuICAgKlxyXG4gICAqIEByZXR1cm4gIHtBcnJheS48cGhvdG9ncmFwaGVyPn0gIGxhIGxpc3RlIGRlcyBwaG90b2dyYXBoZXNcclxuICAgKi9cclxuICBwaG90b2dyYXBoZXJzTGlzdChmaWx0ZXJzKSB7XHJcbiAgICBpZiAoZmlsdGVycy5sZW5ndGggPT09IDAgKSByZXR1cm4gdGhpcy5kYXRhLnBob3RvZ3JhcGhlcnM7XHJcbiAgICBjb25zdCBsaXN0PVtdO1xyXG4gICAgdGhpcy5kYXRhLnBob3RvZ3JhcGhlcnMuZm9yRWFjaChwaG90b2dyYXBoZSA9PiB7XHJcbiAgICAgIGZpbHRlcnMuZm9yRWFjaChmaWx0cmU9PntcclxuICAgICAgICBpZihwaG90b2dyYXBoZS50YWdzLmluZGV4T2YoZmlsdHJlKSA+PSAwKSBsaXN0LnB1c2gocGhvdG9ncmFwaGUpO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gWy4uLm5ldyBTZXQobGlzdCldO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcGhvdG9ncmFwaGVySW5mb3JtYXRpb24oaWQpe1xyXG4gICAgaWYgKHRoaXMuZGF0YSA9PT0gbnVsbCkgYXdhaXQgdGhpcy5nZXRBbGxEYXRhKCk7XHJcbiAgICBmb3IoIGNvbnN0IHBob3RvZ3JhcGhlciBvZiB0aGlzLmRhdGEucGhvdG9ncmFwaGVycyl7XHJcbiAgICAgIGlmIChwaG90b2dyYXBoZXIuaWQgPT09IGlkKSByZXR1cm4gcGhvdG9ncmFwaGVyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGhvdG9ncmFwaGVyTWVkaWEoaWQsIG9yZGVyKXtcclxuICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgIHRoaXMuZGF0YS5tZWRpYS5mb3JFYWNoKG1lZGlhID0+IHtcclxuICAgICAgaWYgKG1lZGlhLnBob3RvZ3JhcGhlcklkID09PSBpZCkgbGlzdC5wdXNoKG1lZGlhKTtcclxuICAgIH0pO1xyXG4gICAgY29uc29sZS5sb2cobGlzdClcclxuICAgIGxpc3Quc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICBpZiAob3JkZXIgPT09IFwiUG9wdWxhcml0w6lcIikgcmV0dXJuIGIubGlrZXMgLSBhLmxpa2VzO1xyXG4gICAgICBpZiAob3JkZXIgPT09IFwiRGF0ZVwiKSByZXR1cm4gbmV3IERhdGUoYS5kYXRlKSAtIG5ldyBEYXRlKGIuZGF0ZSk7XHJcbiAgICAgIGlmIChvcmRlciA9PT0gXCJUaXRyZVwiKSByZXR1cm4gdGhpcy5zb3J0VGV4dChhLCBiKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGxpc3Q7XHJcbiAgfVxyXG5cclxuICBzb3J0VGV4dChhLCBiKXtcclxuICAgIGNvbnN0IGZhID0gYS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBmYiA9IGIudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBpZiAoZmEgPCBmYikge1xyXG4gICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbiAgICBpZiAoZmEgPiBmYikge1xyXG4gICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuICAgIHJldHVybiAwO1xyXG4gIH1cclxufVxyXG4iLCJjbGFzcyBSb3V0ZXJ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7RGF0YU1hbmFnZXJ9XHJcbiAgICAgKi9cclxuICAgIGRhdGFNYW5hZ2VyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICBET007XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBbY29uc3RydWN0b3IgZGVzY3JpcHRpb25dXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgZG9tVGFyZ2V0ICBsZSBub2V1ZCBET00gZGFucyBsZXF1ZWwgb24gdmV1dCBpbmplY3TDqSBsYSBwYWdlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGRvbVRhcmdldCl7XHJcbiAgICAgICAgdGhpcy5ET00gPSBkb21UYXJnZXQ7XHJcbiAgICAgICAgdGhpcy5kYXRhTWFuYWdlciA9IG5ldyBEYXRhTWFuYWdlcihcIi4vZGF0YS5qc29uXCIpXHJcbiAgICAgICAgd2luZG93LmNoYW5nZVBhZ2UgPSB0aGlzLmNoYW5nZVBhZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICBjb25zdCBbcGFnZSwgYXJnc10gPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNsaWNlKDEpLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICB0aGlzLnNob3dQYWdlKHBhZ2UgPT09IFwiXCI/IFwiaW5kZXhcIiA6IHBhZ2UsIGFyZ3MpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzaG93UGFnZShuZXdQYWdlLCBhcmdzKXtcclxuICAgICAgICBzd2l0Y2ggKG5ld1BhZ2Upe1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5kZXhcIiA6IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ET00uY2xhc3NOYW1lID0gXCJpbmRleFBhZ2VcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZSA9IG5ldyBJbmRleFBhZ2UodGhpcy5ET00sIHRoaXMuZGF0YU1hbmFnZXIpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInBob3RvZ3JhcGhlclwiIDpcclxuICAgICAgICAgICAgICAgIHRoaXMuRE9NLmNsYXNzTmFtZSA9IFwicGhvdG9ncmFwaGVyUGFnZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlID0gbmV3IFBob3RvZ3JhcGhlclBhZ2UodGhpcy5ET00sIHRoaXMuZGF0YU1hbmFnZXIsIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOiBcclxuICAgICAgICAgICAgICAgIHRoaXMuRE9NLmNsYXNzTmFtZSA9IFwiNDA0XCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRPTS5pbm5lclRleHQgPSBcIjQwNFwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYWdlKG5ld1BhZ2UsIGFyZ3Mpe1xyXG4gICAgICAgIC8vbWFuaXB1bGVyIGwnaGlzdG9yaXF1ZVxyXG4gICAgICAgIHRoaXMuc2hvd1BhZ2UobmV3UGFnZSwgYXJncylcclxuICAgIH1cclxufSAiLCJjbGFzcyBJbmRleFBhZ2V7XHJcbiAgICAvKipcclxuICAgICAqIFtjb25zdHJ1Y3RvciBkZXNjcmlwdGlvbl1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gICB7SFRNTEVsZW1lbnR9ICBkb21UYXJnZXQgICAgW2RvbVRhcmdldCBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAgIHtEYXRhTWFuYWdlcn0gIGRhdGFNYW5hZ2VyICBbZGF0YU1hbmFnZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGRvbVRhcmdldCwgZGF0YU1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGFNYW5hZ2VyO1xyXG4gICAgICAgIHRoaXMuRE9NID0gZG9tVGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuYWN0aXZlRmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWxsRmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBhc3luYyByZW5kZXIoKXtcclxuICAgICAgICB0aGlzLkRPTS5pbm5lclRleHQgPSBcIlwiO1xyXG4gICAgICAgIGlmKCB0aGlzLmFsbEZpbHRlcnMubGVuZ3RoID09PSAwKSB0aGlzLmFsbEZpbHRlcnMgPSBhd2FpdCB0aGlzLmRhdGEucGhvdG9ncmFwaGVyc1RhZ3MoKTtcclxuICAgICAgICBuZXcgSGVhZGVyKHRoaXMuRE9NLCB0aGlzLmFsbEZpbHRlcnMsIHRoaXMuY2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtYWluXCIpO1xyXG4gICAgICAgIHRoaXMuRE9NLmFwcGVuZENoaWxkKG1haW4pO1xyXG4gICAgICAgIGNvbnN0IHBob3RvZ3JhcGhlcnMgPSB0aGlzLmRhdGEucGhvdG9ncmFwaGVyc0xpc3QodGhpcy5hY3RpdmVGaWx0ZXJzKTtcclxuICAgICAgICBwaG90b2dyYXBoZXJzLmZvckVhY2gocGhvdG9ncmFwaGVyID0+IHtcclxuICAgICAgICAgICAgbmV3IFBob3RvZ3JhcGhlck1haW4obWFpbiwgcGhvdG9ncmFwaGVyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjbGljayh0YWcpe1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5hY3RpdmVGaWx0ZXJzLmluZGV4T2YodGFnKTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB0aGlzLmFjdGl2ZUZpbHRlcnMucHVzaCh0YWcpO1xyXG4gICAgICAgIGVsc2UgdGhpcy5hY3RpdmVGaWx0ZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4gICAgIiwiY2xhc3MgUGhvdG9ncmFwaGVyUGFnZSB7XHJcbiAgaW5mb3JtYXRpb247XHJcbiAgZmlsdGVyc0xpc3QgPSBbXCJQb3B1bGFyaXTDqVwiLCBcIkRhdGVcIiwgXCJUaXRyZVwiXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgZG9tVGFyZ2V0ICBbZG9tVGFyZ2V0IGRlc2NyaXB0aW9uXVxyXG4gICAqIEBwYXJhbSAgIHtEYXRhTWFuYWdlcn0gIGRhdGFNYW5hZ2VyICAgICAgW2RhdGFNYW5hZ2VyIGRlc2NyaXB0aW9uXVxyXG4gICAqIEBwYXJhbSAgIHtOdW1iZXJ9ICAgICAgICBpZFBob3RvZ3JhcGhlclxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGRvbVRhcmdldCwgZGF0YU1hbmFnZXIsIGlkUGhvdG9ncmFwaGVyKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhTWFuYWdlcjtcclxuICAgIHRoaXMuRE9NID0gZG9tVGFyZ2V0O1xyXG4gICAgdGhpcy5pZCA9IGlkUGhvdG9ncmFwaGVyO1xyXG4gICAgdGhpcy5ET00uY2xhc3NOYW1lID0gXCJwaG90b2dyYXBoZXJQYWdlXCI7XHJcbiAgICB0aGlzLnRvdGFsTGlrZXMgPSAwO1xyXG4gICAgdGhpcy50b3RhbExpa2VzRE9NID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFzaWRlXCIpO1xyXG5cclxuICAgIC8vIHRoaXMuRE9NLmlubmVySFRNTCA9IGBcclxuICAgIC8vICAgPGEgaHJlZj1cInBob3RvZ3JhcGhlclBhZ2UuaHRtbFwiPlxyXG4gICAgLy8gICdcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIGFzeW5jIHJlbmRlcigpIHtcclxuICAgIHRoaXMuRE9NLmlubmVyVGV4dCA9IFwiY2hhcmdlbWVudC4uLlwiO1xyXG4gICAgaWYgKCF0aGlzLmluZm9ybWF0aW9uKVxyXG4gICAgICB0aGlzLmluZm9ybWF0aW9uID0gYXdhaXQgdGhpcy5kYXRhLnBob3RvZ3JhcGhlckluZm9ybWF0aW9uKHRoaXMuaWQpO1xyXG4gICAgdGhpcy5ET00uaW5uZXJIVE1MID0gYFxyXG4gICAgICA8aGVhZGVyPlxyXG4gICAgICAgIDxhIGhyZWY9XCJpbmRleC5odG1sXCI+PGltZyBhbHQ9XCJGaXNoZXllIEhvbWUgUGFnZVwiIHNyYz1cIi4vaW1hZ2VzL2xvZ28ucG5nXCIgLz48L2E+XHJcbiAgICAgIDwvaGVhZGVyPlxyXG4gICAgYDtcclxuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibWFpblwiKTtcclxuICAgIHRoaXMuRE9NLmFwcGVuZENoaWxkKG1haW4pO1xyXG4gICAgbmV3IFBob3RvZ3JhcGhlck1haW4obWFpbiwgdGhpcy5pbmZvcm1hdGlvbik7XHJcbiAgICBtYWluLmlubmVySFRNTCArPSBgXHJcbiAgICAgIDxidXR0b24gY2xhc3M9XCJjb250YWN0XCI+Q29udGFjdGV6LW1vaTwvYnV0dG9uPlxyXG4gICAgICBgO1xyXG4gICAgbmV3IERyb3Bkb3duKG1haW4sIHRoaXMuZmlsdGVyc0xpc3QsIHRoaXMudXBkYXRlTWVkaWEuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLm1lZGlhQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMubWVkaWFDb250YWluZXIuY2xhc3NOYW1lID0gXCJpbWdQaG90b2dyYXBoZXJzXCI7XHJcbiAgICBtYWluLmFwcGVuZENoaWxkKHRoaXMubWVkaWFDb250YWluZXIpO1xyXG4gICAgdGhpcy5ET00uYXBwZW5kQ2hpbGQodGhpcy50b3RhbExpa2VzRE9NKTtcclxuICAgIHRoaXMudXBkYXRlTWVkaWEodGhpcy5maWx0ZXJzTGlzdFswXSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVNZWRpYShuZXdGaWx0ZXIpIHtcclxuICAgIHRoaXMubWVkaWFDb250YWluZXIuaW5uZXJUZXh0ID0gXCJcIjtcclxuICAgIGNvbnN0IG1lZGlhID0gdGhpcy5kYXRhLnBob3RvZ3JhcGhlck1lZGlhKHRoaXMuaWQsIG5ld0ZpbHRlcik7XHJcbiAgICBtZWRpYS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgIGlmIChlbGVtZW50LnZpZGVvKVxyXG4gICAgICAgIG5ldyBWaWRlb0NvbXBvbmVudChcclxuICAgICAgICAgIHRoaXMubWVkaWFDb250YWluZXIsXHJcbiAgICAgICAgICBlbGVtZW50LFxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VUb3RhbExpa2VzLmJpbmQodGhpcylcclxuICAgICAgICApO1xyXG4gICAgICBpZiAoZWxlbWVudC5pbWFnZSlcclxuICAgICAgICBuZXcgSW1hZ2VDb21wb25lbnQoXHJcbiAgICAgICAgICB0aGlzLm1lZGlhQ29udGFpbmVyLFxyXG4gICAgICAgICAgZWxlbWVudCxcclxuICAgICAgICAgIHRoaXMuY2hhbmdlVG90YWxMaWtlcy5iaW5kKHRoaXMpXHJcbiAgICAgICAgKTtcclxuICAgICAgdGhpcy50b3RhbExpa2VzICs9IGVsZW1lbnQubGlrZXM7XHJcblxyXG4gICAgICB0aGlzLnRvdGFsTGlrZXNSZW5kZXIoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogW2NoYW5nZVRvdGFsTGlrZXMgZGVzY3JpcHRpb25dXHJcbiAgICpcclxuICAgKiBAcGFyYW0gICB7Qm9vbGVhbn0gIGxpa2VkICBbbGlrZWQgZGVzY3JpcHRpb25dXHJcbiAgICpcclxuICAgKiBAcmV0dXJuICB7dm9pZH0gICAgICAgIG1ldCDDoCBqb3VyIGxlIG5vbWJyZSBkZSBsaWtlXHJcbiAgICovXHJcbiAgY2hhbmdlVG90YWxMaWtlcyhsaWtlZCkge1xyXG4gICAgdGhpcy50b3RhbExpa2VzICs9IGxpa2VkID8gMSA6IC0xO1xyXG4gICAgdGhpcy50b3RhbExpa2VzUmVuZGVyKCk7XHJcbiAgfVxyXG5cclxuICB0b3RhbExpa2VzUmVuZGVyKCkge1xyXG4gICAgdGhpcy50b3RhbExpa2VzRE9NLmlubmVySFRNTCA9IGBcclxuICAgICR7dGhpcy50b3RhbExpa2VzfSA8aSBjbGFzcz1cImZhcyBmYS1oZWFydFwiPjwvaT4gXHJcbiAgICAke3RoaXMuaW5mb3JtYXRpb24ucHJpY2V94oKsL2pvdXJcclxuICAgIGA7XHJcbiAgfVxyXG59XHJcblxyXG4vKlxyXG4gXHJcbiAgICA8bWFpbj5cclxuICAgIDwlLSBpbmNsdWRlKCBcIi4uL2NvbXBvc2FudHMvaGVhZGVyUGhvdG9ncmFwaGVyUGFnZS9oZWFkZXJQaG90b2dyYXBoZXJQYWdlLmh0bWxcIiAsIHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJNaW1pIEtlZWxcIixcclxuICAgICAgXCJpZFwiOiAyNDMsXHJcbiAgICAgIFwiY2l0eVwiOiBcIkxvbmRvblwiLFxyXG4gICAgICBcImNvdW50cnlcIjogXCJVS1wiLFxyXG4gICAgICBcInRhZ3NcIjogW1wicG9ydHJhaXRcIiwgXCJldmVudHNcIiwgXCJ0cmF2ZWxcIiwgXCJhbmltYWxzXCJdLFxyXG4gICAgICBcInRhZ2xpbmVcIjogXCJWb2lyIGxlIGJlYXUgZGFucyBsZSBxdW90aWRpZW5cIixcclxuICAgICAgXCJwcmljZVwiOiA0MDAsXHJcbiAgICAgIFwicG9ydHJhaXRcIjogXCJNaW1pS2VlbC5qcGdcIlxyXG4gICAgfSApOyAlPlxyXG5cclxuICAgIFxyXG5cclxuXHJcblxyXG48ZGl2IGNsYXNzPVwiaW1nUGhvdG9ncmFwaGVyc1wiPlxyXG48aW1nIHNyYz1cIi4uL2ltYWdlcy9NaW1pL0FuaW1hbHNfUmFpbmJvdy5qcGdcIiBhbHQ9XCJBcmMtZW4tY2llbFwiIC8+XHJcbjxpbWcgc3JjPVwiLi4vaW1hZ2VzL01pbWkvVHJhdmVsX0xvbmVzb21lLmpwZ1wiIGFsdD1cIlNvbGl0dWRlXCIgLz5cclxuPC9kaXY+XHJcbiAgICA8L21haW4+XHJcbiAqLyIsImNsYXNzIEhlYWRlciB7XHJcbiAgY29uc3RydWN0b3IoZG9tVGFyZ2V0LCB0YWdzLCB0YWdBY3Rpb24pIHtcclxuICAgIHRoaXMuRE9NID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhlYWRlclwiKTtcclxuICAgIGRvbVRhcmdldC5hcHBlbmRDaGlsZCh0aGlzLkRPTSk7XHJcbiAgICB0aGlzLkRPTS5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgPGEgaHJlZj1cImluZGV4Lmh0bWxcIj48aW1nIGFsdD1cIkZpc2hleWUgSG9tZSBQYWdlXCIgc3JjPVwiLi9pbWFnZXMvbG9nby5wbmdcIiAvPjwvYT5cclxuICAgIDxoMT5Ob3MgcGhvdG9ncmFwaGVzPC9oMT5cclxuICAgIGA7XHJcbiAgICBuZXcgTmF2VGFncyh0aGlzLkRPTSwgdGFncywgdGFnQWN0aW9uKTtcclxuICB9XHJcbn1cclxuIiwiY2xhc3MgRHJvcGRvd24ge1xyXG4gIC8qKlxyXG4gICAqIGxlIGZpbHRlciBzZWxlY3Rpb25uw6lcclxuICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIGFjdGl2ZUZpbHRlcjtcclxuXHJcbiAgLyoqXHJcbiAgICogbGEgbGlzdGUgZGVzIGZpbHRyZXMgcG9zc2libGVzXHJcbiAgICogQHR5cGUge0FycmF5LjxTdHJpbmc+fVxyXG4gICAqL1xyXG4gIGxpc3RGaWx0ZXJzID0gW107XHJcblxyXG4gIC8qKlxyXG4gICAqIGluZGljYXRldXIgcG91ciBzYXZvaXIgc2kgb24gYWZmaWNoZSBsYSBsaXN0ZSBvdSBub25cclxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBzaG93TGlzdCA9IGZhbHNlO1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAgICAgZG9tVGFyZ2V0ICAgbCdlbmRyb2l0IG/DuSBpbmplY3RlciBsZSBjb21wb3NhbnRcclxuICAgKiBAcGFyYW0ge0FycmF5LjxTdHJpbmc+fSAgcHJvcHMgICAgICAgbGEgbGlzdGUgZGVzIGZpbHRyZXMgcG9zc2libGVzXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgIGNhbGxiYWNrXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoZG9tVGFyZ2V0LCBwcm9wcywgY2FsbGJhY2spIHtcclxuICAgIHRoaXMuRE9NID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xyXG4gICAgZG9tVGFyZ2V0LmFwcGVuZENoaWxkKHRoaXMuRE9NKTtcclxuICAgIHRoaXMubGlzdEZpbHRlcnMgPSBwcm9wcztcclxuICAgIHRoaXMuYWN0aXZlRmlsdGVyID0gcHJvcHNbMF07XHJcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdGhpcy5ET00uaW5uZXJUZXh0ID0gXCJcIjtcclxuICAgIGlmICh0aGlzLnNob3dMaXN0KSB7XHJcbiAgICAgIHRoaXMuRE9NLmNsYXNzTmFtZSA9IFwiZHJvcGRvd24gbGlzdFwiO1xyXG4gICAgICBmb3IgKGxldCBpID0gMCwgc2l6ZSA9IHRoaXMubGlzdEZpbHRlcnMubGVuZ3RoOyBpIDwgc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5hZGRMaSh0aGlzLmxpc3RGaWx0ZXJzW2ldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLkRPTS5jbGFzc05hbWUgPSBcImRyb3Bkb3duIHNlbGVjdGVkXCI7XHJcbiAgICB0aGlzLmFkZExpKHRoaXMuYWN0aXZlRmlsdGVyKTtcclxuICB9XHJcblxyXG4gIGFkZExpKGZpbHRlcikge1xyXG4gICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcbiAgICBsaS5pbm5lclRleHQgPSBmaWx0ZXI7XHJcbiAgICBsaS5vbmNsaWNrID0gKCk9PnRoaXMuY2xpY2soZmlsdGVyKTtcclxuICAgIHRoaXMuRE9NLmFwcGVuZENoaWxkKGxpKTtcclxuICB9XHJcblxyXG4gIGNsaWNrKHNlbGVjdGVkKXtcclxuICAgICAgaWYgKHRoaXMuc2hvd0xpc3QpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZUZpbHRlciA9IHNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2soc2VsZWN0ZWQpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2hvd0xpc3QgPSAhdGhpcy5zaG93TGlzdDtcclxuICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbn1cclxuIiwiY2xhc3MgSW1hZ2VDb21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKGRvbVRhcmdldCwgcHJvcHMsIGNhbGxiYWNrKSB7XHJcbiAgICBjb25zdCBET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXJ0aWNsZVwiKTtcclxuICAgIERPTS5pbm5lckhUTUwgPSBgXHJcbiAgICAgIDxpbWcgc3JjPVwiLi9pbWFnZXMvJHtwcm9wcy5pbWFnZX1cIiBhbHQ9XCIke3Byb3BzLmRlc2NyaXB0aW9ufVwiIHRpdGxlPVwiJHtwcm9wcy50aXRsZX1cIj5cclxuICAgICAgPGgyPiR7cHJvcHMudGl0bGV9PC9oMj5cclxuICAgICAgYDtcclxuICAgIG5ldyBMaWtlKERPTSwgcHJvcHMubGlrZXMsIGNhbGxiYWNrKTtcclxuICAgIGRvbVRhcmdldC5hcHBlbmRDaGlsZChET00pO1xyXG4gIH1cclxufVxyXG4iLCJjbGFzcyBMaWtlIHtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBbY29uc3RydWN0b3IgZGVzY3JpcHRpb25dXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgZG9tVGFyZ2V0ICBbZG9tVGFyZ2V0IGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICAge051bWJlcn0gICAgICAgbGlrZXMgICAgICBsZSBub21icmUgZGUgbWlrZSBwYXIgZGVmYXV0XHJcbiAgICAgKiBAcGFyYW0gICB7RnVuY3Rpb259ICAgICBjYWxsYmFjayAgIFtjYWxsYmFjayBkZXNjcmlwdGlvbl1cclxuICAgICAqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gIGNvbnN0cnVjdG9yKGRvbVRhcmdldCwgbGlrZXMsIGNhbGxiYWNrKSB7IFxyXG4gICAgY29uc29sZS5sb2coZG9tVGFyZ2V0KSAgICAgXHJcbiAgICB0aGlzLmxpa2VzID0gbGlrZXM7XHJcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB0aGlzLmxpa2VkID0gZmFsc2U7XHJcbiAgICB0aGlzLkRPTSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhc2lkZVwiKTtcclxuICAgIHRoaXMuRE9NLmNsYXNzTmFtZSA9IFwibGlrZXNcIjtcclxuICAgIHRoaXMuRE9NLm9uY2xpY2s9IHRoaXMuY2xpY2suYmluZCh0aGlzKTtcclxuICAgIGRvbVRhcmdldC5hcHBlbmRDaGlsZCh0aGlzLkRPTSk7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICByZW5kZXIoKXtcclxuICAgIHRoaXMuRE9NLmlubmVyVGV4dCA9IHRoaXMubGlrZXMudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIGNsaWNrKCl7XHJcbiAgICB0aGlzLmxpa2VkID0gISB0aGlzLmxpa2VkO1xyXG4gICAgdGhpcy5saWtlcyArPSB0aGlzLmxpa2VkPyAxIDogLTE7XHJcbiAgICB0aGlzLkRPTS5jbGFzc0xpc3QudG9nZ2xlKFwibGlrZWRcIik7XHJcbiAgICB0aGlzLmNhbGxiYWNrKHRoaXMubGlrZWQpO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbn1cclxuIiwiY2xhc3MgTmF2VGFnc3tcclxuICAgIGNvbnN0cnVjdG9yKGRvbVRhcmdldCwgdGFncywgdGFnQWN0aW9uID0gbnVsbCl7XHJcbiAgICAgICAgdGhpcy5ET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibmF2XCIpO1xyXG4gICAgICAgIGRvbVRhcmdldC5hcHBlbmRDaGlsZCh0aGlzLkRPTSk7XHJcbiAgICAgICAgdGFncy5mb3JFYWNoKHRhZyA9PiB7XHJcbiAgICAgICAgICAgIG5ldyBUYWcodGhpcy5ET00sIHRhZywgdGFnQWN0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImNsYXNzIFBob3RvZ3JhcGhlck1haW4ge1xyXG4gIC8qKlxyXG4gICAgICogW2NvbnN0cnVjdG9yIGRlc2NyaXB0aW9uXVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAgIHtIVE1MRWxlbWVudH0gIGRvbVRhcmdldCAgW2RvbVRhcmdldCBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAgIHtwaG90b2dyYXBoZXJ9ICBkYXRhICAgICAgIFtkYXRhIGRlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgY29uc3RydWN0b3IoZG9tVGFyZ2V0LCBkYXRhKSB7XHJcbiAgICB0aGlzLkRPTSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhcnRpY2xlXCIpO1xyXG4gICAgdGhpcy5ET00uY2xhc3NOYW1lID0gXCJwaG90b2dyYXBoZXJNYWluXCI7XHJcbiAgICBkb21UYXJnZXQuYXBwZW5kQ2hpbGQodGhpcy5ET00pO1xyXG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcclxuICAgICAgdGhpc1trZXldID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdGhpcy5ET00uaW5uZXJIVE1MID0gYFxyXG4gICAgPGEgaHJlZj1cIiNcIiAgb25jbGljaz1cIndpbmRvdy5jaGFuZ2VQYWdlKCdwaG90b2dyYXBoZXInLCR7dGhpcy5pZH0pXCI+XHJcbiAgICAgICAgPGltZyBzcmM9XCIuL2ltYWdlcy9Qb3J0cmFpdF8ke3RoaXMucG9ydHJhaXR9XCIgLz5cclxuICAgICAgICA8aDI+JHt0aGlzLm5hbWV9PC9oMj5cclxuICAgIDwvYT5cclxuXHJcbiAgICA8c3VtbWFyeT5cclxuICAgICAgICA8aDM+JHt0aGlzLmNpdHl9LCR7dGhpcy5jb3VudHJ5fTwvaDM+XHJcbiAgICAgICAgPHA+JHt0aGlzLnRhZ2xpbmV9PC9wPlxyXG4gICAgICAgIDxhc2lkZT4ke3RoaXMucHJpY2V9ZS9qb3VyPC9hc2lkZT5cclxuICAgIDwvc3VtbWFyeT5cclxuICAgIGA7XHJcbiAgICBuZXcgTmF2VGFncyh0aGlzLkRPTSwgdGhpcy50YWdzKTtcclxuICB9XHJcbn1cclxuIiwiY2xhc3MgVGFne1xyXG4gICAgY29uc3RydWN0b3IoZG9tVGFyZ2V0LCB0YWcsIHRhZ0FjdGlvbj1udWxsKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSB0YWc7XHJcbiAgICAgICAgdGhpcy5ET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGFnXCIpO1xyXG4gICAgICAgIGRvbVRhcmdldC5hcHBlbmRDaGlsZCh0aGlzLkRPTSk7XHJcbiAgICAgICAgdGhpcy5ET00uY2xhc3NOYW1lID0gXCJ0YWdcIjtcclxuICAgICAgICBpZiAodGFnQWN0aW9uICE9PSBudWxsKSB0aGlzLkRPTS5vbmNsaWNrID0gKCk9PntcclxuICAgICAgICAgICAgdGFnQWN0aW9uKHRoaXMubmFtZSk7XHJcbiAgICAgICAgfSBcclxuICAgICAgICB0aGlzLkRPTS5pbm5lclRleHQ9XCIjXCIrdGFnO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKiA8YSBhcmlhLWxhYmVsPVwiUGhvdG9ncmFwaGVycyBjYXRlZ29yaWVzXCIgY2xhc3M9XCJ0YWdcIiBocmVmPVwiaW5kZXguaHRtbFwiPiM8JS0gdGV4dCAlPjwvYT4gKi8iLCJjbGFzcyBWaWRlb0NvbXBvbmVudCB7XHJcbiAgICBcclxuICBpZDtcclxuICBwaG90b2dyYXBoZXJJZDtcclxuICB0aXRsZTtcclxuICB2aWRlbztcclxuICB0YWdzO1xyXG4gIGxpa2VzO1xyXG4gIGRhdGU7XHJcbiAgZGVzY3JpcHRpb247XHJcbiAgcHJpY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRvbVRhcmdldCwgcHJvcHMpIHtcclxuICAgIHRoaXMuRE9NID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xyXG4gICAgZG9tVGFyZ2V0LmFwcGVuZENoaWxkKHRoaXMuRE9NKTtcclxuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzKSkge1xyXG4gICAgICB0aGlzW2tleV0gPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHRoaXMuRE9NLnNyYyA9IHRoaXMudmlkZW87XHJcbiAgfVxyXG59XHJcblxyXG4vKlxyXG4gICAgICBcImlkXCI6IDgzMjg5NTMsXHJcbiAgICAgIFwicGhvdG9ncmFwaGVySWRcIjogODIsXHJcbiAgICAgIFwidGl0bGVcIjogXCJXb29kZW4gSG9yc2UgU2N1bHB0dXJlXCIsXHJcbiAgICAgIFwidmlkZW9cIjogXCJBcnRfV29vZGVuX0hvcnNlX1NjdWxwdHVyZS5tcDRcIixcclxuICAgICAgXCJ0YWdzXCI6IFtcImFydFwiXSxcclxuICAgICAgXCJsaWtlc1wiOiAyNCxcclxuICAgICAgXCJkYXRlXCI6IFwiMjAxMS0xMi0wOFwiLFxyXG4gICAgICBcInByaWNlXCI6IDEwMFxyXG4gKi8iXX0=
