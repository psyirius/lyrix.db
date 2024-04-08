import {Buffer} from 'node:buffer';
import parseRTF from '@extensionengine/rtf-parser';
import presentation from '../etc/legacy-to-port/pro7-json/Aa Yesuvae.json' assert { type: "json" };
import fs from "node:fs";
import RtfParser from 'rtf-parse';

console.log('Song:', presentation.name)
presentation.cues.forEach((cue) => {
    cue.actions.forEach(async (action) => {
        const p = action.slide.presentation;
        // console.log(p.baseSlide);

        p.baseSlide.elements.forEach(async ({element}) => {
            const content = Buffer.from(element.text.rtfData, 'base64').toString('utf8');
            // console.log(content);

            fs.writeFileSync("./xoxo.rtf", content);

            const d = await parseRTF(content);
            // const d = await RtfParser.parseString(content);

            console.log(d);
        })
    })
});