import { React, useRef, useState, useEffect } from 'react';
import getMode from '../services/urlService';
import TwoDMode from './2dMode/2dMode';
import ThreeDMode from './3dMode/3dMode';
import shortcutScreens from './shortcutScreens';
import { map, values } from '@laufire/utils/collection';

const GameMode = {
	'3d': ThreeDMode,
	'2d': TwoDMode,
};

const flashDuration = 150;

const useDamageFlash = (health) => {
	const prevHealthRef = useRef(health);
	const [flash, setFlash] = useState(false);

	useEffect(() => {
		if(health < prevHealthRef.current) {
			setFlash(true);
			const timer = setTimeout(() => setFlash(false), flashDuration);

			return () => clearTimeout(timer);
		}
		prevHealthRef.current = health;
	}, [health]);

	return flash;
};

const DamageFlash = ({ health }) => {
	const flash = useDamageFlash(health);

	return (
		<div
			role="damage-flash"
			className={ `damage-flash ${ flash ? 'flash' : '' }` }
		/>
	);
};

const handleMouseMove = (context) => (event) => {
	context.actions.updateMousePosition(event);
	context.actions.updateFlightPosition();
};

const GameScreen = (context) => {
	const { state } = context;
	const Mode = GameMode[getMode(context)];

	return (
		<div
			role="gameScreen"
			className="game-screen"
			onMouseMove={ handleMouseMove(context) }
			onClick={ (event) => !state.playPause
				&& context.actions.generateBullets(event) }
		>
			<DamageFlash health={ state.health }/>
			<Mode { ...context }/>
			{ values(map(shortcutScreens, (Component, key) =>
				<Component key={ key } { ...context }/>)) }
		</div>
	);
};

export default GameScreen;
