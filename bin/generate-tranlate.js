const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '../src/');

function traverseDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
            traverseDirectory(fullPath);
        } else if (file === 'pt.json') {
            processTranslationFiles(fullPath);
        }
    });
}

function processTranslationFiles(ptFilePath) {
    const translations = ['en', 'es', 'fr']; // Idiomas que você quer suportar
    const ptContent = JSON.parse(fs.readFileSync(ptFilePath, 'utf8'));

    translations.forEach(lang => {
        const langFilePath = ptFilePath.replace('pt.json', `${lang}.json`);

        if (fs.existsSync(langFilePath)) {
            updateTranslationFile(langFilePath, ptContent);
        } else {
            fs.writeFileSync(langFilePath, JSON.stringify(ptContent, null, 2), 'utf8');
            console.log(`Arquivo de tradução criado: ${langFilePath}`);
        }
    });
}

function updateTranslationFile(langFilePath, ptContent) {
    const langContent = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
    let updated = false;

    for (const key in ptContent) {
        if (!langContent.hasOwnProperty(key)) {
            console.log(ptContent[key])
            langContent[key] = ptContent[key] + 'adicionado por script';
            updated = true;
        }
    }

    if (updated) {
        fs.writeFileSync(langFilePath, JSON.stringify(langContent, null, 2), 'utf8');
        console.log(`Arquivo de tradução atualizado: ${langFilePath}`);
    } else {
        console.log(`Nenhuma atualização necessária para: ${langFilePath}`);
    }
}

traverseDirectory(projectRoot);