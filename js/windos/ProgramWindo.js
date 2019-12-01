import { Windo } from './Windo.js'

/*

- ProgramWindos are to wrap around 'Program' content. 
- getHtml() really should e the same as parent Windo version but the differences are so tedious I'm leaving it for now.

- = ABOUT EMPTY INIT FUNCTION =
- Windo.addToDOM() for ProgramWindos is called in programUtil.js
- Windo.addOpenDocumentListeners() is for documents in the start menu so doesn't apply to WindoProgram

*/

export class ProgramWindo extends Windo{
  
  constructor( config ){
    super(config);
    this.init();
  }

  init(){}

  getHtml(){
    return `
    <div draggable="true"  style="position:absolute; top:${this.top}rem; left:${this.left}rem; "class="windo show  ${this.windoClassName} modal-${this.windoClassName} ">
  
      <div draggable="true" class="bar" data-modalno="${this.windoClassName}">
        <div class="windo-info">
         
          <div class="windo-title">${this.windoClassName}</div>
        </div>

        <button data-windo-contents="${this.windoClassName}" class="mini-btn mini-btn-${this.classNameToOpen}">-</button>

        <button data-windo-contents="${this.windoClassName}" class="maxi-btn maxi-btn-${this.windoClassName}">
          <div class="maxi-square"></div>
        </button>

        <button data-windo-contents="${this.windoClassName}" data-program-title="${this.title}" class=" close-btn close-program-windo-btn close-btn-${this.windoClassName}">X</button>
      </div>
  
      <div class="windo-main">
      <div>${this.content}</div>
      </div>
  
    </div>`;
  }

}