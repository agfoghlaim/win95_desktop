const  LASTDROPCOORDINATES = {
  clientX: 0, clientY: 0
}

export class Windo{
    constructor(config){
  
   
      this.windoParent = config.windoParent; // yes
      this.classNameToOpen = config.classNameToOpen; //yes
      this.content = config.content; //yes
      this.title = config.title; //yes
      this.img = config.img || false; //yes
      [this.top, this.left] = config.offset || [5, 5]; //yes
      this.windoClassName = config.windoClassName; //yes

      this.iconHtml = this.getIconHtml(); // can be
      //this.parentContainer = document.querySelector(`.${config.docParent}`); //no
     
    this.init();
  }


  init(){
    this.addToDOM();
   //this.addOpenDocumentListeners();
  }

  getIconHtml(){
    if(this.img){
      return  `<img class="modal-icon" src="../img/${this.img}"/>`
    }
    return '';
  }

  getHTML(){
    return `
    <div draggable="true"  style="position:absolute;top:${this.top}rem; left:${this.left}rem; "class="windo show modal-${this.classNameToOpen}">
  
      <div draggable="true" class="bar" data-modalno="${this.classNameToOpen}">
        <div class="windo-info">
          ${this.iconHtml}
          <div class="windo-title">${this.title}</div>
        </div>
        <button data-windo-contents="${this.classNameToOpen}" class="mini-btn mini-btn-${this.classNameToOpen}">-</button>

        <button data-windo-contents="${this.classNameToOpen}" class="maxi-btn maxi-btn-${this.classNameToOpen}">
          <div class="maxi-square"></div>
        </button>

        <button data-windo-contents="${this.classNameToOpen}" class="close-btn-explorer close-btn-explorer-${this.classNameToOpen}">X</button>
        
      </div>
  
      <div class="windo-main">
      <div>${this.content}</div>
      </div>
  
    </div>`;
  }

  addToDOM(html = this.getHTML() ){
 
    const windoParent = document.querySelector(`.${this.windoParent}`);
  
    windoParent.innerHTML += html;

    this.addMinimiseListeners();
    
  }

  // Listen to all start-{classname}, works for desktop icons and start menu
  // will be Program maximise
  // moved to desktopIconUtil.js
  // addOpenDocumentListeners(){
  //   const startLinks = document.querySelectorAll(`.start-${this.classNameToOpen}`);

  //   if(!startLinks) return;

  //   startLinks.forEach(link => link.addEventListener( 'click', e => this.show(e)))
  // }
  
  // Listen to .mini-btn | see this.addToDOM
  
  addMinimiseListeners(){

    const miniBtns = document.querySelectorAll(`.mini-btn`)

    miniBtns.forEach( miniBtn => miniBtn.addEventListener('click', e => this.handleMinimise(e) ));
    
  }

  handleMinimise(e){
  
  if(!e.target.classList.contains(`mini-btn`)) return;

  document.querySelector(`.modal-${e.target.dataset.windoContents}`)

  .classList.remove('show');

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
 
    if(e.target.dataset.modalClass !== `${this.classNameToOpen}`
    && e.target.parentElement.dataset.modalClass !== `${this.classNameToOpen}`) return;
    
    document.querySelector(`.modal-${this.classNameToOpen}`)
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




