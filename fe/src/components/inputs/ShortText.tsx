

const ShortText = ({ index, onChange, value }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(index, e.target.value)}
            className="input input-bordered input-primary w-full"
        />
    );
};

export default ShortText;