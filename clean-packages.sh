# Установка depcheck, если он еще не установлен
if ! command -v depcheck &> /dev/null
then
    echo "depcheck не установлен. Устанавливаю..."
    yarn global add depcheck
fi

# Запуск depcheck
echo "Проверка неиспользуемых пакетов..."
depcheck

# Вывод инструкции по удалению неиспользуемых пакетов
echo "Для чистки от ненужных пакетов выполните команды:"
depcheck | grep -oP 'Unused dependencies[\s\S]+?\K@[a-z-]+' | while read -r package ; do
    echo "yarn remove $package"
done
