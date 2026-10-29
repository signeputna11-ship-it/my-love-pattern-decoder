-- Plain, specific names for the Relationships and Start Here modules.
update public.journeys set subtitle = 'Stop repeating the same heartbreak. Break the loop in love.' where slug = 'relationships';

update public.modules set
  title = 'Why You Keep Choosing the Same Person',
  subtitle = 'Spot the exact loop you repeat in love, from the first red flag to the heartbreak.',
  intro = 'Same type, same ending. Before you can break it, you need to see it written down: what you ignored at the start, what you did to keep them, and how it ended. This module walks you through your own loop, step by step.'
where slug = 'see-the-pattern';

update public.modules set
  title = 'When They Go Quiet: Stop the Spiral',
  subtitle = 'What to do in the next 90 seconds, when your chest tightens and you want to text, chase or beg.',
  intro = 'An unanswered text, a cold tone, a cancelled plan, and your body goes into alarm. This module gives you a 90-second reset you can use in the moment, before you send the message you will regret.'
where slug = 'calm-the-trigger';

update public.modules set
  title = 'Stop Needing Them to Choose You',
  subtitle = 'Rebuild your worth so their replies, attention and approval stop deciding your day.',
  intro = 'If your mood rises and falls with their messages, your worth is in their hands. This module moves it back to you, with exercises you can use the same day.'
where slug = 'rebuild-self-worth';

update public.modules set
  title = 'Say No Without Guilt',
  subtitle = 'Write the exact words for what you will no longer accept, and practise saying them.',
  intro = 'You already know what you will no longer accept. Boundaries fail when you soften them, over-explain or take them back. You will write the exact lines you need and rehearse holding them.'
where slug = 'set-the-boundary';

update public.modules set
  title = 'Choose Differently Next Time',
  subtitle = 'Make your plan for the next red flag, the next text from an ex and the next person who is only half in.',
  intro = 'You already know your pattern. Now you decide, in advance, what you will do at the next red flag, the next message from an ex and the next person who gives you crumbs.'
where slug = 'decide-differently';

update public.modules set
  title = 'Easy Relaxation',
  subtitle = 'A 19-minute audio to switch off a racing mind and loosen a tight body.'
where slug = 'start-calm';

update public.modules set
  title = 'Healing Vortex',
  subtitle = 'A 33-minute guided relaxation to release built-up stress and heavy emotions.'
where slug = 'healing-vortex';

update public.modules set
  title = 'Total Relaxation for Anxiety',
  subtitle = 'A 20-minute audio for when you feel tense, wound up or cannot switch off.'
where slug = 'total-relaxation';
