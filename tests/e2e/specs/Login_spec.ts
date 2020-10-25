describe('The login form', () => {
  it('should be displayed directly', () => {
    cy.visit('/');
    cy.contains('Login');
    cy.contains('Username');
    cy.contains('Password');
    cy.get('.v-dialog').within(() => {
      cy.get('input[type=text]').should('have.length', 1);
      cy.get('input[type=password]').should('have.length', 1);
    });
  });
  it('should accept a valid login', () => {
    cy.login('test', 'test');
    cy.get('.v-dialog').should('not.be.visible');
  });
  it('should not accept an invalid login', () => {
    cy.login('test', 'wrong');
    cy.get('.v-dialog .v-alert').should('be.visible');
    cy.contains('Invalid username or password');
  });
});
