

const ShortText = ({ index, onChange, value }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(index, e.target.value)}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-900"
        />
    );
};

export default ShortText;