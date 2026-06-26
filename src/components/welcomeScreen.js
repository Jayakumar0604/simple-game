import { React } from 'react';
import HelpList from './shortcutScreens/HelpList';

const MenuCard = (context) => {
	const { actions, state } = context;

	return (
		<div className="menu-card">
			<button
				className="start-btn"
				onClick={ () => actions.gameStart(!state.ready) }
			>Start Game</button>
			<button
				className="help-btn"
				onClick={ (e) => {
					e.target.blur();
					actions.setHelp(!state.help);
				} }
			>Help / Keys</button>
		</div>
	);
};

const WelcomeScreen = (context) =>
	<div role="welcomeScreen" className="welcomeScreen">
		<h1>SKY STRIKE</h1>
		<MenuCard { ...context }/>
		<div className="instructions">
			Use Mouse to Move & Click to Shoot
		</div>
		<HelpList { ...context }/>
	</div>;

export default WelcomeScreen;
