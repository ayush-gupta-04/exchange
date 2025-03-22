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
exports.initializeDB = initializeDB;
function initializeDB(pgClient) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Database initialised successfully !");
        }
        catch (error) {
            yield pgClient.query(`ROLLBACK`);
            console.log("Error in DB initialisation !");
            console.log(error);
            console.log("Rolled back to initial state !");
        }
    });
}
