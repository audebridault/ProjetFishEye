class DataManager {
  /**
   * toutes nos données
   * @type {Object | null}
   */

  /**
   *  * [constructor description]
   *@param   {String}  data.name      "Ellie-Rose Wilkens",
   * @param   {Number}  data.id      930,
   * @param   {String}  data.city      "Paris",
   * @param   {String}  data.country      "France",
   * @param   {Array}  data.tags      ["sports", "architecture"],
   * @param   {String}  data.tagline      "Capturer des compositions complexes",
   * @param   {Number}  data.price      250,
   * @param   {String}  data.portrait      "EllieRoseWilkens.jpg"
   */
  data = null;

  constructor(src) {
    this.src = src;
  }

  async getAllData() {
    const response = await fetch(this.src);
    this.data = await response.json();
  }

  async photographersTags() {
    if (this.data === null) await this.getAllData();
    let tags = [];
    this.data.photographers.forEach((photographer) => {
      tags = tags.concat(photographer.tags);
    });
    return [...new Set(tags)];
  }

  photographersList() {
    return this.data.photographers;
  }
}