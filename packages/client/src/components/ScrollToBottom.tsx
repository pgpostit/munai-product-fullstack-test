import { useEffect, useRef } from "react";


const ScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        elementRef.current?.scrollIntoView({
            behavior:"smooth"
        });
    } );

    return <div ref={elementRef}></div>
}


export default ScrollToBottom;

