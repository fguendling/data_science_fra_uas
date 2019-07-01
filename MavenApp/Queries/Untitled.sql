-- count der Ausschreibungen, gruppiert nach Ort und Job
select
	count(ausschreibungs_id) c,
    suchbegriff_job, 
    suchbegriff_ort 
from Ausschreibungen group by suchbegriff_ort, suchbegriff_job order by c desc;


select a.*, p.pos, p.token
from Ausschreibungen a
inner join Ausschreibungs_Inhalt_POS p
on a.Ausschreibungs_ID = p.Ausschreibungs_ID
where suchbegriff_job='Data Scientist'
and suchbegriff_ort='Koeln'
and p.token = 'Science';


select * from Ausschreibungen
where suchbegriff_job = 'Data Scientist' and suchbegriff_ort = 'Koeln';


select count(ausschreibungs_inhalt), ausschreibungs_inhalt,
from Ausschreibungen
where suchbegriff_job = 'Projektmanager'
group by ausschreibungs_inhalt
HAVING
    COUNT(ausschreibungs_inhalt) > 1;
;



SET SQL_SAFE_UPDATES = 0;

delete from Ausschreibungs_Inhalt_POS where ausschreibungs_inhalt_pos_id in (
select ausschreibungs_inhalt_pos_id from Ausschreibungs_Inhalt_POS p
left join Ausschreibungen a
on p.ausschreibungs_id = a.ausschreibungs_id
where a.ausschreibungs_id is null);


select count(*) from Ausschreibungs_Inhalt_POS;