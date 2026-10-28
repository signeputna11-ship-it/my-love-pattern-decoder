-- DRAFT seed: Money and Business journey (stays unpublished until Signe approves the copy).
-- Original wording. Arc: Notice, Understand, Reframe, Release, Offer, Visibility, Sustain.

with j as (select id from public.journeys where slug = 'money-and-business')
insert into public.modules (slug, position, title, subtitle, intro, journey_id)
select v.slug, v.position, v.title, v.subtitle, v.intro, j.id
from j,
(values
  ('money-notice', 1, 'Notice', 'Meet your money story today.',
   'Before anything changes, you look at where you are. This module is about honest, kind noticing. Your numbers and your feelings about them both count.'),
  ('money-understand', 2, 'Understand', 'Find where your money beliefs began.',
   'Most money beliefs were learned early, from the people around you. Here you trace yours with curiosity and see what they were protecting.'),
  ('money-reframe', 3, 'Reframe', 'Connect your worth and your price.',
   'Your value is already there. In this module you choose a belief about money that supports charging, receiving and keeping what you earn.'),
  ('money-release', 4, 'Release', 'Set down the blocks that slow you.',
   'Guilt, fear of being seen and the habit of over-giving can all sit between you and your income. You name them and choose what to keep.'),
  ('money-offer', 5, 'Your Offer', 'Make it clear, make it yours.',
   'A clear offer makes selling easier. You describe who you help, what changes for her and what it is worth, in plain words.'),
  ('money-visibility', 6, 'Visibility', 'Let the right people find you.',
   'Being seen is a skill you build in small steps. You plan simple, repeatable ways to share your work with confidence.'),
  ('money-sustain', 7, 'Sustain', 'Build a rhythm that lasts.',
   'Lasting growth comes from steady habits. You set a calm monthly money rhythm that fits your real life and your energy.')
) as v(slug, position, title, subtitle, intro)
on conflict (slug) do nothing;

insert into public.exercises (module_id, position, kind, title, body, options)
select m.id, e.position, e.kind, e.title, e.body, e.options
from public.modules m
join (values
  ('money-notice', 1, 'prompt', 'How do you feel when you look at your bank balance?', 'Write the first words that come. Body sensations count too.', null::jsonb),
  ('money-notice', 2, 'prompt', 'What do you say to yourself when you set a price?', 'Write the exact sentences you hear in your head.', null),
  ('money-notice', 3, 'prompt', 'Where does your income stand today, and where would you like it to be in 12 months?', 'Write both numbers. Clear numbers give your mind a direction.', null),
  ('money-notice', 4, 'checklist', 'Tick what feels familiar', 'There are no wrong answers.', '["I undercharge compared with the value I give","I feel uncomfortable talking about money","I give discounts before anyone asks","I delay sending invoices","I compare my income with other women"]'::jsonb),

  ('money-understand', 1, 'prompt', 'What did you hear about money growing up?', 'Write phrases from your family, school or community.', null),
  ('money-understand', 2, 'prompt', 'Who in your life earned money, and how did they feel about it?', 'Describe what you observed, with kindness.', null),
  ('money-understand', 3, 'prompt', 'What did you decide money means?', 'Finish the sentence: "To have money, I believed I had to..."', null),
  ('money-understand', 4, 'prompt', 'How has that belief looked after you?', 'Find the protective side. What did it keep you safe from?', null),

  ('money-reframe', 1, 'prompt', 'Thank your old money belief.', 'Write a short thank-you for the way it protected you.', null),
  ('money-reframe', 2, 'prompt', 'Choose your new money belief.', 'Write one sentence beginning with "I am" or "I receive" that feels true enough to try this month.', null),
  ('money-reframe', 3, 'prompt', 'What is your work worth, and why?', 'List the results, experience and care you bring. Let the list speak.', null),
  ('money-reframe', 4, 'prompt', 'What would the confident version of you charge?', 'Write the price. Then write one reason it is fair.', null),

  ('money-release', 1, 'checklist', 'Which blocks are present for you?', 'Tick any that fit. Naming them is the first step.', '["Guilt about earning more than others","Fear of being visible","Worry about being judged for my prices","Belief that money has to be hard work","Habit of putting everyone else first","Concern that asking will push people away"]'::jsonb),
  ('money-release', 2, 'prompt', 'Pick one block. What does it say to you?', 'Write its words as if it were a person talking.', null),
  ('money-release', 3, 'prompt', 'What would you say back?', 'Respond with the voice of the woman who is ready to earn well.', null),
  ('money-release', 4, 'prompt', 'A letter to your money.', 'Write what you want your relationship with money to feel like. This stays private.', null),

  ('money-offer', 1, 'prompt', 'Who do you help?', 'Describe her in two or three sentences. Be specific.', null),
  ('money-offer', 2, 'prompt', 'What changes for her after working with you?', 'Write the before and the after.', null),
  ('money-offer', 3, 'prompt', 'What is included, and what is the price?', 'Write your offer in plain words, with a clear number.', null),
  ('money-offer', 4, 'prompt', 'Say it out loud. How does it feel?', 'Record yourself saying your price. Write what you notice.', null),

  ('money-visibility', 1, 'prompt', 'Where do the women you help spend time?', 'Name two places, online or in person.', null),
  ('money-visibility', 2, 'prompt', 'What is one story from your work you can share?', 'Write a short story with a beginning, a turning point and a result.', null),
  ('money-visibility', 3, 'prompt', 'Plan your next seven days of visibility.', 'Choose one small action each day, such as a post, a message or a conversation.', null),
  ('money-visibility', 4, 'checklist', 'Your visibility commitments', 'Tick what you are willing to do.', '["I will share my offer once this week","I will invite one person to a conversation","I will ask for one testimonial","I will celebrate each action I complete"]'::jsonb),

  ('money-sustain', 1, 'prompt', 'What does a calm money week look like for you?', 'Describe your ideal rhythm for checking income, invoicing and saving.', null),
  ('money-sustain', 2, 'prompt', 'How will you keep a share of what you earn?', 'Choose a percentage for savings and write when you will move it.', null),
  ('money-sustain', 3, 'prompt', 'What helps you rest while your business grows?', 'List the habits that protect your energy.', null),
  ('money-sustain', 4, 'checklist', 'Your monthly money rhythm', 'Tick what you will do each month.', '["Review my income and spending","Send all invoices on time","Move savings on the same day","Review my prices every quarter","Write down three wins"]'::jsonb)
) as e(module_slug, position, kind, title, body, options) on e.module_slug = m.slug
where not exists (select 1 from public.exercises x where x.module_id = m.id and x.position = e.position);
