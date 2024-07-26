
const TitleBar = ({ text }) => {
    return (
        <div class="bg-gray-100 p-4 rounded-t-lg -m-6 mb-8">
            <h1 class="text-lg font-extrabold text-gray-900">
                {text}
            </h1>
        </div>

    );
};

export default TitleBar;