# Aliasmanager

## About the project

The Aliasmanager consists of a Frontend and an API-Server that manages 
specific attributes in an LDAP server.

When integrated in an MTA (like Postfix), these attributes can be used
as aliases for the main E-Mail address.

## Introduction

This repository holds the Frontend for the Aliasmanager based on 
[Vuejs](https://vuejs.org).

The API-Server based on [Nest](https://nestsjs.com) can be found at
https://github.com/dploeger/aliasmanager.

The frontend consists of these components:

* A table of aliases in the system with pagination and filtration
* A filter input
* A new alias input

Additionally, modals for logging in and editing aliases are included.

## Running the Frontend

The whole project is meant to be run through docker. Please check out
[the aliasmanager-docker repository](https://github.com/dploger/aliasmanager-docker)
for details.

## Development

### Event emitter

The frontend uses [mitt](https://www.npmjs.com/package/mitt) injected into
the Vue instance for global event handling. For example, when the table
filter is set, an event is emitted from the filter component and the
alias list component catches it and reloads the aliases.

### Internationalization

The i18n of the project was done using 
[vue-i18n](https://kazupon.github.io/vue-i18n/). The localization files
can be found in src/locales.

### Testing

The test suite uses [MirageJs](https://miragejs.com/) to mock the API-Server
and uses [Cypress](https://cypress.io) for tests.
