-- actual query for the app (aufgabe 3)
SELECT CONCAT(
    '[', 
    GROUP_CONCAT(json_object('token', pl_name, 'token_count', count)),
    ']'
) FROM (
select count(pos.token) count, pl.name pl_name
from test.Ausschreibungs_Inhalt_POS pos
inner join test.Ausschreibungen a
inner join test.programming_languages pl
on a.ausschreibungs_id = pos.ausschreibungs_id
and pos.token=pl.name
where a.suchbegriff_job = 'Softwareentwickler'
and pos.token != 'es'
and pos.token != 'code'
and pos.token != 't'
and pos.token != 'e'
and pos.token != 'plus'
group by pos.token
order by count desc
limit 10) json_results
;	
