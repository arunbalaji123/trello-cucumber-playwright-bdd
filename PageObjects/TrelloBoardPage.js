const { expect } = require('@playwright/test')

class TrelloBoardPage {
    constructor(page) {
        this.page = page;
    }


    async verifyBoardAndLists(boardName) {
        await expect(this.page.getByText(boardName, { exact: true }).first()).toBeVisible();
        const lists = ['To Do', 'Doing', 'Done'];
         for (const l of lists) {
            await expect(this.getList(l)).toHaveCount(1);
            await expect(this.getList(l)).toBeVisible();
        }
    }

    getList(listName) {
        return this.page.getByTestId('list-wrapper')
        .filter({has: this.page.getByText(listName, { exact: true })});
    }

    async createCard(listName, cardName) {
    const list = this.getList(listName);
    await expect(list).toHaveCount(1);
    const crdText = list.getByTestId('list-card-composer-textarea');
    if (!(await crdText.isVisible())) {
        await list.getByTestId('list-add-card-button').click();
    }
    await expect(crdText).toBeVisible();
    await crdText.fill(cardName);
    await list.getByTestId('list-card-composer-add-card-button').click();
    await this.verifyCardInList(listName, cardName);
}
    

    async verifyCardInList(listName, cardName) {
        const list = this.getList(listName);
        await expect(list.getByText(cardName, { exact: true })).toBeVisible();
    }

   getCard(listName, cardName) {
    const list = this.getList(listName);

    return list
        .getByTestId('list-card')
        .filter({ hasText: cardName });
}


async moveCard(cardName, sourceListName, destinationListName) {
    const sourceCard = this.getCard(
        sourceListName,
        cardName
    );

    const destinationList = this.getList(
        destinationListName
    );

    const destinationDropZone =
        destinationList.getByTestId('list');

    await expect(sourceCard).toHaveCount(1);
    await expect(sourceCard).toBeVisible();
    await expect(destinationDropZone).toBeVisible();

    await sourceCard.dragTo(destinationDropZone);

    await this.verifyCardInList(
        destinationListName,
        cardName
    );
}
}

module.exports = { TrelloBoardPage };