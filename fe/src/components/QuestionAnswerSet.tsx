import EncryptedSet from "./answer_sets/Encrypted";
import PlainTextSet from "./answer_sets/PlainTextSet";

const QuestionAnswerSet = ({ question_type, answers, index, text }) => {
    let questionComponent = null;
    switch (question_type) {
        case 'plaintext':
            questionComponent = (
                <PlainTextSet
                    answers={answers}
                />
            );
            break;
        case 'encrypted':
            questionComponent = (
                <EncryptedSet
                    answers={answers}
                />
            );
            break;
        // Add other case statements for different question types, if needed.
        default:
            questionComponent = null;
    }
    return (<div>
        <label>
            {index + 1}. {text}
        </label>
        {questionComponent}
    </div>)
};

export default QuestionAnswerSet;
