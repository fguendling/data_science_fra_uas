-- Aufgabe 2
-- verwendet analytic function (lag), um vorgänger der tokens zu ermitteln.
-- Hier zusätzlich noch die am Häufigsten verwendeten Nomen


SELECT CONCAT(
    '[', 
    GROUP_CONCAT(json_object('jahre', vorgaenger, 'count', erfahrungs_count)),
    ']'
) FROM (
select 	
	count(p.ausschreibungs_id) erfahrungs_count,
    p.token vorgaenger, 
    a.token nachfolger
    -- p.pos, p.ausschreibungs_id
    -- au.ausschreibungs_inhalt 
from (
	select 
		ausschreibungs_id, 
        token, 
        pos, 
        ausschreibungs_inhalt_pos_id, 
        lag(ausschreibungs_inhalt_pos_id) over (order by ausschreibungs_inhalt_pos_id) as predecessor_token
	from test.Ausschreibungs_Inhalt_POS) a
inner join test.Ausschreibungs_Inhalt_POS p 
on a.predecessor_token = p.ausschreibungs_inhalt_pos_id
inner join test.Ausschreibungen au
on a.ausschreibungs_id = au.ausschreibungs_id
where p.pos = 'card'
and a.token like 'jahre'
and au.suchbegriff_job = 'Projektmanager'
-- das group by und den erfahrungs_count muss man entfernen, um die detaillierten Daten zu erhalten.
group by vorgaenger
order by erfahrungs_count desc, p.ausschreibungs_id) json_results
;