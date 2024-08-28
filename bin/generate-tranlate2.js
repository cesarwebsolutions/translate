const fs = require("fs");
const path = require("path");
const { Translate } = require("@google-cloud/translate").v2;

// Configuração do cliente de tradução
const translate = new Translate({
  key: "AIzaSyD-z7caO2B6M-ZuZ2Lf52ffsUVFkXfdqwk",
  email: "cesar.sprite@gmail.com",
});

// Função para traduzir propriedades ausentes em arquivos JSON de tradução
async function updateTranslationFile(baseContent, targetContent, lang) {
  for (const [key, value] of Object.entries(baseContent)) {
    if (typeof value === "object" && value !== null) {
      targetContent[key] = targetContent[key] || {};
      await updateTranslationFile(value, targetContent[key], lang);
    } else {
      if (!targetContent.hasOwnProperty(key)) {
        const [translation] = await translate.translate(value, lang);
        targetContent[key] = translation;
      }
    }
  }
}

// Função para percorrer diretórios e buscar pastas `i18n/pt`
async function traverseAndTranslate(directory, targetLang = "en") {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);

    if (fs.statSync(fullPath).isDirectory()) {
      // Se a pasta é `i18n`, verifica se contém `pt`
      if (file === "i18n") {
        console.log(fullPath);
        const ptFilePath = path.join(fullPath, "pt.json");
        const targetFilePath = path.join(fullPath, `${targetLang}.json`);

        console.log(ptFilePath);
        if (fs.existsSync(ptFilePath)) {
          const ptContent = JSON.parse(fs.readFileSync(ptFilePath, "utf8"));
          console.log(ptContent);
          let targetContent = {};

          // Lê o arquivo de tradução existente (en.json), se houver
          if (fs.existsSync(targetFilePath)) {
            targetContent = JSON.parse(fs.readFileSync(targetFilePath, "utf8"));
          }
          console.log(targetContent);

          // Atualiza o conteúdo com as traduções ausentes
          await updateTranslationFile(ptContent, targetContent, targetLang);

          // Salva o conteúdo traduzido no arquivo de destino
          fs.writeFileSync(
            targetFilePath,
            JSON.stringify(targetContent, null, 2),
            "utf8"
          );
          console.log(`Arquivo de tradução atualizado: ${targetFilePath}`);
        }
      } else {
        // Continua a busca nos subdiretórios
        await traverseAndTranslate(fullPath, targetLang);
      }
    }
  }
}

// Função principal
(async function main() {
  const projectRoot = path.join(__dirname, "../src"); // Ajuste o caminho conforme a estrutura do seu projeto
  ["en", "es"].forEach(async (lang) => {
    await traverseAndTranslate(projectRoot, lang);
  });
})();
