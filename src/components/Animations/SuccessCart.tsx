import { useLottie } from 'lottie-react';
import animationData from '@/assets/icons/SuccessCart.json';
const style = {
    height: 80,
    width: 80,
};

const SuccessCart = () => {
    const options = {
        animationData,
        loop: true,
        autoplay: true,
    };

    const { View } = useLottie(options, style);

    return <div>{View}</div>;
};

export default SuccessCart;