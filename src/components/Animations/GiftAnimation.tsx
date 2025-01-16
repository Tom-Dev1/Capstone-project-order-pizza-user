import { useLottie } from 'lottie-react';
import animationData from '../../assets/icons/Gift.json';

const style = {
    height: 58,
    width: 60,
};

const GiftAnimation = () => {
    const options = {
        animationData,
        loop: true,
        autoplay: true,
    };

    const { View } = useLottie(options, style);

    return <div>{View}</div>;
};

export default GiftAnimation;
