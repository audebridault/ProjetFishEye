/**
 * @typedef    {Object}  photographer
 * @property   {String}  name      "Ellie-Rose Wilkens",
 * @property   {Number}  id      930,
 * @property   {String}  city      "Paris",
 * @property   {String}  country      "France",
 * @property   {Array}    tags      ["sports", "architecture"],
 * @property   {String}  tagline      "Capturer des compositions complexes",
 * @property   {Number}  price      250,
 * @property   {String}  portrait      "EllieRoseWilkens.jpg"
 */

/**
 * @typedef {Object} singleMedia
 * @property   {String}  id        exemple:23394384,
 * @property   {Number}  photographerId        exemple:925,
 * @property   {String}  title        exemple:"Musical Festival Keyboard",
 * @property   {String}  image        exemple:"Event_KeyboardCheck.jpg",
 * @property   {Array}  tags        exemple:["events"],
 * @property   {Number}  likes        exemple:52,
 * @property   {String}  date        exemple:"2019-07-18",
 * @property   {Number}  price        exemple:70
 */

/**
 * @typedef  {Object} allData
 * @property {Array.<photographer>}  photographers
 * @property {Array.<singleMedia>}  media
 */

class DataManager {
  /**
   * toutes nos données
   * @type {allData | null}
   */
  data = null;

  constructor(src) {
    this.src = src;
  }

  /**
   * recupère toutes les données
   *
   * @return  {Promise.<void>}  enregistrer les données dans this.data
   */
  async getAllData() {
    const response = await fetch(this.src);
    this.data = await response.json();
  }

  /**
   * permet d'avoir la liste de tous les tags possible en fonction des tags de chaque photographe
   *
   * @return  {Promise.<Array>}  retourne la liste des tags
   */
  async photographersTags() {
    if (this.data === null) await this.getAllData();
    let tags = [];
    this.data.photographers.forEach((photographer) => {
      tags = tags.concat(photographer.tags);
    });
    return [...new Set(tags)];
  }

  /**
   * permet d'avoir la liste des photographes
   * @param  {Array.<String>}  filters  la liste des tags actifs
   *
   * @return  {Array.<photographer>}  la liste des photographes
   */
  photographersList(filters) {
    if (filters.length === 0 ) return this.data.photographers;
    const list=[];
    this.data.photographers.forEach(photographe => {
      filters.forEach(filtre=>{
        if(photographe.tags.indexOf(filtre) >= 0) list.push(photographe);
      })
    });
    return [...new Set(list)];
  }

  async photographerInformation(id){
    if (this.data === null) await this.getAllData();
    for( const photographer of this.data.photographers){
      if (photographer.id === id) return photographer;
    }
  }

  photographerMedia(id, order){
    const list = [];
    this.data.media.forEach(media => {
      if (media.photographerId === id) list.push(media);
    });
    console.log(list)
    list.sort((a, b) => {
      if (order === "Popularité") return b.likes - a.likes;
      if (order === "Date") return new Date(a.date) - new Date(b.date);
      if (order === "Titre") return this.sortText(a, b);
    });
    return list;
  }

  sortText(a, b){
    const fa = a.toLowerCase(),
      fb = b.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  }
}
