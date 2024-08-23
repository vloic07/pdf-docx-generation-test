const fs = require('fs');
const path = require('path');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

function getTemplate() {
    const templatePath = path.join(__dirname, 'templates', 'template.docx');
    return fs.readFileSync(templatePath, 'binary');
}

function generateDocxFromTemplate(data) {
    const templateContent = getTemplate();
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.setData(data);
    doc.render();

    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    const outputPath = path.join(__dirname, 'generated-files', 'output.docx');
    fs.writeFileSync(outputPath, buf);
}

async function createPdfFromDocx() {
    const ext = '.pdf'
    const inputPath = path.join(__dirname, '/generated-files/output.docx');
    const outputPath = path.join(__dirname, '/generated-files/output.pdf');


    const docxBuf = fs.readFileSync(inputPath);

    // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
    let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);

    // Here in done you have pdf file which you can save or transfer in another stream
    fs.writeFileSync(outputPath, pdfBuf);
}

const data = {
    status: 'Mon statut dynamique',
    name: 'My name'
};

console.log('Generating files from DOCX template...');
generateDocxFromTemplate(data);
createPdfFromDocx();
