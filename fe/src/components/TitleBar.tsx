const TitleBar = ({ text }) => {
    return (
        <div className="navbar">
            <div className="flex-1">
                <span className="text-xl font-bold">{text}</span>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="/">Create Survey</a></li>
                </ul>
                <ul className="menu menu-horizontal px-1">
                    <li><a href="/how-it-works">How it Works</a></li>
                </ul>
            </div>
        </div>
    );
};

export default TitleBar;