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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (server) => __awaiter(void 0, void 0, void 0, function* () {
    server.get('/customer', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        // Handle GET request
    }));
    server.post('/customer', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        // Handle POST request
    }));
    server.put('/customer', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        // Handle PUT request
    }));
    server.delete('/customer', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        // Handle DELETE request
    }));
});
