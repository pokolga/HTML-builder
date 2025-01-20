const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);
const stat = promisify(fs.stat);

// Создание директории project-dist
async function createProjectDist() {
  await mkdir(path.join(__dirname,'project-dist'), { recursive: true });
}

// Замена шаблонных тегов в template.html
async function replaceTemplateTags() {
  const templatePath = path.join(__dirname, 'template.html');
  let templateContent = await readFile(templatePath, 'utf8');

  const componentsDir = path.join(__dirname, 'components');
  const componentFiles = await readdir(componentsDir);

  for (const file of componentFiles) {
    const componentName = path.basename(file, '.html');
    const componentContent = await readFile(path.join(componentsDir, file), 'utf8');
    const tag = `{{${componentName}}}`;
    templateContent = templateContent.replace(new RegExp(tag, 'g'), componentContent);
  }

  await writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateContent);
}

// Компиляция стилей
async function compileStyles() {
  const stylesDir = path.join(__dirname,'styles');
  const styleFiles = await readdir(stylesDir);
  let stylesContent = '';

  for (const file of styleFiles) {
    if (path.extname(file) === '.css') {
      const fileContent = await readFile(path.join(stylesDir, file), 'utf8');
      stylesContent += fileContent;
    }
  }

  await writeFile(path.join(__dirname, 'project-dist', 'style.css'), stylesContent);
}

// Копирование папки assets
async function copyAssets() {
  const assetsDir = path.join(__dirname, 'assets');
  const projectAssetsDir = path.join(__dirname, 'project-dist', 'assets');

  await mkdir(projectAssetsDir, { recursive: true });


  async function copyDir(src, dest) {
    const entries = await readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await mkdir(destPath, { recursive: true });
        await copyDir(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  }  

  await copyDir(assetsDir, projectAssetsDir);

}
// Основная функция
async function buildProject() {
  try {
    await createProjectDist();
    await replaceTemplateTags();
    await compileStyles();
    await copyAssets();
    
  } catch (error) {
    throw new Error(err);
  }
}

buildProject();