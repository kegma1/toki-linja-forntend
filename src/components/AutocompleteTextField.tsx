import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Glyph } from "./../glyphs";
import './AutocompleteTextField.css';  


let lastBracketTime = 0;
let lastBracketKey = null;

function AutocompleteTextField() {
    const [inputValue, setInputValue] = useState("");
    const [popupVisible, setPopupVisible] = useState(false); 
    const [matches, setMatches] = useState<string[]>([]);
    const [highlightedWord, setHighlightedWord] = useState(0); 
    const inputRef = useRef<HTMLInputElement>(null);
    const refs = useRef<HTMLLIElement[]>([]);
    
    const getCaret = () => inputRef.current!.selectionStart!;
    
    useEffect(() => {
        if (popupVisible && refs.current[highlightedWord]) {
            refs.current[highlightedWord].scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
        }
    }, [highlightedWord, popupVisible])
    
    const getCurrentWord = (text, caret) => {
        const startIndex = caret === 0           ? caret : indexOfStartOfWord(text, caret);
        const endIndex =   caret === text.length ? caret : indexOfEndOfWord(text, caret);
        
        return text.slice(startIndex, endIndex);
    }
    
    const indexOfStartOfWord = (text, caret) => {
        for (let i = caret - 1; i >= 0; i--) {
            if (!isAlphabetical(text[i])) {
                return i + 1;
            }
        }
        
        return 0
    }
    
    const indexOfEndOfWord = (text, caret) => {        
        if (!isAlphabetical(text[caret])) return caret;
        
        for (let i = caret + 1; i <= text.length; i++) {
            if (!isAlphabetical(text[i])) {
                return i;
            }
        }
    }
    
    const isAlphabetical = (s: string) => /^[a-zA-Z]$/.test(s);
    
    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setHighlightedWord(0);
        
        updateMatchList(newValue);
    }
    
    const updateMatchList = (newValue: string) => {
        const currentWord = getCurrentWord(newValue, getCaret());
        const matchingGlyphs = Glyph.findMatches(currentWord);       
        const matchList = matchingGlyphs.flatMap(g => g.hasVariants ? [g.getGlyph(), g.getVariant()!] : g.getGlyph())
        
        if (matchList.length > 0) {
            setMatches(matchList)
            setPopupVisible(true)
        } else {
            setPopupVisible(false)
        }
    }
    
    const applySuggestion = (glyph: string, text: string, caret: number) => {
        const startIndex = caret === 0           ? caret : indexOfStartOfWord(text, caret);
        const endIndex =   caret === text.length ? caret : indexOfEndOfWord(text, caret);

        const before = text.slice(0, startIndex);
        const after = text.slice(endIndex);
        
        const newValue = before + glyph + after;
        setInputValue(newValue)
        
        updateMatchList(newValue)
        setPopupVisible(false)
    }

    const handleKeyDown = (e) => {
        const now = Date.now();

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedWord((prev) => (prev + 1) % matches.length);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedWord((prev) => (prev - 1 + matches.length) % matches.length);
        } else if (e.key === "[" || e.key === "]") {
            const isDouble = (e.key === lastBracketKey && now - lastBracketTime < 300);
            lastBracketTime = now;
            lastBracketKey = e.key;

            if (isDouble) {
                e.preventDefault();
                const caret = getCaret();

                const char = e.key === "[" ? String.fromCodePoint(0xF1990) : String.fromCodePoint(0xF1991);

                const newValue = inputValue.slice(0, caret - 1) + char + inputValue.slice(caret);
                setInputValue(newValue);
            }
        } else if (e.key === "(") {
            const isDouble = (e.key === lastBracketKey && now - lastBracketTime < 300);
            lastBracketTime = now;
            lastBracketKey = e.key;

            const caret = getCaret();
            
            const inputAsList = [...inputValue];
            const codePointCaret = getCodePointIndex(inputValue, caret);
            let prevGlyph = inputAsList[codePointCaret - 2];
            
            if (prevGlyph?.codePointAt(0) === 0xFE00) {
                prevGlyph = inputAsList[codePointCaret - 3];
            }

            const canGlyphBeLong = Glyph.isGlyphLongable(prevGlyph?.codePointAt(0)!);

            if (isDouble && canGlyphBeLong) {
                e.preventDefault();
                const newValue = inputValue.slice(0, caret - 1) + String.fromCodePoint(0xF1997) + inputValue.slice(caret);
                setInputValue(newValue);
            }
        } else if (e.key === ")") {
            const isDouble = (e.key === lastBracketKey && now - lastBracketTime < 300);
            lastBracketTime = now;
            lastBracketKey = e.key;

            if (isDouble) {
                e.preventDefault();
                const caret = getCaret();

                const newValue = inputValue.slice(0, caret - 1) + String.fromCodePoint(0xF1998) + inputValue.slice(caret);
                setInputValue(newValue);
            }
        } else if (e.key === "{" || e.key === "}") {
            const isDouble = (e.key === lastBracketKey && now - lastBracketTime < 300);
            lastBracketTime = now;
            lastBracketKey = e.key;

            if (isDouble) {
                
                e.preventDefault();
                const caret = getCaret();

                const char = e.key === "{" ? String.fromCodePoint(0xF199A) : String.fromCodePoint(0xF199B) + String.fromCodePoint(0xF1921);

                const newValue = inputValue.slice(0, caret - 1) + char + inputValue.slice(caret);
                setInputValue(newValue);
            }
        } else if ((e.key === " ") && (!popupVisible || e.shiftKey)) {
            // make space do shit when in long glyph and shii
        } else if ((e.key === "Tab" || e.key === " ") && popupVisible && !e.shiftKey) {
            e.preventDefault();
            const selected = matches[highlightedWord];
            applySuggestion(selected, inputValue, getCaret());
        }
    }

    const getCodePointIndex = (str, utf16Index) => {
        let codePointIndex = 0;
        let i = 0;

        while (i < utf16Index) {
            const code = str.codePointAt(i);
            i += code > 0xFFFF ? 2 : 1;
            codePointIndex++
        }

        return codePointIndex
    }

    // const findOpenParam = (str, params, idx) => {
    //     if (str.length <= idx) return "";
    //     if (idx > 0) return "";

    //     const open = params[0];
    //     const close = params[1];

    //     for(const i = idx - 1; i > 0; i--) {
    //         if (str[i] === char) return char
    //     }
    // }

    return ( 
        <>
        <div className="Prompt">
            <ul className="SuggestionList">
                {popupVisible && (
                    matches.map((glyph, i) => (
                        <li 
                            key={glyph} 
                            ref={(el : HTMLLIElement | null) => {
                                if (el) refs.current[i] = el
                            }}
                            onClick={() => applySuggestion(glyph, inputValue, getCaret())}
                            className={i === highlightedWord ? "Suggestion Highlighted" : "Suggestion"}
                        >
                            {glyph}
                        </li>
                    ))
                )}
            </ul>
            <div className="Field">
                <input 
                    type="text" 
                    ref={inputRef} 
                    value={inputValue} 
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown} 
                    onClick={() => updateMatchList(inputValue)}
                    className="InputField" 
                />
                <button type="submit" className="SendButton"> pana </button>
            </div>
        </div>
        </>
    );
}

export default AutocompleteTextField;
