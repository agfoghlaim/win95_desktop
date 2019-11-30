/*

Drag/drop stuff is very messy. TODO Will tidy (and read all the e.dataTransfer stuff) when I'm sure the bugginess is all fixed.

*/
const FILEDRAG = {
  html: '',
  inProgress:false,
  droppedSafe:false
};

export class DesktopIcon{

  constructor(iconClass, dataModal, img, p, iconNo){
    this.iconClass = iconClass;
    this.dataModal = dataModal;
    this.img = img;
    this.p = p;

  }

  getHtml(i){
    return `
    <div  class="file ${this.iconClass}" data-modal="${this.dataModal}" data-modalno=${i}>

      <img draggable="true" class="desktop-icon-img" data-modal-class=${this.iconClass} src="img/${this.img}" alt="">
      <p class="item-p" id="${this.iconClass}">${this.p}</p>

    </div>`;
  }


  static addDragListners(){
  
    
    // NB .file-container is hardcoded
    const container = document.querySelector('.file-container');
    container.addEventListener('dragstart', e =>this.startFileDrag(e));
    container.addEventListener('dragend', e => this.endFileDrag(e)); 
    container.addEventListener('dragover', e => this.dragOver(e)); 
    container.addEventListener('drop', e => this.dropFile(e)); 
  }

  // show light outline of empty file spaces
  static showDropTargetOutline(){
    const emptySpaces = document.querySelectorAll('.emptySpace');
    emptySpaces.forEach(space=>space.classList.add('outline'));
  }

  static hideDropTargetOutline(){
    const spaces = document.querySelectorAll('.space');

    spaces.forEach(space => {
      if(space.classList.contains('outline')){
        space.classList.remove('outline');
      }
    });
  }

  // Drag Drop Files
  static startFileDrag(e){

    // // TIL Node.ELEMENT_NODE = 1, Node.TEXT_NODE	3
    if(e.target.nodeType !== 1) return;
    if(!e.target.classList.contains('desktop-icon-img')) return;

    this.showDropTargetOutline();

    FILEDRAG.html = '';
    FILEDRAG.inProgress=true;
    FILEDRAG.droppedSafe = false;
    
    let targetParent = e.target.parentElement.parentElement;
    if(targetParent.classList.contains('space')){
      FILEDRAG.html = e.target.parentElement.parentElement.innerHTML;
    }
  }

  static endFileDrag(e){
    e.preventDefault();

    if(FILEDRAG.droppedSafe !== true) return;
  
  
    let targetParent = e.target.parentElement.parentElement;
    if(!targetParent.classList.contains('space')) return;
    e.target.parentElement.parentElement.classList.replace("filledSpace", "emptySpace");
    e.target.parentElement.parentElement.innerHTML = '';
 
    this.hideDropTargetOutline();

    FILEDRAG.html = '';
    FILEDRAG.droppedSafe = false;
    FILEDRAG.inProgress=false;
  }

  static dragOver(e){
    e.preventDefault();
  }

  static dropFile(e){

    if(!FILEDRAG.inProgress) return;
    if(! e.target.classList.contains('emptySpace') ) return;
    if( FILEDRAG.html === '') return;
  
    e.target.innerHTML = FILEDRAG.html;
    e.target.classList.replace("emptySpace", "filledSpace");
    FILEDRAG.droppedSafe = true;
  }


}