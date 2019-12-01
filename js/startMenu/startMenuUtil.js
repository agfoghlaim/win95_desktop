/*
TODO - this works but the addPrograms/addDocuments is a mess, it's not DRY & StartBlock isn't used. Also menuLevels CSS should be defined in js.
I'm leaving it for now cause have a feeling things will have to change as more programs are added. Also I'm sick of the sight of it. 
*/

//import { StartBlock } from "./StartBlock.js";
import { StartItem } from "./StartItem.js";
import { myDocuments, programConfigs as programs } from '../content.js';

// TODO this function isn't very efficient
// Event Handler | main.js
export function toggleStartMenu(e){

  if( e.target.classList.contains('start-menu') ||
    e.target.classList.contains('menu-item') || 
    e.target.classList.contains('menu-item-p')){
    return;
  }

  const mainMenu = document.querySelector('.start-menu');
  const menus = document.querySelectorAll('.start-menu');
  if(e.target.classList.contains('start-btn')){
    mainMenu.classList.toggle('show');
  }else{
    menus.forEach(m=>m.classList.remove('show'));
  }
}


export function initStartMenu(){
  addDocumentsBlock();
  addPrograms();
}

function addDocumentsBlock( ){
  const docMenu = document.querySelector('.documents-item');
  const currentMenuLevel = docMenu.parentElement.dataset.menuLevel;
  const thisMenuLevelClass = `start-menu-${+currentMenuLevel+1}`;
  let docBlock = `<ul class="start-menu ${thisMenuLevelClass}">`;
  
  myDocuments.forEach( doc => {

    let classes = `class = "start-item start-${doc.classNameToOpen}"`;

    let dataAttributes = `data-modal-class="${doc.classNameToOpen}"`;

    let startItem = new StartItem(classes, dataAttributes, doc.img, doc.title, false);

    docBlock += startItem.getHtml();

  })
  docBlock += `</ul>`;
  docMenu.innerHTML += docBlock;
}

/*
If program[Program].startMenuParentClass is !false
Add start menu item for the program under parent li.startMenuParentClass
If parent li.startMenuParentClass already contains a <ul> for sub items, add here
Else create li.startMenuParentclass > ul, add here
*/
function addPrograms(){

  for (let [key, value] of Object.entries(programs)) {

    if( !value ) continue;
 
    if( !value['startMenuParentClass'] ) return;
   
      const menuItemParent = document.querySelector(`.${value['startMenuParentClass'] }`);
      const menuLevel = getThisMenuLevelClass(menuItemParent);

      // '.launch-program' launches when clicked | main.js & programUtil.js
      // '.start-item' - I forget what this is for but it's not just a class for CSS
      const classes ='class = "start-item launch-program"';

      // dataset.launchWindo - to prevent duplicate windos | programUtil.js
      // dataset.launch - name of program class constructor eg 'Tetris' | programUtil.js
      const dataAttributes = `data-launch-windo="${value.params.windoClassName}" data-launch="${key}"`;
      
      const childUl = {
        ul: checkIfAlreadyHasChildUl(menuItemParent),
        menuLevel: menuLevel
      }

      const startItem= new StartItem(classes, dataAttributes, value.params.img, key, false).getHtml();

      if( !childUl.ul ){
        
        const theStartItem = `<ul class="start-menu ${childUl.menuLevel}">${startItem}</ul>`;
        menuItemParent.insertAdjacentHTML( 'beforeend', theStartItem);
      }else{

        childUl.ul.insertAdjacentHTML('beforeend', startItem);
        menuItemParent.insertAdjacentElement('beforeend', childUl.ul);
      }
  }   
}

function getThisMenuLevelClass(parent){
  const currentMenuLevel = parent.parentElement.dataset.menuLevel;
  return `start-menu-${+currentMenuLevel+1}`;
}

function checkIfAlreadyHasChildUl(parent){
 
  if( !parent.hasChildNodes() ) return false;

  const children = Array.from(parent.childNodes);
    
  let m = children.filter( child => child.nodeName === 'UL');

  return m.length===1 ? m[0] : '';

}

