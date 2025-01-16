import NightAnimation from "@/components/Animations/NightAnimation";
import SunAnimation from "@/components/Animations/SunAnimation";
const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
        return 'morning';
    } else if (hour < 18) {
        return 'afternoon';
    } else {
        return 'night';
    }
};
const getGreeting = (timeOfDay: string) => {
    switch (timeOfDay) {
        case 'morning':
            return 'Chào buổi sáng';
        case 'afternoon':
            return 'Chào buổi chiều';
        case 'night':
            return 'Chào buổi tối';
        default:
            return '';
    }
};
const getIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
        case 'morning':
            return <SunAnimation />;
        case 'afternoon':
            return <SunAnimation />;
        case 'night':
            return <NightAnimation />;
        default:
            return null;
    }
};

export { getTimeOfDay, getGreeting, getIcon };