# Wordle Bot

<p align="center">
<img width="200px" src="./doc/profile.svg" />
</p>

A bot who solves the daily [powerlanguage.co.uk/wordle](https://www.powerlanguage.co.uk/wordle/) and posts the result on twitter.

> 🚧 The layout has changed since the game move to NYT. Unfortunately the selector need to be updated, until them the bot is broken

- 🐦 [twitter account](https://twitter.com/OasisPlatane)
- 📚 [result archive](https://github.com/Platane/wordle-bot/tree/output)

# Implementation

## Automation

The bot launches a browser instance with pupetteer and acts like a regular user. _It even detects errors, [impressive](https://cdn.jsdelivr.net/gh/Platane/wordle-bot@5a9763b061f43cbe7cb42f98fa349c935817bfdf/Wordle-240.mp4) !_

It runs every day at 9 GMT, thanks to [github action cron job](.github/workflows/solve-daily.yml).

## Solver

- [baseline solver](src/solver-simple/README.md)
- [advanced solver](src/solver-advanced/README.md)

# Attribution

The word list is extracted from [github.com/powerlanguage/guess-my-word](https://github.com/powerlanguage/guess-my-word/tree/master/wordlist), which was obtained from [scrabbledict](https://sourceforge.net/projects/scrabbledict/). Licensed under [GPL](https://github.com/powerlanguage/guess-my-word/blob/master/wordlist/gpl.txt)
