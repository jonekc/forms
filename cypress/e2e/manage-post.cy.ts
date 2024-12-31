/// <reference types="cypress" />

describe('Manage post', () => {
  const editedPostTitle = 'Edited test post title';

  const editPost = () => {
    cy.selectById('edit-post').first().click();
    cy.selectById('post-title-field').clear().type(editedPostTitle);
    cy.selectById('post-content-field')
      .clear()
      .type('Edited test post description');
    cy.intercept('/api/posts/**').as('editPost');
    cy.selectById('post-submit').click();
    cy.wait('@editPost');
  };

  beforeEach(() => {
    cy.createPost();
  });

  afterEach(() => {
    cy.logout();
  });

  it('Admin can edit a post', () => {
    editPost();
  });

  it('Admin can edit a post in the details page', () => {
    cy.selectPost();
    editPost();
  });

  it('Admin can remove posts', () => {
    cy.removePosts([editedPostTitle]);
  });

  it('Admin can remove a post in the details page', () => {
    cy.selectPost();
    cy.removePosts();
  });
});
