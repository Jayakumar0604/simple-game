import { rndValue } from '@laufire/utils/random';
import { fireEvent, render } from '@testing-library/react';
import WelcomeScreen from './welcomeScreen';

describe('WelcomeScreen', () => {
	const actions = {
		gameStart: jest.fn(),
		setHelp: jest.fn(),
	};
	const state = {
		ready: rndValue([true, false]),
		help: rndValue([true, false]),
	};
	const config = {
		shortcutKeys: [],
	};
	const context = {
		actions,
		state,
		config,
	};

	test('Render WelcomeScreen', () => {
		const component = render(WelcomeScreen(context))
			.getByRole('welcomeScreen');

		expect(component.children[0]).toHaveTextContent('Start');
		expect(component).toHaveClass('welcomeScreen');
		expect(component).toBeInTheDocument();
	});

	test('Fire Event', () => {
		const component = render(WelcomeScreen(context))
			.getByRole('welcomeScreen');

		fireEvent.click(component.children[0]);

		expect(actions.gameStart).toHaveBeenCalledWith(!state.ready);
	});

	test('Fire Help Event', () => {
		const component = render(WelcomeScreen(context))
			.getByRole('welcomeScreen');

		const helpButton = component.children[1];
		const blurMock = jest.fn();

		fireEvent.click(helpButton, { target: { blur: blurMock } });

		expect(blurMock).toHaveBeenCalled();
		expect(actions.setHelp).toHaveBeenCalledWith(!state.help);
	});
});
