import { useEffect } from 'preact/hooks';
import mermaid from 'mermaid';
import TitleBar from '../components/TitleBar';
import KeyBenefits from '../components/how_it_works/KeyBenefits';
import Motivations from '../components/how_it_works/Motivations';
import HowToCreate from '../components/how_it_works/HowToCreate';
import LimitationsAndMitigations from '../components/how_it_works/LimitationsAndMitigations';
import SequenceDiagram from '../components/how_it_works/Sequence';
import Infrastructure from '../components/how_it_works/Infrastructure';




const HowItWorks = () => {

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true });
        mermaid.init();
    }, []);

    return (
        <div class="p-6 mt-8 max-w-4xl mx-auto bg-base-200 shadow-lg rounded-lg">
            <TitleBar text="How it Works" />
            <div class="text-base-content text-lg font-semibold mb-4">
                <strong class="text-xl">Really Super Anonymous Surveys</strong>
                <p class="pl-1 mt-1 font-normal">
                    Surveys which claim to be anonymous often do very little to ensure that they actually are.
                </p>
                <p class="pl-1 text-primary">
                    <b> RSurvA</b> tries to do anonymous surveys better.
                </p>
            </div>
            <KeyBenefits />
            <HowToCreate />
            <Motivations />
            <LimitationsAndMitigations />
            <SequenceDiagram />
            <Infrastructure />
        </div>
    );
};

export default HowItWorks;
