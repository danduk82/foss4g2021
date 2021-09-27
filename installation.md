# Installation

## prerequisites

these examples have been tested on Ubuntu linux 18.04. You also need at least:

- docker (for the test database)
- java runtime version >= 11

## Install baremaps

```bash
# download the latest version
#wget https://github.com/baremaps/baremaps/releases/latest/download/baremaps.zip

# use a fixed version so the examples are still working in the future
wget https://github.com/baremaps/baremaps/releases/download/v0.6.1/baremaps.zip
unzip baremaps.zip && rm baremaps.zip
export PATH=$PATH:`pwd`/baremaps/bin
```

## Select java version and use openjdk-11

```bash
sudo apt install openjdk-11-jre
sudo update-alternatives --config java
```

## Create DB

We will now launch a docker container to host our testing database,
and configure our environment to use it.

### Launch a postgresql server with docker

The following comand will start a postgresql database, and bind the TCP port 5432 of the host machine.

```bash
docker run \
  --name baremaps-db-test \
  --publish 5432:5432 \
  -e POSTGRES_DB=baremaps \
  -e POSTGRES_USER=baremaps \
  -e POSTGRES_PASSWORD=baremaps \
  -d baremaps/postgis:latest
```

You can now access the database with `psql -U baremaps -h localhost baremaps` and the password `baremaps`

NB: if you already have another service running on `localhost:5432` you should adapt the above command with `--publish <some-other-port>:5432` where `<some-other-port>` is another port that you want to use on the host machine.

### (optional) create a postgresql-client service file

You can create a file called `~/.pg_service.conf` with the following contents to access the DB more easily with `psql`:

```conf
[baremaps]
host=localhost
dbname=baremaps
user=baremaps
password=baremaps
port=5432
```

Then you can just type `psql -d "service=baremaps"` to access the DB.
