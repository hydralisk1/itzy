import { useState, useEffect, useRef } from 'react';

export default function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const targetRef = useRef(null);
    const clickRef = useRef(null)

    let clickHandle = initialIsVisible

    const handleClickOutside = (event) => {
        if(clickRef.current && clickRef.current.contains(event.target)) {
            clickHandle = !clickHandle
            setIsComponentVisible(clickHandle)
        }
        else if (targetRef.current && !targetRef.current.contains(event.target)) {
            clickHandle = false
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { targetRef, clickRef, isComponentVisible, setIsComponentVisible };
}
