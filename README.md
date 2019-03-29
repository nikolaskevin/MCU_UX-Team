# CSC355-Browser-Team
## Browser Version – Sprint 2 

 

### Login Info 
IT Admin 
* Email: ltctmsapp2018@gmail.com 
* Password: admin123123 

### Browser Version Link 
The browser version can be accessed by clicking [here](https://browserteam.firebaseapp.com/Frontend/00Login2.html). This link was generated using the files completed during Sprint 2 and the following command:
```
firebase deploy
```

 

### Browser Version on localhost:5000 

In order to access the browser version on localhost:5000, you must install the Firebase CLI. This [Firebase Tutorial](https://firebase.google.com/docs/hosting/quickstart#install_the_firebase_cli) has instructions for installation

Follow the steps 1-4 in this tutorial. A public folder should be automatically created on your computer. Next, grab the files from GitHub for the browser version. Put these files inside the public folder. Your public folder should look something like this [example](https://livekutztown-my.sharepoint.com/:i:/g/personal/tjenn300_live_kutztown_edu/Ecttd30AEGRPoeoiFcryLMEBkQsvH7y1R2p3XHXEf5giiA?e=WjDW0B). 

From the command line you should be able to run the command ```firebase serve```. It should give you a link http://localhost:5000. Click [here](https://livekutztown-my.sharepoint.com/:i:/g/personal/tjenn300_live_kutztown_edu/ETadHpvJpXBEhDqGnrJXv7QB3Rjf8t0igDiZbokYo5XodQ?e=9Yj3hF) to see the output of this command.

 

 

 

This link will direct you to the index.html page that is automatically generated when the public folder is created. Just navigate to http://localhost:5000/Frontend/00Login2.html to get to the project. Press ctrl-C to stop running the server locally.  

 

### NOTE 

As of 12:00PM on 3/1/2019 the deployed version of LTC-TMS given above uses the Browser Team’s instance of the firebase. In order to use a different firebase instance, the appropriate code snippet must be added to the following files to configure the database (basically to tell the web app which database it is using and to let the database know it is being accessed): 

* /Backend/Config.js 
* /Backend/Server.js 
* /Backend-Chinese/Config.js 
* /Backend-Chinese/Server.js 
* /Frontend/00Login2.html 
* /Frontend/Config.js 
* /Frontend-Chinese/00Login2.html 
* /Frontend-Chinese/Config.js 

This what a code snippet used to access a firebase instance looks like: [example](https://livekutztown-my.sharepoint.com/:i:/g/personal/tjenn300_live_kutztown_edu/EVTUyjNznpdHqWvitl-G73ABqxyauRIcc9bdmQ2fxh9C0g?e=1hhYeq).
