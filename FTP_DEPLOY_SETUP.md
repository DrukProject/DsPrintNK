# FTP Deploy Setup

## Що вже підготовлено

У репозиторії є workflow:

`/.github/workflows/deploy-ftp.yml`

Він автоматично заливає сайт на FTP-хостинг після кожного `push` у `main`.

## Які secrets треба додати в GitHub

Відкрий:

`Repository -> Settings -> Secrets and variables -> Actions`

І додай такі secrets:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_PORT`
- `FTP_REMOTE_DIR`

## Що туди вписувати

- `FTP_SERVER` — FTP-сервер хостингу, наприклад `server6.erahosting.net`
- `FTP_USERNAME` — FTP-логін із cPanel
- `FTP_PASSWORD` — FTP-пароль
- `FTP_PORT` — зазвичай `21`
- `FTP_REMOTE_DIR` — папка, куди має заливатись сайт

## Для переходу на dsprint.com.ua

Треба, щоб у хостингу вже був підключений домен `dsprint.com.ua` і для нього була своя document root.

Типові варіанти `FTP_REMOTE_DIR`:

- `/public_html/`
- `/public_html/dsprint.com.ua/`
- інша папка домену, яку покаже cPanel

Якщо не вгадати папку, файли зальються, але сайт відкриватиметься не там.

## Що треба зробити в cPanel

1. Додати або підключити домен `dsprint.com.ua`
2. Подивитися, яка саме папка є document root для цього домену
3. Створити або використати FTP-акаунт з доступом у цю папку
4. Цю папку вставити в `FTP_REMOTE_DIR`

## Що треба зробити в DNS

Для реального переходу на `dsprint.com.ua` треба ще направити DNS домену на цей хостинг.

Тобто:

1. А-запис або записи домену мають дивитися на IP хостингу
2. Якщо використовується `www`, то треба ще або A/CNAME для `www`

Це вже не в GitHub, а в панелі керування доменом / DNS.

## Як це буде працювати далі

Після того як secrets будуть додані:

1. Ти або я робимо зміни в репозиторії
2. Пушимо в `main`
3. GitHub Actions автоматично заливає свіжу версію сайту на FTP-хостинг

Тобто вручну через Total Commander кожен раз уже не треба буде заливати.

## Якщо хочеш взагалі без GitHub

У репозиторії є локальний скрипт:

`scripts/deploy-site-via-ftp.ps1`

Що треба зробити:

1. Скопіювати файл `deploy-ftp.local.example.json`
2. Перейменувати його в `deploy-ftp.local.json`
3. Вписати туди свої FTP-дані
4. Запускати:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-site-via-ftp.ps1
```

Після цього сайт одразу заливається на хостинг напряму, без GitHub Actions.

Файл `deploy-ftp.local.json` уже доданий у `.gitignore`, тому логін і пароль не поїдуть у репозиторій.

## Якщо хочеш протестувати без ризику

Можна спочатку вказати тестову папку, наприклад:

`/public_html/test-dsprint/`

Перевірити, що workflow заливає файли правильно, і тільки потім переключити `FTP_REMOTE_DIR` на бойову папку домену.
