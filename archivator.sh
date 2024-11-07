# Подключение .env файла при наличии
if [ -f .env ]; then
    source .env
fi

# Проверим доступность всех необходимых параметров окружения
if [ -z "LOG_PATH" ] || [ -z "LOG_ZIP_PATH" ]; then
    echo "LOG credentials not set. Please set LOG_PATH and LOG_ZIP_PATH in .env file."
    exit 1
fi

# Файл дампа для восстановления должен передаваться при вызове скрипта
if [ -z "$1" ]; then
    echo "Usage: $0 <log_file>"
    exit 1
fi

# Определим полный путь до файла с дампом
LOG_PATH=${LOG_PATH}
LOG_FILE="$1"

# Проверим, существует ли файл логов
if [ ! -f "${LOG_PATH}"/"${LOG_FILE}" ]; then
    echo "Log file not found: ${LOG_PATH}/${LOG_FILE}"
    exit 1
fi

# Текущая дата для имени архива
DATE=$(date +"%Y%m%d_%H%M%S")

# Путь, куда сохранить архивированный файл
ARCHIVE_DIR=${LOG_ZIP_PATH}

# Имя архива
ARCHIVE_NAME="logs_${DATE}.tar.gz"

# Архивирование файлов в каталоге
tar -czvf "${ARCHIVE_DIR}/${ARCHIVE_NAME}" "${LOG_PATH}/${LOG_FILE}"*

# Проверка статуса архивирования
if [ $? -eq 0 ]; then
  echo "Файл логов успешно архивирован: ${ARCHIVE_DIR}/${ARCHIVE_NAME}"

  # Проверка существования файла перед удалением
  if [ -f "${LOG_PATH}/${LOG_FILE}" ]; then
    rm "${LOG_PATH}/${LOG_FILE}"
    echo "Файл успешно удален: ${LOG_PATH}/${LOG_FILE}"
  else
    echo "Файл не найден: $FILE_TO_DELETE"
  fi
else
  echo "Ошибка при архивировании файла логов"
fi