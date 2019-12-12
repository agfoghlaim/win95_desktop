import { WordpadUI } from './Wordpad';
import { createElement } from 'react';
export function addDeleteFileListener(){

  document.querySelectorAll('.wordpad-open-file-wrap').forEach( icon => {
    icon.addEventListener('contextmenu', (e) =>{

    e.preventDefault();

    if(!e.target.classList.contains('wordpad-open-file') && !e.target.parentElement.classList.contains('wordpad-open-file-wrap')){
      return;
    }
    
    // Add context event
    addContextToDOM(e);
    addDeleteListener(e);

  })});

}

function addDeleteListener(ev){

    // Click on 'delete'
    document.getElementById(`delete-${ev.target.dataset.name}`)
    .addEventListener('click', function remove(e){
 

      // Remove file icon | target data-delete should === icon data-name
      
      const targetDelete = e.target.dataset.delete;

      // get all file icons
      const fileIcons = document.querySelectorAll('.wordpad-open-file-wrap');

      // Filter for one to remove
      const fileIconToDelete = Array.from(fileIcons).filter(icon => icon.dataset.name === targetDelete)[0]
      
      // Remove
      fileIconToDelete.parentElement.removeChild(fileIconToDelete)
       
      // delete file
      let files = JSON.parse(localStorage.getItem('files'));
      files = files.filter(file => file.name !== e.target.dataset.delete );
      localStorage.setItem('files', JSON.stringify(files));
    
    });
}
function addContextToDOM(e){
  const div = document.createElement('div');
  const p = document.createElement('p');

  if(document.getElementById(`delete-${e.target.dataset.name}`)){
    console.log("GOOD >.................")
    return;
  }
  p.id = `delete-${e.target.dataset.name}`;
  p.className='delete-context'
  p.dataset.delete= `${e.target.dataset.name}`;
  p.appendChild( document.createTextNode('delete'));
  p.style="display:block;";
  div.id= `delete-wrap-${e.target.dataset.name}`;
  div.className = 'delete-context-wrap';


  div.appendChild(p);
  document.querySelector(`[data-name="${e.target.dataset.name}"]`).appendChild(div);

}