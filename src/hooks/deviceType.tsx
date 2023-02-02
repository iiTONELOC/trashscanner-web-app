import { useEffect, useState } from 'react';

export default function useDeviceType(): 'mobile' | 'desktop' {
    const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>(window.navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop');

    useEffect(() => {
        const handleResize = () => {
            setDeviceType(window.navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop');
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return deviceType;
}
