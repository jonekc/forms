/// <reference types="cypress" />

const postTitle = 'Test post title';
const postContent = 'Test post description';

Cypress.Commands.add(
  'selectById',
  { prevSubject: 'optional' },
  (subject: JQuery<HTMLElement> | undefined, selector: string) =>
    subject
      ? cy.wrap(subject).find(`[data-testid=${selector}]`)
      : cy.get(`[data-testid=${selector}]`),
);

Cypress.Commands.add('login', () => {
  cy.session('login', () => {
    cy.intercept('/api/auth').as('auth');
    cy.visit('/login');
    cy.selectById('login-field').type(Cypress.env('LOGIN'));
    cy.selectById('password-field').type(Cypress.env('PASSWORD'), {
      log: false,
    });
    cy.selectById('login-submit').click();
    cy.wait('@auth');
  });
});

Cypress.Commands.add('logout', () => {
  cy.visit('/');
  cy.selectById('logout-button').click();
});

Cypress.Commands.add('displayPosts', () => {
  cy.intercept('/api/posts').as('posts');
  cy.visit('/');
  cy.wait('@posts');
});

Cypress.Commands.add('createPost', () => {
  cy.login();
  cy.visit('/new');

  cy.selectById('post-title-field').type(postTitle);
  cy.selectById('post-content-field').type(postContent);
  cy.selectById('post-published-field').check();
  cy.selectById('post-file-field').selectFile('cypress/fixtures/upload.png');

  cy.intercept('/api/posts').as('createPost');
  cy.selectById('post-submit').click();
  cy.wait('@createPost');
  cy.contains('Post successfully created');

  cy.displayPosts();
});

Cypress.Commands.add('removePosts', (titles) => {
  const postTitles = [postTitle, ...(titles || [])];
  cy.selectById('post-title')
    .filter((_index, element) =>
      postTitles.includes(element?.textContent || ''),
    )
    .each(($postTitle) => {
      cy.intercept('/api/posts/**').as('removePost');
      cy.intercept('/api/posts').as('posts');
      cy.wrap($postTitle).parent().selectById('remove-post').click();
      cy.wrap($postTitle)
        .closest('[data-testid=post]')
        .selectById('confirm-button')
        .click();
      cy.wait('@removePost');
      cy.wait('@posts');
    });
});

Cypress.Commands.add('selectPost', () => {
  cy.intercept('/api/posts/**').as('post');
  cy.selectById('show-details').first().click();
  cy.wait('@post');
});
