class VideoComponent {
    
  id;
  photographerId;
  title;
  video;
  tags;
  likes;
  date;
  description;
  price;

  constructor(domTarget, props) {
    this.DOM = document.createElement("video");
    domTarget.appendChild(this.DOM);
    for (const [key, value] of Object.entries(props)) {
      this[key] = value;
    }
    this.DOM.src = this.video;
  }
}

/*
      "id": 8328953,
      "photographerId": 82,
      "title": "Wooden Horse Sculpture",
      "video": "Art_Wooden_Horse_Sculpture.mp4",
      "tags": ["art"],
      "likes": 24,
      "date": "2011-12-08",
      "price": 100
 */