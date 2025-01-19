# Overview
Welcome to the LearnSpheres Repository!. This project was built during 48-hour hackathon organized by CSI MIT-WPU In collaboration with WorqHat. This project aims to streamline the process of submission and evaluation of assignments. The project tries to enhance the prouductivity of teachers and students by using AI to :
1. Grade the assignments based on the professor's marking scheme
2. Provide the areas of improvement / feedback
3. Provide the score based on the metriecs provided by the teacher
4. Suggest resources to improve the areas of improvement

## Tech Stack
1. **Frontend:** ReactJS was used to build the frontend of the project. Also, the project uses PrimeReact for the UI components and tailwindCss for the styling.
2. **Backend:** The backend of the project was built using NodeJS and ExpressJS.
3. **Database:** The database used in the project is MongoDB.

## Main features of the project
1. **RBA (Role Based Access):** The project has three roles:
    - **Admin:** The admin can approve teachers sign up requests and teachers need to make a request to make a course.
    - **Teacher:** The teacher can create a course and students will put an enrollment request to join the course. The teacher can approve or reject the request.
    - **Student:** The student can enroll in the course and submit the assignments.
2. **Assignment Submission:** The student can submit the assignment and the **WorqHat's LLM** will provide a comprehensive evaluation of the assignment: 
    - **Score**: The score of the assignment based on the metrics provided by the teacher.
    - **Feedback**: The feedback of the assignment including problematic areas in the assignment.
    - **Roadmap**: A roadmap is generated to guide the students towards improvement.

## How to run the project

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
For configuring the backend of the project, please follow the following steps:jimmoriarty
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
    WORQHAT_API_KEY="YOUR_WORQHAT_API_KEY"
    ```
    Brief description of the environment variables:
    - **PORT**: The port on which the server will run.
    - **MONGOURL**: The URL of the MongoDB database. (You can use MongoDB Atlas or local MongoDB)
    - **JWTSECRET**: The secret key for the JWT token.
    - **SESSIONSECRET**: The secret key for the session.
    - **SUPER_ADMIN_TOKEN**: The token for the super admin signup. Super admin can only be created when you make a POST request to the `/api/admin/signup` route with the token in the header (Bearer token).
    - **WORQHAT_API_KEY**: The API key for the WorqHat's LLM. You can get the API key by signing up on the [WorqHat's LLM](https://worqhat.com/).
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

### **Important Note:** 
**Super Admin Signup:** The super admin can only be created when you make a POST request to the `/api/admin/signup` route with the token in the header (Bearer token).

This token is the `SUPER_ADMIN_TOKEN` that you have added in the `.env` file.

```JSON
{
    ...
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer <super_admin_token>"
    },
    "body": {
        "Name" : "<Name>",
        "email" : "<Email>",
        "password" : "<Password>",
        "role": "admin",
        "rollNo": "<some_roll_no>"
    }
}
```

You can use tools like **Postman** to make the POST request to the `/api/admin/signup` route of the backend.

This is the only way to create the super admin. The main reason to keep the super admin signup this way is to prevent unauthorized access to the super admin role.

For accessing the super admin pages on the frontend, you need to head to the `http://localhost:5173/admin/login` and login with the super admin credentials.

Once you are logged in, you can approve the teacher signup requests and create the courses.

## Contributors
1. **[Aryan Mehta](https://github.com/arymehta)**
2. **[Hardik Mutha](https://github.com/HardikMutha)**
3. **[Mehmood Deshmukh](https://github.com/Mehmood-Deshmukh)**
4. **[Yashwant Bhosale](https://github.com/YashwantBhosale)**