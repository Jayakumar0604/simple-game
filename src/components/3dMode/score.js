import { React } from 'react';
import { Text } from '@react-three/drei';
import { degreeToRad } from '../../services/helperService';
import PositionService from '../../services/positionService';
import { useCookies } from 'react-cookie';

const meshProps = (context) => {
	const { x, z } = PositionService.threeDProject({ ...context,
		data: context.config.scorePosition });
	const degree = -90;

	return {
		rotation: [degreeToRad(degree), 0, 0], position: [x, 1, z],
	};
};

const textProps = ({ state }, highScore) => ({
	text: `Score: ${ state.score }  HI: ${ highScore }`,
	fontSize: 0.2,
	color: 'black',
	anchorX: 'right',
});

const Score = (context) => {
	const [cookies] = useCookies(['score']);
	const highScore = cookies.score || 0;

	return (
		<group { ...meshProps(context) }>
			<Text { ...textProps(context, highScore) }/>
		</group>
	);
};

export default Score;
