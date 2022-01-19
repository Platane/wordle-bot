# Solver Advanced

This solver is based on min-max.

# Algorithm (min-max)

To pick the next word:

Pick N word candidates. For each determine an heuristic score. The score is higher when the candidate is more likely to win now, or in the next turns.

Choose the word with the highest score.

> note: It would be ideal to check every word as candidate. Unfortunately it is too slow. N can be tuned to have fast and sub-optimal solution, or slow and optimal solution.

> note: Notice that we pick candidates that might not respect the already played lines constraint.
>
> In that case we know that the candidate is not a valid solution. However it might be that this candidate is the best at collecting hints, and our best chance to win next round.

**heuristic**

Or how to determine how desirable the candidate is ?

- from the list of all possible word and from the result of previously played lines, we generate the list of potential solutions ( = all the word that still respect the played line constraint ). Let's assume each potential solution of that list have the same probability of being the actual solution.

- for a given candidate, let's iterate over the list of potential solution. Considering a solution, what would be the game answer ( ex: first letter is correct, second letter is absent ... ). And from that answer, how many potential solution can we discard.

- let's assume the more we discard potential solution, the better. Let's then compute the average number of discarded elements over the list of potential solution. This number is a suitable heuristic, the hight it is, the better.

> notes: Notice that in a min-max algorithm we could go a step further and simulate the next play as well. Let's not do that as the complexity blows pretty quickly.

> notes: picking the next word have a complexity of O( N \* potential_solution.length \* potential_solution.length ), in the worst cast O( N \* n² ) ( or O( n³ ) ) . It's not great.

> notes: For a given candidate, when iterating over the list of potential solution, we might get the same game answer for different potential solutions. Since the number of discarded elements will then be the same. Let's cache the result to avoid expensively recomputing it.

**heuristic - optimization**

Let's attempt to reduce the complexity.

Instead of counting the discarded elements (which requires to iterate over potential_solution ), get a score from the game answer ( ex: first letter is correct, second letter is absent ... ).

In order to attribute a score to a game answer, let's introduce a new concept. It combines all the played lines and their game answer, and gives for each position the available letters.

Let's say the less available letter for each position, the better.

> notes: picking the next word then have complexity of O( N \* potential_solution.length ). Which allow to tune N up and test more candidate.
