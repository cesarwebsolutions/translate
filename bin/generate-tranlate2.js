const fs = require("fs");
const path = require("path");
const { Translate } = require("@google-cloud/translate").v2;

// Configuração do cliente de tradução
const translate = new Translate({
  key: "AIzaSyD-z7caO2B6M-ZuZ2Lf52ffsUVFkXfdqwk",
  email: "cesar.sprite@gmail.com",
});

const fileMapping = {
  "pt-BR": { default: "pt-BR.json", en: "en-US.json", es: "es-ES.json" },
  pt: { default: "pt.json", en: "en.json", es: "es.json" },
};

// Função para traduzir propriedades ausentes em arquivos JSON de tradução
async function updateTranslationFile(baseContent, targetContent, lang) {
  for (const [key, value] of Object.entries(baseContent)) {
    if (typeof value === "object" && value !== null) {
      targetContent[key] = targetContent[key] || {};
      await updateTranslationFile(value, targetContent[key], lang);
    } else {
      if (!targetContent.hasOwnProperty(key)) {
        const placeholderRegex = /{{(.*?)}}/g;

        const placeholders = [];
        const protectedText = value.replace(placeholderRegex, (match, p1) => {
          placeholders.push(match); // Salva o placeholder original
          return `__PLACEHOLDER_${placeholders.length}__`; // Substitui pelo identificador
        });
        const [translatedText] = await translate.translate(protectedText, lang);
        console.log("[translatedText]", translatedText);
        const finalText = translatedText.replace(
          /__PLACEHOLDER_(\d+)__/g,
          (match, p1) => {
            return placeholders[parseInt(p1) - 1]; // Recupera o placeholder original
          }
        );
        console.log("[finalText]", finalText);
        targetContent[key] = finalText;
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
        const { filePath, targetFilePath } = await getFilePaths(
          fullPath,
          targetLang
        );
        if (fs.existsSync(filePath)) {
          console.log("[filePath]", filePath);
          const ptContent = JSON.parse(fs.readFileSync(filePath, "utf8"));
          // console.log(ptContent);
          let targetContent = {};

          // Lê o arquivo de tradução existente (en.json), se houver
          if (fs.existsSync(targetFilePath)) {
            targetContent = JSON.parse(fs.readFileSync(targetFilePath, "utf8"));
          }
          // console.log(targetContent);

          // Atualiza o conteúdo com as traduções ausentes
          await updateTranslationFile(ptContent, targetContent, targetLang);

          // Salva o conteúdo traduzido no arquivo de destino
          fs.writeFileSync(
            targetFilePath,
            JSON.stringify(targetContent, null, 2),
            "utf8"
          );
          // console.log(`Arquivo de tradução atualizado: ${targetFilePath}`);
        }
      } else {
        // Continua a busca nos subdiretórios
        await traverseAndTranslate(fullPath, targetLang);
      }
    }
  }
}

async function getFilePaths(fullPath, targetLang) {
  const langPriority = ["pt-BR", "pt"];
  let filePath, targetFilePath;

  for (const lang of langPriority) {
    const defaultFilePath = path.join(fullPath, fileMapping[lang].default);

    if (fs.existsSync(defaultFilePath)) {
      filePath = defaultFilePath;
      targetFilePath = fileMapping[lang][targetLang]
        ? path.join(fullPath, fileMapping[lang][targetLang])
        : null;
      break;
    }
  }

  return { filePath, targetFilePath };
}

// Função principal
(async function main() {
  const projectRoot = path.join(__dirname, "../src"); // Ajuste o caminho conforme a estrutura do seu projeto
  ["en", "es"].forEach(async (lang) => {
    console.log("starting translation ", lang);
    await traverseAndTranslate(projectRoot, lang);
    console.log("finish translation");
  });
})();
