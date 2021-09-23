class Tag{
    constructor(domTarget, tag){
        this.name = tag;
        this.DOM = document.createElement("tag");
        domTarget.appendChild(this.DOM);
        this.DOM.className = "tag";
        this.DOM.onclick= this.click;
        this.DOM.innerText="#"+tag;
    }
    click(){
        console.log(this.name);
    }
}

/* <a aria-label="Photographers categories" class="tag" href="index.html">#<%- text %></a> */