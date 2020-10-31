describe('The new alias form', () => {
  it('should add a new alias', () => {
    cy.login('test', 'test');
    cy.get('[data-test=newAliasForm');
    cy.get('[data-test=newAliasInput').type('test7@test.com');
    cy.get('[data-test=newAliasButton').click();
    cy.get('[data-test=aliasEntry').should('have.lengthOf', 7);
    cy.contains('test7@test.com');
    cy.get('[data-test=newAliasInput').type('test8@test.com');
    cy.get('[data-test=newAliasForm').submit();
    cy.get('[data-test=aliasEntry').should('have.lengthOf', 8);
    cy.contains('test8@test.com');
  });
  it('should show an alert on adding an existing alias', () => {
    cy.login('test', 'test');
    cy.get('[data-test=newAliasInput').type('test1@test.com');
    cy.get('[data-test=newAliasButton').click();
    cy.get('[data-test=newAliasAlert').should('be.visible');
    cy.contains('Alias test1@test.com already exists.');
  });
});
