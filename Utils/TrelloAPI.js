const { request, expect } = require('@playwright/test');
require('dotenv').config();

class TrelloAPI {
    

    getAuthParams() {
        return {
            key: process.env.TRELLO_API_KEY,
            token: process.env.TRELLO_TOKEN
        };
    }

    async createBoard(boardName) {
        this.APIcontext = await request.newContext();
        this.BaseURL = 'https://api.trello.com';
        const paramsvalue = this.getAuthParams();
        const APIResponse = await this.APIcontext.post(`${this.BaseURL}/1/boards`, {
            params: {
                name: boardName,
                ...paramsvalue
            }
        });
        expect(APIResponse.status()).toBe(200);
        const JsonResponse = await APIResponse.json();

        return JsonResponse;

    }

    async getBoardLists(boardId) {
        const response = await this.APIcontext.get(`${this.BaseURL}/1/boards/${boardId}/lists`, {
            params: this.getAuthParams()
        });
        expect(response.ok()).toBeTruthy();
        const JsonResponse = await response.json();
        return JsonResponse;
    }

    getRequiredLists(lists) {
        const todoList = lists.find(list => list.name === 'To Do');
        const doingList = lists.find(list => list.name === 'Doing');
        const doneList = lists.find(list => list.name === 'Done');

        if(!todoList || !doingList || !doneList) {
            const actualListNames = lists.map(list => list.name);
            throw new Error(
                `Required lists are missing. Found: ${actualListNames.join(', ')}`
            );
        }

        return {
            todoList,
            doingList,
            doneList
        };
    }


    async deleteBoard(boardId) {
    
        const response= await this.APIcontext.delete(`${this.BaseURL}/1/boards/${boardId}`,{
            params:this.getAuthParams()
        });
        expect(response.ok()).toBeTruthy();
    }

    async dispose() {
        if(this.APIcontext){
            await this.APIcontext.dispose();
        }

    }
}

module.exports = { TrelloAPI };