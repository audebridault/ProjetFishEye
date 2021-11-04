class PhotographerPage {

  information;

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
    if ( ! this.information ) this.information = await this.data.photographerInformation(this.id);
    const media = await this.data.photographerMedia(this.id, ""); //TODO ajouter le tri
    this.DOM.innerHTML = `
      <header>
        <a href="index.html"><img alt="Fisheye Home Page" src="./images/logo.png" /></a>
      </header>
    `;
    const main = document.createElement("main");
    this.DOM.appendChild(main);
    new PhotographerMainPage(main, this.information);
    main.innerHTML += `
      <button class="contact">Contactez-moi</button>
      <div class="menu">
        <button class="boutonMenuPrincipal">Popularité<i class="far fa-angle-down"></i></button>
        <div class="menuDeroulant">
            <a href="#">Date</a>
            <a href=#>Titre</a>
        </div>
      </div>
    `;
    const mediaContainer = document.createElement("div");
    mediaContainer.className = "imgPhotographers";
    main.appendChild(mediaContainer);
    media.forEach(element => {
      if (element.video) new VideoComponent(mediaContainer, element, this.changeTotalLikes.bind(this));
      if (element.image) new ImageComponent(mediaContainer, element, this.changeTotalLikes.bind(this));
      this.totalLikes += element.likes;
    });
    this.DOM.appendChild(this.totalLikesDOM);
    this.totalLikesRender();

  }

  /**
   * [changeTotalLikes description]
   *
   * @param   {Boolean}  liked  [liked description]
   *
   * @return  {void}        met à jour le nombre de like
   */
  changeTotalLikes(liked){
    this.totalLikes += liked ? 1 : -1;
    this.totalLikesRender();
  }


  totalLikesRender(){
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