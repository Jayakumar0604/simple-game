import React from 'react';
import { useCookies } from 'react-cookie';
import blast from '../images/score-icon.png';
import context from '../core/context';

const Score = () => {
	const [cookies] = useCookies(['score']);
	const highScore = cookies.score || 0;

	return (
		<div role="score-card" className="container">
			<img role="damage-icon" src={ blast } className="flightDamage"/>
			<span role="score" className="score">
				{ context.state.score }
			</span>
			<span role="high-score" className="high-score-hud">
				HI: { highScore }
			</span>
		</div>
	);
};

export default Score;
