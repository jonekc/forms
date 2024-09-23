declare namespace Cypress {
  interface Chainable {
    selectById(selector: string): Chainable<JQuery<HTMLElement>>;
  }
}
