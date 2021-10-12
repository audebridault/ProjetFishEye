class PageDeTest{
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
        if( this.allFilters.length === 0) this.allFilters = await this.data.photographersTags();
        new Header(this.DOM, this.allFilters, this.click.bind(this));
        const main = document.createElement("main");
        this.DOM.appendChild(main);
        const photographers = this.data.photographersList(this.activeFilters);
        photographers.forEach(photographer => {
            new PhotographerMainPage(main, photographer);
        });
    }

    click(tag){
        const index = this.activeFilters.indexOf(tag);
        if (index === -1) this.activeFilters.push(tag);
        else this.activeFilters.splice(index, 1);
        
        console.log("actifs", this.activeFilters);
        this.render();
    }
}
    