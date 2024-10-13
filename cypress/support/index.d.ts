declare namespace Cypress {
  interface Chainable {
    selectById(selector: string): Chainable<JQuery<HTMLElement>>;
    findById(selector: string): Chainable<JQuery<HTMLElement>>;
  }
}
