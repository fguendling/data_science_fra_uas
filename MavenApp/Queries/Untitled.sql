select 
	count(ausschreibungs_id) c,
    suchbegriff_job, 
    suchbegriff_ort 
from Ausschreibungen group by suchbegriff_ort, suchbegriff_job order by c desc;

-- Es fehlen die anderen Jobs (Projektmanager, Softwareentwickler)
-- evtl. einfach Deutschlandweit den Crawler laufen lassen

select
    ausschreibungs_id,
    datum
from
    Ausschreibungen
where suchbegriff_job='Projektmanager'
and datum = (select max(datum) from Ausschreibungen);


select count(*) from Ausschreibungs_Inhalt_POS;


select a.*, p.pos, p.token
from Ausschreibungen a
inner join Ausschreibungs_Inhalt_POS p
on a.Ausschreibungs_ID = p.Ausschreibungs_ID
where suchbegriff_job='Data Scientist'
and suchbegriff_ort='Frankfurt am Main'
and p.token = 'Science';




select * from Ausschreibungen where suchbegriff_job = 'Softwareentwickler';

