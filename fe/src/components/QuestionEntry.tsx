import { createElement, h } from 'preact';
import { iconMapping } from '../constants';

interface QuestionEntryProps {
    question: {
        text: string;
        question_type: string;
    };
    index: number;
    onQuestionChange: (index: number, text: string) => void;
    onDeleteQuestion: (index: number) => void; // New prop for deleting the question
}

const QuestionEntry = ({ question, index, onQuestionChange, onDeleteQuestion }: QuestionEntryProps) => {
    return (
        <div className="mb-6 flex items-center">
            <span className="text-sm font-medium text-primary mr-4">{index + 1}.</span>
            <input
                id={`question-entry-${index}`}
                type="text"
                value={question.text}
                onInput={(e) => onQuestionChange(index, (e.target as HTMLInputElement).value)}
                className="question-entry input input-bordered max-w-xl flex-grow mr-4"
            />
            <span className="flex items-center space-x-1">
                <span className="text-secondary">
                    {createElement(iconMapping[question.question_type], { className: "h-5 w-5" })}
                </span>
                <span className="text-sm text-secondary capitalize">{question.question_type}</span>
            </span>
            <button
                onClick={() => onDeleteQuestion(index)}
                className="btn btn-outline btn-error ml-auto"
            >
                Delete
            </button>

           
        </div>
    );
};

export default QuestionEntry;
