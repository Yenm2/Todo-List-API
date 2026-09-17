#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${TODO_API_URL:-http://localhost:3000}"
TOKEN_FILE="${TODO_TOKEN_FILE:-${HOME}/.todo-list-api-token}"

usage() {
  cat <<'EOF'
Uso:
  ./cli/todo-cli.sh register <usuario> <password>
  ./cli/todo-cli.sh login <usuario> <password>
  ./cli/todo-cli.sh list
  ./cli/todo-cli.sh mine
  ./cli/todo-cli.sh get <todo-id>
  ./cli/todo-cli.sh create <user-id> <nombre> <descripcion>
  ./cli/todo-cli.sh update <todo-id> <nombre> <descripcion>
  ./cli/todo-cli.sh delete <todo-id>

Variables opcionales:
  TODO_API_URL    URL base de la API (por defecto: http://localhost:3000)
  TODO_TOKEN_FILE Archivo donde se guarda el token después de login/register

Ejemplos:
  ./cli/todo-cli.sh register ana secreto123
  ./cli/todo-cli.sh login ana secreto123
  ./cli/todo-cli.sh mine
  ./cli/todo-cli.sh create 1 "Comprar leche" "Pasar por el supermercado"
EOF
}

require_args() {
  local expected="$1"
  shift
  if [[ "$#" -ne "$expected" ]]; then
    usage
    exit 1
  fi
}

json_escape() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\r'/\\r}"
  value="${value//$'\t'/\\t}"
  printf '%s' "$value"
}

save_token() {
  local response="$1"
  local token
  token="$(printf '%s' "$response" | sed -n 's/.*"token"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"

  if [[ -z "$token" ]]; then
    printf '%s\n' "$response"
    echo "No se encontró un token en la respuesta." >&2
    exit 1
  fi

  umask 077
  printf '%s' "$token" > "$TOKEN_FILE"
  echo "Token guardado en $TOKEN_FILE"
  printf '%s\n' "$response"
}

auth_header() {
  if [[ ! -s "$TOKEN_FILE" ]]; then
    echo "Ejecuta login o register antes de usar este comando." >&2
    exit 1
  fi

  printf 'Authorization: Bearer %s' "$(cat "$TOKEN_FILE")"
}

request() {
  local method="$1"
  local path="$2"
  shift 2

  curl --silent --show-error --request "$method" \
    --header "Content-Type: application/json" \
    "$@" \
    "${BASE_URL}${path}"
  printf '\n'
}

command="${1:-}"

case "$command" in
  register)
    require_args 3 "$@"
    username="$(json_escape "$2")"
    password="$(json_escape "$3")"
    response="$(request POST /auth/register \
      --data "{\"username\":\"${username}\",\"password\":\"${password}\"}")"
    save_token "$response"
    ;;

  login)
    require_args 3 "$@"
    username="$(json_escape "$2")"
    password="$(json_escape "$3")"
    response="$(request POST /auth/login \
      --data "{\"username\":\"${username}\",\"password\":\"${password}\"}")"
    save_token "$response"
    ;;

  list)
    require_args 1 "$@"
    request GET /todos
    ;;

  mine)
    require_args 1 "$@"
    request GET /todos/me --header "$(auth_header)"
    ;;

  get)
    require_args 2 "$@"
    request GET "/todos/$2"
    ;;

  create)
    require_args 4 "$@"
    user_id="$2"
    name="$(json_escape "$3")"
    description="$(json_escape "$4")"
    request POST /todos \
      --data "{\"userId\":${user_id},\"nombre\":\"${name}\",\"descripcion\":\"${description}\"}"
    ;;

  update)
    require_args 4 "$@"
    name="$(json_escape "$3")"
    description="$(json_escape "$4")"
    request PATCH "/todos/$2" \
      --data "{\"nombre\":\"${name}\",\"descripcion\":\"${description}\"}"
    ;;

  delete)
    require_args 2 "$@"
    request DELETE "/todos/$2"
    ;;

  -h|--help|help)
    usage
    ;;

  *)
    usage
    exit 1
    ;;
esac
