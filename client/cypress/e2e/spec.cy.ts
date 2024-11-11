// cypress/e2e/homepage.cy.ts

describe('HomePage Tests', () => {
  beforeEach(() => {
    // Visit the homepage of the local development server
    cy.visit('http://localhost:5173');
  });

  it('should load the homepage and display the main title', () => {
    // Check if the main title is present and contains the correct text
    cy.get('h2')
      .should('contain.text', 'Communicate with fellow researchers for free');
  });

  it('should display the "Create and join Groups" section with image', () => {
    // Check if the section title and image are displayed correctly
    cy.get('h3')
      .contains('Create and join Groups to work on projects')
      .should('be.visible');

    cy.get('img[alt="Group example"]')
      .should('have.attr', 'src')
      .and('include', '/api/placeholder/300/200');
  });

  it('should display the "Create and follow threads in the Discussion Forum" section', () => {
    // Check if the section title and image are displayed correctly
    cy.get('h3')
      .contains('Create and follow threads in the Discussion Forum')
      .should('be.visible');

    cy.get('img[alt="Discussion Forum thread example"]')
      .should('have.attr', 'src')
      .and('include', '/api/placeholder/300/200');
  });

  it('should display the "Join and host Expert Q&A sessions" section with image', () => {
    // Check if the section title and image are displayed correctly
    cy.get('h3')
      .contains('Join and host Expert Q&A sessions')
      .should('be.visible');

    cy.get('img[alt="Expert Q&A session example"]')
      .should('have.attr', 'src')
      .and('include', '/api/placeholder/300/200');
  });

  it('should display the "Learn about a topic written by an expert" section', () => {
    // Check if the section title and image are displayed correctly
    cy.get('h3')
      .contains('Learn about a topic written by an expert / write about a topic you\'re an expert in')
      .should('be.visible');

    cy.get('img[alt="Learn topic example"]')
      .should('have.attr', 'src')
      .and('include', '/api/placeholder/300/200');
  });

  it('should display the "Send direct messages" section with image', () => {
    // Check if the section title and image are displayed correctly
    cy.get('h3')
      .contains('Send direct messages')
      .should('be.visible');

    cy.get('img[alt="Direct message example"]')
      .should('have.attr', 'src')
      .and('include', '/api/placeholder/300/200');
  });
});
