echo off
set mongopath=%1

if exist %1\mongo.exe (
	%1\mongo ttdb --eval "db.absenses.remove()"
	%1\mongo ttdb --eval "db.periods.remove()"
	%1\mongo ttdb --eval "db.users.remove()"
	%1\mongo ttdb --eval "db.tasks.remove()"
	%1\mongo ttdb --eval "db.time.remove()"

	%1\mongoimport.exe -c absenses --file D:\Joe\Creative\Git\timetracker\data\absenses.json --db ttdb --jsonArray
	%1\mongoimport.exe -c periods --file D:\Joe\Creative\Git\timetracker\data\periods.json --db ttdb --jsonArray
	%1\mongoimport.exe -c users --file D:\Joe\Creative\Git\timetracker\data\users.json --db ttdb --jsonArray
	%1\mongoimport.exe -c tasks --file D:\Joe\Creative\Git\timetracker\data\tasks.json --db ttdb --jsonArray
	%1\mongoimport.exe -c time --file D:\Joe\Creative\Git\timetracker\data\time.json --db ttdb --jsonArray
) else (
	echo "mongo.exe does not exist at %1"
)