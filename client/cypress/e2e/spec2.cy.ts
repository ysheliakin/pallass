// cypress/e2e/homepage.cy.ts

describe('HomePage Tests', () => {
    beforeEach(() => {
      // Visit the homepage of the local development server
      cy.visit('http://localhost:5173');
    });

    it('should find and click the "Login" button/link', () => {
        // Find the element containing the text 'Log in' and click on it
        cy.contains('Log in')  // or you can use cy.get('button').contains('Login') if it's a button
        .click();
        
  
      // After clicking, verify that the URL changes or the login page is loaded
      cy.contains('Log In')  // or you can use cy.get('button').contains('Login') if it's a button
        .click();
      // Example: cy.url().should('include', '/login') assuming the login page route is '/login'
      cy.contains('+ Create group')  // or you can use cy.get('button').contains('Login') if it's a button
        .click();
    
        // Fill out the form fields
        cy.get('input[placeholder="Enter group name"]').type('Research Group');
        cy.get('input[placeholder="Enter user email"]').type('user@example.com');
        cy.get('button').contains('Add').click();  // Click the "Add" button to add the user
    
        // Fill out the description field
        cy.get('textarea[placeholder="Enter group description"]')
          .type('This is a group for research purposes.');
    
        // Select Privacy and Notifications options
        cy.get('input[type="radio"][value="public"]').check();  // Select "Public"
        cy.get('input[type="radio"][value="on"]').check();  // Select "On" for notifications
    
        // Click the "Create Group and GroupID" button
        cy.get('button').contains('Create Group and GroupID').click();
    
        // Verify that the fetch request is made and the response is as expected
        cy.intercept('POST', 'http://localhost:5000/newgroup').as('createGroup');
        // cy.wait('@createGroup').then((interception) => {
        //   // Ensure that the response status code is 200 (OK)
        //   assert.equal(interception.response.statusCode, 200);
        // });
      });
    });
  
    