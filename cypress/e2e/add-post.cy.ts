/// <reference types="cypress" />

describe('Add post', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('User can add a new post', () => {
    cy.selectById('post-title').type('Test post title');
    cy.selectById('post-content').type('Test post description');
  });
});
