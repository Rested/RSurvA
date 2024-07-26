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
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center min-w-max w-64 space-x-2">
                <span class="text-sm font-medium text-gray-900">{index + 1}.</span>
                <span class="flex items-center space-x-1">
                    <span class="text-gray-500">
                        {createElement(iconMapping[question.question_type], { className: "h-5 w-5" })}
                    </span>
                    <span class="text-sm text-gray-700 capitalize">{question.question_type}</span>
                </span>
            </div>
            <input
                type="text"
                value={question.text}
                onInput={(e) => onQuestionChange(index, (e.target as HTMLInputElement).value)}
                class="block flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
};

export default QuestionEntry;