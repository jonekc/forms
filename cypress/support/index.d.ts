declare namespace Cypress {
  interface Chainable {
    selectById(selector: string): Chainable<JQuery<HTMLElement>>;
    login(): Chainable<void>;
    preserveSession(): Chainable<void>;
    logout(): Chainable<void>;

    displayPosts(): Chainable<void>;
    createPost(): Chainable<void>;
    removePosts(titles?: string[]): Chainable<void>;
    selectPost(): Chainable<void>;
  }
}
