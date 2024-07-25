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
        <div class="mb-4">
            <label class="block text-sm font-medium leading-6 text-gray-900 mb-1">
                {index + 1}. ({question.question_type})
            </label>
            <input
                type="text"
                value={question.text}
                onChange={(e) => onQuestionChange(index, e.target.value)}
                class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
};

export default QuestionEntry;