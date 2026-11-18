Feature: Trello task management workflow

  Scenario: Create project tasks in the To Do list
    Given the disposable Trello project board is open
    When the user creates the following cards in the To Do list
      | task                     |
      | Configure Trello API     |
      | Build BDD Card Workflow  |
      | Generate Cucumber Report |
    Then all project cards should be displayed in the To Do list

  Scenario: Start working on the project tasks
    Given the disposable Trello project board is open
    And all project cards are available in the To Do list
    When the user moves all project cards from To Do to Doing
    Then all project cards should be displayed in the Doing list

  Scenario: Complete the project tasks
    Given the disposable Trello project board is open
    And all project cards are available in the Doing list
    When the user moves all project cards from Doing to Done
    Then all project cards should be displayed in the Done list
