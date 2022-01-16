# Solver Advanced

Simpler solver to serve as a baseline.

# Algorithm

Maintains a list of valid words : ie words that are compatible with the played lines.

To select the next word:

- if there is only one valid word, return it

- pick N candidate from the list of words ( valid or not valid )

  > it would be ideal to check the whole list, but it's usually not performant enough.

- for each candidate, determine an heuristic. Take the candidate with the best heuristic

**heuristic**

A good heuristic is: "if I play this line, how many words can I remove the valid list, in average"

To compute that, we need to consider each word in the valid list. Each one have a 1 / valid_list_length probability to be the solution. In that case what will be the result of playing this line. And how many word are removed from the valid list then.

This is quite expensive as we need to traverse the word list twice for each N candidate.

As word yielding the same result ( ex: 1 -> absent, 2 -> present ect ... ) will have the same number of words removed, this can be cached to speed things up.

---

A faster heuristic is used. It does not compute the number of word removed, but instead is based on the result of ( ex: 1 -> absent, 2 -> present ect ... ).
