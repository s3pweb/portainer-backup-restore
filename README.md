# Portainer backup and restore utility

## Introduction

This node app backup and restore your Portainer stacks.

Current portainer API supported is 1.19.1

## Installation

    $ npm install

## Usage

### Backup

This command will create (or replace) a file named `stacks-backup.json` where all stacks with `Total` control from portainer will be saved.
A backup file is mandatory to restore stacks, but it can be created by hand if you follow the backup format.


    $ node . backup --url <URL> --login <LOGIN> --password <PWD>

### Restore

This command will UPDATE the stacks on portainer.

    $ node . update --url <URL> --login <LOGIN> --password <PWD>

This command will REMOVE then CREATE the stacks on portainer.

    $ node . create --url <URL> --login <LOGIN> --password <PWD>

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
