
describe('Survey Expiration', () => {
    const surveyName = "My Test Survey";
    const Q1 = "What is your favorite color?"
    // This will run before each test
    beforeEach(() => {
        cy.visit('/');
        cy.get('input#survey-name').type(surveyName);

        // Add a question
        cy.contains('button', 'Short Text').click();
        cy.get('input#question-entry-0').type(Q1);


        // Set the duration
        cy.get('select#survey-duration').select("20 seconds");
      
        // Set the minimum responses
        cy.get('input#survey-min-responses').clear().type('3');

        // Attempt to share the survey
        cy.contains('button', 'Share Survey').click();
        cy.contains('Share this link').should('be.visible');

        const surveyTimerStarted = (new Date())

        cy.get('input[readonly]').eq(1).invoke('val').then((link) => {
            cy.visit(link);
            cy.contains("Respond to Survey").should('exist');

            cy.get("input").eq(0).type("green");
            cy.contains("Submit Answers").click()
            cy.contains("Thank you")
    
    
            cy.wait((25 * 1000) - ((new Date()) - surveyTimerStarted));
            cy.visit(link);
            cy.contains("Survey");

        });

    });

    it('it should say that survey has expired', () => {
        cy.contains("The survey expired after").should('exist');
    });
});
