-- actual query for the app (aufgaben 1 & 2), muss noch angepasst werden

SELECT CONCAT(
    '[', 
    GROUP_CONCAT(json_object('token', token, 'token_count', token_count)),
    ']'
) FROM (
select token, pos, count(token) token_count from (
select 
	a.ausschreibungs_id id, 
    a.ausschreibungs_inhalt, 
    a.ausschreibungs_titel, 
    a.datum, firma, 
    a.suchbegriff_job, 
    a.suchbegriff_ort, 
    a.webseite,
    pos.ausschreibungs_inhalt_pos_id, 
    pos.ausschreibungs_id, 
    pos.token, 
    pos.pos
from Ausschreibungen a
inner join Ausschreibungs_Inhalt_POS pos
on a.ausschreibungs_id=pos.ausschreibungs_id
where a.suchbegriff_job = "Data Scientist"
-- viele Englische Wörter bekommen den pos 'NE' zugeordnet. 
-- Diese werden hier nicht berücksichtigt.
-- Dadurch fehlen einige wichtige Begriffe, wie z. B. "Python" oder "Science".
-- Das Problem könnte man lösen, wenn ein Language Detector eingebaut wird.
and pos.pos in ('NN')) results group by results.token order by token_count desc limit 10) limited_results;


-- actual query for the app (aufgabe 3)
SELECT CONCAT(
    '[', 
    GROUP_CONCAT(json_object('token', pl_name, 'token_count', count)),
    ']'
) FROM (
select count(pos.token) count, pl.name pl_name
from Ausschreibungs_Inhalt_POS pos
inner join Ausschreibungen a
inner join programming_languages pl
on a.ausschreibungs_id = pos.ausschreibungs_id
and pos.token=pl.name
where a.suchbegriff_job = 'Data Scientist'
group by pos.token
order by count desc
limit 10) json_results
;
