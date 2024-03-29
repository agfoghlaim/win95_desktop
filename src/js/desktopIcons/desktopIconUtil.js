import { Windo } from '../windos/Windo.js';
import { myDocuments } from '../content.js';
import { DesktopIcon } from './DesktopIcon.js';

export function initDesktopIcons() {
	help().createFileSpacesAndAddToDOM();
	help().createDesktopIconsAndAddToDOM();

	// Listener to launch Explorer Windo | happens on init, resize & dragend
	addLaunchExplorerListener();
}

// Called above in init | also in main.js after 'dragend' events
export function addLaunchExplorerListener() {
	document
		.querySelectorAll('.launchExplorer')
		.forEach((el) => el.addEventListener('click', launchExplorer));
}

// Event Handler | click '.desktop-icon-img' | main.js
function launchExplorer(e) {
	if (help().shouldReturn(e)) return;

	const classNameToOpen = help().classNameToOpen(e);

	if (help().alreadyExists(classNameToOpen)) return;

	const relevantDocConfig = help().getDocConfig(classNameToOpen);

	if (relevantDocConfig.length !== 1) return;

	// Currently this is only for 'the_only_folder'
	// Call getContent everytime it is opened so that file icons represent the latest from localStorage
	if (typeof relevantDocConfig[0].getContent === 'function') {
		let content = relevantDocConfig[0].getContent();
		relevantDocConfig[0].content = content();
	}

	const win = new Windo(relevantDocConfig[0]);

	// New Dec 2021.
	win.manageFocus();

	// Add Listener to REMOVE Windo (Explorer)
	help().addListenForCloseWindo();

	// check config.broadcastEvent(the_only_folder needs listener to launch wordpad from the desktop)
	// main.js listens | re-adds launch-program listeners
	if (relevantDocConfig[0].broadcastEvent) {
		// Dispatch event | main.js listening
		dispatchtheOnlyFolderOpened(relevantDocConfig[0].broadcastEvent);

		function dispatchtheOnlyFolderOpened(eventName) {
			const event = new Event(eventName);
			document.dispatchEvent(event);
		}
	}
}

// Event Handler | click '.close-btn-explorer' | help()
function closeExplorerWindo(e) {
	const windowToClose = e.target.dataset.windoContents;

	// Remove from DOM | (kill Windo)
	const windoToRemove = document.querySelector(`.windo-${windowToClose}`);
	windoToRemove.parentNode.removeChild(windoToRemove);

	// Dispatch 'exploredClosed' | main.js listening | will remove taskbar item
	dispatchExplorerClosedEvent(windowToClose);
}

function dispatchExplorerClosedEvent(windowToClose) {
	const explorerClosed = new CustomEvent('explorerClosed', {
		detail: windowToClose,
	});
	document.querySelector('.mid-taskbar').dispatchEvent(explorerClosed);
}

function help() {
	return {
		shouldReturn: function (e) {
			if (
				!e.target.classList.contains('launchExplorer') &&
				!e.target.parentElement.classList.contains('launchExplorer')
			) {
			
				return true;
			} else {
			
				return false;
			}
		},
		classNameToOpen: function (e) {
			return (
				e.target.dataset.className || e.target.parentElement.dataset.className
			);
		},
		alreadyExists: function (classNameToOpen) {
			if (document.querySelector(`.windo-${classNameToOpen}`)) {
				Windo.showDirect(`windo-${classNameToOpen}`);
				return true;
			} else {
				return false;
			}
		},
		getDocConfig: function (classNameToOpen) {
			return myDocuments.filter(
				(doc) => doc.classNameToOpen === classNameToOpen
			);
		},
		getNumFileSpaces: function () {
			// TODO check for tiny screens - not enough space for all files case
			const minWidth = 150;
			const minHeight = 200;
			const numSpaces =
				(window.innerWidth / minWidth) * (window.innerHeight / minHeight);
			return Math.round(numSpaces);
		},
		addSpacesToDOM: function (filesContainer, noFileSpaces) {
			filesContainer.innerHTML = ``;

			for (let i = 0; i < noFileSpaces; i++) {
				filesContainer.innerHTML += `<div class="space space-${i} emptySpace"></div>`;
			}
		},
		addIconToDOM: function (i, dtIcon) {
			const spaces = document.querySelectorAll('.space');
			spaces[i].classList.replace('emptySpace', 'filledSpace');
			spaces[i].innerHTML = dtIcon.getHtml(i);
		},
		createDesktopIconsAndAddToDOM: function () {
			myDocuments.forEach((icon, i) => {
				const dtIcon = new DesktopIcon(icon);
				this.addIconToDOM(i, dtIcon);
			});
		},
		createFileSpacesAndAddToDOM: function () {
			const filesContainer = document.querySelector('.desktop-container');
			const noFileSpaces = help().getNumFileSpaces();

			this.addSpacesToDOM(filesContainer, noFileSpaces);
		},
		addListenForCloseWindo: function () {
			document
				.querySelectorAll('.close-btn-explorer')
				.forEach((el) => el.addEventListener('click', closeExplorerWindo));
		},
	};
}
