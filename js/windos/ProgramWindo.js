const  LASTDROPCOORDINATES = {
  clientX: 0, clientY: 0
}


/*

- ProgramWindos are to wrap around 'Program' content. 
- They are removed from DOM when not showing

TODO - merge with Windo. Current ProgramWindo2 functionality will be to 'close' a 'program'. Windo functionality is to 'minimise'. These should be all one and available to DesktopIcons and Programs
*/

export class ProgramWindo {
  
  constructor(config, innerHtml){

  this.innerHtml = innerHtml;
  this.windoParent = config.windoParent;
  this.windoClassName = config.windoClassName;
  this.classNameToOpen = config.classNameToOpen;
  this.content = config.content;
  this.offset = config.offset;
  this.img = config.img;
  this.title = config.title;

  }

  getHtml(){
    return `
    <div draggable="true"  style="position:absolute; top:5rem; left:20rem; "class="modal show  ${this.windoClassName} modal-${this.windoClassName} ">
  
      <div draggable="true" class="bar" data-modalno="${this.windoClassName}">
        <div class="modal-info">
         
          <div class="modal-title">${this.windoClassName}</div>
        </div>
        <button data-windo-contents="${this.windoClassName}" data-program-title="${this.title}" class=" close-btn close-program-windo-btn close-btn-${this.windoClassName}">X</button>
      </div>
  
      <div class="modal-main">
      <div>${this.innerHtml}</div>
      </div>
  
    </div>`;
  }

  addToDOM(html){
    const windoParent = document.querySelector(`.${this.windoParent}`);
    windoParent.innerHTML += html;
    windoParent.prepend(`${html}`);
  }
 
  removeFromDOM(selector){
    const currentprogram = document.querySelector(`.modal-${this.related}`);
    currentprogram.parentNode.removeChild(currentprogram); 
  }

}