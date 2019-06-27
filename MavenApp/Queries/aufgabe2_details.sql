-- experience_details
-- basiert auf Query 'Aufgabe 2'

select 	
	p.ausschreibungs_id,
    p.token vorgaenger, 
    a.token nachfolger,
    au.ausschreibungs_inhalt
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

-- and p.token = ?
order by p.ausschreibungs_id;
