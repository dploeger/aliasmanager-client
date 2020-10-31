describe('The login form', () => {
  it('should be displayed directly', () => {
    cy.visit('/');
    cy.contains('Login');
    cy.contains('Username');
    cy.contains('Password');
    cy.get('[data-test=loginDialog]').within(() => {
      cy.get('[data-test=username]').should('have.length', 1);
      cy.get('[data-test=password]').should('have.length', 1);
    });
  });
  it('should accept a valid login', () => {
    cy.login('test', 'test');
    cy.get('[data-test=loginDialog]').should('not.be.visible');
  });
  it('should not accept an invalid login', () => {
    cy.login('test', 'wrong');
    cy.get('[data-test=loginAlert]').should('be.visible');
    cy.contains('Invalid username or password');
  });
});
