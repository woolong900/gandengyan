#!/bin/sh
set -eu

backup_dir=/var/backups/qjqp
mkdir -p "$backup_dir"
stamp=$(date -u +%Y%m%dT%H%M%SZ)
/usr/bin/node /opt/qjqp/tools/backup-state.js "$backup_dir/state-$stamp.sqlite"
find "$backup_dir" -type f -name 'state-*.sqlite' -mtime +14 -delete
