import fs from 'node:fs'
import path from 'node:path'

import {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} from "@google/generative-ai";


const INPUT_DIR = path.resolve(import.meta.dirname, '..', '.tmp');

const token = process.env["GEMINI_API_KEY"]!;

if (!token) {
  throw new Error("GEMINI_API_KEY is required");
}

const genAI = new GoogleGenerativeAI(token)

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-002",
    generationConfig: {
        temperature: 0.25,
        topP: 1,
        topK: 1,
        responseMimeType: "application/json",
    },
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
    ]
})

const config = {
    prompts: {
        system: `
        You are an expert in transliteration from Tamil to English.
        The user will provide you a json array of strings in Tamil song titles.
        Your task is to transliterate them to English.
        
        Instructions:
            1. Make sure to transliterate all items in the json array. Never miss an item.
            2. Your response must be the json array with the English transliterated strings.
            3. Provide transliterations only in English and not in Latin.
            4. Never give translated response. Strictly give only transliterated response.
            5. The first letter of each word should be in capital letters.
            6. You response should be in the same order as the input.
            7. Your response should be a valid JSON array of strings with no prefix or suffix or anything.
            8. Don't wrap the json array in any object. Just the array of strings.
            9. Don't wrap the json array in markdown or any other formatting.
            
        Examples:
        - input: ["தேவ ரீருக்கே! மிக ஸ்தோத்திரம்", "ஸ்தோத்திரம் இயேசுஇராஜா உமக்கென்றும்"]
          output: ["Deva Reerukke! Miga Sthothiram", "Sthothiram Yesu Raaja Umakkendrum"]
        - input: ["இயேசு என்ற திரு நாமத்திற்கு", "இயேசுவுக்கு ஸ்தோத்திரம் என் மீட்பராம்", "ஸ்தோத்திரப்பலிகளைச் செலுத்துவோம்", "தொழுகிறோம்  எங்கள் பிதாவே", "தேவன்  நமக்கு அடைக்கலமும்!!", "ஸ்தோத்திரம் பாடிப் போற்றுவேன்"]
          output: ["Yesu Endra Thiru Naamaththirku", "Yesuvukku Sthothiram En Meetparum", "Sthothira Paligalai Seluththuvom", "Thozhugirrom Engal Pithave", "Devan Namaku Adaikkalamum!!", "Sthothiram Paadi Potruven"]
        `
    },
}

async function transliterate(inputs: string[]) {
    const prompt = [
        `system: \`\`\`\n${config.prompts.system}\n\`\`\``,
        `input: \`\`\`json\n${JSON.stringify(inputs)}\n\`\`\``,
    ].join('\n\n');

    const { response } = await model.generateContent(prompt)

    console.log("Responded!");

    const result: Record<string, string>[] = [];

    const res = response.text();

    try {
        const rx = JSON.parse(res) as string[];

        if (!Array.isArray(rx)) {
            throw new Error("Invalid response type");
        }

        result.push(
            ...rx.map((name, i) => ({ [inputs[i]]: name }))
        );
    } catch (e) {
        console.error("Response:", res);

        throw new Error("Invalid response format");
    }

    if (result.length !== inputs.length) {
        throw new Error("Invalid response length");
    }

    return result;
}

const INP_FILE = path.resolve(INPUT_DIR, 'kcc-songs.tamil-names.json');
if (!fs.existsSync(INP_FILE)) {
    throw new Error('Input file not found: ' + INP_FILE);
}
const _todoNames = fs.readFileSync(path.resolve(INPUT_DIR, INP_FILE), 'utf-8');
const todoNames = JSON.parse(_todoNames) as string[];

!(async function exec(chunkSize = 250) {
    console.log('Processing Chunk:', chunkSize);

    const OUT_FILE = path.resolve(INPUT_DIR, 'kcc-songs.tanglish-names.json');
    const doneMap = (fs.existsSync(OUT_FILE) ? JSON.parse(fs.readFileSync(OUT_FILE, 'utf-8')) : {}) as Record<string, string>;

    // collect not done names
    const notDoneNames = todoNames.filter(name => !doneMap[name]);

    const inputs = notDoneNames.slice(0, chunkSize);

    if (!Array.isArray(inputs)) {
        throw new Error('Invalid input');
    }

    if (inputs.length === 0) {
        console.log('All done');
        process.exit(0);
    }

    try {
        const res = await transliterate(inputs);
        console.log('Processed:', res);

        const remaining = notDoneNames.length - chunkSize;

        console.log('Remaining:', remaining);

        const done = res.reduce((acc, item) => {
            const key = Object.keys(item)[0];
            acc[key] = item[key];
            return acc;
        }, doneMap);

        // return;

        fs.writeFileSync(OUT_FILE, JSON.stringify(done, null, 2));

        console.log('Done');

        if (remaining > 0) {
            console.log('Waiting before Next chunk...');
            setTimeout(() => exec(chunkSize), 1500);
        }
    } catch (err) {
        console.error("The operation encountered an error:", err);
    }
})();