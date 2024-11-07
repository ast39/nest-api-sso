# Подключение .env файла при наличии
if [ -f .env ]; then
    source .env
fi

# Определим полный путь до файла с дампом
DUMP_PATH=${POSTGRES_DUMP_PATH}
DUMP_FILE="$1"

# Файл дампа для восстановления должен передаваться при вызове скрипта
if [ -z "$1" ]; then
    echo "Usage: $0 <dump_file>"
    exit 1
fi

# Проверим, существует ли файл дампа
if [ ! -f "${DUMP_PATH}"/"${DUMP_FILE}" ]; then
    echo "Dump file not found: $DUMP_PATH/$DUMP_FILE"
    exit 1
fi

# Проверим доступность всех необходимых параметров окружения
if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_NAME" ]; then
    echo "Database credentials not set. Please set POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_NAME in .env file."
    exit 1
fi

# Восстановим образ из дампа
docker exec -i "${POSTGRES_CONTAINER}" /bin/bash -c "PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} ${POSTGRES_NAME}" < "${DUMP_PATH}/${DUMP_FILE}"

# Лог выполнения
if [ $? -ne 0 ]; then
    echo "Error recovering from dump"
else
    echo "Postgres image was recovered from dump file $DUMP_PATH/$DUMP_FILE"
fi