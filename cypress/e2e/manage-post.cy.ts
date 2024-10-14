/// <reference types="cypress" />

describe('Manage post', () => {
  const postTitle = 'Test post title';
  const postMessage = 'Test post description';
  const editedPostTitle = 'Edited test post title';

  beforeEach(() => {
    cy.visit('/');
    cy.selectById('post-title-field').type(postTitle);
    cy.selectById('post-content-field').type(postMessage);
    cy.selectById('post-published-field').check();
    cy.selectById('post-file-field').selectFile('cypress/fixtures/upload.png');

    cy.intercept('/api/posts').as('createPost');
    cy.selectById('post-submit').click();
    cy.wait('@createPost');
    cy.contains('Post successfully created');

    cy.visit('/login');
    cy.selectById('login-field').type(Cypress.env('LOGIN'));
    cy.selectById('password-field').type(Cypress.env('PASSWORD'), {
      log: false,
    });
    cy.intercept('/api/posts').as('posts');
    cy.selectById('login-submit').click();
    cy.wait('@posts');
  });

  it('Admin can edit a post', () => {
    cy.selectById('edit-post').last().click();
    cy.selectById('post-title-field').clear().type(editedPostTitle);
    cy.selectById('post-content-field')
      .clear()
      .type('Edited test post description');
    cy.intercept('/api/posts').as('editPost');
    cy.selectById('post-submit').click();
    cy.wait('@editPost');
  });

  it('Admin can remove posts', () => {
    cy.selectById('post-title')
      .filter(
        (_index, element) =>
          element?.textContent === postTitle ||
          element?.textContent === editedPostTitle,
      )
      .each(($postTitle) => {
        cy.wrap($postTitle).parent().selectById('remove-post').click();
        cy.intercept('/api/posts').as('removePost');
        cy.wrap($postTitle)
          .closest('[data-testid=post]')
          .selectById('confirm-button')
          .click();
        cy.wait('@removePost');
      });
  });
});
