import { ProgramWindo } from '../windos/ProgramWindo.js';
import { programConfigs } from '../content.js';

export function createProgramModalAndShow(program, instance, name,  onOpen, onClose){

  const programConfig = getProgramConfig(program, name);

  const programModal = new ProgramWindo( programConfig, instance, onOpen, onClose);

  show(programModal, programConfig.related);

  // helper
  function show(modal, related){
    modal.showDirect(`modal-${related}`);
  }
  
  // helper
  function getProgramConfig(program, name){
    // html should be in content.js/config
    const html = program.getHtml();
    const config = programConfigs[`${name}`];
    config.content = html;
    return config;
  }
  
}



