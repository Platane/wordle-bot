import * as path from "path";
import * as fs from "fs";
import { getWordList } from "../src/wordlist";
import {
  createSolver,
  evaluateWord,
  isLineCorrect,
} from "../src/solver-simple";
import { evaluationToSquare } from "../src/type";

(async () => {
  const wordList = (await getWordList()).slice(0, 2000);

  const grids = Array.from({ length: 60 }, () => {
    const solution = wordList[Math.floor(Math.random() * wordList.length)];

    const solver = createSolver(wordList);

    const grid: string[][] = [];

    while (grid.length < 6) {
      const w = solver.getNextWord();

      const line = evaluateWord(solution, w);

      solver.reportLine(line);

      grid.push(line.map((e) => evaluationToSquare(e.evaluation)));

      if (isLineCorrect(line)) break;
    }

    return grid;
  });

  const body = grids
    .map(
      (grid) =>
        '<div class="grid">' +
        grid
          .map(
            (line) =>
              '<div class="line">' +
              line.map((s) => `<div class="tile">${s}</div>`).join("") +
              "</div>"
          )
          .join("\n") +
        "</div>"
    )
    .join("");

  const page = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" />
    <style>
    .grid {
        padding:16px;
        display:flex;
        flex-direction:column;
    }
    .line {
        display:flex;
        flex-direction:row;
    }
    .tile {
        width:18px;
        height:18px;
        font-size:16px;
    }
    .container{
        display:flex;
        flex-direction:row;
        flex-wrap:wrap;
        width:100%;
        transform:translate( 50px, 90px ) rotateY(20deg) scale(1.7);

    }
    .overlay{
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background-image: radial-gradient( transparent 50%,  #333 110% )
    }
    .world {
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        transform-style: preserve-3d;
        perspective: 2000px;
        perspective-origin: 0 0;
    }
    body {
        margin:0;
        background-color: #f8f8f8;
        overflow:hidden;

        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
    }
    
    </style>
    </head>
    <body>
    <div class="world">
        <div class="container">${body}</div>
    </div>
    <div class="overlay"/>
    </body>
    </html>
    `;

  fs.writeFileSync(path.join(__dirname, "./banner.html"), page);
})();
