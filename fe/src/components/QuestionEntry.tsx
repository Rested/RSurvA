import { h } from 'preact';

interface QuestionEntryProps {
    question: {
        text: string;
        question_type: string;
    };
    index: number;
    onQuestionChange: (index: number, text: string) => void;
}

const QuestionEntry = ({ question, index, onQuestionChange }: QuestionEntryProps) => {
    return (
        <div>
            <label>
                {index + 1}. ({question.question_type})
            </label>
            <input
                type="text"
                value={question.text}
                onChange={(e) => onQuestionChange(index, e.target.value)}
            />
        </div>
    );
};

export default QuestionEntry;