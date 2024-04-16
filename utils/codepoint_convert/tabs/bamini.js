export default function convert(value) {
    value = value.replace(/\[§/g, "ஜு");
    value = value.replace(/,/g, "இ");
    value = value.replace(/\|/g, ";");
    value = value.replace(/>/g, ",");
    value = value.replace(/sp/g, "ளி");
    value = value.replace(/hp/g, "ரி");
    value = value.replace(/hP/g, "ரீ");
    value = value.replace(/uP/g, "ரீ");
    value = value.replace(/u;/g, "ர்");
    value = value.replace(/h;/g, "ர்");
    value = value.replace(/H/g, "ர்");

    value = value.replace(/n~s/g, "க்ஷௌ");
    value = value.replace(/N~h/g, "க்ஷோ");
    value = value.replace(/n~h/g, "க்ஷொ");
    value = value.replace(/~h/g, "க்ஷா");
    value = value.replace(/~p/g, "க்ஷி");
    value = value.replace(/~P/g, "க்ஷீ");
    value = value.replace(/~§/g, "க்ஷு");
    value = value.replace(/~_/g, "க்ஷூ");
    value = value.replace(/n~/g, "க்ஷெ");
    value = value.replace(/N~/g, "க்ஷே");
    value = value.replace(/i~/g, "க்ஷை");
    value = value.replace(/~;/g, "க்ஷ்");
    value = value.replace(/~/g, "க்ஷ");

    value = value.replace(/nfs/g, "கௌ");
    value = value.replace(/Nfh/g, "கோ");
    value = value.replace(/nfh/g, "கொ");
    value = value.replace(/fh/g, "கா");
    value = value.replace(/fp/g, "கி");
    value = value.replace(/fP/g, "கீ");
    value = value.replace(/F/g, "கு");
    value = value.replace(/\$/g, "கூ");
    value = value.replace(/nf/g, "கெ");
    value = value.replace(/Nf/g, "கே");
    value = value.replace(/if/g, "கை");
    value = value.replace(/f;/g, "க்");
    value = value.replace(/f/g, "க");

    value = value.replace(/nqs/g, "ஙௌ");
    value = value.replace(/Nqh/g, "ஙோ");
    value = value.replace(/nqh/g, "ஙொ");
    value = value.replace(/qh/g, "ஙா");
    value = value.replace(/qp/g, "ஙி");
    value = value.replace(/qP/g, "ஙீ");
    value = value.replace(/nq/g, "ஙெ");
    value = value.replace(/Nq/g, "ஙே");
    value = value.replace(/iq/g, "ஙை");
    value = value.replace(/q;/g, "ங்");
    value = value.replace(/q/g, "ங");

    value = value.replace(/nrs/g, "சௌ");
    value = value.replace(/Nrh/g, "சோ");
    value = value.replace(/nrh/g, "சொ");
    value = value.replace(/rh/g, "சா");
    value = value.replace(/rp/g, "சி");
    value = value.replace(/rP/g, "சீ");
    value = value.replace(/R/g, "சு");
    value = value.replace(/#/g, "சூ");
    value = value.replace(/nr/g, "செ");
    value = value.replace(/Nr/g, "சே");
    value = value.replace(/ir/g, "சை");
    value = value.replace(/r;/g, "ச்");
    value = value.replace(/r/g, "ச");


    value = value.replace(/n\[s/g, "ஜௌ");
    value = value.replace(/N\[h/g, "ஜோ");
    value = value.replace(/n\[h/g, "ஜொ");
    value = value.replace(/\[h/g, "ஜா");
    value = value.replace(/\[p/g, "ஜி");
    value = value.replace(/\[P/g, "ஜீ");

    value = value.replace(/\[_/g, "ஜூ");
    value = value.replace(/n\[/g, "ஜெ");
    value = value.replace(/N\[/g, "ஜே");
    value = value.replace(/i\[/g, "ஜை");
    value = value.replace(/\[;/g, "ஜ்");
    value = value.replace(/\[/g, "ஜ");

    value = value.replace(/nQs/g, "ஞௌ");
    value = value.replace(/NQh/g, "ஞோ");
    value = value.replace(/nQh/g, "ஞொ");
    value = value.replace(/Qh/g, "ஞா");
    value = value.replace(/Qp/g, "ஞி");
    value = value.replace(/QP/g, "ஞீ");
    value = value.replace(/nQ/g, "ஞெ");
    value = value.replace(/NQ/g, "ஞே");
    value = value.replace(/iQ/g, "ஞை");
    value = value.replace(/Q;/g, "ஞ்");
    value = value.replace(/Q/g, "ஞ");

    value = value.replace(/nls/g, "டௌ");
    value = value.replace(/Nlh/g, "டோ");
    value = value.replace(/nlh/g, "டொ");
    value = value.replace(/lp/g, "டி");
    value = value.replace(/lP/g, "டீ");
    value = value.replace(/lh/g, "டா");
    value = value.replace(/b/g, "டி");
    value = value.replace(/B/g, "டீ");
    value = value.replace(/L/g, "டு");
    value = value.replace(/\^/g, "டூ");
    value = value.replace(/nl/g, "டெ");
    value = value.replace(/Nl/g, "டே");
    value = value.replace(/il/g, "டை");
    value = value.replace(/l;/g, "ட்");
    value = value.replace(/l/g, "ட");

    value = value.replace(/nzs/g, "ணௌ");
    value = value.replace(/Nzh/g, "ணோ");
    value = value.replace(/nzh/g, "ணொ");
    value = value.replace(/zh/g, "ணா");
    value = value.replace(/zp/g, "ணி");
    value = value.replace(/zP/g, "ணீ");
    value = value.replace(/Zh/g, "ணூ");
    value = value.replace(/Z}/g, "ணூ");
    value = value.replace(/nz/g, "ணெ");
    value = value.replace(/Nz/g, "ணே");
    value = value.replace(/iz/g, "ணை");
    value = value.replace(/z;/g, "ண்");
    value = value.replace(/Z/g, "ணு");
    value = value.replace(/z/g, "ண");

    value = value.replace(/njs/g, "தௌ");
    value = value.replace(/Njh/g, "தோ");
    value = value.replace(/njh/g, "தொ");
    value = value.replace(/jh/g, "தா");
    value = value.replace(/jp/g, "தி");
    value = value.replace(/jP/g, "தீ");
    value = value.replace(/Jh/g, "தூ");
    value = value.replace(/Jh/g, "தூ");
    value = value.replace(/J}/g, "தூ");
    value = value.replace(/J/g, "து");
    value = value.replace(/nj/g, "தெ");
    value = value.replace(/Nj/g, "தே");
    value = value.replace(/ij/g, "தை");
    value = value.replace(/j;/g, "த்");
    value = value.replace(/j/g, "த");

    value = value.replace(/nes/g, "நௌ");
    value = value.replace(/Neh/g, "நோ");
    value = value.replace(/neh/g, "நொ");
    value = value.replace(/eh/g, "நா");
    value = value.replace(/ep/g, "நி");
    value = value.replace(/eP/g, "நீ");
    value = value.replace(/E}/g, "நூ");
    value = value.replace(/Eh/g, "நூ");
    value = value.replace(/E/g, "நு");
    value = value.replace(/ne/g, "நெ");
    value = value.replace(/Ne/g, "நே");
    value = value.replace(/ie/g, "நை");
    value = value.replace(/e;/g, "ந்");
    value = value.replace(/e/g, "ந");


    value = value.replace(/nds/g, "னௌ");
    value = value.replace(/Ndh/g, "னோ");
    value = value.replace(/ndh/g, "னொ");
    value = value.replace(/dh/g, "னா");
    value = value.replace(/dp/g, "னி");
    value = value.replace(/dP/g, "னீ");
    value = value.replace(/D}/g, "னூ");
    value = value.replace(/Dh/g, "னூ");
    value = value.replace(/D/g, "னு");
    value = value.replace(/nd/g, "னெ");
    value = value.replace(/Nd/g, "னே");
    value = value.replace(/id/g, "னை");
    value = value.replace(/d;/g, "ன்");
    value = value.replace(/d/g, "ன");

    value = value.replace(/ngs/g, "பௌ");
    value = value.replace(/Ngh/g, "போ");
    value = value.replace(/ngh/g, "பொ");
    value = value.replace(/gh/g, "பா");
    value = value.replace(/gp/g, "பி");
    value = value.replace(/gP/g, "பீ");
    value = value.replace(/G/g, "பு");
    value = value.replace(/ng/g, "பெ");
    value = value.replace(/Ng/g, "பே");
    value = value.replace(/ig/g, "பை");
    value = value.replace(/g;/g, "ப்");
    value = value.replace(/g/g, "ப");

    value = value.replace(/nks/g, "மௌ");
    value = value.replace(/Nkh/g, "மோ");
    value = value.replace(/nkh/g, "மொ");
    value = value.replace(/kh/g, "மா");
    value = value.replace(/kp/g, "மி");
    value = value.replace(/kP/g, "மீ");
    value = value.replace(/K/g, "மு");
    value = value.replace(/%/g, "மூ");
    value = value.replace(/nk/g, "மெ");
    value = value.replace(/Nk/g, "மே");
    value = value.replace(/ik/g, "மை");
    value = value.replace(/k;/g, "ம்");
    value = value.replace(/k/g, "ம");

    value = value.replace(/nas/g, "யௌ");
    value = value.replace(/Nah/g, "யோ");
    value = value.replace(/nah/g, "யொ");
    value = value.replace(/ah/g, "யா");
    value = value.replace(/ap/g, "யி");
    value = value.replace(/aP/g, "யீ");
    value = value.replace(/A/g, "யு");
    value = value.replace(/A\+/g, "யூ");
    value = value.replace(/na/g, "யெ");
    value = value.replace(/Na/g, "யே");
    value = value.replace(/ia/g, "யை");
    value = value.replace(/a;/g, "ய்");
    value = value.replace(/a/g, "ய");

    value = value.replace(/nus/g, "ரௌ");
    value = value.replace(/Nuh/g, "ரோ");
    value = value.replace(/nuh/g, "ரொ");
    value = value.replace(/uh/g, "ரா");
    value = value.replace(/up/g, "ரி");
    value = value.replace(/U/g, "ரு");
    value = value.replace(/&/g, "ரூ");
    value = value.replace(/nu/g, "ரெ");
    value = value.replace(/Nu/g, "ரே");
    value = value.replace(/iu/g, "ரை");
    value = value.replace(/u/g, "ர");

    value = value.replace(/nys/g, "லௌ");
    value = value.replace(/Nyh/g, "லோ");
    value = value.replace(/nyh/g, "லொ");
    value = value.replace(/yh/g, "லா");
    value = value.replace(/yp/g, "லி");
    value = value.replace(/yP/g, "லீ");
    value = value.replace(/Yh/g, "லூ");
    value = value.replace(/Y}/g, "லூ");
    value = value.replace(/Y/g, "லு");
    value = value.replace(/ny/g, "லெ");
    value = value.replace(/Ny/g, "லே");
    value = value.replace(/iy/g, "லை");
    value = value.replace(/y;/g, "ல்");
    value = value.replace(/y/g, "ல");

    value = value.replace(/nss/g, "ளௌ");
    value = value.replace(/Nsh/g, "ளோ");
    value = value.replace(/nsh/g, "ளொ");
    value = value.replace(/sh/g, "ளா");
    value = value.replace(/sP/g, "ளீ");
    value = value.replace(/@/g, "ளூ");
    value = value.replace(/S/g, "ளு");
    value = value.replace(/ns/g, "ளெ");
    value = value.replace(/Ns/g, "ளே");
    value = value.replace(/is/g, "ளை");
    value = value.replace(/s;/g, "ள்");
    value = value.replace(/s/g, "ள");

    value = value.replace(/ntt;/g, "வெவ்");
    value = value.replace(/ntt/g, "வௌ");
    value = value.replace(/Nth/g, "வோ");
    value = value.replace(/nth/g, "வொ");
    value = value.replace(/th/g, "வா");
    value = value.replace(/tp/g, "வி");
    value = value.replace(/tP/g, "வீ");
    value = value.replace(/nt/g, "வெ");
    value = value.replace(/Nt/g, "வே");
    value = value.replace(/it/g, "வை");
    value = value.replace(/t;/g, "வ்");
    value = value.replace(/t/g, "வ");

    value = value.replace(/noo/g, "ழௌ");
    value = value.replace(/Noh/g, "ழோ");
    value = value.replace(/noh/g, "ழொ");
    value = value.replace(/oh/g, "ழா");
    value = value.replace(/op/g, "ழி");
    value = value.replace(/oP/g, "ழீ");
    value = value.replace(/\*/g, "ழூ");
    value = value.replace(/O/g, "ழு");
    value = value.replace(/no/g, "ழெ");
    value = value.replace(/No/g, "ழே");
    value = value.replace(/io/g, "ழை");
    value = value.replace(/o;/g, "ழ்");
    value = value.replace(/o/g, "ழ");

    value = value.replace(/nws/g, "றௌ");
    value = value.replace(/Nwh/g, "றோ");
    value = value.replace(/nwh/g, "றொ");
    value = value.replace(/wh/g, "றா");
    value = value.replace(/wp/g, "றி");
    value = value.replace(/wP/g, "றீ");
    value = value.replace(/Wh/g, "றூ");
    value = value.replace(/W}/g, "றூ");
    value = value.replace(/W/g, "று");
    value = value.replace(/nw/g, "றெ");
    value = value.replace(/Nw/g, "றே");
    value = value.replace(/iw/g, "றை");
    value = value.replace(/w;/g, "ற்");
    value = value.replace(/w/g, "ற");

    value = value.replace(/n``/g, "ஹௌ");
    value = value.replace(/N`h/g, "ஹோ");
    value = value.replace(/n`h/g, "ஹொ");
    value = value.replace(/`h/g, "ஹா");
    value = value.replace(/`p/g, "ஹி");
    value = value.replace(/`P/g, "ஹீ");
    value = value.replace(/`§/g, "ஹு");
    value = value.replace(/`_/g, "ஹூ");
    value = value.replace(/n`/g, "ஹெ");
    value = value.replace(/N`/g, "ஹே");
    value = value.replace(/i`/g, "ஹை");
    value = value.replace(/`;/g, "ஹ்");
    value = value.replace(/`/g, "ஹ");

    value = value.replace(/n\\s/g, "ஷௌ");
    value = value.replace(/N\\h/g, "ஷோ");
    value = value.replace(/n\\h/g, "ஷொ");
    value = value.replace(/\\h/g, "ஷா");
    value = value.replace(/\\p/g, "ஷி");
    value = value.replace(/\\P/g, "ஷீ");
    value = value.replace(/\\§/g, "ஷு");
    value = value.replace(/\\_/g, "ஷூ");
    value = value.replace(/n\\/g, "ஷெ");
    value = value.replace(/N\\/g, "ஷே");
    value = value.replace(/i\\/g, "ஷை");
    value = value.replace(/\\;/g, "ஷ்");
    value = value.replace(/\\/g, "ஷ");


    value = value.replace(/n]s/g, "ஸௌ");
    value = value.replace(/N]h/g, "ஸோ");
    value = value.replace(/n]h/g, "ஸொ");
    value = value.replace(/]h/g, "ஸா");
    value = value.replace(/]p/g, "ஸி");
    value = value.replace(/]P/g, "ஸீ");
    value = value.replace(/]§/g, "ஸு");
    value = value.replace(/]_/g, "ஸூ");
    value = value.replace(/n]/g, "ஸெ");
    value = value.replace(/N]/g, "ஸே");
    value = value.replace(/i]/g, "ஸை");
    value = value.replace(/];/g, "ஸ்");
    value = value.replace(/]/g, "ஸ");



    value = value.replace(/m/g, "அ");
    value = value.replace(/M/g, "ஆ");
    value = value.replace(/</g, "ஈ");
    value = value.replace(/c/g, "உ");
    value = value.replace(/C/g, "ஊ");
    value = value.replace(/v/g, "எ");
    value = value.replace(/V/g, "ஏ");
    value = value.replace(/I/g, "ஐ");
    value = value.replace(/x/g, "ஒ")
    value = value.replace(/X/g, "ஓ");
    value = value.replace(/xs/g, "ஔ");



    value = value.replace(/\//g, "ஃ");


    value = value.replace(/=/g, "ஸ்ரீ");

    value = value.replace(/¨/g, "௸");

    value = value.replace(/T/g, "வு");


    value = value.replace(/வு\+/g, "வூ");
    value = value.replace(/ப\+/g, "பூ");
    value = value.replace(/பு\+/g, "பூ");
    value = value.replace(/யு\+/g, "யூ");
    value = value.replace(/ய\+/g, "யூ");
    value = value.replace(/சு\+/g, "சூ");
    value = value.replace(/ச\+/g, "சூ");


    value = value.replace(/h/g, "ா");
    value = value.replace(/n/g, "ெ");
    value = value.replace(/N/g, "ே");
    value = value.replace(/i/g, "ை");
    value = value.replace(/§/g, "ு");
    value = value.replace(/_/g, "ூ");
    value = value.replace(/p/g, "ி");
    value = value.replace(/P/g, "ீ");

    return value;
}
