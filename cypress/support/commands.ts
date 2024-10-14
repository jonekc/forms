/// <reference types="cypress" />

Cypress.Commands.add(
  'selectById',
  { prevSubject: 'optional' },
  (subject: JQuery<HTMLElement> | undefined, selector: string) =>
    subject
      ? cy.wrap(subject).find(`[data-testid=${selector}]`)
      : cy.get(`[data-testid=${selector}]`),
);
