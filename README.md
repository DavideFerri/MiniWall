# Miniwall

#### Intro
This is a simple API that allows the users to post their thoughts on a wall and see what everybody posts, to make comments to other people posts, and like them.
- [Assumes existence of MongoDB Atlas cluster] 

#### Folder structure:
- All src code in src/
- All UAT in test/

#### Local env set-up for boilerplate dev work (macOS)
- Clone repository
- Set up virtual environment and install dependancies
- create .env file with configurations, and add to .gitignore - see env.example for guidance
- Do dev work 
- Update requirements file
- Stage / commit / push
 
### Local env commands
- To start the dev server: npm start; NB the command runs nodemon app.js so that the server reloads after every code change (only for dev) 
- To test: npm test ; this runs jest --runInBand
- To access api documentation, just go to server_path_and_port/api-docs for swagger (e.g. http://localhost:3000/api-docs/)

### Contribution guidelines 
- do all dev in feature-branch
- write tests before adding functionality
- Make sure that all records inserted in the database for testing purposes are cleared before and after the testing pipeline
- before committing: (i) run npm test; (ii) update package.json and package-lock.json
- initiate a pull request when done

#### Deployment
- TODO
- ensure all env variables are added to .github/workflows/python-app.yaml (without double quotes)

#### Security
- ensure all sensitive data are in .env, and that .env is in .gitignore
- generate jwt TOKEN_SECRET in .env via openssl rand -hex 32 
- https://www.mongodb.com/docs/atlas/driver-connection/
