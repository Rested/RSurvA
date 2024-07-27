import { QuestionType } from "../constants";
import EncryptedSet from "./answer_sets/Encrypted";
import PlainTextSet from "./answer_sets/PlainTextSet";
import RatingSet from "./answer_sets/RatingSet";

const QuestionAnswerSet = ({ question_type, answers, index, text }) => {
    let questionComponent = null;
    switch (question_type) {
        case QuestionType.ShortText:
            questionComponent = (
                <PlainTextSet
                    answers={answers}
                />
            );
            break;
        case QuestionType.LongText:
            questionComponent = (
                <PlainTextSet
                    answers={answers}
                />
            );
            break;
        case QuestionType.Rating:
            questionComponent = (
                <RatingSet
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
    return (
        <div class="mb-6">
            <label class="block text-base-content font-semibold mb-2">
                {index + 1}. {text}
            </label>
            <div class="px-4">
                {questionComponent}
            </div>
        </div>
    );
};

export default QuestionAnswerSet;
