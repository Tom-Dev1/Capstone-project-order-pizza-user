import { useLottie } from 'lottie-react';
import animationData from '../../assets/icons/Sun.json';

const style = {
    height: 28,
    width: 28,
};

const SunAnimation = () => {
    const options = {
        animationData,
        loop: true,
        autoplay: true,
    };

    const { View } = useLottie(options, style);

    return <div>{View}</div>;
};

export default SunAnimation;