# Installation

The overall design for the installation of BMA platform has been built upon the open-source Angular v1.5 javascript
framework. That means that all functionality runs in client side environment (browser).
However, a server is required to host the files and serve them to the client.

A simple list of steps to install the BMA application is the following:
-  Set a cloud server using Ubuntu image version 16.x
-  Install an Apache web server with PHP version 5.3 or higher (but not v7)
-  Clone the repository into the public html folder in the file system (port 80).

Now the system is accessible from the main domain (or IP) of the server.


# Dependencies

The BMA platform consumes data from other servers. These external
services are:
- Sparkworks IoT Platform and Auth mechanism
- Over API endpoints
- CTI rule engine

To configure the BMA platform to exchange information with these services
you have to configure the app.config.js file in the  ```'app/core/```  directory.


