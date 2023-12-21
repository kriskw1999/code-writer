"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolsMap = void 0;
const fs_1 = __importDefault(require("fs"));
const gpt_1 = require("./gpt");
const path = require("path");
const createOrUpdateFile = ({ fileName, content }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Creating file ${fileName} with content ${content}`);
    fs_1.default.writeFileSync(fileName, content);
});
const createMultipleFiles = ({ values }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Creating multiple files`, values);
    values.forEach((value) => {
        createOrUpdateFile(value);
    });
});
const readFile = ({ fileName, newQuestion, }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Reading file ${fileName}`);
    const fileContent = fs_1.default.readFileSync(fileName, "utf8");
    const gptResponse = yield (0, gpt_1.fetchGptResponse)(`${newQuestion}, File content: \n${fileContent}`);
    return yield (0, gpt_1.handleGptResponse)(gptResponse);
});
const readDirectoryRecursively = ({ dirPath, depth = 0, }) => {
    let result = "";
    const prefix = " ".repeat(depth * 2); // Indentation for hierarchy
    fs_1.default.readdirSync(dirPath).forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs_1.default.statSync(filePath);
        if (stat && stat.isDirectory()) {
            result += `${prefix}[Folder] ${file}\n`;
            result += readDirectoryRecursively({
                dirPath: filePath,
                depth: depth + 1,
            });
        }
        else {
            result += `${prefix}[File] ${file}\n`;
        }
    });
    return result;
};
const readDirectoryAndAskNewQuestion = ({ dirPath, newQuestion, }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("READING DIRECTORY: ", dirPath);
    const result = readDirectoryRecursively({ dirPath: dirPath });
    const gptResponse = yield (0, gpt_1.fetchGptResponse)(`${newQuestion}, Folder structure: \n${result}`);
    return yield (0, gpt_1.handleGptResponse)(gptResponse);
});
exports.toolsMap = {
    createFile: createOrUpdateFile,
    createMultipleFiles,
    readDirectoryRecursively,
    readDirectoryAndAskNewQuestion,
    readFile,
};
