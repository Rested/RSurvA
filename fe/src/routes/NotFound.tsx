import TitleBar from "../components/TitleBar";

const NotFound = () => {

    return (
        <div class="p-6 mt-8 max-w-4xl mx-auto bg-base-200 shadow-lg rounded-lg">
            <TitleBar text="Not Found" />
            <h1>Page Doesn't Exist :(</h1>
        </div>
    );
};

export default NotFound;
