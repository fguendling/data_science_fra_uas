-- War ein Entwurf für den ersten Chart.
-- Wird so in dieser Form nicht verwendet.

SELECT CONCAT(
    '[', 
    GROUP_CONCAT(json_object('token', concatenated_result, 'token_count', counter)),
    ']'
) FROM (
	select count(ausschreibungs_id) counter, concatenated_result from(
		select 
			sub.ausschreibungs_id, 
			concat(sub.token, ' ', p.token) concatenated_result
		from (
			select 
				a.ausschreibungs_id, 
				a.token, 
				a.pos, 
				a.ausschreibungs_inhalt_pos_id, 
				lead(ausschreibungs_inhalt_pos_id) over (order by ausschreibungs_inhalt_pos_id) as successor_token
			from test.Ausschreibungs_Inhalt_POS a) sub
		inner join test.Ausschreibungs_Inhalt_POS p 
		on sub.successor_token = p.ausschreibungs_inhalt_pos_id
		inner join test.Ausschreibungen au
		on sub.ausschreibungs_id = au.ausschreibungs_id
		where sub.pos in ('NN', 'NE')
		and suchbegriff_job = 'Data Scientist') final
	group by final.concatenated_result
	order by counter desc limit 20
) limited_results;


