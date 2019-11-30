 // ▶ = &#9654;
export class StartItem{

  constructor(classes, dataAttributes, img, text, arrow){
    this.classes = classes;
    this.img = img;
    this.text = text;
    this.arrow = this.handleArrow(arrow);
    this.dataAttributes = dataAttributes;
  }

  handleArrow(arrow){
    const arrowHtml = `<span class="arrow">▶</span>`;
    return arrow ? arrowHtml : '';
  }
  
  getHtml(){

 
      return `<li  ${this.classes} ${this.dataAttributes} >

      <img src="img/${this.img}" alt="">

      <p class="menu-item-p">${this.text}</p>

      ${this.arrow}

    </li>`

  }
}