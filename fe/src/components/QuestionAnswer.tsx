import { QuestionType } from '../constants';
import ShortText from './inputs/ShortText';
import Rating from './inputs/Rating';
import LongText from './inputs/LongText';

const QuestionAnswer = (props) => {
    let questionComponent = null;
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
                <LongText {...props}/>
            )
            break;
        case QuestionType.Rating:
            questionComponent = <Rating {...props} />;
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
        </div>
    );
};
export default QuestionAnswer;
