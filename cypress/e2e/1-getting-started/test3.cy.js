describe('CreateThread and ViewThread', () => {
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
    
      });

  
    it('Process of creating and viewing a thread', () => {
    //   cy.get('button[type="button"]').contains('+ Create thread').click();
    //   cy.get('button').contains('Create thread').click();
    cy.wait(2000); // Wait for 2 seconds before trying to click the button
    // cy.get('button').contains('+ Create thread');
    // // cy.get('button').contains('Create thread').debug().click();
    // cy.get('#app').find('button').click();
    cy.contains('.mantine-Button-label', '+ Create thread').click();
    cy.get('input[placeholder="Enter thread title"]').type('Homeostasis');  // Email input field
    // cy.get('input[placeholder="Enter thread description"]').type('the process by which green plants and certain other organisms transform light energy into chemical energy.'); 
    // cy.get('div[role="listbox"]')
    // //.contains('Biology')  // Replace 'Category Name' with an actual category name
    // .should('be.visible') // Ensure the dropdown is visible
    // .find('span')
    // .contains('Biology')
    // .click();
    cy.get('span')
     .contains('Biology')
     .click({ force: true });
    cy.contains('Create thread')  // or you can use cy.get('button').contains('Login') if it's a button
            .click();


    cy.get('h2').contains('Homeostasis'); // Check for title
    cy.get('h3').contains('Latest News On The Subject');
    // cy.get('h4').contains('Interesting Journals In The Field');
    cy.wait(1500);
    cy.contains('👍 Upvote').click();
    // cy.get('input[placeholder="Your message"]').type('Cypress Test');
    cy.get('textarea[placeholder="Your message"]').type('Cypress Test');
    cy.contains('Post Message')  // or you can use cy.get('button').contains('Login') if it's a button
        .click();
    cy.wait(1000);
    // cy.get('h5').contains('Cypress Test');

    //   cy.get('input[placeholder="Enter thread title"]').should('exist'); // Title input
    //   cy.get('textarea[placeholder="Enter thread description"]').should('exist'); // Description textarea
    //   cy.get('select[placeholder="Select a category"]').should('exist'); // Category select
    //   cy.get('button').contains('Create thread').should('exist'); // Create button
    });
  });
  