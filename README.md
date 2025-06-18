# Hospital Management System
This project is a Hospital Management System designed to streamline healthcare services by enabling efficient patient-doctor interaction through a web-based interface. It features two separate dashboards for patients and doctors, offering secure login, appointment management, and health record access.

## System Requirements

Before you begin, make sure your system meets the following requirements:

- **VS Code** 
- **Node.js** 
- **MongoDB** (Ensure MongoDB is running locally or you have access to a remote MongoDB database)

Additionally, the project requires the following technologies:

- **React**
- **Express**
- **MongoDB**

---

## Setting Up MongoDB

1. **Create a Database**: Ensure your MongoDB database is named speakX.
2. **Create a Collection**: Inside the speakX database, create a collection named datas.
3. **Upload Data**: Upload your data into the datas collection to populate the database.

---

## Folder Structure

1. **Create a Folder**: Create a folder named hospital on your local machine.
2. **Download the Project**: Clone or download the project files from GitHub into the Search folder.
3. **Frontend and Backend Folders**: Inside the hospital folder, you will have two directories: one for the frontend and one for the backend.
4. **MongoDB Connection**: Obtain the MongoDB connection URL (from your local or cloud MongoDB service) and save it in a .env file inside the backend folder.

---

## Adding Dependencies

### Backend Dependencies
To install the required dependencies for the backend, navigate to the backend folder and run the following command in the terminal:
npm install bcryptjs cors dotenv express express-async-handler jsonwebtoken mongoose


### Frontend Dependencies
To install the required dependencies for the frontend, navigate to the srcfolder inside frontend folder and run the following command in the terminal:
npm install axios  react  react-dom  react-router-dom react-datepicker



## Running of project
**Backend**: The backend server is started using node server.js from the backend folder.
**Frontend**: The frontend server is started with npm run dev from the frontend/src folder.
