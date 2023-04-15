
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getPasteboardTexts } from "./index.model";

export const Pasteboard = () => {
    const dispatch = useDispatch();
    const pasteboardTexts = useSelector((state: RootState) => state.pasteboard.pasteboardTexts.texts);

    React.useEffect(() => {
        dispatch(getPasteboardTexts() as any);
    }, [dispatch]);

    // update getPasteboardTexts every second
    React.useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getPasteboardTexts() as any);
        }, 1000);
        return () => clearInterval(interval);
    }, [dispatch]);

    // copy pasteboardTexts text with click
    const copyText = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    // alert pasteboardTexts text with click
    const alertText = (text: string) => { 
        alert(text); 
    };
    
    return (
        <>
            {pasteboardTexts.map((text) => (
                // text 显示为红色 
                <div>
                    <button key={text} style={{ color: "red" }} onClick={() => 
                        {
                            //alertText(text);
                            copyText(text);
                        }
                    }>
                        {text}
                    </button>
                </div>
            ))}
        </>
    );
};