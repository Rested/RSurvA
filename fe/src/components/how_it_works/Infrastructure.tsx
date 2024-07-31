

import { infrastructureDiagram } from '../../graphs';
import Collapse from './Collapse';


const Infrastructure = () => (
    <>
        <Collapse title="Infrastructure" emoji="🧱">
            <div class="mb-6">
                <p class="text-base-content">
                    The frontend code (where encryption happens) is hosted on <a href="https://pages.cloudflare.com/" target="_blank" rel="noreferrer" class="text-primary hover:underline">Cloudflare Pages</a>.
                </p>
                <p class="text-base-content">
                    The backend is hosted on <a href="https://fly.io/" target="_blank" rel="noreferrer" class="text-primary hover:underline">Fly.io</a>. The encrypted answer data and unencrypted question data are stored on <a href="https://fly.io/docs/reference/redis/" target="_blank" rel="noreferrer" class="text-primary hover:underline">Fly Upstash for Redis</a>.
                </p>
                <p class="text-base-content">
                    You can check the <a href="https://github.com/rested/RSurvA" class="text-primary" target="_blank" rel="noopener noreferrer">code</a> being used and the actions used to deploy it or deploy it to your own infra.
                </p>
                <div class="mermaid bg-white  p-6 rounded-lg shadow-md mt-4">
                    {infrastructureDiagram}
                </div>
            </div>
        </Collapse>
    </>
);

export default Infrastructure;