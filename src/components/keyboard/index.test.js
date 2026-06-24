import { rndString } from '@laufire/utils/random';
import React from 'react';
import Keyboard from '.';
import shortcutManager from '../../services/shortcutManager';

test('Keyboard', () => {
	const key = rndString();
	const context = Symbol('context');
	const evt = { key } ;

	let cleanup;
	jest.spyOn(React, 'useEffect').mockImplementation((fn) => {
		cleanup = fn();
	});
	// eslint-disable-next-line no-undef
	jest.spyOn(window, 'addEventListener')
		.mockImplementation((d, fn) => fn(evt));
	// eslint-disable-next-line no-undef
	jest.spyOn(window, 'removeEventListener').mockReturnValue();
	jest.spyOn(shortcutManager, 'handleShortcut').mockReturnValue();

	Keyboard(context);

	expect(React.useEffect).toHaveBeenCalledWith(expect.any(Function), [context, shortcutManager]);
	expect(shortcutManager.handleShortcut).toHaveBeenCalledWith({ ...context,
		data: { key }});
	// eslint-disable-next-line no-undef
	expect(window.addEventListener)
		.toHaveBeenCalledWith('keydown', expect.any(Function));

	cleanup();
	// eslint-disable-next-line no-undef
	expect(window.removeEventListener)
		.toHaveBeenCalledWith('keydown', expect.any(Function));
});
