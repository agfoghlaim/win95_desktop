import Task from './Task.js';
import { myDocuments, programConfigs} from '../content.js';

export function handleInitTask(clue){

  // =file-1 | classNameToOpen
  // =windo-datetimeui | windoClassName
  const config = getConfig(clue);

  new Task(config);
}

// programUtil.js dispatchs 'programClosed' event | main.js calls removeTaskItemOnClose()
// desktopIconUtil.js dispatchs 'explorerClosed' event | main.js calls removeTaskItemOnClose()
export function removeTaskItemOnClose(e){
  const toRemove = document.querySelector(`[data-task-for-class=${e.detail}]`);
  if(!toRemove) return;
  toRemove.parentElement.removeChild(toRemove);

}


// This is a horrible, look up if clue param from Windo.handleMinimised refers to a Program or a Desktop Icon
// Get the right config (by brute force) and return it. 
function getConfig(clue){

  if(clue.substring(0,8)=== 'document'){
    return myDocuments.filter( doc => doc.classNameToOpen === clue)[0];
  }else{
    let array = [];
    Object.keys(programConfigs).forEach((key,index) => {
      if(programConfigs[`${key}`] && programConfigs[`${key}`][`params`]){
        array.push(programConfigs[`${key}`][`params`])
        array = array.filter(a => a.windoClassName === clue );
      }
    });
    return array[0];
  }
}