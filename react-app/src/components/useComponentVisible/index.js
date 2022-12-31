import { useState, useEffect, useRef } from 'react';

export default function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const clickRef = useRef(null)

    let clickHandle = initialIsVisible

    const handleClickOutside = (event) => {
        if(clickRef.current && clickRef.current.contains(event.target)) {
            clickHandle = !clickHandle
            setIsComponentVisible(clickHandle)
        }
        else{
            setTimeout(() => {
                clickHandle = false
                setIsComponentVisible(false);
            },0)
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { clickRef, isComponentVisible };
}
