const EncryptedSet = ({ answers }) => {
    return (
        <div>
            {answers.map(a => <p>encrypted</p>)}
        </div>
    );
};

export default EncryptedSet;