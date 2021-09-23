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
        this.render();
    }
    async render(){
        new Header(this.DOM, await this.data.photographersTags());
        const main = document.createElement("main");
        this.DOM.appendChild(main);
        const photographers = this.data.photographersList();
        photographers.forEach(photographer => {
            new 
        });

// <%- include("../composants/header/header.html") %>
//         <main>

//             <%- include( "../composants/photographerMain/photographerMain.html" , {"name": "Mimi Keel" , "id" :
//                 243, "city" : "London" , "country" : "UK" , "tags" : ["portrait", "events" , "travel" , "animals"
//                 ], "tagline" : "Voir le beau dans le quotidien" , "price" : 400, "portrait" : "MimiKeel.jpg" } ); %>

//                 <%- include( "../composants/photographerMain/photographerMain.html" , {"name" : "Ellie-Rose Wilkens"
//                     , "id" : 930, "city" : "Paris" , "country" : "France" , "tags" : ["sports", "architecture"
//                     ], "tagline" : "Capturer des compositions complexes" , "price" : 250, "portrait"
//                     : "EllieRoseWilkens.jpg" } ); %>

//                     <%- include( "../composants/photographerMain/photographerMain.html" , {"name" : "Tracy Galindo"
//                         , "id" : 82, "city" : "Montreal" , "country" : "Canada" , "tags" : ["art", "fashion" , "events"
//                         ], "tagline" : "Photographe freelance" , "price" : 500, "portrait" : "TracyGalindo.jpg" } ); %>

//                         <%- include( "../composants/photographerMain/photographerMain.html" , {"name"
//                             : "Nabeel Bradford" , "id" : 527, "city" : "Mexico City" , "country" : "Mexico" , "tags" :
//                             ["travel", "portrait" ], "tagline" : "Toujours aller de l'avant" , "price" : 350, "portrait"
//                             : "NabeelBradford.jpg" } ); %>

//                             <%- include( "../composants/photographerMain/photographerMain.html" , {"name"
//                                 : "Rhode Dubois" , "id" : 925, "city" : "Barcelona" , "country" : "Spain" , "tags" :
//                                 ["sport", "fashion" , "events" , "animals" ], "tagline" : "Je crée des souvenirs"
//                                 , "price" : 275, "portrait" : "RhodeDubois.jpg" } ); %>

//                                 <%- include( "../composants/photographerMain/photographerMain.html" , { "name"
//                                     : "Marcel Nikolic" , "id" : 195, "city" : "Berlin" , "country" : "Germany" , "tags"
//                                     : ["travel", "architecture" ], "tagline" : "Toujours à la recherche de LA photo"
//                                     , "price" : 300, "portrait" : "MarcelNikolic.jpg" } ); %>


//         </main>



    }
}
    