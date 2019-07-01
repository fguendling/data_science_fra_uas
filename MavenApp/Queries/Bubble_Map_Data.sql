use test;
select * from Ausschreibungen;

SELECT CONCAT(
    '[', 
    GROUP_CONCAT(json_object('Count', counter, 'Ort', suchbegriff_ort)),
    ']'
) FROM (
select suchbegriff_ort, count(ausschreibungs_id) counter, datum 'Crawl_Datum'
from Ausschreibungen
where suchbegriff_job = 'Data Scientist' 
group by suchbegriff_ort) count_by_cities;


