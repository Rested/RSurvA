
export const Divider = ({ text, id }) => (<div className="my-6" id={id}>        <span className="flex items-center">
    <span className="h-px flex-1 bg-base-content" />
    <span className="shrink-0 px-6 text-base-content">{text}</span>
    <span className="h-px flex-1 bg-base-content" />
</span>
</div>)