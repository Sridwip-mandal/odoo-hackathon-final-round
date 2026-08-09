const fs = require('fs');
const pdf = require('pdf-parse');

const pdf1 = 'C:\\\\Users\\\\argha\\\\.gemini\\\\antigravity-ide\\\\brain\\\\54fcc0fe-5adb-4708-a6a2-03704b23b4d8\\\\media__1786234142169.pdf';
const pdf2 = 'C:\\\\Users\\\\argha\\\\.gemini\\\\antigravity-ide\\\\brain\\\\54fcc0fe-5adb-4708-a6a2-03704b23b4d8\\\\media__1786234142121.pdf';

pdf(fs.readFileSync(pdf1)).then(function(data) {
    console.log("PDF 1 START:");
    console.log(data.text.substring(0, 500));
});

pdf(fs.readFileSync(pdf2)).then(function(data) {
    console.log("PDF 2 START:");
    console.log(data.text.substring(0, 500));
});
