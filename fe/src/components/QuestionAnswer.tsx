import { QuestionType } from '../constants';
import ShortText from './inputs/ShortText';
import Rating from './inputs/Rating';
import LongText from './inputs/LongText';
import { Anonymize } from './Anonymize';

const QuestionAnswer = (props) => {
    let questionComponent = null;
    let anonymize = <Anonymize question={props.text} answer={props.value} />;
    switch (props.question_type) {
        case QuestionType.ShortText:
            questionComponent = (
                <ShortText
                    {...props}
                />
            );
            
            break;
        case QuestionType.LongText:
            questionComponent = (
                <LongText {...props} />
            )
            break;
        case QuestionType.Rating:
            questionComponent = <Rating {...props} />;
            anonymize = null;
            break;
        // Add other case statements for different question types, if needed.
        default:
            questionComponent = null;
    }
    return (
        <div class="mb-6">
            <label class="block text-primary font-semibold mb-2">
                {props.index + 1}. {props.text}
            </label>
            {questionComponent}
            {anonymize}
        </div>
    );
};
export default QuestionAnswer;
