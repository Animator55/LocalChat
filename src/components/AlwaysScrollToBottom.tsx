import { useRef, useEffect } from 'react';
export default function AlwaysScrollToBottom(){
    const elementRef = useRef(null);
    useEffect(() => {
        if(elementRef.current !== null) elementRef.current.scrollIntoView()
    });
    return <div ref={elementRef} />;
}