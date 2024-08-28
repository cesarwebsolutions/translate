const fs = require("fs");
const path = require("path");
const env = require("process");
const { Translate } = require("@google-cloud/translate").v2;

const private_key = "";
const credentials = {
  private_key,
  client_email: "cesar.sprite@gmail.com",
};
const translate = new Translate({
  key: private_key,
  email: "cesar.sprite@gmail.com",
});

const projectRoot = path.join(__dirname, "../src/");

async function traverseDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);

    if (fs.statSync(fullPath).isDirectory()) {
      await traverseDirectory(fullPath);
    } else if (file === "pt.json") {
      await processTranslationFiles(fullPath);
    }
  }
}

async function processTranslationFiles(ptFilePath) {
  const translations = ["en"];
  const ptContent = JSON.parse(fs.readFileSync(ptFilePath, "utf8"));

  for (const lang of translations) {
    const langFilePath = ptFilePath.replace("pt.json", `${lang}.json`);

    if (fs.existsSync(langFilePath)) {
      const teste = await updateTranslationFile(langFilePath, ptContent, lang);
      console.log(teste);
    } else {
      fs.writeFileSync(
        langFilePath,
        JSON.stringify(ptContent, null, 2),
        "utf8"
      );
      console.log(`Arquivo de tradução criado: ${langFilePath}`);
    }
  }
}

async function updateTranslationFile(baseContent, targetContent, lang) {
  const updatedContent = { ...targetContent };

  async function recurse(base, target) {
    for (const key in base) {
      if (typeof base[key] === "object" && base[key] !== null) {
        target[key] = target[key] || {};
        recurse(base[key], target[key]);
      } else {
        if (!target.hasOwnProperty(key)) {
          target[key] = base[key];
        }
      }
    }
  }

  await recurse(baseContent, updatedContent);
  return updatedContent;
}

// async function updateTranslationFile2(langFilePath, ptContent, lang) {
//   const langContent = JSON.parse(fs.readFileSync(langFilePath, "utf8"));
//   let updated = false;

//   for (const key in ptContent) {
//     if (!langContent.hasOwnProperty(key)) {
//       console.log(key);
//       console.log(ptContent, "AQUI");
//       const [translation] = await translate.translate(ptContent[key], lang);
//       console.log(translation);
//       langContent[key] = translation;
//       updated = true;
//     }
//   }

//   if (updated) {
//     fs.writeFileSync(
//       langFilePath,
//       JSON.stringify(langContent, null, 2),
//       "utf8"
//     );
//     console.log(`Arquivo de tradução atualizado: ${langFilePath}`);
//   } else {
//     console.log(`Nenhuma atualização necessária para: ${langFilePath}`);
//   }
// }

(async () => {
  await traverseDirectory(projectRoot);
})();
