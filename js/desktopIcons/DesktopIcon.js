const FILEDRAG = {
  html: '',
  inProgress:true,
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
    <div draggable="true" class="file ${this.iconClass}" data-modal="${this.dataModal}" data-modalno=${i}>

      <img data-modal-class=${this.iconClass} src="img/${this.img}" alt="">
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
    this.showDropTargetOutline();
  
    FILEDRAG.html = '';
    FILEDRAG.inProgress=true;
    if(e.target.matches('img')){
      FILEDRAG.droppedSafe = false;
      FILEDRAG.html = e.target.parentElement.parentElement.innerHTML;
    }
  }

  static endFileDrag(e){
    e.preventDefault();

    if(FILEDRAG.droppedSafe === true){
     
      e.target.parentElement.parentElement.classList.replace("filledSpace", "emptySpace");
      FILEDRAG.inProgress=false;
      e.target.parentElement.parentElement.innerHTML = '';	
    }

    this.hideDropTargetOutline();
  }

  static dragOver(e){
    e.preventDefault();
  }

  static dropFile(e){
    
    if(!FILEDRAG.inProgress){
      return;
    }

    if(e.target.classList.contains('emptySpace') && FILEDRAG.html !== ''){
      e.target.innerHTML = FILEDRAG.html;
      e.target.classList.replace("emptySpace", "filledSpace");
      FILEDRAG.droppedSafe = true;
    }
    e.preventDefault();
  }


}