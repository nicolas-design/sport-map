describe('Can navigate', () => {
  it('can visit and load', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy="register-link"]').click();
    cy.get('[data-cy="register1"]').type('exam1695');
    cy.get('[data-cy="register2"]').type('q');
    cy.get('[data-cy="register3"]').type('q');
    cy.get('[data-cy="register4"]').type('Hans20');
    cy.get('[data-cy="register5"]').type('Meier@gmail.com');
    cy.get('[data-cy="signup-link"]').click();
    cy.wait(3000);

    cy.get('[data-cy="map"]').click(400, 400);
    cy.wait(2000);
    cy.get('[data-cy="add-button"]').click();

    cy.wait(2500);
    cy.get('[data-cy="add1"]').type('Vienna');
    cy.get('[data-cy="add2"]').type('Hinterhugl 44');
    cy.get('[data-cy="add4"]').type('Big surf wave lets go');
    cy.get('[data-cy="add-spot"]').click();
    cy.wait(3000);
    cy.get('[data-cy="plus-link"]').click();
    cy.get('[data-cy="delete-button"]').click();
  });
});
