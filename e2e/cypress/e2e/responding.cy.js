describe('Responding', () => {
    const surveyName = "My Test Survey";
    const Q1 = "What is your favorite color?"
    const Q2 = "What is your story?";
    const Q3 = "How are you feeling?";

    let publicKey;
    // This will run before each test
    beforeEach(() => {
        cy.visit('/');
        cy.get('input#survey-name').type(surveyName);

        // Add a question
        cy.contains('button', 'Short Text').click();
        cy.get('input#question-entry-0').type(Q1);

        cy.contains('button', 'Long Text').click();
        cy.get('input#question-entry-1').type(Q2);

        cy.contains('button', 'Rating').click();
        cy.get('input#question-entry-2').type(Q3);

        // Attempt to share the survey
        cy.contains('button', 'Share Survey').click();
        cy.contains('Share this link').should('be.visible');
        cy.get('input[readonly]').eq(2).invoke('val').then((inputValue) => {
            publicKey = inputValue;
        });

        cy.get('input[readonly]').eq(1).invoke('val').then((link) => {
            cy.visit(link);
            cy.contains("Respond to Survey").should('exist');
        });

      
    });

    it("should show a prompt in a model when a user clicks the anonymize button", () => {
        cy.get("input").eq(0).type("green");
        cy.get("button").contains("Anonymize").click();
        cy.contains("Prompt").should("exist");
        cy.get('button:contains(Copy)').eq(1).realClick();
        cy.contains('Prompt copied to clipboard!').should('exist');
    });

    it('it should display the survey name and questions', () => {
        cy.contains(surveyName).should('exist');
        cy.contains(Q1).should('exist');
        cy.contains(Q2).should('exist');
        cy.contains(Q3).should('exist');
    });

    it("should thank for responses", () => {
        cy.intercept('POST', '*', (req) => {
            req.on('response', (res) => {
              res.setDelay(1000); // ensure that we wait long enough to see loading
            });
          }).as('submitAnswers');

        cy.get("input").eq(0).type("green");
        cy.get("textarea").first().type("A story");
        cy.get("input").eq(5).click();

        cy.contains("Submit Answers").click();
        // shows the loading indicator
        cy.contains('Submitting').should('be.visible');
        cy.wait('@submitAnswers');

        cy.contains("Thank you")
    });

    it("should allow very long answers", () => {
        cy.get("input").eq(0).type("green");
        cy.get("textarea").first().invoke('val', "he was happy but he was cold but ".repeat(1000)).trigger('input').trigger('change');
        cy.get("input").eq(5).click();

        cy.contains("Submit Answers").click();

        cy.contains("Thank you")
    });

    function submitAnswersAndCheckError() {
        cy.contains("Submit Answers").click();
        cy.contains("All questions must be answered before submitting.");
    }


    it("should show validation error if empty answer", () => {
        submitAnswersAndCheckError();

        cy.get("input").eq(0).type("green");
        submitAnswersAndCheckError();

        cy.get("textarea").first().type("A story");
        submitAnswersAndCheckError();

        cy.get("input").eq(0).clear();
        cy.get("textarea").first().type("A story");
        cy.get("input").eq(5).click();

        submitAnswersAndCheckError();

    });

    it("should show the public key", () => {
        cy.get("input[readonly]").last().invoke('val').then((inputValue) => {
            expect(inputValue).to.equal(publicKey);
        });

    });


});  