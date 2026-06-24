import Flight from './flight';
import { render, cleanup } from '@testing-library/react';
import context from '../core/context';
import PositionService from '../services/positionService';
import { rndBetween } from '@laufire/utils/lib';

jest.mock('../core/context', () => ({
	state: { flight: { x: 100 }},
}));

describe('testing Flight', () => {
	test('flight is visible', () => {
		[true, false].forEach((playPause) => {
			context.state.playPause = playPause;
			const returnValue = { x: rndBetween() };

			const projectSpy = jest.spyOn(PositionService, 'project').mockReturnValue(returnValue);

			const component = render(Flight()).getByRole('flight');

			expect(component).toBeInTheDocument();
			expect(component).toHaveClass('flight');

			if (playPause) {
				expect(projectSpy).not.toHaveBeenCalled();
				expect(component).not.toHaveStyle({
					left: `${returnValue.x}%`,
				});
			} else {
				expect(projectSpy).toHaveBeenCalledWith(context.state.flight);
				expect(component).toHaveStyle({
					left: `${returnValue.x}%`,
				});
			}

			projectSpy.mockRestore();
			cleanup();
		});
	});
});
