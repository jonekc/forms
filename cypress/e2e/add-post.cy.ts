/// <reference types="cypress" />

describe('Add post', () => {
  it('User can add a new post', () => {
    cy.visit('/');
    cy.selectById('post-title').type('Test post title');
    cy.selectById('post-content').type('Test post description');
    cy.selectById('post-published').check();
    cy.selectById('post-file').selectFile('cypress/fixtures/upload.png');

    cy.intercept('/api/posts').as('createPost');
    cy.selectById('post-submit').click();
    cy.wait('@createPost');
    cy.contains('Post successfully created');
  });
});
