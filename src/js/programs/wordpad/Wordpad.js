/*
TODO - Open-Dialog/Save-Dialog class
*/

import { Windo } from '../../windos/Windo';
import wordpadImg from '../../../img/wordpad.ico';
import { programConfigs } from '../../content';
export class Wordpad{

  constructor(){
    this.state = {isEditingFile: false, fileName: '', fileContent: ''};
    
    this.cmdsTextDecoration = [
      {name: 'bold', icon:'../img/bold.svg'}, 
      {name: 'italic', icon:'../img/italic.svg'},
      {name: 'underline', icon:'../img/underline.svg'}
    ];
    
    this.cmdsTypeface = [
      {name: 'serif'},
      {name: 'sans-serif'},
      {name: 'arial'},
      {name: 'georgia'}
    ];
    
    this.cmdsFontSize = [
      {name: '1', show:'7'},
      {name: '2', show:'8'},
      {name: '3', show:'9'},
      {name: '4', show:'10'},
      {name: '5', show:'11'},
      {name: '6', show:'12'},
      {name: '7', show:'14'},
    ];

    this.cmdsTextAlign = [ 
      {name: 'justifyLeft', icon:'../img/left.svg'},
      {name: 'justifyCenter', icon:'../img/center.svg'},
      {name: 'justifyRight', icon:'../img/right.svg'}
    ];

  }

  init(file){
    
    if(file){
      this.state.fileName = file.name || '';
      this.state.fileContent = file.content || '';
      this.state.isEditingFile = true;
    }
   
    WordpadUI.initDecorationCmds(this.cmdsTextDecoration);
    WordpadUI.initAlignCmds(this.cmdsTextAlign);
    WordpadUI.initCmdsTypeface(this.cmdsTypeface);
    WordpadUI.initCmdsFontSize(this.cmdsFontSize);

    WordpadUI.listenCmdButtons();
    WordpadUI.listenFontFamily();
    WordpadUI.listenFontSize();

    WordpadUI.addPrintSaveOpenNewListeners(this);
  }

  getHtml(content){
    
    return `
    <div class="wordpad-wrap">
    <div class="wordpad-openDialog"></div>
    <div class="wordpad-saveDialog"></div>

    <div class="wordpad-inside-wrap">

      <div class="wordpad-topsection topsection">
          <span class="wordpad-menu">Edit</span>
          <span class="wordpad-menu">View</span>
          <span class="wordpad-menu">Help</span>
      </div>

    

      <div class="wordpad-middlesection">
        <div class="wordpad-buttons">
          <button class="wordpad-btn wordpad-newFile"></button>
          <button class="wordpad-btn wordpad-openFile"></button>
          <button class="wordpad-btn wordpad-printFile"></button>
          <button class="wordpad-btn wordpad-saveFile"></button>
        </div>
        <div class="wordpad-empty"></div>
      </div>

      <div class="wordpad-bottomsection">
        <div class="wordpad-fontfamily">
          <select name="font-family" id="" class="wordpad-fontfamily-select">
  
          </select>
        </div>
        <div class="wordpad-fontsize">
            <select name="font-size" id="" class="wordpad-fontsize-select">
            </select>
        </div>
        <div class="wordpad-textdecoration">
            <button class="wordpad-tool bold" data-cmd="bold">B</button>
        </div>
        <div class="wordpad-textalign"></div>
      </div>

    
      <div class="wordpad-textBox" contenteditable="true">
        ${content || ''} 
      </div>

      <div class="wordpad-feedback"></div>
    </div>
  </div>
    `;
  }

  handleSave(){
    const textBoxContent = document.querySelector('.wordpad-textBox').innerHTML;

    let myFiles = JSON.parse(localStorage.getItem('files')) || [];

    // If Editing file - quietly save - return
    if(this.state.isEditingFile){

      this.quietlySave(myFiles, textBoxContent);

      return;

    }

    const dialogFileWindoContent = WordpadUI.dialogFileWindoContent(myFiles);

    // Get config for save dialog Windo
    const saveConfig = programConfigs.Wordpad.saveDialogConfig();
    saveConfig.content = WordpadUI.saveDialogHtml( dialogFileWindoContent );
 
    // Save dialog Windo | with no min/max/x buttons
    new Windo(saveConfig, false);

    // Save-Dialog | Cancel Btn
    document.querySelector('.cancel-save-btn').addEventListener('click',()=> Windo.closeDirect('windo-document-saveDialog'))
  
    // Save-Dialog | Save Btn
    document.getElementById('saveForm').addEventListener('submit', (e) =>{
      e.preventDefault();

    // User Input
    const fileName =  document.getElementById('fileName').value;
      
      // VERY basic validation
      if( fileName === '' ) return;
      if( fileName.length > 255 ){
        alert('Windos 95 only saves file names up to 255 characters in length!');
        return;
      }

      // Save file
      myFiles.push( {name: fileName, content: textBoxContent} );
      localStorage.setItem('files', JSON.stringify(myFiles));

      // Close save dialog Windo
      Windo.closeDirect('windo-document-saveDialog');

      // File remains open after save
      this.state.isEditingFile = true;
      this.state.fileName = fileName;
    })
    
  }

  quietlySave(myFiles, textBoxContent){

    const fileToOverwrite = myFiles.filter( file => file.name === this.state.fileName )[0];

    fileToOverwrite.content = textBoxContent;

    localStorage.setItem('files', JSON.stringify(myFiles));

    // TODO | Show user feedback
    // document.querySelector('.wordpad-feedback').textContent = 'Saved';
  }

  handleOpen(){
    let myFiles = JSON.parse(localStorage.getItem('files')) || [];

    this.showOpenDialog(myFiles);
  }

  showOpenDialog(files){
    
    // Images and File names | for file window
    const dialogFileWindoContent = WordpadUI.dialogFileWindoContent(files);

    // Create new Windo | with no min/max/x buttons
    const openConfig = programConfigs.Wordpad.openDialogConfig();
    openConfig.content = WordpadUI.openDialogHtml( dialogFileWindoContent );

    // Open dialog Windo | with no min/max/x buttons
    new Windo(openConfig, false);

    // Open-Dialog | Cancel Btn
    document.querySelector('.cancel-open-btn').addEventListener('click',()=> Windo.closeDirect('windo-document-openDialog'))

    // Open-Dialog | Open file
    document.querySelectorAll(`.wordpad-open-file`).forEach(file => file.addEventListener('click', e => this.openTargetFile(e) ));
    
  }

  openTargetFile(e){

    // Find file in localStorage and show in textBoxContent
    const name = e.target.dataset.name;
    const textBoxContent = document.querySelector('.wordpad-textBox');
    let myFiles = JSON.parse(localStorage.getItem('files')) || [];
    let file = myFiles.filter(f => f.name === name )[0];

    textBoxContent.innerHTML = file.content;

    // Close Windo
    Windo.closeDirect('windo-document-openDialog');

    // set isEditing to true
    this.state.isEditingFile = true;
    this.state.fileName = file.name;
  }

  handleNewFile(){

    document.querySelector('.wordpad-textBox').innerHTML = '';

    // File is new, not saved
    this.state.isEditingFile = false;
    this.state.fileName = '';
  }

} // end Wordpad

// Need WordpadUI.dialogFileWindoContent() in content.js
export class WordpadUI{
  
  static initCmdsTypeface(cmdsTypeface){
    const selectInput = document.querySelector('.wordpad-fontfamily-select');

    cmdsTypeface.forEach(typeface => {

      let opt = `<option data-typeface=${typeface.name}>${typeface.name}</option`;

      selectInput.innerHTML += opt;

    })
  }
  // For Desktop Icon the_only_folder  | content.js
  static getDialogFileWindoContent(){
    let files = JSON.parse(localStorage.getItem('files')) || [];
    //return WordpadUI.dialogFileWindoContent( myFiles );
    let html = '';
    files.forEach(file => html += `<div class="wordpad-open-file-wrap" data-name="${file.name}">
    <img class="wordpad-open-file launch-program" data-launch-windo="windo-wordpad" data-launch="Wordpad" data-name="${file.name}" src=${wordpadImg} />
    <p class="wordpad-open-file" data-name="${file.name}" >${file.name}</p></div>`)
    
    return `<div class="folder-file-window">${html}</div>`
  
  }

  static dialogFileWindoContent(files){
    let html = '';
    files.forEach(file => html += `<div class="wordpad-open-file-wrap" data-name="${file.name}">
    <img class="wordpad-open-file" data-name="${file.name}" src=${wordpadImg} />
    <p class="wordpad-open-file" data-name="${file.name}" >${file.name}</p></div>`)
    
    return html;
  }


  static saveDialogHtml(content){

    return `
      <div class="wordpad-save-wrap">
        <div class="wordpad-dialog-explorer-wrap">
          <label>Save <span class="underline-first">in:</span></label>
          <input disabled type="text" value="the_only_folder" class="dialog-explorer-input" />
        </div>
        <div class="dialog-file-window">${content}</div>
        <form id="saveForm">
          <label>File <span class="underline-first">name:</span></label>
          <input type="text" id="fileName" />
          <input class="btn" type="submit" value="save" />
        </form>
        <button class=" btn cancel-save-btn">Cancel</button>
      </div>
    `;

  }

  static openDialogHtml(content){

    return `
      <div class="wordpad-open-wrap">
        <div class="wordpad-dialog-explorer-wrap">
          <label>Look <span class="underline-first">in:</span></label>
          <input disabled type="text" value="the_only_folder" class="dialog-explorer-input" />
        </div>
        <div class="dialog-file-window">${content}</div>
        <button class="btn cancel-open-btn">Cancel</button>
      </div>
    `;

  }


  static initCmdsFontSize(cmdsFontSize){
    const selectInput = document.querySelector('.wordpad-fontsize-select');

    cmdsFontSize.forEach(size => {
      let opt = `<option value="${size.name}" >${size.show}</option`;
      selectInput.innerHTML += opt;
    });
  }

  static initDecorationCmds(cmdsTextDecoration){
    const buttonArea = document.querySelector('.wordpad-textdecoration');

    const cmdButtons = cmdsTextDecoration.map(cmd => `<button class="cmd-btn cmd-${cmd.name} cmd-decorate" data-cmd="${cmd.name}"></button>`).join('');

    buttonArea.innerHTML = cmdButtons;
  }

  static initAlignCmds(cmdsTextAlign){
    const buttonArea = document.querySelector('.wordpad-textalign');
    const cmdButtons = cmdsTextAlign.map(cmd => `<button class="cmd-btn ${cmd.name} cmd-${cmd.name} cmd-align" data-cmd="${cmd.name}"></button>`).join('');

    buttonArea.innerHTML = cmdButtons;
  }

  static  doCmd(e){
    const cmd = e.target.dataset.cmd || e.target.parentElement.dataset.cmd;
    document.execCommand(cmd, false, '');
  }

  static changeFont(e){
    const val =  e.target.options[e.target.selectedIndex].value;
    document.execCommand('fontname', false, val);
  }

  static changeFontSize(e){
    const val =  e.target.options[e.target.selectedIndex].value;
    document.execCommand('fontsize', false, val);
  }

  static listenCmdButtons(){
    const btns = document.querySelectorAll('.cmd-btn')
    btns.forEach(btn => btn.addEventListener('click', e => WordpadUI.doCmd(e) ))
  }
  
  static listenFontFamily(){
    document.querySelector('.wordpad-fontfamily-select').addEventListener('change', e => WordpadUI.changeFont(e) );
  }
  
  static listenFontSize(){
    document.querySelector('.wordpad-fontsize-select').addEventListener('change', e => WordpadUI.changeFontSize(e) );
  }

  static handlePrint(){
    
    // See media query in wordpad.css
    window.print();

  }

  static addPrintSaveOpenNewListeners(pad){
    document.querySelector('.wordpad-printFile').addEventListener('click', () => WordpadUI.handlePrint());
  
    document.querySelector('.wordpad-saveFile').addEventListener('click', () => pad.handleSave() );
  
    document.querySelector('.wordpad-openFile').addEventListener('click', () => pad.handleOpen() );
  
    document.querySelector('.wordpad-newFile').addEventListener('click', () => pad.handleNewFile() );
  }

}

