// Would make more sense for these to be in desktopIconUtil. Since there are only Wordpad files I'm leaving them here for now.

export function addContextMenuFileListeners() {
	document
		.querySelectorAll('.wordpad-open-file-wrap')

		.forEach((icon) => icon.addEventListener('contextmenu', handleContextMenu));
}

// Event Handler | main.js
export function clickAnywhereToCloseContextMenu(e) {
	if (!document.querySelector('.context-menu-wrap')) return;

	// TODO - should use .context-menu-wrap and children
	if (
		e.target.classList.contains('delete-context') ||
		e.target.classList.contains('context-menu-wrap')
	)
		return;

	// Remove all context menus onclick  (allow multiple opened)
	const contextMenus = document.querySelectorAll('.context-menu-wrap');
	contextMenus.forEach((menu) => menu.parentElement.removeChild(menu));
}

function handleContextMenu(e) {
	e.preventDefault();

	if (
		!e.target.classList.contains('wordpad-open-file') &&
		!e.target.parentElement.classList.contains('wordpad-open-file-wrap')
	)
		return;

	addContextMenuToDOM(e);
	addTaskListenersToContextMenu(e);
}

function addTaskListenersToContextMenu(ev) {
	// Click on 'Delete'
	document
		.getElementById(`delete-${ev.target.dataset.name}`)
		.addEventListener('click', deleteFile);

	// Click on 'Rename'
	document
		.getElementById(`rename-${ev.target.dataset.name}`)
		.addEventListener('click', makeIconEditable);
}

function deleteFile(e) {
	// Remove file icon | target data-delete should === icon data-name
	const allFileIcons = document.querySelectorAll('.wordpad-open-file-wrap');
	const targetDelete = e.target.dataset.delete;

	const fileIconToDelete = Array.from(allFileIcons).filter(
		(icon) => icon.dataset.name === targetDelete
	);

	if (fileIconToDelete.length !== 1) return;

	fileIconToDelete[0].parentElement.removeChild(fileIconToDelete[0]);

	// Delete file
	let files = JSON.parse(localStorage.getItem('files')) || [];
	files = files.filter((file) => file.name !== e.target.dataset.delete);
	localStorage.setItem('files', JSON.stringify(files));
}

function makeIconEditable(e) {
	const icons = document.querySelectorAll('.wordpad-open-file-p');

	// New Dec 2021 make it so only one can be editable at a time
	icons.forEach((icon) => (icon.contentEditable = 'false'));
	const targetRename = e.target.dataset.rename;
	const targetIcon = Array.from(icons).filter(
		(icon) => icon.dataset.name === targetRename
	);

	if (targetIcon.length !== 1) return;

	targetIcon[0].contentEditable = 'true';

	// Listen for click - then rename
	document
		.querySelector('.folder-file-window')
		.addEventListener('click', renameFiles);
}

function renameFiles() {
	const icons = document.querySelectorAll('.wordpad-open-file-p'); // file names
	const files = JSON.parse(localStorage.getItem('files')) || [];

	// renamedIcons is always length 1?
	const renamedIcons = Array.from(icons).filter(
		(icon) => icon.contentEditable === 'true'
	);
	if (renamedIcons.length <= 0) return;
	const icon = renamedIcons[0];
	selectText(icon);
	let renamedFile = files.filter((file) => file.name === icon.dataset.name);

	if (renamedFile.length !== 1) return;
	const ogTextContent = renamedFile[0].name;

	addListeners();

	// part of renameFiles()
	function addListeners() {
		// Handle pressing 'return' or 'tab' during file rename.
		icon.addEventListener('keydown', handleRenameKeydown, false);

		// Handle clicking anywhere during file rename.
		icon.addEventListener('blur', handleRenameBlur, false);
	}
	// part of renameFiles()
	function removeListeners() {
		icon.removeEventListener('keydown', handleRenameKeydown, false);
		icon.removeEventListener('blur', handleRenameBlur, false);
	}
	// part of renameFiles()
	function selectText(el) {
		const range = document.createRange();
		range.selectNodeContents(el);
		const selectedText = window.getSelection();
		selectedText.removeAllRanges();
		selectedText.addRange(range);
	}
	// part of renameFiles()
	function handleRenameKeydown(e) {
		if (e.key !== 'Enter' && e.key !== 'Tab') {
			return;
		}
		e.preventDefault();
		if (icon.textContent.length > 0) {
			renamedFile[0].name = icon.textContent;
			localStorage.setItem('files', JSON.stringify(files));
		} else {
			icon.textContent = ogTextContent;
		}

		icon.previousElementSibling.focus();
		icon.contentEditable = 'false';
		removeListeners();
	}
	// part of renameFiles()
	function handleRenameBlur(e) {
		e.preventDefault();
		if (icon.textContent.length > 0) {
			renamedFile[0].name = icon.textContent;
			localStorage.setItem('files', JSON.stringify(files));
		} else {
			icon.textContent = ogTextContent;
		}

		icon.previousElementSibling.focus();
		icon.contentEditable = 'false';
		removeListeners();
	}
}

function addContextMenuToDOM(e) {
	const contextWrapDiv = document.createElement('div');

	// Check this icon's context menu doesn't already exist
	if (document.getElementById(`delete-${e.target.dataset.name}`)) return;

	const deleteItem = makeItem('delete', e.target.dataset.name, 'Delete');
	const renameItem = makeItem('rename', e.target.dataset.name, 'Rename');

	contextWrapDiv.id = `context-menu-wrap-${e.target.dataset.name}`;
	contextWrapDiv.className = 'context-menu-wrap';

	contextWrapDiv.appendChild(deleteItem);
	contextWrapDiv.appendChild(renameItem);

	document
		.querySelector(`[data-name="${e.target.dataset.name}"]`)
		.appendChild(contextWrapDiv);
}

function makeItem(task, targetName, itemName) {
	const item = document.createElement('p');

	item.id = `${task}-${targetName}`;
	item.className = `${task}-context context-menu-item`;
	item.dataset[`${task}`] = `${targetName}`;
	item.appendChild(document.createTextNode(`${itemName}`));
	item.style = 'display:block;';

	return item;
}
