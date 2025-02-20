1. Build an app using the following technologies:
Front End: React / Angular / Vue (choose one)
Server side: Javascript / Python / C# / Java (choose one)
Database: Postgres / MySQL / SQL Server / MongoDB (choose one)
2. You have 24 hours to build the example app and to submit. The project is not meant
to take you an entire day to do. Should only spend 1-2 hours max on the project.
3. The Project:
• Use the baseball data API: https://api.hirefraction.com/api/test/baseball
The UI will be simple: List out the players along with their stats from the API
(correct the missing data on ranking in terms of hits per season).
• When a user clicks on a player in the list, they should see a description of the
player. This description should be LLM-generated.
• Include an Edit button on the UI enabling a user to edit a player’s data.

Okay, let's focus on the UI part. Let's have a button that seeds the API data. And let's have a nice tabular view of all the players and their stats. They came from the API.