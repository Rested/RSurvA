describe('Survey Creation', () => {
  // This will run before each test
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow deleting questions', ()=> {
    cy.contains('button', 'Short Text').click();
    cy.contains('button', 'Long Text').click();
    cy.contains('button', 'Rating').click();
    cy.get('.question-entry ').should('have.length', 3);
    cy.contains('button', 'Delete').click();
    cy.get('.question-entry ').should('have.length', 2);
    cy.contains('button', 'Delete').click();
    cy.get('.question-entry ').should('have.length', 1);
    cy.contains('button', 'Delete').click();
    cy.get('.question-entry ').should('have.length', 0);
  })

  it('should load the Home page and render the create survey form', () => {
    // Check for the presence of the form title
    cy.contains('Create Survey').should('be.visible');

    // Check for the survey name input
    cy.get('input#survey-name').should('be.visible');

    // Check for the 'Add Question' button
    cy.contains('Add a Question').should('be.visible');
  });

  it('should allow the user to enter a survey name', () => {
    // Type a survey name into the input
    cy.get('input#survey-name').type('My Test Survey');

    // Check that the survey name was entered correctly
    cy.get('input#survey-name').should('have.value', 'My Test Survey');
  });

  it('should allow the user to add different types of question', () => {
    cy.contains('button', 'Short Text').click();
    cy.contains('button', 'Long Text').click();
    cy.contains('button', 'Rating').click();
    cy.get('.question-entry ').should('have.length', 3);

  });

  it('should validate the survey when trying to share it', () => {
    // Attempt to share the survey without entering a name or question
    cy.contains('button', 'Share Survey').click();

    // Check for the validation message
    cy.contains('Survey title must be at least 1 character long.').should('be.visible');
  });

  it('should properly create and share a survey', () => {
    // Enter a survey name
    cy.get('input#survey-name').type('My Test Survey');

    // Add a question
    cy.contains('button', 'Short Text').click();
    cy.get('input#question-entry-0').type('What is your favorite color?');

    // Set the duration
    cy.get('select#survey-duration').select('20 seconds'); // Assuming '60' is equivalent to 60 minutes

    // Set the minimum responses
    cy.get('input#survey-min-responses').clear().type('5');

    // Attempt to share the survey
    cy.contains('button', 'Share Survey').click();

    // Assuming we should navigate to a share link page or get a confirmation message
    // Adjust the selector and text based on actual implementation
    cy.contains('Share this link').should('be.visible');

  });
});
