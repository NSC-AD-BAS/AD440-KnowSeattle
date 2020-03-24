#KnowSeattle
![alt text](https://github.com/NSC-AD-BAS/AD440-KnowSeattle/blob/master/webroot/assets/seattle.jpg "Know Seattle")

##KnowSeattle is a location-based webservice
Built by NSC AD, powered by Node and Apache

###Information Groups:
* Walk Score
* Hospitals
* Parks
* Culture
* Jobs
* Schools
* Art
* Crime
* Properties
* Concerts
* Food

##Installation & Run
**1. Install mongodb:**
- Mac OS X: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
- Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- Once you are running the server, load the DB with the following command from **root directory**:
```
mongoimport --db knowSeattle --collection neighborhoods --drop --jsonArray --file ./webroot/data/seattle.json
```

**2. Install Node.js and NPM:**
- https://nodejs.org/en/

**3. Clone this repo and get to the root directory via your command line:**
```
cd ad440-knowseattle
```

**4. Install necessary Node dependencies:**
```
npm install
```

**4. Run the server:**
```
node server.js
```
