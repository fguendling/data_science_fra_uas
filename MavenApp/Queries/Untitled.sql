select 
	count(ausschreibungs_id), 
    suchbegriff_job, 
    suchbegriff_ort 
from Ausschreibungen group by suchbegriff_ort;

-- Es fehlen die anderen Jobs (Projektmanager, Softwareentwickler)
-- evtl. einfach Deutschlandweit den Crawler laufen lassen
