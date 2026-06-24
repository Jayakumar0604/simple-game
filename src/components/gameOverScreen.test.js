/* eslint-disable max-statements */

jest.mock('../core/context', () => ({
	state: { score: 0 },
}));
jest.mock('react-cookie', () => ({
	CookiesProvider: ({ children }) => children,
	useCookies: jest.fn(),
}));

import GameOverScreen from '../components/gameOverScreen';
import { render } from '@testing-library/react';
import { React } from 'react';
import context from '../core/context';
import * as Restart from './restart';
import { useCookies } from 'react-cookie';

describe('testing GameOverScreen', () => {
	test('gameOverScreen visible', () => {
		useCookies.mockReturnValue([{}, jest.fn()]);
		jest.spyOn(Restart, 'default')
			.mockReturnValue(<div role="restartButton"/>);
		const { getByRole } = render(<GameOverScreen />);

		expect(getByRole('game-over-screen')).toBeInTheDocument();
		expect(getByRole('game-over-screen')).toHaveClass('game-over-screen');

		expect(getByRole('game-over')).toBeInTheDocument();
		expect(getByRole('game-over')).toHaveClass('game-over');
		expect(getByRole('restartButton')).toBeInTheDocument();
		expect(Restart.default).toHaveBeenCalled();

		expect(getByRole('score')).toBeInTheDocument();
		expect(getByRole('score')).toHaveClass('game-score');
		expect(getByRole('score')).toHaveTextContent(`SCORE: ${ context.state.score }`);
	});

	test('updates high score cookie when current score is higher', () => {
		const setCookieMock = jest.fn();
		useCookies.mockReturnValue([{ score: 5 }, setCookieMock]);
		context.state.score = 10;

		render(<GameOverScreen />);

		expect(setCookieMock).toHaveBeenCalledWith('score', 10);
	});
});
