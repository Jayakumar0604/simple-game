/* eslint-disable max-statements */
import React from 'react';
import { render } from '@testing-library/react';
import Score from './score';
import blast from '../images/score-icon.png';
import context from '../core/context';
import { useCookies } from 'react-cookie';

jest.mock('../core/context', () => ({
	state: { score: 0 },
}));
jest.mock('react-cookie', () => ({
	CookiesProvider: ({ children }) => children,
	useCookies: jest.fn(),
}));

describe('score card', () => {
	test('to Check score card', () => {
		const mockHighScore = 100;

		useCookies.mockReturnValue([{ score: mockHighScore }]);
		const { getByRole } = render(<Score/>);
		const component = getByRole('score-card');

		expect(component).toBeInTheDocument();

		expect(getByRole('score-card')).toBeInTheDocument();
		expect(getByRole('damage-icon')).toBeInTheDocument();
		expect(getByRole('score')).toBeInTheDocument();
		expect(getByRole('high-score')).toBeInTheDocument();

		expect(getByRole('score-card')).toHaveClass('container');
		expect(getByRole('damage-icon')).toHaveClass('flightDamage');
		expect(getByRole('score')).toHaveClass('score');
		expect(getByRole('high-score')).toHaveClass('high-score-hud');

		expect(getByRole('damage-icon'))
			.toHaveAttribute('src', blast);

		expect(component).toHaveTextContent(context.state.score);
		expect(getByRole('high-score')).toHaveTextContent('HI: 100');
	});

	test('to Check score card when cookies.score is undefined', () => {
		useCookies.mockReturnValue([{}]);
		const { getByRole } = render(<Score/>);

		expect(getByRole('high-score')).toHaveTextContent('HI: 0');
	});
});
