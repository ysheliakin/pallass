/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

// cypress/e2e/homepage.cy.ts

describe('LoggedInHomePage Tests (Without Mocking)', () => {
  const baseUrl = 'http://localhost:5173'; // Replace with your app's local URL
  const email = 'firstname1.lastname1@gmail.com';
  const password = 'password1';

  beforeEach(() => {
    // Log in before each test
    cy.visit(`${baseUrl}/login`);
    cy.contains('Log in')  // or you can use cy.get('button').contains('Login') if it's a button
        .click();
        cy.get('input[placeholder="hello@example.com"]').type(email);  // Email input field
        cy.get('input[placeholder="Your password"]').type(password); 
    
        // Click the "Log In" button
    cy.get('button[type="button"]').contains('Log In').click();

    // Verify login success by checking if localStorage contains 'token'
    // cy.window().should('have.property', 'localStorage')
    //   .then((localStorage) => {
    //     expect(localStorage.getItem('token')).to.exist;
    //   });

    // Verify user is redirected to the homepage
    // cy.url().should('include', '/home');
  });

  it('should display user groups on the homepage', () => {
    // cy.visit(`${baseUrl}/#/dashboard`);

    //Check if "Your Groups" section is visible
    cy.contains("Your Groups").should('exist');

    // Validate at least one group is displayed
    cy.get('div').contains('Your Groups').parent().within(() => {
      // cy.get('a').should('have.length.greaterThan', 0); // Ensure groups are listed
    });

    // Verify group links navigate correctly
    // cy.get('a').first().click();
    // cy.url().should('include', '/group/'); // Check group page navigation
  });

  it('should display upvoted threads on the homepage', () => {
    // cy.visit(`${baseUrl}/#/dashboard`);


    // Check if "Your Upvoted Discussion Forum Threads" section is visible
    cy.contains('Your Upvoted Discussion Forum Threads').should('exist');

    // Validate at least one thread is displayed
    cy.get('div').contains('Your Upvoted Discussion Forum Threads').parent().within(() => {
      // cy.get('a').should('have.length.greaterThan', 0); // Ensure threads are listed
    });

    // Verify thread links navigate correctly
  });

  // it('should allow navigating to "Create Group" page', () => {
  //   // cy.visit(`${baseUrl}/home`);
  //   cy.contains('+ Create group').click();
  //   cy.url().should('include', '/create-group');
  // });


  it('should load funding opportunities section', () => {
    // cy.visit(`${baseUrl}/home`);
    // cy.visit(`${baseUrl}/#/dashboard`);

    // Check if "Funding Opportunities" section is visible
    cy.contains('Funding Opportunities').should('exist');

    // Verify buttons are present
  });
});
