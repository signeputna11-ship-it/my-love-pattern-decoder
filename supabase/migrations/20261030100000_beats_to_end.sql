-- The binaural beats are an optional extra, not the centre of the app.
update public.journeys
set position = 99, title = 'Sounds Library', subtitle = 'Extra focus and calm soundscapes. Optional.'
where slug = 'beats';
