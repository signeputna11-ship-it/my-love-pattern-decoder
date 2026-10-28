-- DRAFT seed for the Confidence journey (journey stays unpublished until Signe approves the copy).
-- Original wording. Structure follows Notice, Understand, Reframe, Release, Rehearse.

with j as (select id from public.journeys where slug = 'confidence')
insert into public.modules (slug, position, title, subtitle, intro, journey_id)
select v.slug, v.position, v.title, v.subtitle, v.intro, j.id
from j,
(values
  ('confidence-notice', 1, 'Notice', 'See where you shrink.',
   'Confidence starts with noticing. This week you simply watch when you soften your words, second-guess a decision or say yes when you mean no. There is nothing to fix yet.'),
  ('confidence-understand', 2, 'Understand', 'Find where the belief began.',
   'Every pattern was once a clever way to stay safe. Here you look kindly at when you learned to make yourself smaller, and what that younger version of you decided.'),
  ('confidence-reframe', 3, 'Reframe', 'Give the old belief a new job.',
   'Your old belief was trying to protect you. You thank it, then you choose a new belief that fits the woman you are now.'),
  ('confidence-release', 4, 'Release', 'Let go of what is not yours.',
   'Some of what you carry belongs to other people. This module helps you set it down with care, in your own private space.'),
  ('confidence-rehearse', 5, 'Rehearse', 'Practise being her tomorrow.',
   'Beliefs grow through repetition. You plan seven small moments where you act from your new belief, and you celebrate each one.')
) as v(slug, position, title, subtitle, intro)
on conflict (slug) do nothing;

insert into public.exercises (module_id, position, kind, title, body, options)
select m.id, e.position, e.kind, e.title, e.body, e.options
from public.modules m
join (values
  ('confidence-notice', 1, 'prompt', 'When did you soften your words this week?', 'Describe one moment. What did you want to say, and what did you say instead?', null::jsonb),
  ('confidence-notice', 2, 'prompt', 'What did you do afterwards?', 'Did you replay it, apologise or tell yourself a story? Write what happened in your mind.', null),
  ('confidence-notice', 3, 'checklist', 'Tick what feels familiar', 'There are no wrong answers.', '["I second-guess decisions after making them","I say yes when I mean no","I wait to be sure before I speak","I downplay what I have achieved","I replay conversations at night"]'::jsonb),
  ('confidence-understand', 1, 'prompt', 'Think of the first time you felt "not enough".', 'Where were you and who was there? Write only what feels comfortable.', null),
  ('confidence-understand', 2, 'prompt', 'What did you decide about yourself then?', 'Finish the sentence: "From then on, I believed that I had to..."', null),
  ('confidence-understand', 3, 'prompt', 'How has that decision protected you?', 'Look for the kindness in it. What did it keep you safe from?', null),
  ('confidence-reframe', 1, 'prompt', 'Thank your old belief.', 'Write a short thank-you to the belief that has protected you until now.', null),
  ('confidence-reframe', 2, 'prompt', 'Choose your new belief.', 'Write one sentence beginning with "I am" that feels true enough to try this week.', null),
  ('confidence-reframe', 3, 'prompt', 'What would she do differently?', 'Imagine the woman who fully believes your new sentence. What is one thing she does today?', null),
  ('confidence-release', 1, 'prompt', 'Whose voice is that?', 'When you criticise yourself, whose words do you hear? Write down their name or role.', null),
  ('confidence-release', 2, 'prompt', 'A letter you will never send.', 'Write what you would like to say to them. This stays private.', null),
  ('confidence-release', 3, 'checklist', 'What are you ready to set down?', 'Tick what you choose to release.', '["The need to be liked by everyone","Other people''s expectations of me","Being perfect before I begin","Staying small to keep the peace"]'::jsonb),
  ('confidence-rehearse', 1, 'prompt', 'Your next seven days.', 'Choose one small moment each day where you will act from your new belief.', null),
  ('confidence-rehearse', 2, 'prompt', 'Who can support you?', 'Name one person or space that will cheer you on.', null),
  ('confidence-rehearse', 3, 'checklist', 'Your commitments', 'Tick what you are willing to do.', '["I will listen to my audio three times this week","I will speak up once a day","I will celebrate each small win"]'::jsonb)
) as e(module_slug, position, kind, title, body, options) on e.module_slug = m.slug
where not exists (select 1 from public.exercises x where x.module_id = m.id and x.position = e.position);
