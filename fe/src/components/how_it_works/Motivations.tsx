import Collapse from './Collapse';


const Motivations = () => (
    <>
        <Collapse title="Motivations" emoji="🏋️‍♂️">
            <p>Surveys which claim to be anonymous often are not.</p>
            <ul className="list-inside list-disc text-base-content mt-4 space-y-4 pl-4">
                <li>They often require login, meaning the server knows exactly who provided which answer.</li>
                <li>They may well store answers unencrypted, making them viewable by any entity with access to the server.</li>
                <li>They often allow survey owners to see responses as they come in, making correlating them to when respondents saw the survey link possible.</li>
                <li>They also offer no stylometry counter-measures (to stop the survey owner from identifying respondents using stylometry).</li>
                <li>Finally, they often do nothing to randomize responses, making it easier to identify respondents by viewing all their answers at once and applying stylometry or other information on this broader dataset.</li>
            </ul>
            <p className="text-base-content mt-4">
                RSurvA attempts to address all of these issues by providing a simple low trust approach.
                See the <a href="#limitations-and-mitigations" className="text-primary hover:underline">Limitations & Mitigations</a> section for details on how.
            </p>
        </Collapse>
    </>
);

export default Motivations;