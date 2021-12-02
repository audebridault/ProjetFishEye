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