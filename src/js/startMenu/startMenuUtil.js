/*
TODO - this works but the addPrograms/addDocuments is a mess, it's not DRY & StartBlock isn't used.
*/

//import { StartBlock } from "./StartBlock.js";
import { StartItem } from './StartItem.js';
import { myDocuments, programConfigs as programs } from '../content.js';
import { navigationHandlers } from './startHelpers';

// Event Handler | main.js
export function toggleStartMenu(e) {
	// Return if it's part of the menu but not the start button.
	if (
		e.target.classList.contains('start-menu') ||
		e.target.classList.contains('menu-item') ||
		e.target.classList.contains('menu-item-p') ||
		e.target.classList.contains('sub-menu-toggle')
	) {
		return;
	}

	if (e.target.classList.contains('start-btn')) {
		navigationHandlers.toggleAriaExpanded(e.target);
	} else {
		// clicked anywhere else
		const el = document.querySelector('#start-menu-nav');
		if (!el) {
			return;
		}
		const allToggles = document.querySelectorAll('.sub-menu-toggle');

		allToggles.forEach((m) =>
			navigationHandlers.toggleAriaExpanded(m, 'close')
		);

		const startBtn = document.querySelector('.start-btn');

		navigationHandlers.toggleAriaExpanded(startBtn, 'close');
	}
}

export function initStartMenu() {
	addDocumentsBlock();
	addPrograms();
	subMenuToggle();
	menuKeyboardNavigation();
	mouseNavigation();
}

// TODO this and addPrograms() should just be hardcoded?
function addDocumentsBlock() {
	const docMenu = document.querySelector('.documents-item');
	const currentMenuLevel = docMenu.parentElement.dataset.menuLevel;
	const thisMenuLevelClass = `start-menu-${+currentMenuLevel + 1}`;
	let docBlock = `<ul class="start-menu ${thisMenuLevelClass}">`;

	myDocuments.forEach((doc) => {
		let classes = `class = "start-item launchExplorer start-${doc.classNameToOpen}"`;

		let dataAttributes = `data-class-name="${doc.classNameToOpen}" data-corresponding-windo="${doc.windoClassName}"`;

		let startItem = new StartItem(
			classes,
			dataAttributes,
			doc.img,
			doc.title,
			false
		);

		docBlock += startItem.getHtml();
	});
	docBlock += `</ul>`;
	docMenu.innerHTML += docBlock;
}

/*
If program[Program].startMenuParentClass is !false
Add start menu item for the program under parent li.startMenuParentClass
If parent li.startMenuParentClass already contains a <ul> for sub items, add here
Else create li.startMenuParentclass > ul, add here
*/
function addPrograms() {
	for (let [key, value] of Object.entries(programs)) {
		if (!value) continue;

		if (!value['startMenuParentClass']) return;

		const menuItemParent = document.querySelector(
			`.${value['startMenuParentClass']}`
		);
		const menuLevel = getThisMenuLevelClass(menuItemParent);

		// '.launch-program' launches when clicked | main.js & programUtil.js
		// '.start-item' - I forget what this is for but it's not just a class for CSS
		const classes = 'class = "start-item launch-program"';

		// dataset.launchWindo - to prevent duplicate windos | programUtil.js
		// dataset.launch - name of program class constructor eg 'Tetris' | programUtil.js
		const dataAttributes = `data-launch-windo="${value.params.windoClassName}" data-launch="${key}"`;

		const childUl = {
			ul: checkIfAlreadyHasChildUl(menuItemParent),
			menuLevel: menuLevel,
		};
		const startItem = new StartItem(
			classes,
			dataAttributes,
			value.params.img,
			key,
			false
		).getHtml();

		if (!childUl.ul) {
			const theStartItem = `<ul class="start-menu ${childUl.menuLevel}">${startItem}</ul>`;
			menuItemParent.insertAdjacentHTML('beforeend', theStartItem);
		} else {
			childUl.ul.insertAdjacentHTML('beforeend', startItem);
			menuItemParent.insertAdjacentElement('beforeend', childUl.ul);
		}
	}
}

function getThisMenuLevelClass(parent) {
	const currentMenuLevel = parent.parentElement.dataset.menuLevel;
	return `start-menu-${+currentMenuLevel + 1}`;
}

function checkIfAlreadyHasChildUl(parent) {
	if (!parent.hasChildNodes()) return false;

	const children = Array.from(parent.childNodes);

	let m = children.filter((child) => child.nodeName === 'UL');

	return m.length === 1 ? m[0] : '';
}

function subMenuToggle() {
	// 1. Listen or Un-Listen to all button.sub-menu-toggles.
	const allSubMenuToggleButtons = document.querySelectorAll(
		'#start-menu-nav .sub-menu-toggle'
	);

	if (allSubMenuToggleButtons && allSubMenuToggleButtons.length) {
		allSubMenuToggleButtons.forEach((button) => {
			button.addEventListener(
				'click',
				navigationHandlers.handleExpandAppropiateSubMenu,
				false
			);
		});
	}
}

function menuKeyboardNavigation() {
	document.addEventListener('keydown', function (event) {
		const startBtn = document.querySelector('.start-btn');
		let isExpanded = false;
		if (startBtn && startBtn.getAttribute('aria-expanded') === 'true') {
			isExpanded = true;
		}
		const mainNavMenu = document.querySelector('#start-menu-nav');
		const selectors = 'input, a, button';

		const tabKey = event.key === 'Tab';
		const shiftKey = event.shiftKey;
		const escKey = event.key === 'Escape';

		const els = mainNavMenu.querySelectorAll(selectors);
		const elements = Array.prototype.slice.call(els);
		const activeEl = document.activeElement;
		const lastEl = elements[elements.length - 1];

		// Get the last button.sub-menu-toggle without a tabindex=-1 attribute.
		function getLastRelevantToggleBtn() {
			const subBtns = mainNavMenu.querySelectorAll(
				'nav ul .sub-menu-toggle:not([tabindex="-1"]'
			); // TODO tabindexes...

			//  const subBtns = mainNavMenu.querySelectorAll( ':scope button.sub-menu-toggle:not([tabindex="-1"]' ); // TODO tabindexes...
			if (!subBtns || !subBtns.length) {
				return false;
			}

			// Get non nested togglebtns & nested togglebtns in tab order.
			const activeBtns = Array.from(subBtns).filter(
				(btn) => btn.getAttribute('aria-expanded') === 'false'
			);
			if (!activeBtns || !activeBtns.length) {
				return false;
			}

			const lastActiveBtn = activeBtns[activeBtns.length - 1];
			return lastActiveBtn;
		}

		const firstEl = elements[0];

		// Close mobile menu with escape key. TODO also close everything (tabindex is good..?)
		if (escKey && isExpanded) {
			event.preventDefault();
			// navigationHandlers.toggleAriaExpanded(startBtn);
			navigationHandlers.toggleAriaExpanded(startBtn);
			startBtn.focus();
		}

		if (!isExpanded) {
			return;
		}

		// Keep tabbing inside the menu (last item to first item). The Element to use to send the tab back to firstEl is either lastEl OR lastRelevantToggleBtn if lastEl[tabindex=-1].
		let lastRelevantLinkOrToggleBtn = lastEl;

		if (lastEl.getAttribute('tabindex') === '-1') {
			lastRelevantLinkOrToggleBtn = getLastRelevantToggleBtn();
		}

		if (!shiftKey && tabKey && activeEl === lastRelevantLinkOrToggleBtn) {
			event.preventDefault();
			firstEl.focus();
		}

		// Keep tabbing inside the menu (first item to last item). The element to send focus to is either lastEl or LastRelevantToggleBtn if lastEl[tabindex=-1].
		if (shiftKey && tabKey && firstEl === activeEl) {
			event.preventDefault();

			// el to focus is
			let elToFocus = lastEl;
			if (lastEl.getAttribute('tabindex') === '-1') {
				elToFocus = getLastRelevantToggleBtn();
			}
			elToFocus.focus();
		}

		// If there are no elements in the menu, don't move the focus
		if (tabKey && firstEl === lastEl) {
			event.preventDefault();
		}
	});
}

function mouseNavigation() {
	// Get ALL <li.with-subitem> items with nested ul.sub-menus
	const lisWithChildren = document.querySelectorAll('ul li.with-subitem');

	if (!lisWithChildren || !lisWithChildren.length) {
		return;
	}

	// Show onMouseEnter.
	lisWithChildren.forEach((li) => {
		li.addEventListener('mouseenter', function showSubMenu() {
			this.querySelector('.sub-menu-toggle').setAttribute(
				'aria-expanded',
				'true'
			);

			// change css class if sub-menu goes off screen.
			// keepSubMenusVisible( li );
		});

		// hide onMouseLeave
		li.addEventListener('mouseleave', function hideSubMenu() {
			this.querySelector('.sub-menu-toggle').setAttribute(
				'aria-expanded',
				'false'
			);
		});
	});
}
