const PlainTextSet = ({ answers }) => {
    return (
        <div class="space-y-2">
            {answers.map((a, i) => (
                <p key={i} class="text-gray-700">{a}</p>
            ))}
        </div>
    );
};

export default PlainTextSet;
