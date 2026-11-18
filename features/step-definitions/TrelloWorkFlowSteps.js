const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
let projectTasks = [];

Given('the disposable Trello project board is open', async function () {
    await expect(this.page).toHaveURL(/trello\.com\/b\//);
    await this.trelloPOM.verifyBoardAndLists(this.testboard.name);
});

When("the user creates the following cards in the To Do list",async function(dataTable){
    const names=dataTable.hashes();
    projectTasks = names.map(row => row.task);
     for (const cName of projectTasks) {
            await this.trelloPOM.createCard('To Do',cName);
    }
});

Then('all project cards should be displayed in the To Do list',async function () {
        for (const cName of projectTasks) {
            await this.trelloPOM.verifyCardInList('To Do',cName);
        }
    });


Given('all project cards are available in the To Do list',async function () {
        for (const taskName of projectTasks) {
            await this.trelloPOM.verifyCardInList('To Do',taskName);
        }
});

When('the user moves all project cards from To Do to Doing',async function () {
        for (const taskName of projectTasks) {
            await this.trelloPOM.moveCard(taskName,'To Do','Doing');
        }
});

Then('all project cards should be displayed in the Doing list',async function () {
        for (const taskName of projectTasks) {
            await this.trelloPOM.verifyCardInList('Doing',taskName);
        }
});

Given('all project cards are available in the Doing list',async function () {
        for (const taskName of projectTasks) {
            await this.trelloPOM.verifyCardInList('Doing',taskName);
        }
});

When('the user moves all project cards from Doing to Done',async function () {
        for (const taskName of projectTasks) {
            await this.trelloPOM.moveCard(taskName,'Doing','Done');
        }
});

Then('all project cards should be displayed in the Done list',async function () {
        for (const taskName of projectTasks) {
            await this.trelloPOM.verifyCardInList('Done',taskName);
        }
});