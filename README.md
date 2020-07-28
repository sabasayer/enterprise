# @sabasayer/enterprise

There are 5 parts of ui projects. Api , Data store , Logic , Mapper , UI

1. **Api :** Handles requests and response from backend

2. **Data store :** Stores data that get from backend or only local data. Handles caching etc.
3. **Logic :** Communicates with data store or sometimes directly api. 
Changes data accordingly to needs of backend and ui. Also validates to data. Acts as gatekeeper between ui and backend
4. **Mapper :** Maps domain models to viewModels and vice versa.
5. **UI :** Renders data and handles user input. 
UI frameworks ( vue , react vs.) dont need to know logic and where and how data is stored.


This projects acts as a guide for first 4 parts and also provides usefull tools.

Check **examples** folder for usage examples.