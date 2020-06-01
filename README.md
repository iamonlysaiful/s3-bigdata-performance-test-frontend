# An Analysis on Big Data Pulling Performance 

## Tools

* Angular 9
* Angular Material
* Highcharts 8.1.0
* Apollo GraphQL-Angular
* CSS Flex 

## Backend Git Repository

https://gitlab.com/iamonlysaiful/s3-bigdata-performance-test-backend

In given link I provided my backend project including specific details with README.md

## Prerequisites

* Node.js
* NPM
* Angular 
* optionally install a good IDE with TypeScript support, e.g. VS Code

##  Dependency Installation

Run CMD/Powershell as Administrator at Cloned Directory and run command given bellow:

> npm i

## Project & Feature Discussion

In brief, In this project I tried to portray possible all features of professional projects within given criteria.

Here is my Project Structure:

![Image of Project Structure](src/assets/images/img-1.PNG)

* app
  * main
    * s3itest
  * models
    * queries
  * package
    * charts
    * forms
  * service

#### app
Here **app** is the parent module of all module. It holds all other modules and their components on it

#### main
**main** is the only sub-module here. Actually it holds main component of project. By created this module 
I tried to portray the pattern of **Lazy Loading Routes** 

#### models
It holds all typescript models. and **query** holds all graphql queries typescript models 

#### package
It holds all dynamic components e.g. **charts**,**forms**, Which can reuse all over the project. By these I implement **Component Interaction** 
over Project.
 
#### service
Here I included my api related service and other reusable or utility type functionality to increase **Modularity**.

#### graphql.module.ts
This module.ts generally hold graphql-apollo client configuration for angular globally.
I also included **Global Error Interceptor** here.

## Screenshots

![Image of Project Structure](src/assets/images/img-2.png)
![Image of Project Structure](src/assets/images/img-3.png)
![Image of Project Structure](src/assets/images/img-4.png)
![Image of Project Structure](src/assets/images/img-5.png)
![Image of Project Structure](src/assets/images/img-6.png)

## Feedback

Any feedback would be gratefully recieved!

Thanks, iamonlysaiful@outlook.com