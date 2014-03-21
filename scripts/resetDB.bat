@echo off

REM use path from existing directory if a mongo.exe path is not received

set BASE_DIR=%~dp0
set mongopath=%1

if [%1] == [] set mongopath="%BASE_DIR%..\..\..\mongodb\bin"

echo %mongopath%

if exist %mongopath%\mongo.exe (
	%mongopath%\mongo ttdb --eval "db.absenses.remove()"
	%mongopath%\mongo ttdb --eval "db.periods.remove()"
	%mongopath%\mongo ttdb --eval "db.users.remove()"
	%mongopath%\mongo ttdb --eval "db.tasks.remove()"
	%mongopath%\mongo ttdb --eval "db.time.remove()"

	%mongopath%\mongoimport.exe -c absenses --file %BASE_DIR%..\data\absenses.json --db ttdb --jsonArray
	%mongopath%\mongoimport.exe -c periods --file %BASE_DIR%..\data\periods.json --db ttdb --jsonArray
	%mongopath%\mongoimport.exe -c users --file %BASE_DIR%..\data\users.json --db ttdb --jsonArray
	%mongopath%\mongoimport.exe -c tasks --file %BASE_DIR%..\data\tasks.json --db ttdb --jsonArray
	%mongopath%\mongoimport.exe -c time --file %BASE_DIR%..\data\time.json --db ttdb --jsonArray
) else (
	echo "mongo.exe does not exist at %mongopath%"
)