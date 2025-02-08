import Perfil from "./perfil";
import { ulid } from "ulid";
export default class Publicacao {
    private _id: string;
    private _conteudo: string;
    private _data: Date;
    private _perfil: Perfil;

    constructor(conteudo: string, perfil: Perfil, id?: string, data?: Date) {
        
        if (id) {
            this._id = id;  
        } else {
            this._id = ulid().toString(); 
        }

        if (data){
            this._data = data;
        } else {
            this._data = new Date();
        }

        this._conteudo = conteudo;
        this._perfil = perfil;
    }

    public get id(): string {
        return this._id;
    }

    public get conteudo(): string {
        return this._conteudo;
    }

    public get data(): Date {
        return this._data;
    }

    public get perfil(): Perfil {
        return this._perfil;
    }

    public set conteudo(conteudo: string) {
        this._conteudo = conteudo;
    }

    public set data(data: Date) {
        this._data = data;
    }

    public exibir(): void{
        console.log(
            `===== Publicacao ${this._id} =====\n` +
            `Autor: ${this.perfil.apelido}\n` +
            `Data: ${this.data.toLocaleDateString()} - ${this.data.toLocaleTimeString()}\n` +
            `Conteudo: ${this._conteudo}`
        );
    }

}
