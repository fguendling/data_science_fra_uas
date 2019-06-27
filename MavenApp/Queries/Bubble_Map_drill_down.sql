-- Bubble_Map_Drill_Down
-- ist ok so, es wird ein json für jede Stadt vorbereitet,
-- damit es schnell genug lädt auf der Seite.

SELECT CONCAT(
    '[',
    GROUP_CONCAT(json_object('Count', count, 'fachbegriff', concatenated_result)),
    ']'
) FROM (
select count(*) count, concatenated_result from (
select concat(vorgaenger, ' ', nachfolger) concatenated_result from
	(select 
		successor_prep.token vorgaenger, 
		Ausschreibungs_Inhalt_POS.token nachfolger,
		successor_prep.pos pos1,
		Ausschreibungs_Inhalt_POS.pos pos2
	from 
		(select 
			pos.ausschreibungs_id, 
			pos.token,
			pos.pos, 
			pos.ausschreibungs_inhalt_pos_id,
			lead(ausschreibungs_inhalt_pos_id) over (order by ausschreibungs_inhalt_pos_id) as successor_token
		from 
			Ausschreibungs_Inhalt_POS pos
		inner join 
			Ausschreibungen a
		on 
			pos.ausschreibungs_id = a.ausschreibungs_id
		where a.suchbegriff_job = 'Data Scientist'
        and a.suchbegriff_ort = 'Frankfurt am Main') successor_prep
        -- hier muss der Ort angepasst werden
	inner join Ausschreibungs_Inhalt_POS
	on successor_prep.successor_token = Ausschreibungs_Inhalt_POS.ausschreibungs_inhalt_pos_id) looking_good
where pos1 in ('NE', 'NN') and pos2 in ('NE', 'NN')) gruppe 
-- manuelle Filterung notwendig, 
-- da alle Englischen Begriffe mit 'NE' ausgezeichnet werden. 
-- Daher tauchten auch nicht relevante Paare auf -
-- Siehe 'not in' clause unten für Beispiele, die oft vorkamen.
-- Hauptsächlich Berlin war hier das Problem
where concatenated_result not in ('of the', 'LOOKING FOR', 'Experience with', 
									'understanding of', 'years of', 'ABOUT THE', 
									'committed to', 'variety of', 'with a',
                                    'and are', 'are committed', 'working with',
                                    'of our', 'team of', 'THE TEAM', 'WHERE YOUR', 
                                    'the world', 'YOUR EXPERTISE', 'diversity and')
group by concatenated_result
order by 1 desc Limit 10) res;

