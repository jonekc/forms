/// <reference types="cypress" />

describe('Manage comment', () => {
  const comment = 'Test comment';
  const commentAuthor = 'Test user';
  const editedComment = 'Edited comment';

  const addComment = () => {
    cy.selectById('comment-content-field').type(comment);
    cy.intercept('/api/posts/**/comments').as('addComment');
    cy.selectById('comment-submit').click();
    cy.wait('@addComment');
    cy.contains(comment);
  };

  beforeEach(() => {
    cy.createPost();
  });

  afterEach(() => {
    cy.displayPosts();
    cy.removePosts();
    cy.logout();
  });

  it('Guest can add a comment', () => {
    cy.logout();
    cy.displayPosts();
    cy.selectPost();

    cy.selectById('comment-author-field').type(commentAuthor);
    addComment();
    cy.login();
  });

  it('Admin can edit a comment', () => {
    cy.selectPost();
    addComment();

    cy.selectById('edit-comment').click();
    cy.selectById('comment-content-field').first().clear().type(editedComment);
    cy.intercept('/api/posts/**/comments/**').as('editComment');
    cy.selectById('comment-submit').first().click();
    cy.wait('@editComment');
    cy.contains(editedComment);
  });

  it('Admin can remove a comment', () => {
    cy.selectPost();
    addComment();

    cy.selectById('remove-comment').click();
    cy.intercept('/api/posts/**/comments/**').as('removeComment');
    cy.selectById('post-comments').selectById('confirm-button').click();
    cy.wait('@removeComment');
  });
});
