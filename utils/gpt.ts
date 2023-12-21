import OpenAI from "openai";
import * as dotenv from "dotenv";
import { toolsMap } from "./file";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messages: {
  role: "user" | "system";
  content: string;
}[] = [
  {
    role: "user",
    content:
      "I want to receive code changes and tips from existing code, use the functions to read the code and to change it and to create new files and folders when possible then lastly provide messages to the user to ask for more information or to provide more information",
  },
];

export const fetchGptResponse = async (message: string) => {
  messages.push({
    role: "user",
    content: message,
  });
  return await openai.chat.completions.create({
    model: "gpt-4",
    messages: messages,
    tools: [
      {
        type: "function",
        function: {
          name: "createFile",
          description:
            "Creates or updates an existing file with the given name and content",
          parameters: {
            type: "object",
            properties: {
              fileName: {
                type: "string",
                description: "Name of the file to be created",
              },
              content: {
                type: "string",
                description: "Content of the file to be created",
              },
            },
            required: ["properties", "content"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "createMultipleFiles",
          description:
            "Creates a list of files with the given names and content",
          parameters: {
            type: "object",
            properties: {
              values: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    fileName: {
                      type: "string",
                      description: "Name of the file to be created",
                    },
                    content: {
                      type: "string",
                      description: "Content of the file to be created",
                    },
                  },
                  required: ["properties", "content"],
                },
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "readDirectoryAndAskNewQuestion",
          description:
            "read the folder structure of the given directory recursively and return the result as string, and provide the next prompt to ask with the given folder structure",
          parameters: {
            type: "object",
            properties: {
              dirPath: {
                type: "string",
                description: "Path of the directory to be read",
              },
              newQuestion: {
                type: "string",
                description:
                  "The instruction that should be asked to perform to chat gpt with the given folder structure",
              },
            },
            required: ["dirPath", "newQuestion"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "readFile",
          description:
            "read the file content of the given file and return the result as string, and provide the next prompt to ask with the given file content",
          parameters: {
            type: "object",
            properties: {
              fileName: {
                type: "string",
                description: "Path of the file to be read",
              },
              newQuestion: {
                type: "string",
                description:
                  "The instruction that should be asked to perform to chat gpt with the given file content",
              },
            },
            required: ["dirPath", "newQuestion"],
          },
        },
      },
    ],
    temperature: 1,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};

export const handleGptResponse = async (
  response: OpenAI.Chat.Completions.ChatCompletion
) => {
  for (const choice of response.choices) {
    if (choice.message.tool_calls?.length) {
      for (const toolCall of choice.message.tool_calls) {
        console.log("TOOL CALL: ", toolCall);
        const type = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        const tool = toolsMap[type as keyof typeof toolsMap];

        await tool(args);
      }

      return;
    }

    console.log("REPLY: ", choice.message.content);
  }
};
