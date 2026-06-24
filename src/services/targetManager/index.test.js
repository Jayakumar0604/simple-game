/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */

import TargetManager from '.';
import config from '../../core/config';
import * as HelperService from '../helperService';
import PositionService from '../positionService';
import { keys, range } from '@laufire/utils/collection';
import * as random from '@laufire/utils/random';
import GameService from '../gameService';

describe('target Manager', () => {
	const x = Symbol('x');
	const y = 0;
	const id = Symbol('id');
	const { addTargets, getTargets } = TargetManager;

	describe(' add targets', () => {
		const targets = [Symbol('targets')];

		test(' return targets', () => {
			const spawnTargets = [Symbol('spawnTargets')];

			jest.spyOn(TargetManager, 'spawnTargets')
				.mockReturnValue(spawnTargets);

			const result = addTargets({ state: { targets }});
			const expectedResult = [
				...targets,
				...spawnTargets,
			];

			expect(TargetManager.spawnTargets).toHaveBeenCalledWith();
			expect(result).toEqual(expectedResult);
		});

		test('returns the targets without any new targets', () => {
			const maxTargets = range(0, config.maxTargets)
				.map(() => targets[0]);
			const result = addTargets({ state: { targets: maxTargets }});

			expect(result).toEqual(maxTargets);
		});

		test('adds targets up to dynamic maxTargets when score is higher', () => {
			const spawnTargets = [Symbol('spawnTargets')];
			jest.spyOn(TargetManager, 'spawnTargets').mockReturnValue(spawnTargets);

			const score = 10;
			const maxTargetsCount = config.maxTargets + 1;
			const manyTargets = range(0, maxTargetsCount).map(() => targets[0]);

			const result = addTargets({ state: { targets: manyTargets, score } });
			const expectedResult = [
				...manyTargets,
				...spawnTargets,
			];

			expect(result).toEqual(expectedResult);
		});
	});
	describe('spawnTargets', () => {
		const { spawnTargets } = TargetManager;
		const targetTypes = keys(config.targets);

		test('spawnTargets returns all target when isProb is true', () => {
			jest.spyOn(HelperService, 'isProbable')
				.mockReturnValue(true);

			const result = spawnTargets();
			const resultType = result.map((item) => item.type);

			targetTypes.map((type) =>
				expect(HelperService.isProbable)
					.toHaveBeenCalledWith(config.targets[type].prop.spawn));
			expect(resultType).toEqual(targetTypes);
		});

		test('spawnTargets returns no target when isProb is false', () => {
			jest.spyOn(HelperService, 'isProbable').mockReturnValue(false);

			const result = spawnTargets();

			targetTypes.map((type) =>
				expect(HelperService.isProbable)
					.toHaveBeenCalledWith(config.targets[type].prop.spawn));
			expect(result).toEqual([]);
		});
	});

	describe('getTarget returns target', () => {
		const type = 'shooter';
		const typeConfig = config.targets[type];
		const { variance } = typeConfig;
		const { height, width } = typeConfig;
		const size = {
			height: height * variance,
			width: width * variance,
		};
		const sixtyFive = 65;
		const threeHundredFifty = 350;
		const color = Symbol('color');

		test('returns a target while params are passed', () => {
			jest.spyOn(HelperService, 'getId').mockReturnValue(id);
			jest.spyOn(HelperService, 'getVariance').mockReturnValue(variance);
			jest.spyOn(random, 'rndBetween').mockReturnValue(color);

			const expectedResult = {
				id,
				x,
				y,
				type,
				color,
				...typeConfig,
				...size,
			};

			const result = getTargets({ x, y, type });

			expect(HelperService.getId).toHaveBeenCalled();
			expect(HelperService.getVariance).toHaveBeenCalledWith(variance);
			expect(random.rndBetween)
				.toHaveBeenCalledWith(sixtyFive, threeHundredFifty);
			expect(result).toMatchObject(expectedResult);
		});

		test('getTarget params are optional', () => {
			jest.spyOn(HelperService, 'getId')
				.mockReturnValue(id);
			jest.spyOn(random, 'rndValue')
				.mockReturnValue('shooter');
			jest.spyOn(HelperService, 'getVariance')
				.mockReturnValue(variance);
			jest.spyOn(PositionService, 'getRandomValue')
				.mockReturnValue(x);

			const expectedResult = {
				id,
				x,
				y,
				type,
				...typeConfig,
				...size,
			};
			const result = getTargets();

			expect(HelperService.getId).toHaveBeenCalled();
			expect(HelperService.getVariance).toHaveBeenCalledWith(variance);
			expect(PositionService.getRandomValue)
				.toHaveBeenCalledWith(size.width);
			expect(result).toMatchObject(expectedResult);
		});
	});

	describe('generateenemyBullet and generateEnemyBullets', () => {
		test('generateenemyBullet returns false if target is empty', () => {
			const context = {
				state: {
					targets: [],
					score: 5,
				},
			};
			const result = TargetManager.generateenemyBullet(context);
			expect(result).toBe(false);
		});

		test('generateenemyBullet generates bullet with extra probability based on score', () => {
			const target = {
				x: 40,
				prop: {
					bulletSpawn: 0.05,
				},
			};
			const context = {
				state: {
					targets: [target],
					score: 10, // extraProb = 0.04 -> bulletSpawnProb = 0.09
				},
			};

			jest.spyOn(random, 'rndValue').mockReturnValue(target);
			jest.spyOn(HelperService, 'isProbable').mockReturnValue(true);
			jest.spyOn(GameService, 'makeBullet').mockReturnValue({ id: 'bullet1' });
			jest.spyOn(GameService, 'getType').mockReturnValue('normal');

			const result = TargetManager.generateenemyBullet(context);

			expect(HelperService.isProbable).toHaveBeenCalledWith(0.09);
			expect(result).toEqual({
				id: 'bullet1',
				x: 40,
				y: 10,
				rotate: 180,
			});
		});

		test('generateenemyBullet returns false if bullet is not probable', () => {
			const target = {
				x: 40,
				prop: {
					bulletSpawn: 0.05,
				},
			};
			const context = {
				state: {
					targets: [target],
					score: 10,
				},
			};

			jest.spyOn(random, 'rndValue').mockReturnValue(target);
			jest.spyOn(HelperService, 'isProbable').mockReturnValue(false);

			const result = TargetManager.generateenemyBullet(context);

			expect(result).toBe(false);
		});

		test('generateenemyBullet works when score is undefined', () => {
			const target = {
				x: 40,
				prop: {
					bulletSpawn: 0.05,
				},
			};
			const context = {
				state: {
					targets: [target],
				},
			};

			jest.spyOn(random, 'rndValue').mockReturnValue(target);
			jest.spyOn(HelperService, 'isProbable').mockReturnValue(true);
			jest.spyOn(GameService, 'makeBullet').mockReturnValue({ id: 'bullet1' });
			jest.spyOn(GameService, 'getType').mockReturnValue('normal');

			const result = TargetManager.generateenemyBullet(context);

			expect(HelperService.isProbable).toHaveBeenCalledWith(0.05);
			expect(result).toBeDefined();
		});

		test('generateEnemyBullets concatenates new bullet if generated', () => {
			const bullet = { id: 'bullet1' };
			const context = {
				state: {
					enemyBullets: [],
				},
			};
			jest.spyOn(TargetManager, 'generateenemyBullet').mockReturnValue(bullet);

			const result = TargetManager.generateEnemyBullets(context);
			expect(result).toEqual([bullet]);
		});

		test('generateEnemyBullets returns same enemyBullets if no bullet generated', () => {
			const context = {
				state: {
					enemyBullets: [{ id: 'bullet1' }],
				},
			};
			jest.spyOn(TargetManager, 'generateenemyBullet').mockReturnValue(false);

			const result = TargetManager.generateEnemyBullets(context);
			expect(result).toEqual([{ id: 'bullet1' }]);
		});
	});
});
