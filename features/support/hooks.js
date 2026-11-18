const { Before, BeforeAll,AfterAll, Status, AfterStep, setDefaultTimeout, } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { TrelloAPI } = require('../../Utils/TrelloAPI')
const { TrelloBoardPage } = require('../../PageObjects/TrelloBoardPage')
const path = require('path');
const AUTH_FILE = path.resolve('playwright/.auth/trello.json')
const TrelloObj = new TrelloAPI();
let sharedBoard;
setDefaultTimeout(60 * 1000);
let sharedPage;
let sharedBrowser;
let sharedContext;


BeforeAll(async function () {
    const prefix = Date.now().toString().slice(-4);
    const boardName = `BDD-Test-${prefix}`;
    const board = await TrelloObj.createBoard(boardName);
    console.log('Created Board : ' + boardName);
    const lists = await TrelloObj.getBoardLists(board.id);
    const { todoList, doingList, doneList } = TrelloObj.getRequiredLists(lists);
    sharedBoard = {
        id: board.id,
        name: board.name,
        url: board.url,
        prefix: prefix,
        todoList: todoList,
        doingList: doingList,
        doneList: doneList
    };
    sharedBrowser = await chromium.launch({ headless: false });
    sharedContext = await sharedBrowser.newContext({ storageState: AUTH_FILE });
    sharedPage= await sharedContext.newPage();
    await sharedPage.goto(sharedBoard.url);

})

Before(async function () {
    this.page = sharedPage;
    this.trelloPOM = new TrelloBoardPage(this.page);
    this.testboard = sharedBoard;
});





AfterStep(async function ({ result }) {
    if (result.status === Status.FAILED && this.page) {
       const screenSHOT=await this.page.screenshot({ path: `screenshots/failure-${sharedBoard.prefix}.png`, fullPage: true });
        await this.attach(screenSHOT,'Error We Got');
    }
})

AfterAll(async function () {
    try {
        if (sharedContext) {
            await sharedContext.close();
        }

        if (sharedBrowser) {
            await sharedBrowser.close();
        }
    }


    finally {

        try {
            if (sharedBoard?.id) {
                await TrelloObj.deleteBoard(sharedBoard.id);
                console.log(`\nDeleted Board : ${sharedBoard.name}`);
            }
        }
        finally {
            await TrelloObj.dispose();
            console.log("Api Disposed.");
        }
    }

})


