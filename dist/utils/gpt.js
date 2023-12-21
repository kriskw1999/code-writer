"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.handleGptResponse = exports.fetchGptResponse = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv = __importStar(require("dotenv"));
const file_1 = require("./file");
dotenv.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const messages = [
    {
        role: "user",
        content: "I want to receive code changes and tips from existing code, use the functions to read the code and to change it and to create new files and folders when possible then lastly provide messages to the user to ask for more information or to provide more information",
    },
];
const fetchGptResponse = (message) => __awaiter(void 0, void 0, void 0, function* () {
    messages.push({
        role: "user",
        content: message,
    });
    return yield openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        tools: [
            {
                type: "function",
                function: {
                    name: "createFile",
                    description: "Creates or updates an existing file with the given name and content",
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
                    description: "Creates a list of files with the given names and content",
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
                    description: "read the folder structure of the given directory recursively and return the result as string, and provide the next prompt to ask with the given folder structure",
                    parameters: {
                        type: "object",
                        properties: {
                            dirPath: {
                                type: "string",
                                description: "Path of the directory to be read",
                            },
                            newQuestion: {
                                type: "string",
                                description: "The instruction that should be asked to perform to chat gpt with the given folder structure",
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
                    description: "read the file content of the given file and return the result as string, and provide the next prompt to ask with the given file content",
                    parameters: {
                        type: "object",
                        properties: {
                            fileName: {
                                type: "string",
                                description: "Path of the file to be read",
                            },
                            newQuestion: {
                                type: "string",
                                description: "The instruction that should be asked to perform to chat gpt with the given file content",
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
});
exports.fetchGptResponse = fetchGptResponse;
const handleGptResponse = (response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    for (const choice of response.choices) {
        if ((_a = choice.message.tool_calls) === null || _a === void 0 ? void 0 : _a.length) {
            for (const toolCall of choice.message.tool_calls) {
                console.log("TOOL CALL: ", toolCall);
                const type = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments);
                const tool = file_1.toolsMap[type];
                yield tool(args);
            }
            return;
        }
        console.log("REPLY: ", choice.message.content);
    }
});
exports.handleGptResponse = handleGptResponse;
