import { useLottie } from 'lottie-react';
import animationData from '../assets/icons/Location.json';

const style = {
    height: 46,
    width: 38,
};

const LocationAnimation = () => {
    const options = {
        animationData,
        loop: true,
        autoplay: true,
    };

    const { View } = useLottie(options, style);

    return <div>{View}</div>;
};

export default LocationAnimation;
