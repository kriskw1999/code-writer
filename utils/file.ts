import fs from "fs";
import { fetchGptResponse, handleGptResponse } from "./gpt";
const path = require("path");

type FilePayload = { fileName: string; content: string };

const createOrUpdateFile = async ({ fileName, content }: FilePayload) => {
  console.log(`Creating file ${fileName} with content ${content}`);

  fs.writeFileSync(fileName, content);
};

const createMultipleFiles = async ({ values }: { values: FilePayload[] }) => {
  console.log(`Creating multiple files`, values);

  values.forEach((value) => {
    createOrUpdateFile(value);
  });
};

const readFile = async ({
  fileName,
  newQuestion,
}: {
  fileName: string;
  newQuestion: string;
}) => {
  console.log(`Reading file ${fileName}`);

  const fileContent = fs.readFileSync(fileName, "utf8");

  const gptResponse = await fetchGptResponse(
    `${newQuestion}, File content: \n${fileContent}`
  );

  return await handleGptResponse(gptResponse);
};

const readDirectoryRecursively = ({
  dirPath,
  depth = 0,
}: {
  dirPath: string;
  depth?: number;
}) => {
  let result = "";
  const prefix = " ".repeat(depth * 2); // Indentation for hierarchy

  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      result += `${prefix}[Folder] ${file}\n`;
      result += readDirectoryRecursively({
        dirPath: filePath,
        depth: depth + 1,
      });
    } else {
      result += `${prefix}[File] ${file}\n`;
    }
  });

  return result;
};

const readDirectoryAndAskNewQuestion = async ({
  dirPath,
  newQuestion,
}: {
  dirPath: string;
  newQuestion: string;
  depth?: number;
}) => {
  console.log("READING DIRECTORY: ", dirPath);

  const result = readDirectoryRecursively({ dirPath: dirPath });

  const gptResponse = await fetchGptResponse(
    `${newQuestion}, Folder structure: \n${result}`
  );

  return await handleGptResponse(gptResponse);
};

export const toolsMap = {
  createFile: createOrUpdateFile,
  createMultipleFiles,
  readDirectoryRecursively,
  readDirectoryAndAskNewQuestion,
  readFile,
};
