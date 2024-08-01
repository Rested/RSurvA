describe('Survey Link and Key Sharing', () => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    const surveyName = "My Test Survey";

    // This will run before each test
    beforeEach(() => {
      cy.visit('/');
      cy.get('input#survey-name').type(surveyName);

      // Add a question
      cy.contains('button', 'Short Text').click();
      cy.get('input#question-entry-0').type('What is your favorite color?');
    
      // Attempt to share the survey
      cy.contains('button', 'Share Survey').click();
      cy.contains('Share this link').should('be.visible');

    });

    it('should contain a link to the survey', () => {
        cy.get('input[readonly]').eq(1).invoke('val').then((inputValue) => {
            expect(inputValue).to.contain('http');
        });
        cy.contains('Share this link with those you want to complete the survey:').should('exist');
    });

    it('should contain a private key', () => {
        cy.get('input').eq(0).invoke('val').then((inputValue) => {
            expect(inputValue.length).to.be.greaterThan(1600);
        });
        cy.contains("Here is your private key:").should('exist');
    });

    it('should contain a public key', () => {
        cy.get('input').eq(2).invoke('val').then((inputValue) => {
            expect(inputValue.length).to.be.equal(616); 
        });

        cy.contains("The link contains the SHA-256 hash of your full RSA public key which is:").should('exist');
    });

    it('should allow copying all keys and link to clipboard', () => {
        // Check private key copy functionality
        cy.contains('Private key copied to clipboard!').should('not.exist');
        cy.get('button:contains(Copy)').eq(0).realClick();
        cy.contains('Private key copied to clipboard!').should('exist');

        // Check survey link copy functionality
        cy.contains("Share Survey").realClick()
        cy.contains('Survey link copied to clipboard!').should('not.exist');
        cy.get('button:contains(Copy)').eq(1).realClick();
        cy.contains('Survey link copied to clipboard!').should('exist');
        
        // Check public key copy functionality
        cy.contains('Public key copied to clipboard!').should('not.exist');
        cy.get('button:contains(Copy)').eq(2).realClick();
        cy.contains('Public key copied to clipboard!').should('exist');
    });

    it('should allow downloading all keys and links', () => {
        // Stub file downloading
        cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
        });

        // Check download functionality for private key
        cy.get('button:contains(Download)').eq(0).realClick();
        cy.readFile(`${downloadsFolder}/${surveyName}-private-key.txt`);

        // Check download functionality for survey link
        cy.get('button:contains(Download)').eq(1).realClick();
        cy.readFile(`${downloadsFolder}/${surveyName}-survey-link.txt`);

        // Check download functionality for public key
        cy.get('button:contains(Download)').eq(2).realClick();
        cy.readFile(`${downloadsFolder}/${surveyName}-public-key.txt`);
    });

    it('should take us to a valid page on following the survey link', () => {
        cy.get('input[readonly]').eq(1).invoke('val').then((link) => {
            cy.visit(link);
            cy.contains('What is your favorite color?').should('exist');
        });
    });
})