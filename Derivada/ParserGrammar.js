import { Grammar } from "./Grammar.js";
import { Rhs, Nt } from "./Rhs.js";


/**
 * -------------------------------------------------------------
 *   This module was written by Gemini
 * -------------------------------------------------------------
 * Analisa uma string contendo uma Gramática Livre de Contexto e
 * retorna uma instância devidamente populada do objeto Grammar.
 * * @param {string} input - A string com as regras da gramática.
 * @returns {Grammar} A instância da sua classe Grammar.
 */
export function parseGrammar(input) {
    // Tokenizador: Extrai todos os símbolos relevantes e ignora espaços em branco.
    const tokens = input.match(/->|\||;|'[^']*'|[a-zA-Z_]\w*/g) || [];
    let pos = 0;

    const grammar = new Grammar();

    while (pos < tokens.length) {
        const lhsLex = tokens[pos++];

        if (tokens[pos++] !== '->') {
            throw new SyntaxError(`Erro de sintaxe: Esperado '->' após '${lhsLex}'`);
        }

        const lhsNt = new Nt(lhsLex);
        const rhsObj = new Rhs();
        let currentSeq = [];

        while (pos < tokens.length && tokens[pos] !== ';') {
            const token = tokens[pos++];

            if (token === '|') {
                // Fim da sequência atual, adiciona ao Rhs e limpa o array
                // Se a sequência for vazia (ex: | |), colocamos a string vazia para seguir sua lógica de nullable
                if (currentSeq.length === 0) currentSeq.push('');
                rhsObj.addAlternative(currentSeq);
                currentSeq = [];
            } else if (token === 'eps') {
                // Em sua classe Grammar e Rhs, a sequência vazia é avaliada checando se
                // o terminal é igual a '' (string vazia).
                currentSeq.push('');
            } else if (token.startsWith("'") && token.endsWith("'")) {
                // É um terminal: adicionamos a string sem as aspas
                currentSeq.push(token.slice(1, -1));
            } else {
                // É um não-terminal: instanciamos a classe Nt
                currentSeq.push(new Nt(token));
            }
        }

        // Adiciona a última sequência avaliada antes do ';'
        if (currentSeq.length === 0) currentSeq.push('');
        rhsObj.addAlternative(currentSeq);

        if (tokens[pos++] !== ';') {
            throw new SyntaxError(`Erro de sintaxe: Esperado ';' no final da regra '${lhsLex}'`);
        }

        // Adiciona a produção na gramática
        // Nota: O método no seu arquivo Grammar.js está escrito como 'addProdcution'
        grammar.addProdcution(lhsNt.lex, rhsObj);
    }

    return grammar;
}
// E->E'+'E|'n';