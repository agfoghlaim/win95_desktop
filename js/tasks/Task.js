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
    document.querySelector('.mid-taskbar').innerHTML += this.getHtml();
  }

  getHtml(){
    if(this.config.docId){
      return `
      <div class="task-item task-item-${this.config.classNameToOpen} launchExplorer"   data-modal-class="${this.config.classNameToOpen}" data-task-for-class="${this.config.classNameToOpen}" data-modal="${this.config.windoClassName}">
      <button class="explorer-btn">${this.config.title}</button>
  </div>
      `;
    }else{
      return `
      <div class="task-item task-item-${this.config.classNameToOpen} launchExplorer"   data-modal-class="${this.config.classNameToOpen}" data-task-for-class="${this.config.windoClassName}" data-modal="${this.config.windoClassName}">
      <button class="launch-program explorer-btn" data-launch-windo="${this.config.windoClassName}" data-launch="${this.config.title}">${this.config.title}</button>
  </div>
      `;
    }

  }
}

