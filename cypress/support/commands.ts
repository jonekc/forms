/// <reference types="cypress" />

Cypress.Commands.add('selectById', (selector: string) =>
  cy.get(`[data-testid=${selector}]`),
);