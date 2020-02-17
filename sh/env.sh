#config database environment variables
export DB_CONNECT=mongodb
export DB_HOST=localhost
export DB_PORT=27017
export DB_NAME=messenger
export DB_USER=""
export DB_PASSWORD=""

#config host and port environment for server
export APP_HOST=localhost
export APP_PORT=3000

#config admin email
export MAIL_USER=maivthang95@gmail.com
export MAIL_PASS=Th@ng1995
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587

#config login facebook
export FB_APP_ID=564805340774728
export FB_APP_SECRET=5079294686743f66b58b567a9e5356b9
export FB_CALLBACK_URL=https://localhost:3000/auth/facebook/callback

#config login google+
export GG_APP_ID=519432788476-lv9bi1joqjgtdaj2fnsncppalfprieje.apps.googleusercontent.com
export GG_APP_SECRET=KzkCrWbZw6hvvCh93Xg8hRBy
export GG_CALLBACK_URL=https://localhost:3000/auth/google/callback