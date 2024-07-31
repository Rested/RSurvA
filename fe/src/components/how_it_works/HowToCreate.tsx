import { Fragment } from 'preact/jsx-runtime';
import Collapse from './Collapse';


const HowToCreate = () => (
    <>
        <Collapse title="How To Create A Survey" emoji='☑'>
            <Fragment>
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-base-content mb-2">1. Create An Anonymous Survey</h2>
                    <p class="text-base-content">
                        Start by creating a new survey. Enter a name for your survey and add as many questions
                        as you like. The questions can be edited at any time before sharing the survey.
                    </p>
                </div>
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-base-content mb-2">2. Customize Survey Settings</h2>
                    <p class="text-base-content">
                        Choose the duration for which the survey will be active and set a minimum number of responses
                        required before the survey results are available.
                    </p>
                </div>
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-base-content mb-2">3. Share Your Survey</h2>
                    <p class="text-base-content">
                        As people start answering your survey, their responses will be saved encrypted on the server using the public key corresponding to the private key you saved earlier.
                        Responses will not be available for you to decrypt until the survey duration and minimum response count conditions are met to help ensure respondent anonymity.
                    </p>
                </div>
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-base-content mb-2">4. View Results</h2>
                    <p class="text-base-content">
                        After the survey duration has passed and if the minimum responses requirement is met,
                        you will be able to decrypt the collected answers using the private key you saved earlier.
                    </p>
                </div>
            </Fragment>
        </Collapse>
    </>
);

export default HowToCreate;