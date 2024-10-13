/// <reference types="cypress" />

describe('Manage post', () => {
  const postTitle = 'Test post title';
  const postMessage = 'Test post description';

  beforeEach(() => {
    cy.visit('/');
    cy.selectById('post-title').type(postTitle);
    cy.selectById('post-content').type(postMessage);
    cy.selectById('post-published').check();
    cy.selectById('post-file').selectFile('cypress/fixtures/upload.png');

    cy.intercept('/api/posts').as('createPost');
    cy.selectById('post-submit').click();
    cy.wait('@createPost');
    cy.contains('Post successfully created');

    cy.visit('/login');
    cy.selectById('login').type(Cypress.env('LOGIN'));
    cy.selectById('password').type(Cypress.env('PASSWORD'), { log: false });
    cy.intercept('/api/posts').as('posts');
    cy.selectById('login-submit').click();
    cy.wait('@posts');
  });

  it('Admin can edit a post', () => {
    cy.selectById('edit-post').last().click();
    cy.selectById('post-title').clear().type('Edited test post title');
    cy.selectById('post-content').clear().type('Edited test post description');
    cy.intercept('/api/posts').as('editPost');
    cy.selectById('post-submit').click();
    cy.wait('@editPost');
  });

  // it('Admin can remove posts', () => {
  //   cy.get('body')
  //     .find(`:contains("${postTitle}")`)
  //     .each(($title) => {
  //       cy.wrap($title).findById('remove-post').click();
  //       cy.intercept('/api/posts').as('removePost');
  //       cy.selectById('confirm-button').last().click();
  //       cy.wait('@removePost');
  //     });
  // });
});
