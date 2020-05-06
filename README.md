# FDS SYSTEM

## Stack

| Type     | Technology        |
| -------- | ----------------- |
| Backend  | Express.js 4.17.1 |
| Frontend | React.js 16.13.1  |
| Database | PostgreSQL 12.1   |

## Setup

#### 1. After cloning/unzipping the source(repo) do the follow to setup Express.js and React.js

```sh
cd ${repo_dir_location}/frontend/fds-app/
npm install
cd ${repo_dir_location}/backend/fds-app/
npm install
```

###### this will install all the require package that Express.js and React.js need

---

#### 2. Initialize Database

###### Create a database named FDS and run the following command

```sh
cd ${repo_dir_location}/database/
psql fds -U <your_username>
\i master_script.sql
```

###### The master_script will setup the database with all the mock data and triggers.

---

#### 3. Modify Backend Database Connection

###### Modify the Backend Database Connection so that it has the correct information with any editor you like

```sh
cd ${repo_dir_location}/backend/fds-app/
```

###### Edit the config.js file and replace the required information

```javascript
const config = {
  DB_CONNECTION: {
    user: <your_username>,
    host: "localhost",
    database: "fds", // ensure that database is named as fds. if it is not, please change the database name accordingly
    password: <your_password>,
    port: "5432",
  },
};
```

---

#### 4. Run the System

```sh
cd ${repo_dir_location}/backend/fds-app/
npm start
cd ${repo_dir_location}/frontend/fds-app/
npm start
```

###### After running the two system. The system is ready to be used
