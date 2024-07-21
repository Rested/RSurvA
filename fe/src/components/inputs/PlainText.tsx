import { h } from 'preact';


const PlainText = ({ index, onChange, value }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(index, e.target.value)}
        />
    );
};

export default PlainText;