describe('The list of aliases', () => {
  it('should be populated with aliases', () => {
    cy.login('test', 'test');
    cy.get('[data-test=aliasEntry').should('have.lengthOf', 6);
  });
  it('should support deleting an alias', () => {
    cy.login('test', 'test');
    cy.get('[data-test=deleteAliasButton').first().click();
    cy.get('[data-test=aliasEntry').should('have.lengthOf', 5);
  });
  it('should show a message when no aliases exist', () => {
    cy.login('test', 'test');
    cy.get('[data-test=deleteAliasButton').each((element) => element.click());
    cy.get('[data-test=aliasEntry').should('not.exist');
    cy.contains('No entries found');
  });
  it('should support editing an alias', () => {
    cy.login('test', 'test');
    cy.contains('test1@test.com');
    cy.get('[data-test=aliasEntry').first().click();
    cy.get('[data-test=editDialog').should('exist');
    cy.get('[data-test=editInput').clear().type('test7@test.com');
    cy.get('[data-test=editForm').submit();
    cy.contains('test1@test.com').should('not.exist');
    cy.contains('test7@test.com');
    cy.get('[data-test=aliasEntry').should('have.lengthOf', 6);
  });
  it('should show an alert when the new alias already exists', () => {
    cy.login('test', 'test');
    cy.contains('test1@test.com');
    cy.get('[data-test=aliasEntry').first().click();
    cy.get('[data-test=editDialog').should('exist');
    cy.get('[data-test=editInput').clear().type('test2@test.com');
    cy.get('[data-test=editForm').submit();
    cy.contains('Alias test2@test.com already exists.');
  });
  it('should support filtering', () => {
    cy.login('test', 'test');
    cy.get('[data-test=aliasEntry').should('have.lengthOf', 6);
    cy.get('[data-test=filterInput').type('1');
    cy.get('[data-test=aliasEntry').should('have.lengthOf', 1);
    cy.get('[data-test=clearFilterButton').click();
    cy.get('[data-test=aliasEntry').should('have.lengthOf', 6);
    cy.get('[data-test=filterInput').type('notexists');
    cy.contains('No entries found');
  });
  describe('has pagination and', () => {
    it('only shows the selected number of items per page', () => {
      cy.login('test', 'test');
      cy.get('[data-test=pageSizeSelect]').select('5');
      cy.get('[data-test=aliasEntry').should('have.lengthOf', 5);
    });
    // Can not be tested because of https://github.com/buefy/buefy/issues/3028
    it.skip('switches pages using arrow buttons', () => {
      cy.login('test', 'test');
      cy.get('[data-test=aliasEntry').should('have.lengthOf', 6);
      cy.get('[data-test=pageSizeSelect]').select('5');
      cy.get('[aria-label="Go to next page"]').click();
      cy.get('[data-test=aliasEntry').should('have.lengthOf', 1);
      cy.get('[aria-label="Go to previous page"]').click();
      cy.get('[data-test=aliasEntry').should('have.lengthOf', 5);
    });
    it('switches pages using page numbers', () => {
      cy.login('test', 'test');
      cy.get('[data-test=aliasEntry').should('have.lengthOf', 6);
      cy.get('[data-test=pageSizeSelect]').select('5');
      cy.get('[aria-label="Go to page 2."]').first().click();
      cy.get('[data-test=aliasEntry').should('have.lengthOf', 1);
      cy.get('[aria-label="Go to page 1."]').first().click();
      cy.get('[data-test=aliasEntry').should('have.lengthOf', 5);
    });
  });
});
