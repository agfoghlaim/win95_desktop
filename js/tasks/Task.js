// TODO - needs DRYin', too tired
export default class Task{
  constructor( config ){
    this.config = config;
    this.addToDOM();
    this.dispatchAppropiateListener();
  }

  // document config has .docId, program config does not
  dispatchAppropiateListener(){
    this.config.docId ?
      this.dispatchAddExplorerListener()
    : this.dispatchAddProgramListener()
  }

  // main.js is listening
  dispatchAddProgramListener(){
    const minimised = new Event('minimisedProgram');
    document.querySelector('.mid-taskbar').dispatchEvent(minimised);
  }

   // main.js is listening
   dispatchAddExplorerListener(){
    const minimised = new Event('minimisedExplorer');
    document.querySelector('.mid-taskbar').dispatchEvent(minimised);
  }
  
  addToDOM(){
    const html = this.getHtml();
    document.querySelector('.mid-taskbar').insertAdjacentHTML( 'beforeend', html );;
  }

  getHtml(){
    if(this.config.docId){
      return `
      <div class="task-item task-item-${this.config.classNameToOpen}" data-class-name="${this.config.classNameToOpen}" data-task-for-class="${this.config.classNameToOpen}" data-corresponding-windo="${this.config.windoClassName}">
      <button class="explorer-btn launchExplorer" data-class-name="${this.config.classNameToOpen}" >
      <img class="task-btn-icon" src="img/${this.config.img}">
      <span class="task-btn-text">${this.config.title}</span>
      
      </button>
  </div>`;
    }else{
      return `
      <div class="task-item task-item-${this.config.classNameToOpen}"   data-class-name="${this.config.classNameToOpen}" data-task-for-class="${this.config.windoClassName}" data-modal="${this.config.windoClassName}">
      <button class="launch-program explorer-btn" data-launch-windo="${this.config.windoClassName}" data-launch="${this.config.title}">${this.config.title}</button>
  </div>`;
    }

  }
}

