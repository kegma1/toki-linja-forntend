import React, { useState, useRef, useEffect } from "react";
import './AutocompleteTextField.css';  

const tokiPonaUnicode = {
    a: 0xF1900,
    akesi: 0xF1901,
    ala: 0xF1902,
    alasa: 0xF1903,
    ale: 0xF1904,
    anpa: 0xF1905,
    ante: 0xF1906,
    anu: 0xF1907,
    awen: 0xF1908,
    e: 0xF1909,
    en: 0xF190A,
    esun: 0xF190B,
    ijo: 0xF190C,
    ike: 0xF190D,
    ilo: 0xF190E,
    insa: 0xF190F,
    jaki: 0xF1910,
    jan: 0xF1911,
    jelo: 0xF1912,
    jo: 0xF1913,
    kala: 0xF1914,
    kalama: 0xF1915,
    kama: 0xF1916,
    kasi: 0xF1917,
    ken: 0xF1918,
    kepeken: 0xF1919,
    kili: 0xF191A,
    kiwen: 0xF191B,
    ko: 0xF191C,
    kon: 0xF191D,
    kule: 0xF191E,
    kulupu: 0xF191F,
    kute: 0xF1920,
    la: 0xF1921,
    lape: 0xF1922,
    laso: 0xF1923,
    lawa: 0xF1924,
    len: 0xF1925,
    lete: 0xF1926,
    li: 0xF1927,
    lili: 0xF1928,
    linja: 0xF1929,
    lipu: 0xF192A,
    loje: 0xF192B,
    lon: 0xF192C,
    luka: 0xF192D,
    lukin: 0xF192E,
    lupa: 0xF192F,
    ma: 0xF1930,
    mama: 0xF1931,
    mani: 0xF1932,
    meli: 0xF1933,
    mi: 0xF1934,
    mije: 0xF1935,
    moku: 0xF1936,
    moli: 0xF1937,
    monsi: 0xF1938,
    mu: 0xF1939,
    mun: 0xF193A,
    musi: 0xF193B,
    mute: 0xF193C,
    nanpa: 0xF193D,
    nasa: 0xF193E,
    nasin: 0xF193F,
    nena: 0xF1940,
    ni: 0xF1941,
    nimi: 0xF1942,
    noka: 0xF1943,
    o: 0xF1944,
    olin: 0xF1945,
    ona: 0xF1946,
    open: 0xF1947,
    pakala: 0xF1948,
    pali: 0xF1949,
    palisa: 0xF194A,
    pan: 0xF194B,
    pana: 0xF194C,
    pi: 0xF194D,
    pilin: 0xF194E,
    pimeja: 0xF194F,
    pini: 0xF1950,
    pipi: 0xF1951,
    poka: 0xF1952,
    poki: 0xF1953,
    pona: 0xF1954,
    pu: 0xF1955,
    sama: 0xF1956,
    seli: 0xF1957,
    selo: 0xF1958,
    seme: 0xF1959,
    sewi: 0xF195A,
    sijelo: 0xF195B,
    sike: 0xF195C,
    sin: 0xF195D,
    sina: 0xF195E,
    sinpin: 0xF195F,
    sitelen: 0xF1960,
    sona: 0xF1961,
    soweli: 0xF1962,
    suli: 0xF1963,
    suno: 0xF1964,
    supa: 0xF1965,
    suwi: 0xF1966,
    tan: 0xF1967,
    taso: 0xF1968,
    tawa: 0xF1969,
    telo: 0xF196A,
    tenpo: 0xF196B,
    toki: 0xF196C,
    tomo: 0xF196D,
    tu: 0xF196E,
    unpa: 0xF196F,
    uta: 0xF1970,
    utala: 0xF1971,
    walo: 0xF1972,
    wan: 0xF1973,
    waso: 0xF1974,
    wawa: 0xF1975,
    weka: 0xF1976,
    wile: 0xF1977,
    namako: 0xF1978,
    kin: 0xF1979,
    oko: 0xF197A,
    kipisi: 0xF197B,
    leko: 0xF197C,
    monsuta: 0xF197D,
    tonsi: 0xF197E,
    jasima: 0xF197F,
    kijetesantakalu: 0xF1980,
    soko: 0xF1981,
    meso: 0xF1982,
    epiku: 0xF1983,
    kokosila: 0xF1984,
    lanpan: 0xF1985,
    n: 0xF1986,
    misikeke: 0xF1987,
    ku: 0xF1988,
    pake: 0xF19A0,
    apeja: 0xF19A1,
    majuna: 0xF19A2,
    powe: 0xF19A3,
    linluwi: 0xF19A4,
    kiki: 0xF19A5,
    su: 0xF19A6,
    wa: 0xF19C0 ,
    owe: 0xF19AE 
};

const triggerPatterns = Object.keys(tokiPonaUnicode);

function AutocompleteTextField() {
    const [inputValue, setInputValue] = useState("");
    const [popupVisible, setPopupVisible] = useState(false); 
    const [matches, setMatches] = useState([]);
    const inputRef = useRef();
   
    const findTriggerMatch = (word) => {
        if(word === "") return []
        return triggerPatterns
            .filter((pattern) => pattern.startsWith(word))
    }
    
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
    }

    const indexOfEndOfWord = (text, caret) => {        
        if (!isAlphabetical(text[caret])) return caret;

        for (let i = caret + 1; i <= text.length; i++) {
            if (!isAlphabetical(text[i])) {
                return i;
            }
        }
    }

    const isAlphabetical = (s) => /^[a-zA-Z]$/.test(s)

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        const currentWord = getCurrentWord(newValue, inputRef.current.selectionStart);
        const matchList = findTriggerMatch(currentWord);

        if (matchList.length > 0) {
            setMatches(matchList)
            setPopupVisible(true)
        } else {
            setPopupVisible(false)
        }
    }

    const handleKeyDown = (e) => {

    }

    return ( 
        <>
            <div className="Field">
                <input 
                    type="text" 
                    ref={inputRef} 
                    value={inputValue} 
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown} 
                    className="InputField" 
                />
                <button type="submit" className="SendButton"> pana </button>
            </div>
            {popupVisible && (
                <ul>
                    {matches.map((match) => (
                        <li key={match}>
                            {String.fromCodePoint(tokiPonaUnicode[match])}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default AutocompleteTextField;
