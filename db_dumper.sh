# Подключение .env файла при наличии
if [ -f .env ]; then
    source .env
fi

# Определим название файла с будущим дампом
TIMESTAMP=$(date +"%Y-%m-%dT%H-%M-%S")
DUMP_PATH=${POSTGRES_DUMP_PATH}
DUMP_FILE=${TIMESTAMP}_${POSTGRES_CONTAINER}.sql

# Проверим доступность всех необходимых параметров окружения
if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_NAME" ]; then
    echo "Database credentials not set. Please set POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_NAME in .env file."
    exit 1
fi

# Создадим дамп
docker exec -i "${POSTGRES_CONTAINER}" /bin/bash -c "PGPASSWORD=${POSTGRES_PASSWORD} pg_dump -U ${POSTGRES_USER} ${POSTGRES_NAME}" > "${DUMP_PATH}"/"${DUMP_FILE}"

# Лог успешного выполнения
echo "Postgres dump file saved as $DUMP_PATH/$DUMP_FILE"