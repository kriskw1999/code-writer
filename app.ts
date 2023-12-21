import * as readline from "readline";
import { fetchGptResponse, handleGptResponse } from "./utils/gpt";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = () => {
  rl.question("Enter your prompt: ", async (userInput) => {
    const response = await fetchGptResponse(userInput);

    await handleGptResponse(response);

    promptUser();
  });
};

promptUser();
