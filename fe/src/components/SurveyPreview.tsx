
import { useState } from 'preact/hooks';
import QuestionAnswer from "./QuestionAnswer";

const SurveyPreview = ({ questions }) => {
    // Initialize state for answers
    const [surveyQuestionAnswers, setSurveyQuestionAnswers] = useState(() => 
        questions.map(() => "")
    );

    // Handle answer changes
    const handleAnswerChange = (index, newValue) => {
        const updatedAnswers = [...surveyQuestionAnswers];
        updatedAnswers[index] = newValue;
        setSurveyQuestionAnswers(updatedAnswers);
    };

    return (
        <div>
            {questions.map((q, i) => (
                <QuestionAnswer
                    key={i}
                    question_type={q.question_type}
                    text={q.text}
                    index={i}
                    value={surveyQuestionAnswers[i]}
                    onChange={handleAnswerChange}
                />
            ))}
        </div>
    );
};

export default SurveyPreview;