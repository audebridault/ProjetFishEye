class Header{
    constructor(domTarget, tags){
        this.DOM = document.createElement("header");
        domTarget.appendChild(this.DOM);
        this.tags = tags;
    }

    render(){
        this.DOM.innerHTML = `
        <a href="index.html"><img alt="Fisheye Home Page" src="./images/logo.png" /></a>
    <h1>Nos photographes</h1>
    `;
    new NavTags(this.DOM, this.tags);


    }
}