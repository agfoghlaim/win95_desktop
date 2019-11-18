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

  constructor(parent, relatedParent, related, content, offset, draggable = false){

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

  make(){

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
    const html = this.make();
    this.container.innerHTML += html;
  }

  addListenerToRelated(){
 
    this.parentContainer.addEventListener( 'click', (e) => this.show(e));
  }

  addCloseListener(){
      this.container.addEventListener('click', (e)=>this.close(e))
  }




  show(e){
  // data-modal-class should be the class of the modal to show
  if(e.target.dataset.modalClass !== `${this.related}`) return;

    document.querySelector(`.modal-${this.related}`)
    .classList.add('show');
  
  }

  close(e){
    if(!e.target.classList.contains(`close-btn-${this.related}`)) return;
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