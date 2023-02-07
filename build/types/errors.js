"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFailed = void 0;
const isFailed = (obj) => {
    return obj.code !== undefined;
};
exports.isFailed = isFailed;
