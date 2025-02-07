import promptSync from "prompt-sync";

const prompt = promptSync();

export function cls(): void {
    console.clear();
}

export function enter(): void {
    prompt("\nPressione Enter para continuar...");
}
