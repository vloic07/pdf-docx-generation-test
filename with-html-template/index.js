const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const htmlToDocx = require('html-to-docx');

async function generateFiles() {
    console.log('Generating files');
    const templateInputData = getTemplateInputData();
    const html = fillTemplate(templateInputData);
    await generatePdf(html);
    await generateDocx(html);
}

async function generatePdf(html){
    console.log('Converting HTML to PDF');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({path: path.join(__dirname, 'generated-files/output.pdf'), format: 'A4'});
    await browser.close();
}

function getTemplateInputData() {
    return {
        title: 'Project Status Report',
        content: 'This report provides an overview of the project status.',
        items: [
            'Completed initial project setup',
            'Implemented user authentication',
            'Designed database schema',
            'Developed REST API endpoints',
            'Created frontend components'
        ]
    };
}

function fillTemplate(data) {
    console.log('Filling template with data');
    const templatePath = path.join(__dirname, 'templates', 'handlebars-template.html');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    const filledTemplate = template(data);
    fs.writeFileSync(path.join(__dirname, 'generated-files/output.html'), filledTemplate, 'utf-8')
    return filledTemplate;
}

async function generateDocx(html){
    console.log('Converting HTML to DOCX');
    const docxBuffer = await htmlToDocx(html);
    fs.writeFileSync(path.join(__dirname, 'generated-files/output.docx'), docxBuffer);
}

console.log('Generating all files from HTML template...');
generateFiles();