/**1) Implementação das Classes Básicas (2,0 pontos) 
 
• Classe Perfil: 
o Atributos: 
▪ ID único, apelido, foto (emojis), email, status (ativo/inativo), array de amigos, e 
array de postagens. 
o Métodos: 
▪ Adicionar amigo; 
▪ Remover amigo; 
▪ Adicionar publicação; 
▪ Listar amigos; 
▪ Listar postagens; 
▪ Ativar/desativar perf */

import { ulid } from "ulid";

export default class Perfil {
    private _id: string;
    private _apelido: string;
    private _foto: string;
    private _email: string;
    private _status: boolean;
    private _amigos!: Perfil[];

    constructor(_apelido: string, _foto: string, _email: string, id?: string, status?: boolean) {
        
        if (id) {
            this._id = id;  
        } else {
            this._id = ulid().toString(); 
        }

        if (status) {
            this._status = status;
        } else {
            this._status = true;
        }

        this._apelido = _apelido;
        this._foto = _foto;
        this._email = _email;
        this._amigos = [];
    }

    public get id(): string {
        return this._id;
    }

    public get apelido(): string {
        return this._apelido;
    }

    public get foto(): string {
        return this._foto;
    }

    public get email(): string {
        return this._email;
    }

    public get amigos(): Perfil[] {
        return this._amigos;
    }

    public set status(status: boolean) {
        this._status = status;
    }

    public set apelido(apelido: string) {
        this._apelido = apelido;
    }

    public set foto(foto: string) {
        this._foto = foto;
    }

    public set email(email: string) {
        this._email = email;
    }

    public ativar(): void {
        this._status = true;
    }

    public desativar(): void {
        this._status = false;
    }

    public adicionarAmigo(amigo: Perfil): void {
        this._amigos.push(amigo);
    }

    public toString(): string {
        return `
        ==== PERFIL ${this._id} ====
        Apelido: ${this._apelido}
        Foto: ${this._foto}
        Email: ${this._email}
        Status: ${this._status ? "Ativo" : "Inativo"}
        =======================
        `
    }
}
