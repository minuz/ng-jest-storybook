# Overview

This is a sample project created to demonstrate the usage of Storybook with Angular. The sample component is a Tree Control based on Material Tree Control and includes:

* Drag & drop capabilities
* On drop custom validation
* Initilization within specific node on the tree

## Build pipeline status

[![Build Status](https://dev.azure.com/fernandofminoru/n4nd0-samples/_apis/build/status/minuz.n4nd0-ng-playground?branchName=master)](https://dev.azure.com/fernandofminoru/n4nd0-samples/_build/latest?definitionId=1&branchName=master)

[![CircleCI](https://circleci.com/gh/minuz/n4nd0-ng-playground/tree/master.svg?style=svg)](https://circleci.com/gh/minuz/n4nd0-ng-playground/tree/master)

## Pre-requisites

* [NodeJs](https://nodejs.org/en/) - Created with v12.6.0 - Should work on earlier versions, not tested
* [Angular CLI](https://github.com/angular/angular-cli) - Created with v8.1.0
* [Yarn](https://yarnpkg.com/en/) - Should you prefer using `npm`, remove the `yarn.lock` file located at the root beforehand.

## How to build

1. Run `yarn` or `npm install`
2. Run `yarn setup` or `npm run setup`
3. Run `yarn demo` or `npm run demo`

## Why storybook

> *Storybook provides a sandbox to build UI components in isolation so you can develop hard-to-reach states and edge cases.*
>[storybook](https://storybook.js.org/)

Building modern web application in a reliable and secure way requires new features to be built in a modular structure so we don't brake existing code. Ideally, the features should have an user story that captures its behavior. Those stories can be written within Storybook along with a visual implementation of the new component that can be interacted with.

Such feature allows a more controlled implementation of new components as they run in isolation and can have its acceptance criteria signed off before actually getting into the application. It also surfaces questions around ownership of layout and styles.

For example, should your component define its own width, or should that be left up to its parent? These types of questions are immediately surfaced when you view your component in Storybook, because it allows you to see how your it behaves outside of the context of your application.

Another example is around time. Have you ever had to adjust the computer's clock to test for timezones? With storybook, you can write a story to assess this behavior, passing a date value to your component (assuming the date/timezone are component inputs) to assess different scenarios. With the power of knobs, you can have those values as inputs that are dynamically changed during runtime for more comprehensive component testing.

## Why Jest

Firstly, what is Jest? Jest is another JavaScript test framework created by Facebook and strives for its simplicity. The main reason to choose Jest for this experiment is the fact the add-ons to include unit tests directly on the stories were only available for Jest.

Aside from that, it turns out that Jest is actually a great testing framework. It's a lot simpler to setup and it feels a lot faster to run as well - didn't do any formal benchmark. Adding code coverage and html reporters for CI/CD pipelines were actually really easy and the community support around it is really great! It was very easy to find answers and to implement a full story, from writting a test to see it published on code coverage report on build pipeline - have been using Azure DevOps.

Finally, the syntax for writting the tests are pretty much the same as Jasmine, the default testing framework that is packed with Angular CLI projects.

Check the  [Jest](https://jestjs.io/) homepage.

