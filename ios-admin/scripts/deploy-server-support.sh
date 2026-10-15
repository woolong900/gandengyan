#!/bin/zsh
set -euo pipefail

if [[ -z "${QJQP_SSH_PASSWORD:-}" ]]; then
  print -u2 "QJQP_SSH_PASSWORD is required"
  exit 2
fi

script_dir=${0:A:h}
project_dir=${script_dir:h:h}
token_file=${project_dir}/ios-admin/.mobile-token
token=$(tr -d '\r\n' < "${token_file}")
if [[ ! "${token}" =~ '^[0-9a-f]{64}$' ]]; then
  print -u2 "Invalid mobile token"
  exit 2
fi

temp_dir=$(mktemp -d)
trap 'rm -rf "${temp_dir}"' EXIT
dropin=${temp_dir}/secret-weapon.conf
password_file=${temp_dir}/ssh-password
printf '[Service]\nEnvironment=QJQP_ADMIN_MOBILE_TOKEN=%s\n' "${token}" > "${dropin}"
printf '%s' "${QJQP_SSH_PASSWORD}" > "${password_file}"
chmod 600 "${dropin}" "${password_file}"

expect -f /dev/stdin "${password_file}" "${project_dir}/server/admin-http.js" "${dropin}" <<'EXPECT'
set timeout 60
set passwordFile [lindex $argv 0]
set adminHttp [lindex $argv 1]
set dropin [lindex $argv 2]
set fileHandle [open $passwordFile r]
set password [read $fileHandle]
close $fileHandle
proc run {args} {
  global password
  spawn {*}$args
  expect {
    -re {(?i)password:} { send -- "$password\r"; exp_continue }
    eof
  }
  catch wait result
  set code [lindex $result 3]
  if {$code != 0} { exit $code }
}
run scp -o StrictHostKeyChecking=accept-new -- $adminHttp ubuntu@124.156.113.151:/tmp/admin-http-secret-weapon.js
run scp -o StrictHostKeyChecking=accept-new -- $dropin ubuntu@124.156.113.151:/tmp/secret-weapon.conf
run ssh -o StrictHostKeyChecking=accept-new ubuntu@124.156.113.151 {sudo install -m 0644 /opt/qjqp/server/admin-http.js /opt/qjqp/server/admin-http.js.bak-secret-weapon-20260925 && sudo install -m 0644 /tmp/admin-http-secret-weapon.js /opt/qjqp/server/admin-http.js && sudo install -d -m 0755 /etc/systemd/system/qjqp.service.d && sudo install -m 0600 /tmp/secret-weapon.conf /etc/systemd/system/qjqp.service.d/secret-weapon.conf && sudo rm -f /tmp/admin-http-secret-weapon.js /tmp/secret-weapon.conf && sudo systemctl daemon-reload && sudo systemctl restart qjqp && sudo systemctl is-active qjqp}
EXPECT
