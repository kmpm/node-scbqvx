#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive


#add to PACKAGES and install in the end
PACKAGES="language-pack-en-base language-pack-sv-base"
#memcached
PACKAGES="$PACKAGES memcached"

#install PACKAGES
#apt update
apt-get install -y $PACKAGES

#locale fix
echo LC_ALL="sv_SE.UTF-8" >>/etc/default/locale
locale-gen

# fix hostname lookup for sudo
echo 127.0.1.1 $HOSTNAME >> /etc/hosts

function install-memcached() {
  #bind to all interfaces
  sed -i 's/-l 127.0.0.1/-l 0.0.0.0/g' /etc/memcached.conf
  service memcached restart
}

function install-mongodb() {
  echo "installing mongodb"
  # Create the SystemD dependant files
echo '[Unit]
Description=High-performance, schema-free document-oriented database
After=syslog.target network.target

[Service]
Type=forking
User=mongod
Group=mongod
PIDFile=/var/run/mongodb/mongod.pid
ExecStart=/opt/mongodb/bin/mongod --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target' > /lib/systemd/system/mongod.service

echo 'systemLog:
  destination: file
  path: "/var/log/mongo/mongod.log"
  logAppend: true
storage:
  dbPath: /var/lib/mongo
  journal:
    enabled: true
processManagement:
  fork: true
  pidFilePath: /var/run/mongodb/mongod.pid
net:
  bindIp: 0.0.0.0
  port: 27017
setParameter:
  enableLocalhostAuthBypass: false
' > /etc/mongod.conf


  #add service group/user
  echo "adding users and groups"
  addgroup mongod
  adduser --system --no-create-home --ingroup mongod \
    --disabled-password --disabled-login mongod

  #create folders
  echo "folders and access"
  mkdir -p /var/run/mongodb/
  mkdir -p /var/log/mongo/
  mkdir -p /var/lib/mongo/
  chown mongod:mongod /var/run/mongodb/
  chown mongod:adm /var/log/mongo/
  chown mongod:mongod /var/lib/mongo/
  chmod 0755 /var/log/mongo/
  chmod 0755 /var/run/mongodb/
  chmod 0755 /var/lib/mongo


  #download an put in right location
  echo "downloading and extracting mongodb"
  cd /tmp
  curl -sS -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.4.tgz
  tar -zxvf mongodb-linux-x86_64-3.2.4.tgz
  mv mongodb-linux-x86_64-3.2.4 /opt/mongodb

  echo "setting kernel options"
  echo never >/sys/kernel/mm/transparent_hugepage/enabled
  echo never >/sys/kernel/mm/transparent_hugepage/defrag

  # Start the new service and enable it on boot
  echo "starting service"
  systemctl --system daemon-reload
  systemctl start mongod.service
  systemctl enable mongod.service

  echo "create collection and user"
  echo 'db = db.getSiblingDB("projdb");
db.createUser({user: "projUser",
        pwd: "projPassword",
        roles: [{ role: "readWrite", db: "projdb"}]
});
' > /tmp/security.js
  /opt/mongodb/bin/mongo /tmp/security.js


}

install-memcached
install-mongodb
