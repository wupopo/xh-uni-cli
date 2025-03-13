import { program } from "commander";
import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import semver from "semver";
import { execSync } from "child_process";
import ejs from "ejs";
import packagejson from "../package.json";

const checkNpmManagerInstall = (name: string) => {
  try {
    execSync(`${name} --version`, { stdio: "ignore" });
    return true;
  } catch (e) {
    throw new Error(`${name} 未安装`);
  }
};

program
  .version(packagejson.version)
  .description("@xh/uni-cli 命令行工具")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "projectName",
          message: "请输入项目名称",
          default: "xh-uni-app",
        },
        {
          type: "input",
          name: "appName",
          message: "请输入应用名称",
          default: "小火软件",
        },
        {
          type: "select",
          name: "version",
          message: "请选择项目类型",
          choices: ["v2", "v3"],
          default: "v3",
        },
        {
          type: "select",
          name: "npmManager",
          message: "请选择包管理工具？",
          choices: ["pnpm", "npm", "cnpm", "yarn"],
          default: "pnpm",
        },
      ])
      .then((res) => {
        const localVersion = semver.clean(process.version)!;
        if (semver.lt(localVersion, "16.7.0")) {
          throw new Error(
            `当前 Node 版本为 ${localVersion}，请升级到 16.7.0 或以上版本`
          );
        }

        if (res.version == "v2") {
          throw new Error("v2版本待更新，请选择v3版本");
        }
        checkNpmManagerInstall(res.npmManager);
        const templateDir = path.join(
          import.meta.dirname,
          `../templates/xh-${res.version}`
        );

        const targetDir = path.join(process.cwd(), res.projectName);
        if (fs.existsSync(targetDir)) {
          throw new Error(`${res.projectName}目录已存在`);
        }

        fs.mkdirSync(targetDir);
        fs.cpSync(templateDir, targetDir, { recursive: true });

        const packagePath = path.join(targetDir, "package.json");
        ejs.renderFile(packagePath, res, (err, res) => {
          if (!err) {
            fs.writeFileSync(packagePath, res);
          }
        });

        const pagesPath = path.join(targetDir, "src", "pages.json");
        ejs.renderFile(pagesPath, res, (err, res) => {
          if (!err) {
            fs.writeFileSync(pagesPath, res);
          }
        });

        const manifest = path.join(targetDir, "src", "manifest.json");
        ejs.renderFile(pagesPath, res, (err, res) => {
          if (!err) {
            fs.writeFileSync(manifest, res);
          }
        });
        execSync(`cd ${res.projectName} && ${res.npmManager} install`, {
          stdio: "inherit",
        });
      });
  });

program.parse();
