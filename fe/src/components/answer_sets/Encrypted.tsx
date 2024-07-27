import { LockClosedIcon } from '@heroicons/react/24/solid';


const EncryptedSet = ({ answers }) => {
    return (
        <div class="space-y-2">
            {answers.map((a, i) => (
                <div key={i} class="flex items-center text-base-content">
                    <LockClosedIcon class="w-5 h-5 mr-2 text-secondary" />
                    Encrypted Answer {i+1}
                </div>
            ))}
        </div>
    );
};

export default EncryptedSet;