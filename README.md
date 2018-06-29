# Portainer backup and restore utility

## Introduction

This node app backup and restore your Portainer stacks

## Installation

    $ npm install

## Usage

    $ PORTAINER_URL=<url> PORTAINER_LOGIN=<login> PORTAINER_PASSWORD=<pass> node .

Or you can set those variables in the config folder and then start with:

    $ node .

## Backup format

    [
      {
        "Name": "nginx",
        "SwarmID": "jpofkc0i9uo9wtx1zesuk649w",
        "StackFileContent": "version: 3\n services:\n web:\n image:nginx"
      },
      {
        "Name": "HelloWorld",
        "SwarmID": "jpofkc0i9uo9wtx1zesuk649w",
        "StackFileContent": "version: 3\n services:\n hello-world:\n image:hello-world"

      }
    ]
