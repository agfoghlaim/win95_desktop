import { handleInitTask } from '../tasks/taskUtil.js';

const LASTDROPCOORDINATES = {
	clientX: 0,
	clientY: 0,
};

export class Windo {
	constructor(config, showXMinMaxBtns = true) {
		this.showXMinMaxBtns = showXMinMaxBtns;
		this.windoParent = config.windoParent;
		this.classNameToOpen = config.classNameToOpen;
		this.content = config.content;
		this.title = config.title;
		this.img = config.img || false;
		[this.top, this.left] = config.offset || [5, 5];
		this.windoClassName = config.windoClassName;

		this.iconHtml = this.getIconHtml();

		this.xMinMaxBtnsHtml = this.xMinMaxBtns();

		this.init();
	}

	init() {
		this.addToDOM();
		//this.addOpenDocumentListeners();
	}

	getIconHtml() {
		if (this.img) return `<img class="modal-icon" src="${this.img}"/>`;
		return '';
	}

	xMinMaxBtns() {
		return `
      <button data-windo-contents="${this.classNameToOpen}" class="mini-btn mini-btn-${this.classNameToOpen}">-</button>

      <button data-windo-contents="${this.classNameToOpen}" class="maxi-btn maxi-btn-${this.classNameToOpen}">
        <div class="maxi-square"></div>
      </button>

      <button data-windo-contents="${this.classNameToOpen}" class="close-btn-explorer close-btn-explorer-${this.classNameToOpen}">X</button>
      `;
	}
	getHTML() {
		return `
    <div draggable="false" style="position:absolute;top:${this.top}rem; left:${this.left}rem; "class="windo show windo-${this.classNameToOpen} ${this.windoClassName}">
  
      <div draggable="true" class="bar" data-corresponding-classname="${this.classNameToOpen}">
        <div class="windo-info">
          ${this.iconHtml}
          <div class="windo-title">${this.title}</div>
        </div>
        ${this.xMinMaxBtnsHtml}
      </div>
      <div class="windo-main">
      ${this.content}
      </div>
      <div data-corresponding-classname="${this.windoClassName}" class="${this.windoClassName}-resize-handle resize-handle"></div>
    </div>`;
	}

	addToDOM(html = this.getHTML()) {
		const windoParent = document.querySelector(`.${this.windoParent}`);

		windoParent.innerHTML += html;

		this.addMinimiseListeners();
		this.addMaximiseListeners();
	}

	// called above in addToDom()
	addMinimiseListeners() {
		const miniBtns = document.querySelectorAll(`.mini-btn`);

		miniBtns.forEach((miniBtn) =>
			miniBtn.addEventListener('click', (e) => this.handleMinimise(e))
		);
	}

	addMaximiseListeners() {
		const maxiBtns = document.querySelectorAll(`.maxi-btn`);

		maxiBtns.forEach((maxiBtn) =>
			maxiBtn.addEventListener('click', (e) => this.handleMaximise(e))
		);
	}

	handleMinimise(e) {
		if (!e.target.classList.contains(`mini-btn`)) return;

		document
			.querySelector(`.windo-${e.target.dataset.windoContents}`)

			.classList.remove('show');

		// Create taskItem if it doesn't exist
		if (
			!document.querySelector(`.task-item-${e.target.dataset.windoContents}`) &&
			!document.querySelector(
				`[data-task-for-class=${e.target.dataset.windoContents}]`
			)
		) {
			handleInitTask(e.target.dataset.windoContents);
		}
	}

	handleMaximise(e) {
		if (
			!e.target.classList.contains(`maxi-btn`) &&
			!e.target.parentElement.classList.contains(`maxi-btn`)
		)
			return;

		let selector =
			e.target.dataset.windoContents ||
			e.target.parentElement.dataset.windoContents;

		if (!selector) return;

		const windo = document.querySelector(`.windo-${selector}`);
		windo.style.width = '90vw';
		windo.style.height = '80vh';
		windo.style.top = '0px';
		windo.style.left = '0px';
	}

	show(e) {
		// data-modal-class should be the class of the modal to show
		// ie. <button data-modal-class="whatever">  shows <modal modalno="whatever">

		if (
			e.target.dataset.modalClass !== `${this.classNameToOpen}` &&
			e.target.parentElement.dataset.modalClass !== `${this.classNameToOpen}`
		)
			return;

		document
			.querySelector(`.windo-${this.classNameToOpen}`)
			.classList.add('show');
	}

	static addDragListeners() {
		const documentWindoContainer = document.querySelector(
			'.document-windo-container'
		);
		const programWindoContainer = document.querySelector(
			'.program-windo-container'
		);
		const tetrisWindoContainer = document.querySelector(
			'.special-tetris-container-to-getaround-bug-i-cannot-fix'
		);

		documentWindoContainer.addEventListener('dragstart', (e) =>
			this.dragModal(e)
		);
		documentWindoContainer.addEventListener('dragend', (e) =>
			this.dropModal(e)
		);

		programWindoContainer.addEventListener('dragstart', (e) =>
			this.dragModal(e)
		);
		programWindoContainer.addEventListener('dragend', (e) => this.dropModal(e));

		tetrisWindoContainer.addEventListener('dragstart', (e) =>
			this.dragModal(e)
		);
		tetrisWindoContainer.addEventListener('dragend', (e) => this.dropModal(e));

		/* problem with Firefox, can't get mouse positions from dragend event, see here https://bugzilla.mozilla.org/show_bug.cgi?id=505521 */
		window.addEventListener('drop', (e) =>
			this.saveMouseCoordinatesAfterEveryDrop(e)
		);
	}

	// show whatever modal corresponds to class passed
	static showDirect(modalClass) {
		const modal = document.querySelector(`.${modalClass}`);
		if (modal) {
			document.querySelector(`.${modalClass}`).classList.add('show');
		}
	}

	static dragModal(e) {
		if (e.target.nodeType !== 1) return;
		if (!e.target.classList.contains('bar')) return;

		e.dataTransfer.setData('text/plain', null);
		const img = new Image();
		img.src = 'img/programs.ico';
		e.dataTransfer.setDragImage(img, 10, 10);
	}

	static dropModal(e) {
		e.preventDefault();

		if (e.target.nodeType !== 1) return;
		if (!e.target.classList.contains('bar')) return;

		const modalNo = e.target.dataset.correspondingClassname;

		const modal = document.querySelector(`.windo-${modalNo}`);

		// e.clientX, e.clientY not available in Firefox - use LASTDROPCOORDINATES
		modal.style.top = `${LASTDROPCOORDINATES.clientY}px`;
		modal.style.left = `${LASTDROPCOORDINATES.clientX}px`;
	}

	static saveMouseCoordinatesAfterEveryDrop(e) {
		e.preventDefault();

		LASTDROPCOORDINATES.clientX = e.clientX;
		LASTDROPCOORDINATES.clientY = e.clientY;
	}
}

export class DialogWindo extends Windo {
	constructor(config) {
		super(config);
	}

	xMinMaxBtns() {
		return '';
	}

	addToDOM(html = this.getHTML()) {
		const windoParent = document.querySelector(`.${this.windoParent}`);

		windoParent.innerHTML += html;
	}

	// To close save/open dialogs | See Wordpad
	static closeDirect(selector) {
		// Remove from DOM | (kill Windo)
		const windoToRemove = document.querySelector(`.${selector}`);

		if (!windoToRemove) return;

		windoToRemove.parentNode.removeChild(windoToRemove);
	}
}
