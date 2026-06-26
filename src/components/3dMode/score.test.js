import { rndBetween } from '@laufire/utils/random';
import { React } from 'react';
import helper from '../../testHelper/helper';
import PositionService from '../../services/positionService';
import * as helperService from '../../services/helperService';
import Score from './score';
import { useCookies } from 'react-cookie';
import * as ReactDrei from '@react-three/drei';

jest.mock('@react-three/drei', () => {
	const original = jest.requireActual('@react-three/drei');

	return {
		...original,
		Text: (props) => <mesh { ...props }/>,
	};
});

jest.mock('react-cookie', () => ({
	CookiesProvider: ({ children }) => children,
	useCookies: jest.fn(),
}));

describe('Score in 3D Mode', () => {

	test('renders score and high score from cookie', async () => {
		const state = { score: rndBetween() };
		const config = { scorePosition: Symbol('scorePosition') };
		const context = { state, config };
		const getProject = {
			x: Symbol('x'),
			z: Symbol('z'),
		};
		const getDegreeToRad = rndBetween();
		const degree = -90;
		const childCount = 1;
		const meshProps = {
			rotation: [getDegreeToRad, 0, 0],
			position: [getProject.x, 1, getProject.z],
		};
		const mockHighScore = rndBetween();

		useCookies.mockReturnValue([{ score: mockHighScore }]);
		jest.spyOn(PositionService, 'threeDProject').mockReturnValue(getProject);
		jest.spyOn(helperService, 'degreeToRad').mockReturnValue(getDegreeToRad);

		const textProps = {
			text: `Score: ${ state.score }  HI: ${ mockHighScore }`,
		};

		const scene = await helper.getScene(<Score { ...context }/>);
		const mesh = scene.allChildren[0];

		expect(mesh.allChildren.length).toEqual(childCount);
		expect(mesh.props).toMatchObject(meshProps);
		expect(mesh.allChildren[0].props).toMatchObject(textProps);
		expect(PositionService.threeDProject).toHaveBeenCalledWith({ ...context,
			data: config.scorePosition });
		expect(helperService.degreeToRad).toHaveBeenCalledWith(degree);
	});

	test('renders score and high score of 0 when cookie is undefined',
		async () => {
			const state = { score: rndBetween() };
			const config = { scorePosition: Symbol('scorePosition') };
			const context = { state, config };
			const getProject = {
				x: Symbol('x'),
				z: Symbol('z'),
			};
			const getDegreeToRad = rndBetween();

			useCookies.mockReturnValue([{}]);
			jest.spyOn(PositionService, 'threeDProject')
				.mockReturnValue(getProject);
			jest.spyOn(helperService, 'degreeToRad')
				.mockReturnValue(getDegreeToRad);

			const textProps = {
				text: `Score: ${ state.score }  HI: 0`,
			};

			const scene = await helper.getScene(<Score { ...context }/>);
			const mesh = scene.allChildren[0];

			expect(mesh.allChildren[0].props).toMatchObject(textProps);
		});
});
