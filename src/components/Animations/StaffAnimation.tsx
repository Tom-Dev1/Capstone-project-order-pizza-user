import { useLottie } from 'lottie-react';
import animationData from '../../assets/icons/Staff.json';

const style = {
    height: 58,
    width: 60,
};

const StaffAnimation = () => {
    const options = {
        animationData,
        loop: true,
        autoplay: true,
    };

    const { View } = useLottie(options, style);

    return <div>{View}</div>;
};

export default StaffAnimation;
