const TitleBar = ({ text }) => {
    return (
        <div className="relative">
            <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 border-2 bg-base-100 z-10 rounded-md"
                style={{ fontFamily: "'Roboto Slab', serif" }}
            >
                <span className="text-4xl font-bold">
                    RSurvA
                </span>
            </div>
            <div className="navbar flex-col pt-5">
                <div className="flex-1 w-full flex justify-between items-center">
                    <span className="text-xl font-bold">{text}</span>
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">
                            <li><a href={`${import.meta.env.BASE_URL}`}>Create Survey</a></li>
                        </ul>
                        <ul className="menu menu-horizontal px-1">
                            <li><a href={`${import.meta.env.BASE_URL}how-it-works`}>How it Works</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TitleBar;