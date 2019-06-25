use test;

-- delete 
SET SQL_SAFE_UPDATES = 0;
delete from Ausschreibungs_Inhalt_POS where ausschreibungs_id in ( 
select a.ausschreibungs_id from Ausschreibungs_Inhalt_POS pos
left join Ausschreibungen a
on a.Ausschreibungs_ID = pos.Ausschreibungs_ID
where a.ausschreibungs_id is null); -- where clause

-- select * und select count
select count(*), suchbegriff_job from Ausschreibungen group by suchbegriff_job;
select count(ausschreibungs_id) from Ausschreibungs_Inhalt_POS;	

-- nur der erste Satz wurde bei der Suche nach Data Scientists jeweils geparsed. Es gibt keine POS Tags zu Data Scientists.
select * from Ausschreibungs_Inhalt_parsed
inner join Ausschreibungen 
on Ausschreibungs_Inhalt_parsed.ausschreibungs_id = Ausschreibungen.ausschreibungs_id;

-- bei Softwareentwicklern und Projektmanagern wurden die POS Tags korrekt erstellt.
select count(distinct Ausschreibungen.ausschreibungs_id) from Ausschreibungs_Inhalt_POS
inner join Ausschreibungen 
on Ausschreibungs_Inhalt_POS.ausschreibungs_id = Ausschreibungen.ausschreibungs_id
where Ausschreibungen.suchbegriff_job = "Softwareentwickler";


