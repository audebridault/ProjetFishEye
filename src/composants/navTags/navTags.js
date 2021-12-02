class NavTags{
    constructor(domTarget, tags, tagAction = null){
        this.DOM = document.createElement("nav");
        domTarget.appendChild(this.DOM);
        tags.forEach(tag => {
            new Tag(this.DOM, tag, tagAction);
        });
    }
}