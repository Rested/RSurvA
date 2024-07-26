const RatingSet = ({ answers }) => {
    // Calculate the average of the answers
    const average = answers.reduce((sum, num) => sum + num, 0) / answers.length;

    return (
        <div className="space-y-2">
            <p className="text-gray-700 font-bold text-sm">Average: {average.toFixed(2)}</p>
            <ul className="list-disc list-inside">
                {answers.map((a, i) => (
                    <li key={i} className="text-gray-700">{a}</li>
                ))}
            </ul>
        </div>
    );
};

export default RatingSet;