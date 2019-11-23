const  LASTDROPCOORDINATES = {
  clientX:0, clientY: 0
}
export  class Modal{

  // config = {
  //   parent, 
  //   related, 
  //   content, 
  //   offset:[0,0]
  // }

  // parent = '.modal-container', where to put modal
  // relatedParent = '.file-container', add 'show' listener because innerHTML overwritten
  // related = click this to open modal
  
  constructor(parent, relatedParent, related, content, offset){

    this.parent = parent;
    this.parentContainer = document.querySelector(`.${relatedParent}`);
    this.container = document.querySelector(`.${this.parent}`);
    this.related = related;
    this.content = content;
    [this.top, this.left] = offset || [5, 5];

    this.init();
  }

  init(){
    this.addToDOM();
    this.addListenerToRelated();
    this.addCloseListener();
  }

  static addListeners(){
    const container = document.querySelector('.modal-container');
    container.addEventListener('dragstart', e =>this.dragModal(e));
    container.addEventListener('dragend', e => this.dropModal(e)); 

    /* problem with Firefox, can't get mouse positions from dragend event, see here https://bugzilla.mozilla.org/show_bug.cgi?id=505521 */
    document.addEventListener('drop', e =>this.saveMouseCoordinatesAfterEveryDrop(e));
  }

  getHTML(){
    return `
    <div draggable="true"  style="position:absolute;top:${this.top}rem; left:${this.left}rem; "class="modal modal-${this.related}">
  
      <div draggable="true"   class="bar" data-modalno=${this.related}>
        <button class="close-btn close-btn-${this.related}">X</button>
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

  addListenerToRelated(){
    console.log("adding to parent ", this.parentContainer)
    this.parentContainer.addEventListener( 'click', (e) => this.show(e));
  }

  addCloseListener(){
      this.container.addEventListener('click', (e)=>this.close(e))
  }

  show(e){
    // data-modal-class should be the class of the modal to show
    // ie. <button data-modal-class="whatever">  shows <modal modalno="whatever">
    if(e.target.dataset.modalClass !== `${this.related}`) return;

    document.querySelector(`.modal-${this.related}`)
    .classList.add('show');
    
  }

  // show whatever modal corresponds to class passed
  showDirect(modalClass){
  
    if(modalClass){
      document.querySelector(`.${modalClass}`)
      .classList.add('show');
    }
  }

  close(e){
    if(!e.target.classList.contains(`close-btn-${this.related}`)) return;

    // if tetris modal is closing, dispatch event to stop it running in the background
    if(e.target.classList.contains('close-btn-menu-tetris')){
      const closeTetris = new Event('tetrisClosed');
      e.target.dispatchEvent(closeTetris);
    }

    document.querySelector(`.modal-${this.related}`).classList.remove('show');

  }

  static dragModal(e){
    if(!e.target.classList.contains('bar')) return;

    e.dataTransfer.setData('text/plain', null);
    const img = new Image(); 
    img.src = 'img/programs.ico'; 
    e.dataTransfer.setDragImage(img, 10, 10);
  }

  static dropModal(e){
    e.preventDefault();
   
    if(!e.target.classList.contains('bar')) return;
  
    const modalNo = e.target.dataset.modalno;
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