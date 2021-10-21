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
    this.DOM.className = "photographerMain";
    
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
      if (element.video) new VideoComponent(mediaContainer, element);
      if (element.image) new ImageComponent(mediaContainer, element);
    });

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