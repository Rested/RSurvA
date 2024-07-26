
import { h } from 'preact';

const Rating = ({ index, value, onChange }) => {
  // Ensure value is always parsed as an integer
  const parsedValue = parseInt(value, 10) || 0;

  return (
    <div class="flex justify-between items-center w-full">
      {[...Array(10)].map((_, i) => (
        <label key={i} class="flex flex-col items-center">
          <input
            type="radio"
            name={`rating-${index}`}
            value={i + 1}
            checked={parsedValue === i + 1}
            onChange={(e) => {
              if (e.target !== undefined) {
                onChange(index, parseInt(e.target.value, 10));
              }
            }}
            class="form-radio text-blue-600 mb-1"
          />
          <span class="text-xs text-black">{i + 1}</span>
        </label>
      ))}
    </div>
  );
};

export default Rating;
