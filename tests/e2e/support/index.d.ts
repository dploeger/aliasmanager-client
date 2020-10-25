/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    /**
     * Login into the aliasmanager
     * @param username username to use
     * @param password password to use
     */
    login(username: string, password: string): Chainable<Element>;
  }
}
