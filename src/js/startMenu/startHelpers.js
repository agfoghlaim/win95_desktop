export const navigationHandlers = {
	getIsOutermost: function (el) {
		return el.parentElement.parentElement.id === 'start-menu-nav';
	},
	toggleAriaExpanded: function(el, quick) {
		if (!el || el.nodeName !== 'BUTTON') {
			return;
		}
		if (quick === 'close') {
			el.setAttribute('aria-expanded', 'false');
			return;
		}
		if (quick === 'open') {
			el.setAttribute('aria-expanded', 'true');
			return;
		}
		if ('true' !== el.getAttribute('aria-expanded')) {
			el.setAttribute('aria-expanded', 'true');
	
			// // If sub-menu is being opened call keepSubMenusVisible.
			// navigationUtil.keepSubMenusVisible(el.parentElement);
		} else {
			el.setAttribute('aria-expanded', 'false');
		}
	},
	closeMenu(navToggle, menu, header) {
		navToggle.classList.remove('nav-open');
		navToggle.setAttribute('aria-expanded', false);
		menu.classList.remove('show');
		header.classList.remove('nav-open');
	},
	addAllToTabOrder() {
		const el = document.querySelector('#start-menu-nav');
		if (!el) {
			return;
		}

		// Get all non-visible sub-menu-toggle buttons inside main nav.
		const allToggles = el.querySelectorAll('ul#start-menu-nav button');

		if (allToggles && allToggles.length) {
			allToggles.forEach((toggle) => toggle.removeAttribute('tabindex'));
		}
	},
	openMenu(navToggle, menu, header) {
		navToggle.classList.add('nav-open');
		navToggle.setAttribute('aria-expanded', true);
		navToggle.focus();
		menu.classList.add('show');
		header.classList.add('nav-open');
	},
	removeNavSubItemsFromTabOrder() {
		const el = document.querySelector('#start-menu-nav');
		if (!el) {
			return;
		}
		this.addAllToTabOrder();

		// Get all non-visible sub-menu-toggle buttons inside main nav.
		const hiddenToggles = el.querySelectorAll(
			'.with-subitem .start-menu li button'
		);

		if (hiddenToggles && hiddenToggles.length) {
			hiddenToggles.forEach((toggle) => toggle.setAttribute('tabindex', '-1'));
		}
	},
	handleCloseMobileNavOnAnchorLinkClicked: function () {
		const menu = document.querySelector('#ywig-main-nav');
		const togglerButton = document.querySelector('.ywig-burger-btn');

		if (!menu || !menu.classList.contains('show')) {
			return;
		}
		menu.classList.remove('show');

		// Also change burger/minimise icon.
		const burgerIcon = document.querySelector('.ywig-burger-btn');
		if (!burgerIcon) {
			return;
		}
		if (burgerIcon.classList.contains('nav-open')) {
			burgerIcon.classList.remove('nav-open');
			togglerButton.setAttribute('aria-expanded', false);
		}

		const header = document.querySelector('header#ywig-main-header');
		if (!header) {
			return;
		}
		if (header.classList.contains('nav-open')) {
			header.classList.remove('nav-open');
		}
	},
	handleToggleMobileMenu: function () {
		const menu = document.querySelector('#ywig-main-nav');
		const header = document.getElementById('ywig-main-header');

		if (!menu || !header) {
			return;
		}

		if (!menu.classList.contains('show')) {
			openMenu(this, menu, header);
		} else {
			closeMenu(this, menu, header);
		}
	},
	handleExpandAppropiateSubMenu: function (e) {
		e.stopPropagation();

		if (!e.currentTarget.nodeName === 'BUTTON') {
			return;
		}

		const el = e.currentTarget;
		el.focus();

		navigationHandlers.handleToggleSubMenu(el);
	},
	handleToggleSubMenu(toggleBtn) {
		// Determine if the button's sub-menu expanded or not?
		const isExpanded = toggleBtn.getAttribute('aria-expanded');

		// Determine if toggleBtn is on the main nav level (not nested)...
		const isOutermost = navigationHandlers.getIsOutermost(toggleBtn);

		const closestNavEl = toggleBtn.closest('nav');
		if (isOutermost && closestNavEl) {
			// 1.Close other sub menus.
			closestNavEl
				.querySelectorAll('.sub-menu-toggle')
				.forEach(function (button) {
					if (button !== toggleBtn) {
						button.setAttribute('aria-expanded', 'false');
					}
				});

			// 2. Remove all all nested (non-visible) buttons from tab order.
			navigationHandlers.removeNavSubItemsFromTabOrder();
		}

		// If sub menu it is BEING collapsed ie. isExpanded === "false" - Add (only the) next buttons inside the relevant sub menu back in to the tab order.
		if (isExpanded === 'false') {
			addSubMenuToTabOrder(toggleBtn);
		}

		// Always toggle this menu.
		this.toggleAriaExpanded(toggleBtn);

		// Listen & close .sub-menu on tab away (remove from tabindex & close);
		navigationHandlers.handleCloseSubMenuOnTabAwaySelfRemovingVersion(
			toggleBtn
		);

		function addSubMenuToTabOrder(el) {
			// el is <button>. Get all links in the next ul.sub-menu.
			const allDecendantBtns =
				el.nextElementSibling.querySelectorAll('li button');

			const nextBtns = Array.from(allDecendantBtns).filter((btn) => {
				// ul.sub-menu
				return btn.parentElement.parentElement === el.nextElementSibling;
			});

			// Make these buttons tabbable while el button.sub-menu is open.
			if (nextBtns && nextBtns.length) {
				nextBtns.forEach((btn) => {
					if (btn) {
						btn.removeAttribute('tabindex');
						if (btn.classList.contains('sub-menu-toggle')) {
							btn.nextElementSibling.removeAttribute('tabindex');
						}
					}
				});
			}
		}
	},
	handleCloseSubMenuOnTabAwaySelfRemovingVersion: (subToggleBtn) => {
		if (!subToggleBtn || !subToggleBtn.nodeName === 'BUTTON') {
			return;
		}

		const tryAll = document.querySelectorAll('.sub-menu-toggle');
		// Listen for tab away from a <button.sub-menu-toggle>.
		tryAll.forEach((btn) => {
			btn.addEventListener('blur', short, false);
		});
		// Define handler that removes itself.
		function short(event) {
			// Return if not tabbing to a different sub menu.
			if (subToggleBtn.parentNode.contains(event.relatedTarget)) {
				return;
			}
			if (
				!event.relatedTarget ||
				!event.relatedTarget.classList.contains('sub-menu-toggle')
			) {
				return;
			}

			// Close the sub menu.
			subToggleBtn.setAttribute('aria-expanded', 'false');

			// Get non-visible buttons inside the closed sub menu.
			const innerButtons = subToggleBtn.parentElement.querySelectorAll(
				'.sub-menu .sub-menu-toggle'
			);

			// Remove from tab order. add -1 to buttons that we are leaving.
			if (innerButtons && innerButtons.length) {
				innerButtons.forEach((a) => a.setAttribute('tabindex', '-1'));
			}

			// Remove Liseners. Tab is leaving so no need to keep them.
			tryAll.forEach((btn) => btn.removeEventListener('blur', short, false));
		}
	},
};
