import { createElement, h } from 'preact';
import { iconMapping } from '../constants';

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
        <div className="mb-6 flex items-center">
            <span className="text-sm font-medium text-primary mr-4">{index + 1}.</span>
            <input
                type="text"
                value={question.text}
                onInput={(e) => onQuestionChange(index, (e.target as HTMLInputElement).value)}
                className="input input-bordered max-w-xl flex-grow mr-4"
            />
            <div className="flex items-center space-x-2 ml-auto">
                <span className="flex items-center space-x-1">
                    <span className="text-secondary">
                        {createElement(iconMapping[question.question_type], { className: "h-5 w-5" })}
                    </span>
                    <span className="text-sm text-secondary capitalize">{question.question_type}</span>
                </span>
            </div>
        </div>
    );
};

export default QuestionEntry;