# Car Upload Challenge

This project is based on a code challenge to create an API to which a user can `POST` a csv file. 
<br>The file should contain any of a finite list of headers that are known for the user. The users headers should be mapped to the actual DB tables / columns




## Notes / Thought process:
- This is my first time using NextJS -- it looks awesome, so I figured I'd give it a go :) 
- I started this project with MySQL though after doing some research and finding it cumbersome to get a simple dockerized setup I opted to go with postgres
    - some resources: 
      - https://hackr.io/blog/postgresql-vs-mysql
      - https://developer.okta.com/blog/2019/07/19/mysql-vs-postgres
      - https://dzone.com/articles/five-key-postgres-advantages-over-mysql
- I like being able to use JSONB in postgres and I could see it being useful for the project
### DB configs
-- my current thinking is to give each dealer a config in which the headers for their CSV files are mapped to their representation in the db:
#UUID,VIN,MAKE,MODEL,MILEAGE,YEAR,PRICE,ZIP CODE,CREATE DATE,UPDATE DATE
```javascript
let allHeaders = ['UUID', 'YEAR', 'MAKE', 'MODEL', 'MILEAGE', 'YEAR', 'PRICE', 'ZIP CODE', 'UPDATE DATE', 'CREATE DATE']
let obj = allHeaders.reduce((o, key) => ({...o, [key]: 'table.location'}), {})
```
```json
{
	"dbMap": {
		"allHeaders": ["UUID", "YEAR", "themake", "big_model", "MILEAGE", "YEAR", "PRICE", "ZIP CODE", "UPDATE DATE", "CREATE DATE"],
		"UUID": "car.extId",
		"YEAR": "car.year",
		"MAKE": "car.make",
		"MODEL": "car.model",
		"MILEAGE": "car.mileage",
		"PRICE": "car.price",
		"ZIP CODE": "car.zip",
		"UPDATE DATE": "car.updated",
		"CREATE DATE": "car.created"
	}
}
```


## Future Directions
- unfortunately there's currently [05-19-2021] and open issue with Prisma & the latest Docker update [issue link](https://github.com/prisma/prisma/issues/5304)
    Apparently it is impacting many developers' workflows. When this is resolved I'd like to revisit using it in this project
- as one of the things I wanted to do was try to do this project with tech that is new or less-familiar to me, I have a long list of things I would improve
- NextJS
  - I would like to take the API processing pieces away from the NextJS piece.
  - While I thought it is really cool that I could get these things to work from the same place, I think I'd prefer to have an internal express server running to handle more resource intensive processes like writes to the DB. Maybe more experience will convince me otherwise
  - Probably a good idea to explore their CORS middleware to enable broader consumption of the API 
- React
    - hook up redux
    - get thunk middleware setup
- DB
    - I was going to try to use Prism, but there's a sad bug happening there right now.
    - get the Prisma ORM working to check out it's capabilities for setting up the DB based on models
    - revisit the approach to customer configurations 
        - I'd like to explore how normalization occurs based on the columns a customer gives us
        - Would we ever consider trying to automate the reorganization of a DB (recreation) based on expanded data sets
        - I'd like to look at how flexibility and query optimization are affected using JSONB
    - reexamine constraints to ensure proper cascading of updates / deletions
- Docker / DevOps
    - I would make futher improvements to the Dockerfile so that it could be deployed in a more robust environment
    - Making a dockerfile for prod, I'd start with an ubuntu base image and build it out

## Local Development Setup

[comment]: <> (<details><summary><b>Show instructions</b></summary>)

1. Open the project in VS Code
- ensure you have Docker and Remote Containers extensions installed for VS Code

2. Select the containers / docker tab and select Open the current folder in container or attach to running container

3. Open command line with `Ctrl + Shift + ~` and run the django project

    ```bash
    yarn dev
    ```

4. Run / Build the react project
    - RUN (with auto-reload):
    ```bash
    /workspace/ $  yarn && yarn start
    ```

    - BUILD:
    ```bash
    /workspace/ $  yarn build
    ```
