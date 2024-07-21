import { h } from 'preact';


const PlainTextSet = ({ answers }) => {
    return (
        <div>
            {answers.map(a => <p>{a}</p>)}
        </div>
    );
};

export default PlainTextSet;