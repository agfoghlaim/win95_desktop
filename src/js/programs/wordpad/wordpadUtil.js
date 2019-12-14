export function addDeleteFileListener() {

  document.querySelectorAll('.wordpad-open-file-wrap').forEach( icon => {

    icon.addEventListener('contextmenu', handleContext )});

}

function handleContext(e) {
    e.preventDefault();

    if(!e.target.classList.contains('wordpad-open-file') && !e.target.parentElement.classList.contains('wordpad-open-file-wrap')) return;
    
    
    addContextMenuToDOM(e);
    addDeleteFileListenerToContextMenu(e);
}

function addDeleteFileListenerToContextMenu(ev) {

  // Click on 'Delete'
  document.getElementById(`delete-${ev.target.dataset.name}`)
  .addEventListener('click', deleteFile );
}

function deleteFile(e) {

    // Remove file icon | target data-delete should === icon data-name
    const targetDelete = e.target.dataset.delete;

    const allFileIcons = document.querySelectorAll('.wordpad-open-file-wrap');

    const fileIconToDelete = Array.from(allFileIcons).filter(icon => icon.dataset.name === targetDelete)[0];
    
    // Remove Icon
    fileIconToDelete.parentElement.removeChild(fileIconToDelete)
     
    // Delete file
    let files = JSON.parse(localStorage.getItem('files'));
    files = files.filter(file => file.name !== e.target.dataset.delete );
    localStorage.setItem('files', JSON.stringify(files));

}


function addContextMenuToDOM(e) {
  const div = document.createElement('div');
  const p = document.createElement('p');

  if(document.getElementById(`delete-${e.target.dataset.name}`)) return;
  
  p.id = `delete-${e.target.dataset.name}`;
  p.className='delete-context'
  p.dataset.delete= `${e.target.dataset.name}`;
  p.appendChild( document.createTextNode('Delete'));
  p.style="display:block;";

  div.id= `delete-wrap-${e.target.dataset.name}`;
  div.className = 'delete-context-wrap';


  div.appendChild(p);
  document.querySelector(`[data-name="${e.target.dataset.name}"]`).appendChild(div);

}