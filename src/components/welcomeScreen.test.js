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
		const { container } = render(WelcomeScreen(context));
		const component = container.querySelector('.welcomeScreen');
		const startBtn = container.querySelector('.start-btn');

		expect(startBtn).toHaveTextContent('Start Game');
		expect(component).toHaveClass('welcomeScreen');
		expect(component).toBeInTheDocument();
	});

	test('Fire Event', () => {
		const { container } = render(WelcomeScreen(context));
		const startBtn = container.querySelector('.start-btn');

		fireEvent.click(startBtn);

		expect(actions.gameStart).toHaveBeenCalledWith(!state.ready);
	});

	test('Fire Help Event', () => {
		const { container } = render(WelcomeScreen(context));
		const helpBtn = container.querySelector('.help-btn');
		const blurMock = jest.fn();

		fireEvent.click(helpBtn, { target: { blur: blurMock } });

		expect(blurMock).toHaveBeenCalled();
		expect(actions.setHelp).toHaveBeenCalledWith(!state.help);
	});
});
