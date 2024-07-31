import { ReactNode } from "preact/compat";


interface CollapseProps {
    title: string;
    children: ReactNode;
    emoji?: string;
    contentBgColor?: string;

}


const Collapse = ({ title, children, emoji,contentBgColor = "bg-base-300"  }: CollapseProps) => {

    return (<div className="collapse mt-5 br-5" id={title.toLowerCase().replace(/ /g, "-")}>
        <input type="checkbox" />
        <div className="collapse-title bg-base-100 font-medium text-xl flex items-center text-base-content">
            {emoji && <span className="mr-2">{emoji}</span>}
            {title}
        </div>
        <div className={`collapse-content ${contentBgColor} peer-checked`}>
        <div class="pt-4 pb-2">
                {children}
            </div>
        </div>
    </div>
    )
}

export default Collapse;
