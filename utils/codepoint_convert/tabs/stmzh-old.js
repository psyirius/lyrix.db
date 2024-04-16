export default function convert(value) {
    value = value.replace(/p/g, "ஸ்ரீ");
    value = value.replace(/r/g, "௸");

    value = value.replace(/Øáe/g, "ளௌ");
    value = value.replace(/¼áV/g, "ளோ");
    value = value.replace(/ØáV/g, "ளொ");
    value = value.replace(/áV/g, "ளா");
    value = value.replace(/eV/g, "ளா");
    value = value.replace(/¹/g, "ளி");
    value = value.replace(/C/g, "ளீ");
    value = value.replace(/Ó/g, "ளு");
    value = value.replace(/j/g, "ளூ");
    value = value.replace(/Øá/g, "ளெ");
    value = value.replace(/¼á/g, "ளே");
    value = value.replace(/çá/g, "ளை");
    value = value.replace(/\^/g, "ள்");
    value = value.replace(/á/g, "ள");

    value = value.replace(/Ö/g, "இ");


    value = value.replace(/Ø³e/g, "க்ஷௌ");
    value = value.replace(/¼³V/g, "க்ஷோ");
    value = value.replace(/Ø³V/g, "க்ஷொ");
    value = value.replace(/³V/g, "க்ஷா");
    value = value.replace(/H/g, "க்ஷி");
    value = value.replace(/È/g, "க்ஷீ");
    value = value.replace(/Y/g, "க்ஷு");
    value = value.replace(/f/g, "க்ஷூ");
    value = value.replace(/Ø³/g, "க்ஷெ");
    value = value.replace(/¼³/g, "க்ஷே");
    value = value.replace(/ç³/g, "க்ஷை");

    value = value.replace(/Õ/g, "க்ஷ்");
    value = value.replace(/³/g, "க்ஷ");

    value = value.replace(/Øïe/g, "கௌ");
    value = value.replace(/¼ïV/g, "கோ");
    value = value.replace(/ØïV/g, "கொ");
    value = value.replace(/ïV/g, "கா");
    value = value.replace(/þ/g, "கி");
    value = value.replace(/ÿ/g, "கீ");
    value = value.replace(/z/g, "கு");
    value = value.replace(/í/g, "கூ");
    value = value.replace(/Øï/g, "கெ");
    value = value.replace(/¼ï/g, "கே");
    value = value.replace(/çï/g, "கை");

    value = value.replace(/Â/g, "க்");
    value = value.replace(/ï/g, "க");

    value = value.replace(/Øôe/g, "ஙௌ");
    value = value.replace(/¼ôV/g, "ஙோ");
    value = value.replace(/ØôV/g, "ஙொ");
    value = value.replace(/ôV/g, "ஙா");

    value = value.replace(/Øô/g, "ஙெ");
    value = value.replace(/¼ô/g, "ஙே");
    value = value.replace(/çô/g, "ஙை");

    value = value.replace(/º/g, "ங்");
    value = value.replace(/ô/g, "ங");

    value = value.replace(/ØÄe/g, "சௌ");
    value = value.replace(/¼ÄV/g, "சோ");
    value = value.replace(/ØÄV/g, "சொ");
    value = value.replace(/ÄV/g, "சா");
    value = value.replace(/E/g, "சி");
    value = value.replace(/æ/g, "சீ");
    value = value.replace(/·/g, "சு");
    value = value.replace(/ó/g, "சூ");
    value = value.replace(/ØÄ/g, "செ");
    value = value.replace(/¼Ä/g, "சே");
    value = value.replace(/çÄ/g, "சை");

    value = value.replace(/ß/g, "ச்");
    value = value.replace(/Ä/g, "ச");

    value = value.replace(/ØÛe/g, "ஜௌ");
    value = value.replace(/¼ÛV/g, "ஜோ");
    value = value.replace(/ØÛV/g, "ஜொ");
    value = value.replace(/ÛV/g, "ஜா");
    value = value.replace(/÷/g, "ஜி");
    value = value.replace(/ý/g, "ஜீ");
    value = value.replace(/h/g, "ஜு");
    value = value.replace(/É/g, "ஜூ");
    value = value.replace(/ØÛ/g, "ஜெ");
    value = value.replace(/¼Û/g, "ஜே");
    value = value.replace(/çÛ/g, "ஜை");

    value = value.replace(/ë/g, "ஜ்");
    value = value.replace(/Û/g, "ஜ");

    value = value.replace(/ØQe/g, "ஞௌ");
    value = value.replace(/¼QV/g, "ஞோ");
    value = value.replace(/ØQV/g, "ஞொ");
    value = value.replace(/QV/g, "ஞா");

    value = value.replace(/ØQ/g, "ஞெ");
    value = value.replace(/¼Q/g, "ஞே");
    value = value.replace(/çQ/g, "ஞை");

    value = value.replace(/Þ/g, "ஞ்");
    value = value.replace(/Q/g, "ஞ");

    value = value.replace(/Ø¦e/g, "டௌ");
    value = value.replace(/¼¦V/g, "டோ");
    value = value.replace(/Ø¦V/g, "டொ");
    value = value.replace(/¦V/g, "டா");
    value = value.replace(/½/g, "டி");
    value = value.replace(/Ï/g, "டீ");

    value = value.replace(/ù/g, "டூ");
    value = value.replace(/Ø¦/g, "டெ");
    value = value.replace(/¼¦/g, "டே");
    value = value.replace(/ç¦/g, "டை");

    value = value.replace(/â/g, "ட்");
    value = value.replace(/¦/g, "ட");

    value = value.replace(/Øðe/g, "ணௌ");
    value = value.replace(/¼ðV/g, "ணோ");
    value = value.replace(/ØðV/g, "ணொ");
    value = value.replace(/ðV/g, "ணா");
    value = value.replace(/è/g, "ணி");
    value = value.replace(/§/g, "ணீ");
    value = value.replace(/b/g, "ணு");
    value = value.replace(/I/g, "ணூ");
    value = value.replace(/Øð/g, "ணெ");
    value = value.replace(/¼ð/g, "ணே");
    value = value.replace(/çð/g, "ணை");

    value = value.replace(/õ/g, "ண்");
    value = value.replace(/ð/g, "ண");


    value = value.replace(/Ø>e/g, "தௌ");
    value = value.replace(/¼>V/g, "தோ");
    value = value.replace(/Ø>V/g, "தொ");
    value = value.replace(/>V/g, "தா");
    value = value.replace(/]/g, "தி");
    value = value.replace(/y/g, "தீ");
    value = value.replace(/m/g, "து");
    value = value.replace(/#/g, "தூ");
    value = value.replace(/Ø>/g, "தெ");
    value = value.replace(/¼>/g, "தே");
    value = value.replace(/ç>/g, "தை");

    value = value.replace(/Ý/g, "த்");
    value = value.replace(/>/g, "த");


    value = value.replace(/Øåª/g, "நௌ");
    value = value.replace(/¼åV/g, "நோ");
    value = value.replace(/ØåV/g, "நொ");
    value = value.replace(/åV/g, "நா");
    value = value.replace(/W/g, "நி");
    value = value.replace(/À/g, "நீ");
    value = value.replace(/O/g, "நு");
    value = value.replace(/±/g, "நூ");
    value = value.replace(/Øå/g, "நெ");
    value = value.replace(/¼å/g, "நே");
    value = value.replace(/çå/g, "நை");

    value = value.replace(/Í/g, "ந்");
    value = value.replace(/å/g, "ந");

    value = value.replace(/Ø\\á/g, "மௌ");
    value = value.replace(/¼\\V/g, "மோ");
    value = value.replace(/Ø\\V/g, "மொ");
    value = value.replace(/\\V/g, "மா");
    value = value.replace(/t/g, "மி");
    value = value.replace(/\*/g, "மீ");
    value = value.replace(/x/g, "மு");
    value = value.replace(/J/g, "மூ");
    value = value.replace(/Ø\\/g, "மெ");
    value = value.replace(/¼\\/g, "மே");
    value = value.replace(/ç\\/g, "மை");

    value = value.replace(/D/g, "ம்");
    value = value.replace(/\\/g, "ம");


    value = value.replace(/Øªe/g, "னௌ");
    value = value.replace(/¼ªV/g, "னோ");
    value = value.replace(/ØªV/g, "னொ");
    value = value.replace(/ªV/g, "னா");
    value = value.replace(/M/g, "னி");
    value = value.replace(/Ì/g, "னீ");
    value = value.replace(/Ð/g, "னு");
    value = value.replace(/û/g, "னூ");
    value = value.replace(/Øª/g, "னெ");
    value = value.replace(/¼ª/g, "னே");
    value = value.replace(/çª/g, "னை");

    value = value.replace(/\[/g, "ன்");
    value = value.replace(/ª/g, "ன");

    value = value.replace(/ØÃe/g, "பௌ");
    value = value.replace(/¼ÃV/g, "போ");
    value = value.replace(/ØÃV/g, "பொ");
    value = value.replace(/ÃV/g, "பா");
    value = value.replace(/¸/g, "பி");
    value = value.replace(/¬/g, "பீ");
    value = value.replace(/A/g, "பு");
    value = value.replace(/¯/g, "பூ");
    value = value.replace(/ØÃ/g, "பெ");
    value = value.replace(/¼Ã/g, "பே");
    value = value.replace(/çÃ/g, "பை");

    value = value.replace(/©/g, "ப்");
    value = value.replace(/Ã/g, "ப");



    value = value.replace(/Ø«e/g, "ரௌ");
    value = value.replace(/¼«V/g, "ரோ");
    value = value.replace(/Ø«V/g, "ரொ");
    value = value.replace(/«V/g, "ரா");
    value = value.replace(/ö/g, "ரி");
    value = value.replace(/Z/g, "ரீ");
    value = value.replace(/ò/g, "ரு");
    value = value.replace(/Ô/g, "ரூ");
    value = value.replace(/Ø«/g, "ரெ");
    value = value.replace(/¼«/g, "ரே");
    value = value.replace(/ç«/g, "ரை");

    value = value.replace(/ú/g, "ர்");
    value = value.replace(/ì/g, "ர்");
    value = value.replace(/«/g, "ர");

    value = value.replace(/Øée/g, "லௌ");
    value = value.replace(/¼éV/g, "லோ");
    value = value.replace(/ØéV/g, "லொ");
    value = value.replace(/éV/g, "லா");
    value = value.replace(/o/g, "லி");
    value = value.replace(/Ü/g, "லீ");
    value = value.replace(/K/g, "லு");
    value = value.replace(/Ù/g, "லூ");
    value = value.replace(/Øé/g, "லெ");
    value = value.replace(/¼é/g, "லே");
    value = value.replace(/çé/g, "லை");

    value = value.replace(/_/g, "ல்");
    value = value.replace(/é/g, "ல");



    value = value.replace(/Øke/g, "வௌ");
    value = value.replace(/¼kV/g, "வோ");
    value = value.replace(/ØkV/g, "வொ");
    value = value.replace(/kV/g, "வா");
    value = value.replace(/s/g, "வி");
    value = value.replace(/T/g, "வீ");
    value = value.replace(/¡/g, "வு");
    value = value.replace(/Æ/g, "வூ");
    value = value.replace(/Øk/g, "வெ");
    value = value.replace(/¼k/g, "வே");
    value = value.replace(/çk/g, "வை");

    value = value.replace(/Ë/g, "வ்");
    value = value.replace(/k/g, "வ");


    value = value.replace(/Øwe/g, "ழௌ");
    value = value.replace(/¼wV/g, "ழோ");
    value = value.replace(/ØwV/g, "ழொ");
    value = value.replace(/wV/g, "ழா");
    value = value.replace(/a/g, "ழி");
    value = value.replace(/Ñ/g, "ழீ");
    value = value.replace(/¿/g, "ழு");
    value = value.replace(/ñ/g, "ழூ");
    value = value.replace(/Øw/g, "ழெ");
    value = value.replace(/¼w/g, "ழே");
    value = value.replace(/çw/g, "ழை");

    value = value.replace(/µ/g, "ழ்");
    value = value.replace(/w/g, "ழ");

    value = value.replace(/ØÅe/g, "றௌ");
    value = value.replace(/¼ÅV/g, "றோ");
    value = value.replace(/ØÅV/g, "றொ");
    value = value.replace(/ÅV/g, "றா");
    value = value.replace(/¤/g, "றி");
    value = value.replace(/S/g, "றீ");
    value = value.replace(/®/g, "று");
    value = value.replace(/G/g, "றூ");
    value = value.replace(/ØÅ/g, "றெ");
    value = value.replace(/¼Å/g, "றே");
    value = value.replace(/çÅ/g, "றை");

    value = value.replace(/u/g, "ற்");
    value = value.replace(/Å/g, "ற");

    value = value.replace(/ØBe/g, "யௌ");
    value = value.replace(/¼BV/g, "யோ");
    value = value.replace(/BV/g, "யா");
    value = value.replace(/l/g, "யி");
    value = value.replace(/X/g, "யீ");
    value = value.replace(/¥/g, "யு");
    value = value.replace(/R/g, "யூ");
    value = value.replace(/ØB/g, "யெ");
    value = value.replace(/¼B/g, "யே");
    value = value.replace(/çB/g, "யை");

    value = value.replace(/F/g, "ய்");
    value = value.replace(/B/g, "ய");

    value = value.replace(/Øve/g, "ஸௌ");
    value = value.replace(/¼vV/g, "ஸோ");
    value = value.replace(/ØvV/g, "ஸொ");
    value = value.replace(/vV/g, "ஸா");
    value = value.replace(/L/g, "ஸி");
    value = value.replace(/¢/g, "ஸீ");
    value = value.replace(/q/g, "ஸு");
    value = value.replace(/`/g, "ஸூ");
    value = value.replace(/Øv/g, "ஸெ");
    value = value.replace(/¼v/g, "ஸே");
    value = value.replace(/çv/g, "ஸை");
    value = value.replace(/ü/g, "ஸ்");
    value = value.replace(/v/g, "ஸ");


    value = value.replace(/ØÇe/g, "ஹௌ");
    value = value.replace(/¼ÇV/g, "ஹோ");
    value = value.replace(/ØÇV/g, "ஹொ");
    value = value.replace(/ÇV/g, "ஹா");
    value = value.replace(/N/g, "ஹி");
    value = value.replace(/ê/g, "ஹீ");
    value = value.replace(/ø/g, "ஹு");
    value = value.replace(/Ú/g, "ஹூ");
    value = value.replace(/ØÇ/g, "ஹெ");
    value = value.replace(/¼Ç/g, "ஹே");
    value = value.replace(/çÇ/g, "ஹை");
    value = value.replace(/ã/g, "ஹ்");
    value = value.replace(/Ç/g, "ஹ");


    value = value.replace(/Ø­e/g, "ஷௌ");
    value = value.replace(/¼­V/g, "ஷோ");
    value = value.replace(/Ø­V/g, "ஷொ");
    value = value.replace(/­V/g, "ஷா");
    value = value.replace(/´/g, "ஷி");
    value = value.replace(/U/g, "ஷீ");
    value = value.replace(/×/g, "ஷு");
    value = value.replace(/£/g, "ஷூ");
    value = value.replace(/Ø­/g, "ஷெ");
    value = value.replace(/¼­/g, "ஷே");
    value = value.replace(/ç­/g, "ஷை");

    value = value.replace(/i/g, "ஷ்");
    value = value.replace(/­/g, "ஷ");

    value = value.replace(/ØBe/g, "யௌ");
    value = value.replace(/¼BV/g, "யோ");
    value = value.replace(/ØBV/g, "ய");
    value = value.replace(/BV/g, "யா");
    value = value.replace(/l/g, "யி");
    value = value.replace(/X/g, "யீ");
    value = value.replace(/¥/g, "யு");
    value = value.replace(/R/g, "யூ");
    value = value.replace(/ØB/g, "யெ");
    value = value.replace(/¼B/g, "யே");
    value = value.replace(/çB/g, "யை");

    value = value.replace(/F/g, "ய்");
    value = value.replace(/B/g, "ய");

    value = value.replace(/¶/g, "அ");
    value = value.replace(/g/g, "ஆ");
    value = value.replace(/~/g, "ஈ");
    value = value.replace(/c/g, "உ");
    value = value.replace(/»/g, "ஊ");
    value = value.replace(/¨/g, "எ");
    value = value.replace(/°/g, "ஏ");
    value = value.replace(/n/g, "ஐ");
    value = value.replace(/Î/g, "ஒ");
    value = value.replace(/{/g, "ஓ");
    value = value.replace(/Á/g, "ஔ");


    value = value.replace(/à/g, "ஃ");

    value = value.replace(/\|/g, "டு");

    value = value.replace(/Š/g, "-");

    value = value.replace(/"/g, "‘");
    value = value.replace(/'/g, "’");
    value = value.replace(/\$/g, "×");
    value = value.replace(/@/g, "÷");

    return value;
}