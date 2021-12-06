// Tetris onProgramOpen calls | param = current instance of Tetris | content.js
export function addKeyboardListeners(instance) {
	// when programClosed event happens, tetrisIsOpen will be set to false.
	let tetrisIsOpen = true;

	// 32 = spacebar | pause
	// 67 = 'c' | cheat
	// others are arrows

	const keycodes = [32, 40, 39, 37, 38, 67];

	document.addEventListener('keydown', function what(e) {
		// Remove keydown listener if tetris closed
		if (!tetrisIsOpen) {
			this.removeEventListener('keydown', what);
		}
		if (!keycodes.includes(e.keyCode)) return;

		if (e.keyCode === 32) {
			instance.togglePauseGame();
		}

		if (e.keyCode === 67) {
			instance.cheat();
		}

		if (e.keyCode === 40) {
			instance.moveCurrentShape().down();
		}

		if (e.keyCode === 39) {
			instance.moveCurrentShape().right();
		}

		if (e.keyCode === 37) {
			instance.moveCurrentShape().left();
		}

		if (e.keyCode === 38) {
			instance.moveCurrentShape().up();
		}
	});

	// Listen for 'tetrisClosed' | remove keyboard listeners (and self)
	document
		.querySelector('.program-windo-container')
		.addEventListener('tetrisClosed', function listen(e) {
			tetrisIsOpen = false;
			document
				.querySelector('.program-windo-container')
				.removeEventListener('tetrisClosed', listen);
		});
}

// Called - when tetris closes | content.js
export function dispatchClosedEvent() {
	const tetrisClosed = new Event('tetrisClosed');

	document
		.querySelector('.program-windo-container')
		.dispatchEvent(tetrisClosed);
}
