import PlainText from './inputs/PlainText';

const QuestionAnswer = (props) => {
    let questionComponent = null;
    switch (props.question_type) {
        case 'plaintext':
            questionComponent =  (
                <PlainText 
                    {...props}
                />
            );
            break;
        // Add other case statements for different question types, if needed.
        default:
            questionComponent = null;
    }
    return (<div>
        <label>
            {props.index + 1}. {props.text}
        </label>
        {questionComponent}
    </div>)
};

export default QuestionAnswer;
