import { getGreeting } from '../support/app.po';

describe('scorer', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to scorer!');
  });
});
