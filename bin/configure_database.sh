#!/bin/sh

genpwd() {
      	tr -dc A-Za-z0-9_ < /dev/urandom | head -c 16 | xargs
}

userpass=$(genpwd)
username="uwr"
dbname="uwrtourist"
mysql -u root -p${1} -e "CREATE DATABASE IF NOT EXISTS $dbname"
mysql -u root -p${1} -e "CREATE USER '$username'@'localhost' IDENTIFIED BY '$userpass';"
mysql -u root -p${1} -e "GRANT ALL PRIVILEGES ON $dbname.* TO '$username'@'localhost';"

root_dir="${PWD%/bin}"
conf_file="$root_dir/.my.cnf"
cat <<EOF >$conf_file
[client]
password="$userpass"

[mysql]
no-auto-rehash
connect_timeout=2

[mysqlhotcopy]
interactive-timeout
EOF
