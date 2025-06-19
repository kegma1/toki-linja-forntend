export class Glyph {
    static registry: Glyph[] = [];
    static byWord = new Map<string, Glyph>();
    static byCodepoint = new Map<number, Glyph>();

    private word: string;
    private baseGlyph: number;
    public hasVariants: boolean;
    public isLongable: boolean;

    constructor(word: string, baseGlyph: number, hasVariants = false, isLongable = false) {
        this.word = word;
        this.baseGlyph = baseGlyph;
        this.hasVariants = hasVariants;
        this.isLongable = isLongable;

        Glyph.registry.push(this);
        Glyph.byWord.set(word, this);
        Glyph.byCodepoint.set(baseGlyph, this);

    }

    getGlyph() : string {return String.fromCodePoint(this.baseGlyph);}

    getWord() : string {return this.word;}

    getCodepoint() : number {return this.baseGlyph;}

    getVariant() : string  | null {
        if (this.hasVariants) {
            return String.fromCodePoint(this.baseGlyph, 0xFE00);
        }
        return null;
    }

    static formWord(word: string) : Glyph | undefined {
        return this.byWord.get(word);
    }

    static fromCodePoint(Codepoint: number) : Glyph | undefined {
        return this.byCodepoint.get(Codepoint);
    }

    static findMatches(pattern: string) : Glyph[] {
        if(pattern === "") return []

        return this.registry
            .filter((g) => g.word.startsWith(pattern))
    }

    static isGlyphLongable(codepoint: number) : boolean | null {
        const glyph = Glyph.fromCodePoint(codepoint);
        if (glyph) return glyph.isLongable;
        return null
    }
}

new Glyph("a", 0xF1900, false, true)
new Glyph("akesi", 0xF1901, true) 
new Glyph("ala", 0xF1902)
new Glyph("alasa", 0xF1903, false, true)
new Glyph("ale", 0xF1904)
new Glyph("anpa", 0xF1905)
new Glyph("ante", 0xF1906)
new Glyph("anu", 0xF1907, false, true)
new Glyph("awen", 0xF1908, false, true)
new Glyph("e", 0xF1909)
new Glyph("en", 0xF190A)
new Glyph("esun", 0xF190B)
new Glyph("ijo", 0xF190C)
new Glyph("ike", 0xF190D)
new Glyph("ilo", 0xF190E)
new Glyph("insa", 0xF190F)
new Glyph("jaki", 0xF1910)
new Glyph("jan", 0xF1911)
new Glyph("jelo", 0xF1912)
new Glyph("jo", 0xF1913)
new Glyph("kala", 0xF1914, true) 
new Glyph("kalama", 0xF1915)
new Glyph("kama", 0xF1916, false, true)
new Glyph("kasi", 0xF1917)
new Glyph("ken", 0xF1918, false, true)
new Glyph("kepeken", 0xF1919, false, true)
new Glyph("kili", 0xF191A)
new Glyph("kiwen", 0xF191B)
new Glyph("ko", 0xF191C)
new Glyph("kon", 0xF191D)
new Glyph("kule", 0xF191E)
new Glyph("kulupu", 0xF191F)
new Glyph("kute", 0xF1920)
new Glyph("la", 0xF1921)
new Glyph("lape", 0xF1922)
new Glyph("laso", 0xF1923)
new Glyph("lawa", 0xF1924)
new Glyph("len", 0xF1925);
new Glyph("lete", 0xF1926);
new Glyph("li", 0xF1927);
new Glyph("lili", 0xF1928);
new Glyph("linja", 0xF1929);
new Glyph("lipu", 0xF192A);
new Glyph("loje", 0xF192B);
new Glyph("lon", 0xF192C, false, true);
new Glyph("luka", 0xF192D);
new Glyph("lukin", 0xF192E);
new Glyph("lupa", 0xF192F);
new Glyph("ma", 0xF1930);
new Glyph("mama", 0xF1931);
new Glyph("mani", 0xF1932);
new Glyph("meli", 0xF1933, true) ;
new Glyph("mi", 0xF1934);
new Glyph("mije", 0xF1935, true) ;
new Glyph("moku", 0xF1936);
new Glyph("moli", 0xF1937);
new Glyph("monsi", 0xF1938);
new Glyph("mu", 0xF1939, true) ;
new Glyph("mun", 0xF193A);
new Glyph("musi", 0xF193B);
new Glyph("mute", 0xF193C, true) ;
new Glyph("nanpa", 0xF193D, false, true);
new Glyph("nasa", 0xF193E);
new Glyph("nasin", 0xF193F);
new Glyph("nena", 0xF1940);
new Glyph("ni", 0xF1941);
new Glyph("nimi", 0xF1942);
new Glyph("noka", 0xF1943);
new Glyph("o", 0xF1944);
new Glyph("olin", 0xF1945, true) ;
new Glyph("ona", 0xF1946);
new Glyph("open", 0xF1947, false, true);
new Glyph("pakala", 0xF1948);
new Glyph("pali", 0xF1949);
new Glyph("palisa", 0xF194A);
new Glyph("pan", 0xF194B);
new Glyph("pana", 0xF194C, true) ;
new Glyph("pi", 0xF194D, false, true);
new Glyph("pilin", 0xF194E);
new Glyph("pimeja", 0xF194F);
new Glyph("pini", 0xF1950, false, true);
new Glyph("pipi", 0xF1951);
new Glyph("poka", 0xF1952);
new Glyph("poki", 0xF1953);
new Glyph("pona", 0xF1954);
new Glyph("pu", 0xF1955);
new Glyph("sama", 0xF1956);
new Glyph("seli", 0xF1957);
new Glyph("selo", 0xF1958);
new Glyph("seme", 0xF1959);
new Glyph("sewi", 0xF195A, true) ;
new Glyph("sijelo", 0xF195B);
new Glyph("sike", 0xF195C);
new Glyph("sin", 0xF195D);
new Glyph("sina", 0xF195E);
new Glyph("sinpin", 0xF195F);
new Glyph("sitelen", 0xF1960);
new Glyph("sona", 0xF1961, false, true);
new Glyph("soweli", 0xF1962);
new Glyph("suli", 0xF1963);
new Glyph("suno", 0xF1964);
new Glyph("supa", 0xF1965);
new Glyph("suwi", 0xF1966);
new Glyph("tan", 0xF1967);
new Glyph("taso", 0xF1968);
new Glyph("tawa", 0xF1969, false, true);
new Glyph("telo", 0xF196A);
new Glyph("tenpo", 0xF196B, true) ;
new Glyph("toki", 0xF196C);
new Glyph("tomo", 0xF196D);
new Glyph("tu", 0xF196E);
new Glyph("unpa", 0xF196F);
new Glyph("uta", 0xF1970, true) ;
new Glyph("utala", 0xF1971);
new Glyph("walo", 0xF1972);
new Glyph("wan", 0xF1973);
new Glyph("waso", 0xF1974);
new Glyph("wawa", 0xF1975);
new Glyph("weka", 0xF1976);
new Glyph("wile", 0xF1977, true, true) ;
new Glyph("namako", 0xF1978, true) ;
new Glyph("kin", 0xF1979);
new Glyph("oko", 0xF197A);
new Glyph("kipisi", 0xF197B);
new Glyph("leko", 0xF197C);
new Glyph("monsuta", 0xF197D);
new Glyph("tonsi", 0xF197E);
new Glyph("jasima", 0xF197F);
new Glyph("kijetesantakalu", 0xF1980);
new Glyph("soko", 0xF1981);
new Glyph("meso", 0xF1982);
new Glyph("epiku", 0xF1983);
new Glyph("kokosila", 0xF1984);
new Glyph("lanpan", 0xF1985, true) ;
new Glyph("n", 0xF1986, false, true);
new Glyph("misikeke", 0xF1987, true) ;
new Glyph("ku", 0xF1988);
new Glyph("pake", 0xF19A0);
new Glyph("apeja", 0xF19A1);
new Glyph("majuna", 0xF19A2);
new Glyph("powe", 0xF19A3);
new Glyph("linluwi", 0xF19A4, true) ;
new Glyph("kiki", 0xF19A5);
new Glyph("su", 0xF19A6);
new Glyph("wa", 0xF19C0, false, true);
new Glyph("owe", 0xF19AE);
