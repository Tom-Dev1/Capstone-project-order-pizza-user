import { useLottie } from 'lottie-react';
import animationData from '../../assets/icons/Payment.json';

const style = {
    height: 58,
    width: 60,
};

const PaymentAnimation = () => {
    const options = {
        animationData,
        loop: true,
        autoplay: true,
    };

    const { View } = useLottie(options, style);

    return <div>{View}</div>;
};

export default PaymentAnimation;
