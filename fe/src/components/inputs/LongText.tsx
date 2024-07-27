const LongText = ({ index, onChange, value }) => {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(index, e.target.value)}
            className="textarea textarea-bordered textarea-primary w-full"
        />
    );
};

export default LongText;
