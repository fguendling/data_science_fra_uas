-- tests, bezüglich der Ermittlung der "Erfahrung"

select * from Ausschreibungs_Inhalt_parsed where constituent_value like '%Jahre%';

select a.ausschreibungs_id, token, ausschreibungs_inhalt  from Ausschreibungs_Inhalt_POS p
inner join
Ausschreibungen a
on a.ausschreibungs_id = p.ausschreibungs_id
where token like '%Erfahrung%'
or token like 'Jahre'
order by ausschreibungs_id;

select * from (
SELECT ausschreibungs_inhalt, ausschreibungs_id, 
REGEXP_INSTR(ausschreibungs_inhalt, '[1-30] jahre') as result 
from Ausschreibungen) result_table
inner join Ausschreibungs_Inhalt_POS
on result_table.ausschreibungs_id = Ausschreibungs_Inhalt_POS.ausschreibungs_id
where result_table.result != 0
and pos = 'card';

