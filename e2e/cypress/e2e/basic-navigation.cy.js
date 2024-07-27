describe('Responding', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should be able to navigate around using the top bar', () => {
        cy.contains("How it Works").click();
        cy.contains("RSA");
        cy.contains("Create Survey").click();
        cy.contains("Survey Name");
    });
})