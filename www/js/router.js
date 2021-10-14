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
                this.page = new IndexPage(this.DOM, this.dataManager)
                break;
            case "photographer" :
                this.page = new PhotographerPage(this.DOM, this.dataManager, args);
                break;
            default : 
                this.DOM.innerText = "404";
                break;
        }

    }

    changePage(newPage, args){
        //manipuler l'historique
        this.showPage(newPage, args)
    }
} 