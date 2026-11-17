const keywords = new Set(["program", "function", "const", "int", "float", "string", "char", "boolean", "void", "array", "matrix", "range", "class", "extends", "new", "this", "super", "constructor", "lambda", "fn", "parallel", "task", "if", "else", "while", "do", "for", "return", "print", "true", "false"]);
const logical = new Set(["and", "or", "not", "xor", "nor", "nand"]);
const isLetter = (character: string): boolean => character >= "a" && character <= "z" || character >= "A" && character <= "Z" || character === "_";
const isDigit = (character: string): boolean => character >= "0" && character <= "9";
const token = (tokens: Array<{ startIndex: number; scopes: string }>, startIndex: number, scopes: string): void => { tokens.push({ startIndex, scopes }); };

export const registerCorapriLanguage = (monacoApi: any): void => {
  monacoApi.languages.register({ id: "corapri" });
  const state = { clone: () => state, equals: (other: unknown) => other === state };
  monacoApi.languages.setTokensProvider("corapri", {
    getInitialState: () => state,
    tokenize: (line: string) => {
      const tokens: Array<{ startIndex: number; scopes: string }> = [];
      let index = 0;
      while (index < line.length) {
        const character = line[index] ?? "";
        if (character === " " || character === "\t") { index++; continue; }
        if (character === "/" && line[index + 1] === "/") { token(tokens, index, "comment"); break; }
        if (character === '"' || character === "'") { const quote = character; const start = index; index++; while (index < line.length) { if (line[index] === "\\") index += 2; else { const closed = line[index] === quote; index++; if (closed) break; } } token(tokens, start, quote === '"' ? "string" : "char"); continue; }
        if (isDigit(character) || character === "." && isDigit(line[index + 1] ?? "")) { const start = index; let decimal = character === "."; index++; while (index < line.length && (isDigit(line[index] ?? "") || !decimal && line[index] === ".")) { if (line[index] === ".") decimal = true; index++; } token(tokens, start, decimal ? "float" : "number"); continue; }
        if (isLetter(character)) { const start = index; index++; while (index < line.length && (isLetter(line[index] ?? "") || isDigit(line[index] ?? ""))) index++; const word = line.slice(start, index); token(tokens, start, keywords.has(word) ? "keyword" : logical.has(word) ? "logical" : "identifier"); continue; }
        const pair = line.slice(index, index + 2); if (["&&", "||", "++", "--"].includes(pair)) { token(tokens, index, pair === "++" || pair === "--" ? "increment" : "logical"); index += 2; continue; }
        if ("!+-*/%=<>^".includes(character)) { token(tokens, index, character === "!" ? "logical" : "arithmetic"); index++; continue; }
        if (character === "|" || character === "&") { token(tokens, index, "set"); index++; continue; }
        if ("{}()[].,;:".includes(character)) { token(tokens, index, "delimiter"); index++; continue; }
        index++;
      }
      return { tokens, endState: state };
    },
  });
};
