const  LASTDROPCOORDINATES = {
  clientX: 0, clientY: 0
}


/*
  config = {
    parent: ( String | Eg '.modal-container' | Where to put modal in DOM ),
    relatedParent: (String | Eg '.file-container' | add 'show' listener because innerHTML overwritten), 
    related: (String),// related file
    content: (String | html content), 
    offset: (Array | Eg [5,5] | Inital modal position),
    img: (String or bool | File name or false),
    title: (String | For top bar)
  }
*/
export class Windo{
    constructor(config){
    
      this.parent = config.parent;
      this.parentContainer = document.querySelector(`.${config.relatedParent}`);
      this.container = document.querySelector(`.${this.parent}`);
    
      this.related = config.related;
      this.content = config.content;
      this.title = config.title;
      this.img = config.img || false;
      this.iconHtml = this.getIconHtml();
      [this.top, this.left] = config.offset || [5, 5];
    this.init();
  }

  init(){
    this.addToDOM();
    this.addListenerToRelated();
    this.addListenerToItemInStartMenu();
  }

  getIconHtml(){
    if(this.img){
      return  `<img class="modal-icon" src="../img/${this.img}"/>`
    }
    return '';
  }

  getHTML(){
    return `
    <div draggable="true"  style="position:absolute;top:${this.top}rem; left:${this.left}rem; "class="modal modal-${this.related}">
  
      <div draggable="true" class="bar" data-modalno="${this.related}">
        <div class="modal-info">
          ${this.iconHtml}
          <div class="modal-title">${this.title}</div>
        </div>
        <button data-windo-contents="${this.related}" class="close-btn close-btn-${this.related}">X</button>
      </div>
  
      <div class="modal-main">
      <div>${this.content}</div>
      </div>
  
    </div>`;
  }

  addToDOM(){
    const html = this.getHTML();
    this.container.innerHTML += html;
  }

  /*
    TODO - addListenerToRelated() should NOT have to happen on window resize, there could be tonnes of listeners on the '.modal-container' when there only needs to be ~one.
  */ 
  addListenerToRelated(){
    this.parentContainer.addEventListener( 'click', e => this.show(e));
  }

  // TODO - check this
  addListenerToItemInStartMenu(){
    const startLink = document.querySelector(`.start-${this.related}`);

    if(!startLink) return;

    startLink.addEventListener( 'click', e => this.show(e));
  }

  // addCloseListener(){
  
  //     const related = this.related;

  //     // Hide Windo if 'X' clicked
  //     this.container.addEventListener('click',  function handleClose(e){

  //       if(!e.target.classList.contains(`close-btn-${related}`))return;
  
  //       document.querySelector(`.modal-${related}`).classList.remove('show');

  //     }, false);
  // }

  
  static addCloseListeners2(){
    const container = document.querySelector('.modal-container');

    container.addEventListener('click', e =>this.handleClose2(e));
  }

  static handleClose2(e){
   // console.log(e.target)

    if(!e.target.classList.contains(`close-btn`))return;
  
    e.target.parentElement.parentElement.classList.remove('show');

  }

  static addDragListeners(){
    const container = document.querySelector('.modal-container');
    document.addEventListener('dragstart', e =>this.dragModal(e));
    document.addEventListener('dragend', e => this.dropModal(e)); 

    /* problem with Firefox, can't get mouse positions from dragend event, see here https://bugzilla.mozilla.org/show_bug.cgi?id=505521 */
    document.addEventListener('drop', e =>this.saveMouseCoordinatesAfterEveryDrop(e));
  }

  show(e){
   
    // data-modal-class should be the class of the modal to show
    // ie. <button data-modal-class="whatever">  shows <modal modalno="whatever">
   
    if(e.target.dataset.modalClass !== `${this.related}`
    && e.target.parentElement.dataset.modalClass !== `${this.related}`) return;
    
    document.querySelector(`.modal-${this.related}`)
    .classList.add('show');
  }

  // show whatever modal corresponds to class passed
  static showDirect(modalClass){
    const modal = document.querySelector(`.${modalClass}`);
    if(modal){
      document.querySelector(`.${modalClass}`)
      .classList.add('show');
    }
  }

  static dragModal(e){
    
    if(e.target.nodeType !== 1) return;
    if(!e.target.classList.contains('bar')) return;

    e.dataTransfer.setData('text/plain', null);
    const img = new Image(); 
    img.src = 'img/programs.ico'; 
    e.dataTransfer.setDragImage(img, 10, 10);
  }

  static dropModal(e){
    e.preventDefault();
    if(e.target.nodeType !== 1) return;
    if(!e.target.classList.contains('bar')) return;
  
    const modalNo = e.target.dataset.modalno;
    // console.log(modalNo, `.modal-${modalNo}`)
    const modal = document.querySelector(`.modal-${modalNo}`);
  
    // e.clientX, e.clientY not available in Firefox - use LASTDROPCOORDINATES 
    modal.style.top = `${LASTDROPCOORDINATES.clientY}px`;
    modal.style.left = `${LASTDROPCOORDINATES.clientX}px`;
  }

  static saveMouseCoordinatesAfterEveryDrop(e){
    e.preventDefault();
    LASTDROPCOORDINATES.clientX = e.clientX;
    LASTDROPCOORDINATES.clientY = e.clientY;
  }

}




