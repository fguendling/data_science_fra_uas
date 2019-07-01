-- Notwendig, da der Crawler teilweise Duplikate erzeugt.
-- Es ist unklar weshalb - allerdings ist Indeed auch nicht vollständig transparent -
-- eventuell wäre es besser, die REST Schnittstelle zu verwenden.
-- Ansonsten könnte man es bei dieser Methode zur Entfernung von Duplikaten belassen,
-- diese sollte dann nur regelmäßigen Abständen ausgeführt werden;
-- Das könnte man auch machen, nachdem der Crawler durch ist mit seiner Arbeit. (= In Java aufrufen)


-- findet alle duplikate
select * from (
select
    row_number()
            over (partition by ausschreibungs_inhalt, ausschreibungs_titel, datum,
                               firma, suchbegriff_job, suchbegriff_ort, webseite) as row_no
,
    a.*
from Ausschreibungen a) with_row_no
where row_no > 1
;


-- löscht sie
SET SQL_SAFE_UPDATES = 0;
delete from Ausschreibungen where ausschreibungs_id in (
    select ausschreibungs_id from (
        select
            row_number()
                    over (partition by ausschreibungs_inhalt, ausschreibungs_titel, datum,
                                       firma, suchbegriff_job, suchbegriff_ort, webseite) as row_no,
            a.*
        from Ausschreibungen a) with_row_no
        where row_no > 1
    );