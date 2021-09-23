class Tag{
    constructor(domTarget, tag){
        this.name = tag;
        this.DOM = document.createElement("tag");
        domTarget.appendChild(this.DOM);
        this.DOM.className = "tag";
        this.DOM.onclick= this.click.bind(this);
        this.DOM.innerText="#"+tag;
    }
    click(){
        console.log(this.name, this);
    }
}

/* <a aria-label="Photographers categories" class="tag" href="index.html">#<%- text %></a> */