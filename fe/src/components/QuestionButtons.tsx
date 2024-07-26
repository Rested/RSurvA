import { iconMapping, QuestionType } from '../constants';
import React from 'preact/compat';



const QuestionButtons = ({ onAddQuestion }) => {
    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Add a Question</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(QuestionType).map(type => (
                    <button
                        key={type}
                        onClick={() => onAddQuestion(type)}
                        className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2"
                    >
                        {React.createElement(iconMapping[type], { className: "h-6 w-6 mr-3" })}
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionButtons;


