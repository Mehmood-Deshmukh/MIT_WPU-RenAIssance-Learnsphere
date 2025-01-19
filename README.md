### Overview
Welcome to the repository. This project was built during 48-hour hackathon organized by MIT-WPU. This project is essentially a assignment submission portal for students and teachers. The project tries to enhance the prouductivity of teachers and students by using AI to :
1. Grade the assignments
2. Provide the areas of improvement / feedback
3. Provides the score based on the metriecs provided by the teacher
4. Suggest resources to improve the areas of improvement

### Tech Stack
1. **Frontend:** ReactJS was used to build the frontend of the project. Also, the project uses PrimeReact for the UI components and tailwindCss for the styling.
2. **Backend:** The backend of the project was built using NodeJS and ExpressJS.
3. **Database:** The database used in the project is MongoDB.

### Main features of the project
1. **RBA (Role Based Access):** The project has three roles:
    - **Admin:** The admin can approve teachers sign up requests and teachers need to make a request to make a course.
    - **Teacher:** The teacher can create a course and students will put an enrollment request to join the course. The teacher can approve or reject the request.
    - **Student:** The student can enroll in the course and submit the assignments.
2. **Assignment Submission:** The student can submit the assignment and the **WorqHat's LLM** will grade the assignment and provide the feedback: 
    - **score**: The score of the assignment based on the metrics provided by the teacher.
    - **feedback**: The feedback of the assignment including areas of improvement.
    - **roadmap**: The roadmap to improve the areas of improvement.

### How to run the project

#### **Client**
For configuring the frontend of the project, please follow the following steps:
Frontend of the project is bootstrapped with **vite** and TailwindCSS.

1. Clone the repository using the following command:
    ```bash
    git clone https://github.com/Mehmood-Deshmukh/Renaissance-Ai
    ```
2. Change the directory to the frontend directory:
    ```bash
    cd client
    ```
3. Install the dependencies using the following command:
    ```bash
    npm install
    ```
4. Run the frontend using the following command:
    ```bash
    npm run dev
    ```
5. The frontend will start running on the following URL:
    ```bash
    http://localhost:5173/
    ```

#### **Server**
For configuring the backend of the project, please follow the following steps:
Backend of the project is built using **NodeJS** and **ExpressJS**.
and the database used in the project is **MongoDB**.

Assuming you have cloned the repository and you are in the root directory of the project.
1. Change the directory to the backend directory:
    ```bash
    cd server
    ```
2. Install the dependencies using the following command:
    ```bash
    npm install
    ```
3. Create a `.env` file in the backend directory and add the following environment variables:
    ```bash
    PORT=3000
    MONGOURL="mongodb://localhost:27017/renaissance"
    JWTSECRET="thisismysecret"
    SESSIONSECRET="thequickbrownfoxjumpsoverthelazydog"
    SUPER_ADMIN_TOKEN="JamesMoriarty"
    ```
    Brief description of the environment variables:
    - **PORT**: The port on which the server will run.
    - **MONGOURL**: The URL of the MongoDB database. (You can use MongoDB Atlas or local MongoDB)
    - **JWTSECRET**: The secret key for the JWT token.
    - **SESSIONSECRET**: The secret key for the session.
    - **SUPER_ADMIN_TOKEN**: The token for the super admin signup. Super admin can only be created when you make a POST request to the `/api/admin/signup` route with the token in the header (Bearer token).
    ```JSON
    {
        ...
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer <super_admin_token>"
        },
        "body": {
            ...
        }
    }
    ```
4. Run the backend using the following command:
    ```bash
    node index.js
    ```
    You may also use nodemon to run the server:
    if you don't have nodemon installed, you can install it using the following command:
    ```bash
    npm install -g nodemon
    ```
    Now, you can run the server using the following command:
    ```bash
    nodemon index.js
    ```


5. The backend will start running on the following URL:
    ```bash
    http://localhost:<PORT>/
    ```


### Contributors
1. **[Aryan Mehta](https://github.com/arymehta)**
2. **[Hardik Mutha](https://github.com/HardikMutha)**
3. **[Mehmood Deshmukh](https://github.com/Mehmood-Deshmukh)**
4. **[Yashwant Bhosale](https://github.com/YashwantBhosale)**