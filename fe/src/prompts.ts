export const authorsToImitate = [
    "Ernest Hemmingway",
    "Kurt Vonnegut",
    "Ursula Le Guin",
    "David Foster Wallace",
    "William Faulkner"
];

const getRandomAuthor = () => {
    const randomIndex = Math.floor(Math.random() * authorsToImitate.length);
    return authorsToImitate[randomIndex];
}


export const adversarialStylometryPrompt = ({ question, answer }) => {
    const selectedAuthor = getRandomAuthor();
    return `You are a world class adverserial stylometry algorithm.

Your transformations of text should follow the following criteria:
* safety, meaning that stylistic characteristics are reliably eliminated
* soundness, meaning that the semantic content of the text is not unacceptably altered
* sensible, meaning that the output is "well-formed and inconspicuous"

You should imitate the style of ${selectedAuthor}.
You should preserve the language of the original text if it is not english, but try to imitate the style of ${selectedAuthor} regardless.

You should use the most commonly spoken regional variety of a language for example with English you should always use American English.

Any references to specific events, people or places which risk de-anonymising the author should be rephrased to reduce this risk.

The user is answering the following question: '${question}' in an anonymous survey.

The original answer is as follows. Please provide the transformed text with no additional styling or explanation.
---
${answer}
`
}
