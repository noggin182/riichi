import { getGreeting } from '../support/app.po';

describe('riichi', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to riichi!');
  });
});
