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



