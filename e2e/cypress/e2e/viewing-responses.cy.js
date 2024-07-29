describe('Viewing responses', () => {
    const surveyName = "My Test Survey";
    const Q1 = "What is your favorite color?"
    const Q2 = "What is your story?";
    const Q3 = "How are you feeling?";

    let privateKey;
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


        // Set the duration
        cy.get('select#survey-duration').select("10 seconds");
      
        // Set the minimum responses
        cy.get('input#survey-min-responses').clear().type('3');

        // Attempt to share the survey
        cy.contains('button', 'Share Survey').click();
        cy.contains('Share this link').should('be.visible');

        const surveyTimerStarted = (new Date())

        cy.get('input[readonly]').eq(0).invoke('val').then((inputValue) => {
            privateKey = inputValue;
        });

        cy.get('input[readonly]').eq(1).invoke('val').then((link) => {
            cy.visit(link);
            cy.contains("Respond to Survey").should('exist');

            cy.get("input").eq(0).type("green");
            cy.get("textarea").first().type("A story");
            cy.get("input").eq(5).click();
            cy.contains("Submit Answers").click()
            cy.contains("Thank you")
    
            cy.visit(link);

            cy.get("input").eq(0).type("blue");
            cy.get("textarea").first().type("A different story");
            cy.get('input[type="radio"]').eq(9).click();
            cy.contains("Submit Answers").click()
            cy.contains("Thank you")
    

            cy.visit(link);

            cy.get("input").eq(0).type("pink");
            cy.get("textarea").first().type("Another story");
            cy.get('input[type="radio"]').eq(9).click();
            cy.contains("Submit Answers").click()
            cy.contains("Thank you")
    
            cy.wait((12 * 1000) - ((new Date()) - surveyTimerStarted));
            cy.visit(link);
            cy.contains("Survey Responses");

        });

    });

    it('it should display the survey name and questions and encrypted answers', () => {
        cy.contains(surveyName).should('exist');
        cy.contains(Q1).should('exist');
        cy.contains(Q2).should('exist');
        cy.contains(Q3).should('exist');
        cy.get(".answer > div > div > div:contains(Encrypted Answer)").should('have.length', 9);

    });


    
    it('it should allow us to unlock with the private key and may have a different answer ordering on reload', () => {
        let initialOrder = [];
    
        function getColourOrder() {
            return cy.get('p:contains("blue"), p:contains("green"), p:contains("pink")')
                .then($elements => {
                    return $elements.map((index, el) => Cypress.$(el).text()).get();
                });
        }
    
        cy.get("input").eq(0).type(privateKey, {delay: 0});
        cy.contains("Unlock Survey").click();
    
        // has unlocked answers
        cy.contains("blue").should('exist');
        cy.contains("10").should("exist");
        cy.contains("A different story").should("exist");
    
        // Capture the initial order of colour answers
        getColourOrder().then(order => {
            initialOrder = order;
            cy.log('Initial Order: ', initialOrder);
    
            // Function to keep checking order until it changes
            function checkOrderUntilChanged() {
                cy.reload();
                cy.get("input").eq(0).type(privateKey, {delay: 0});
                cy.contains("Unlock Survey").click();
    
                getColourOrder().then(newOrder => {
                    cy.log('New Order: ', newOrder);
    
                    if (Cypress._.isEqual(initialOrder, newOrder)) {
                        // If order hasn't changed, try again
                        checkOrderUntilChanged();
                    } else {
                        // Order has changed, assert the difference and end the test
                        expect(newOrder).to.not.deep.equal(initialOrder);
                        cy.log('Order changed successfully!');
                    }
                });
            }
    
            // Start checking until order changes
            checkOrderUntilChanged();
        });
    });

});