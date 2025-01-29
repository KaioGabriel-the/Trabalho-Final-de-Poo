"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perfil_1 = __importDefault(require("./perfil"));
class PerfilAvancado extends perfil_1.default {
    habilitarPerfil(perfil) {
        perfil.ativar();
    }
    desabilitarPerfil(perfil) {
        perfil.desativar();
    }
}
exports.default = PerfilAvancado;
