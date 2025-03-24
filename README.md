
- [Run project](#run-project)
- [Enviroment variables](#enviroment-variables)
- [Docker start](#docker-start)
- [Fresh start](#fresh-start)
  - [Server](#server)
  - [Client](#client)

# Run project

There are two ways to run the project, the easiest way is to use docker, to avoid installing different packages onto your computer, the other way is to install the nessesary packages and programs onto your computer


# Enviroment variables
Since we don't want to include the enviroment files directly into the project (Mostly because github doesn't like it)
We'll add the variables here for you to copy and insert. The files have to be called `.env` as we haven't used any of the other options for enviroment file.

Server variables
```bash
ATLAS_URI=mongodb://mongoadmin:skrald1234@fm-jensen.dk:27017/admin?retryWrites=true&loadBalanced=false&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1
DB_NAME=journalease
```

Client variables
``` bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Base variables
```bash
MONGO_INITDB_ROOT_USERNAME=mongoadmin
MONGO_INITDB_ROOT_PASSWORD=skrald1234
MONGO_INITDB_DATABASE=journalease
```
# Docker start
If you don't have Docker installed it can be done by following their guide.

Windows: https://docs.docker.com/desktop/setup/install/windows-install/

MAC: https://docs.docker.com/desktop/setup/install/mac-install/

Linux: https://docs.docker.com/desktop/setup/install/linux/

If you want to use our database then you can ignore the folder 'base' as those files are for network setup and database.

To start the backend & client simply navigatate to the root of this project and run the docker-compose file with

``` bash
docker compose -f ".\docker-compose.yml" up -d
```

In the browser, go to http://localhost:3000 and you'll get access to the website


# Fresh start
If docker is not an option, you'll need to install python3 and node.js LTS version 20.19.0

## Server
For the server we'll need to create a virtual envioment to isolate the packages and make sure they aren't installed correctly as needed for the project

``` bash
python -m venv .venv
```

Activate the virtual enviroment

``` bash
.venv/scripts/activate
```

Install packages

``` bash
pip install -r requirements.txt
```

Start server

``` bash
fastapi run .\main.py
```

## Client
Before starting the client you'll need to install the nessesarry packages, to do that just navigate to the client folder and insert in the commandline:

``` bash
npm i --force
```

The reason that we need the force part, is because of some package compilations in shadcn. The client can then be started by typing:

``` bash
npm run dev
```
