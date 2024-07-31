
import { sequenceDiagram } from '../../graphs';
import Collapse from './Collapse';


const SequenceDiagram = () => (
    <>
        <Collapse title="Sequence Diagram" emoji="↔">
            <div class="mermaid mx-auto max-w-xl bg-white p-6 rounded-lg shadow-md" id="sequence-diagram-mermaid">
                {sequenceDiagram}
            </div>
        </Collapse>
    </>
);

export default SequenceDiagram;