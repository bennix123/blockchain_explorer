# blockchain_explorer
blockchain explorer API

You need to have a .env file in your project directory. In that file, you have to declare two things
to run the project

1. your desirable PORT otherwise it will take 3000 by default
2. To fetch real-time data from the eth chain I used Moralis as a 3-party API Provider so you need to have MORALIS_API_KEY

After taking care of the above things just hit

npm install
nodemon index.js 
