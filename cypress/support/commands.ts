/// <reference types="cypress" />

Cypress.Commands.add('selectById', (selector: string) =>
  cy.get(`[data-testid=${selector}]`),
);

Cypress.Commands.add('findById', (selector: string) =>
  this.find(`[data-testid=${selector}]`),
);
