import type { Player } from '../state/types'

export interface WeekendEffects {
  money?: number;
  hunger?: number;
  energy?: number;
  health?: number;
  morale?: number;
  education?: number;
}

export interface WeekendOption {
  id: string;
  label: string;
  description: string;
  resultText: string;
  effects: WeekendEffects;
  available?: (player: Player) => boolean;
}

export interface WeekendEvent {
  id: string;
  title: string;
  description: string;
  options: WeekendOption[];
}

export const ALL_WEEKEND_EVENTS: WeekendEvent[] = [

  // ─── NIGHTLIFE ───────────────────────────────────────────────────────────────

  {
    id: 'wknd_karaoke',
    title: 'Karaoke Night',
    description: 'Your coworker has "reserved" the karaoke bar for the whole night and refuses to take no for an answer. The mic is warm. The crowd is waiting. The song list is laminated.',
    options: [
      { id: 'sing', label: 'Belt out a classic', description: 'Full commitment. Zero shame.', resultText: 'You nailed the chorus — twice. The mic was warm when you finally surrendered it.', effects: { morale: 20, energy: -20, hunger: -10 } },
      { id: 'duet', label: 'Force someone into a duet', description: 'Shared trauma is half the trauma.', resultText: 'Your partner had concerns but went along with it. The room survived intact.', effects: { morale: 15, energy: -10 }, available: p => p.morale >= 30 },
      { id: 'escape', label: 'Fake an emergency and leave', description: '"My houseplant is on fire."', resultText: 'You were around the corner before the first verse. The houseplant was, in fact, fine.', effects: { morale: -10, energy: 15 } },
    ],
  },

  {
    id: 'wknd_trivia',
    title: 'Bar Trivia Night',
    description: 'The local pub is hosting its weekly trivia night. First prize is $50. Last prize is humiliation. You\'ve already paid for a drink.',
    options: [
      { id: 'compete', label: 'Compete seriously', description: 'You did watch a lot of documentaries.', resultText: 'The geography round was yours. Your team came second. Close enough to feel genuinely good.', effects: { morale: 15, energy: -15, money: 50, hunger: -10 }, available: p => p.education >= 1 },
      { id: 'phone', label: 'Quietly use your phone', description: 'Is it cheating if nobody catches you?', resultText: 'Seven searches across eight rounds. Nobody noticed. You got the points and the money.', effects: { morale: 10, energy: -10, money: 20, hunger: -10 } },
      { id: 'drink', label: 'Just drink and heckle', description: 'The real quiz was the friends we made.', resultText: 'Last place, loudly, and everyone in the bar liked you more for it. Zero regrets.', effects: { morale: 10, energy: -20, money: -30, hunger: 10 } },
    ],
  },

  {
    id: 'wknd_speed_dating',
    title: 'Speed Dating at the Brewery',
    description: 'A friend signed you up for speed dating without asking. You have exactly 3 minutes per person to convince a stranger you\'re interesting.',
    options: [
      { id: 'honest', label: 'Be completely honest', description: 'Refreshing or repellent — 50/50.', resultText: 'You disclosed everything by minute two. Half the table respected it enormously. The other half moved on.', effects: { morale: 15, energy: -15, money: -20 } },
      { id: 'fictional', label: 'Invent a better version of yourself', description: '"I\'m a yacht captain who also sculpts."', resultText: 'The yacht story had two plot holes but nobody fact-checked it. You left with a story either way.', effects: { morale: 20, energy: -20, money: -20 } },
      { id: 'bail', label: 'Eat the free snacks and leave early', description: 'A win, technically.', resultText: 'You ate a strategic amount of cheese in under ten minutes and left before the awkward part. A clean win.', effects: { morale: 5, hunger: 20, money: -15, energy: 10 } },
    ],
  },

  {
    id: 'wknd_house_party',
    title: "Neighbor's Rager",
    description: 'The neighbors are throwing an enormous party and the music is already at structural-damage levels. You\'ve been personally invited through the shared wall.',
    options: [
      { id: 'join', label: 'Join the party', description: 'If you can\'t beat them...', resultText: 'The walls shook. You contributed. By 2am you knew half the neighborhood by name.', effects: { morale: 20, energy: -25, money: -20, hunger: 10 } },
      { id: 'complain', label: 'File a noise complaint', description: 'You become a local villain overnight.', resultText: 'The music stopped for 20 minutes then came back louder. You are now a local villain on two floors.', effects: { morale: -5, energy: 10 } },
      { id: 'earplugs', label: 'Put in earplugs and sleep through it', description: 'Rest, interrupted.', resultText: 'You slept through most of it. The last hour broke through but you held firm.', effects: { energy: 20, morale: -5 } },
    ],
  },

  {
    id: 'wknd_comedy',
    title: 'Open Mic Comedy Night',
    description: 'You somehow end up at an open mic comedy night. The MC is staring directly at you and asking if anyone wants to try a set.',
    options: [
      { id: 'perform', label: 'Get up and do 5 minutes', description: 'You have two good jokes and a story about a pigeon.', resultText: 'Two jokes landed. The pigeon story worked better than expected. You are already thinking about next time.', effects: { morale: 20, energy: -20 }, available: p => p.morale >= 40 },
      { id: 'watch', label: 'Watch and heckle strategically', description: 'The audience is on your side.', resultText: 'You heckled at exactly the right moment and the room turned toward you. A supporting role well played.', effects: { morale: 15, energy: -10, money: -15 } },
      { id: 'leave', label: 'Quietly exit during the applause', description: 'Tactical retreat.', resultText: 'You slipped out during a genuine laugh and nobody noticed. The perfect exit.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_escape_room',
    title: 'Escape Room Disaster',
    description: 'Your group has 60 minutes to escape the "Haunted Lighthouse" room. 55 minutes in, nobody has found the first clue.',
    options: [
      { id: 'try', label: 'Redouble your efforts', description: 'The answer is definitely behind that painting.', resultText: 'It was not behind the painting. You found the first clue at minute 58. The lighthouse won.', effects: { morale: 10, energy: -20, money: -25 } },
      { id: 'cheat', label: 'Ask for unlimited hints', description: 'You ruin the immersion but escape with your dignity.', resultText: 'Seven hints confirmed you had missed everything obvious. You escaped with four seconds to spare.', effects: { morale: 5, energy: -15, money: -25 } },
      { id: 'give_up', label: 'Accept defeat gracefully', description: '"We let the lighthouse win today."', resultText: 'The staff gave you the solution with the tone of a doctor delivering bad news. You took it with dignity.', effects: { morale: 5, energy: -10, money: -25 } },
    ],
  },

  {
    id: 'wknd_silent_disco',
    title: 'Silent Disco Confusion',
    description: 'You\'ve accidentally joined a silent disco. Everyone is dancing intensely to music only they can hear. You have no headphones.',
    options: [
      { id: 'fake', label: 'Dance confidently to nothing', description: 'Commit to the bit.', resultText: 'You committed entirely. Someone gave you a thumbs up. You still have no idea what song they were hearing.', effects: { morale: 20, energy: -20 } },
      { id: 'borrow', label: 'Borrow headphones from someone', description: 'DJ 3 is playing yacht rock. This is fine.', resultText: 'DJ 3 was playing yacht rock. You stayed for three full songs. No regrets whatsoever.', effects: { morale: 15, energy: -15, money: -10 } },
      { id: 'watch', label: 'Document it from the sidelines', description: 'This needs to be on the internet.', resultText: 'You documented twelve minutes of joyful disconnection. The internet appreciated it appropriately.', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_cocktail',
    title: 'Cocktail Masterclass',
    description: 'A local bar is offering a Saturday cocktail-making class for $40. You\'ll learn three recipes and go home either enlightened or sticky.',
    options: [
      { id: 'attend', label: 'Sign up and learn properly', description: 'You\'re basically a mixologist now.', resultText: 'You can now make a Negroni and an Old Fashioned with confidence. The sticky part was entirely expected.', effects: { morale: 20, energy: -10, money: -40 }, available: p => p.money >= 40 },
      { id: 'watch_free', label: 'Watch from the bar for free', description: 'Observational learning.', resultText: 'You absorbed most of the technique from a bar stool. The cost was one round of drinks.', effects: { morale: 10, energy: -10, money: -20 } },
      { id: 'skip', label: 'Make drinks at home instead', description: 'Same result, lower standards.', resultText: 'You made something at home with what you had. It was fine. Technically a cocktail.', effects: { morale: 10, money: -15, hunger: 10 } },
    ],
  },

  {
    id: 'wknd_bowling',
    title: 'Midnight Bowling League',
    description: 'A work acquaintance has a spare spot in their midnight bowling league. Rental shoes are mandatory. The carpet is aggressively patterned.',
    options: [
      { id: 'bowl', label: 'Bowl your heart out', description: 'Three gutter balls and then a strike. Classic arc.', resultText: 'Three gutter balls, a spare in frame 6, a strike in frame 9. Classic arc. Everyone cheered.', effects: { morale: 20, energy: -20, money: -15, hunger: -10 } },
      { id: 'competitive', label: 'Take it unnervingly seriously', description: 'You brought your own shoes.', resultText: 'You brought your own shoes. Nobody commented, which you chose to interpret as deep respect.', effects: { morale: 15, energy: -25, money: -30, health: 5 } },
      { id: 'sit_out', label: 'Score-keep and eat nachos', description: 'The supporting role has nachos.', resultText: 'You scored all three games flawlessly and ate the nachos. The nachos were genuinely the best part.', effects: { morale: 10, hunger: 25, money: -20 } },
    ],
  },

  {
    id: 'wknd_bingo',
    title: 'Retirement Home Bingo Night',
    description: 'You volunteered to help at the community center. The activity: competitive bingo. The stakes: bragging rights and a fruit basket. The competition: genuinely ferocious.',
    options: [
      { id: 'compete', label: 'Play to win', description: 'You want that fruit basket.', resultText: 'B-7 came up in round three and you slapped the table before they finished announcing it. The basket was yours.', effects: { morale: 20, energy: -10, money: 30, hunger: 15 } },
      { id: 'volunteer', label: 'Help call the numbers', description: 'B-12! As in the vitamin!', resultText: 'You called numbers with full theatrical commitment. "B-12 — as in the vitamin!" Every single time.', effects: { morale: 15, energy: -5 } },
      { id: 'chat', label: 'Just talk to people', description: 'Turns out Edna was a competitive swimmer.', resultText: 'Edna was a competitive swimmer in the 70s, holds four national records, and once had dinner with a president.', effects: { morale: 20, energy: 5, health: 5 } },
    ],
  },

  // ─── OUTDOOR & NATURE ────────────────────────────────────────────────────────

  {
    id: 'wknd_hiking',
    title: 'Hiking "Shortcut" Discovery',
    description: 'You\'re on a trail. The map app has confidently led you to a gap in a fence labeled "not a trail." On the other side: possibly a better view, or a swamp.',
    options: [
      { id: 'shortcut', label: 'Take the shortcut', description: 'Adventure awaits. Maybe also mud.', resultText: 'The gap led to a lookout point nobody else had on their map. You were filthy but the view was worth it.', effects: { health: 15, energy: -20, morale: 15 } },
      { id: 'official', label: 'Stick to the official trail', description: 'It adds 40 minutes but has handrails.', resultText: 'Forty extra minutes and three handrail-assisted sections, but you made the summit clean and unscathed.', effects: { health: 10, energy: -15, morale: 10 } },
      { id: 'turn_back', label: 'Turn around and get coffee', description: 'The real hike was the friends we made.', resultText: 'The coffee shop was warm, the coffee was genuinely good, and you have zero mud on your shoes.', effects: { morale: 10, energy: 5, money: -10 } },
    ],
  },

  {
    id: 'wknd_beach',
    title: 'Spontaneous Beach Day',
    description: 'Perfect beach weather and you\'ve just remembered you live 40 minutes from the coast. The only question is how committed you are to this plan.',
    options: [
      { id: 'full_day', label: 'Full beach day, packed lunch and all', description: 'Sunscreen applied. Towel secured.', resultText: 'Sunscreen, towel, three swims, and a genuinely good sandwich. You return a different shade and fully recharged.', effects: { health: 15, morale: 25, energy: -15, hunger: -15 } },
      { id: 'afternoon', label: 'Quick afternoon trip', description: 'Two hours. Maximum efficiency.', resultText: 'Two hours of real sea air. The commute cost more time than the beach was long, but still absolutely worth it.', effects: { health: 10, morale: 15, energy: -10 }, available: p => p.hasTransport },
      { id: 'stay_home', label: 'Watch beach videos on your couch', description: 'Sounds the same. Costs less.', resultText: 'You found a two-hour documentary about tidal ecosystems. It was excellent. The couch held.', effects: { morale: 5, energy: 15 } },
    ],
  },

  {
    id: 'wknd_bird_watching',
    title: 'Extreme Bird Watching',
    description: 'You spotted a rare bird in the park. The bird watching community is already there — camouflaged, silent, and intensely judgmental of your regular clothing.',
    options: [
      { id: 'commit', label: 'Lie down in the bushes to observe', description: 'Full dedication.', resultText: 'Something rare was confirmed by three people with binoculars. You have no photo. The memory stands.', effects: { morale: 15, health: 5, energy: -15 } },
      { id: 'binoculars', label: 'Buy binoculars from the gift shop', description: 'You\'re immediately accepted into the group.', resultText: 'The group accepted you immediately. You spent two hours learning bird calls and now you can\'t unhear them.', effects: { morale: 20, money: -35, health: 5 }, available: p => p.money >= 35 },
      { id: 'pigeons', label: 'Loudly point out pigeons instead', description: '"That one looks special."', resultText: 'You pointed at a pigeon with the full confidence of a professional. The group was extremely polite about it.', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_farmers_market',
    title: "Farmer's Market Rabbit Hole",
    description: 'You went for one tomato. Two hours later you have artisanal cheese, a handmade broom, three different hot sauces, and a very persuasive conversation with a jam vendor.',
    options: [
      { id: 'buy_all', label: 'Commit fully to the lifestyle', description: 'You now own a sourdough starter.', resultText: 'You now own a sourdough starter named Gerald, three hot sauces, artisanal cheese, and a broom you\'ll use once.', effects: { hunger: 25, morale: 20, money: -60, health: 10 }, available: p => p.money >= 60 },
      { id: 'selective', label: 'Buy the tomato and leave immediately', description: 'One item. Victory.', resultText: 'One tomato, purchased with discipline. You made it to the exit before the jam vendor could find you.', effects: { hunger: 15, morale: 10, money: -10 } },
      { id: 'browse', label: 'Browse but buy nothing', description: 'Willpower: maximum.', resultText: 'You circled the entire market twice and left with nothing. Willpower confirmed at maximum capacity.', effects: { morale: 10, energy: -10 } },
    ],
  },

  {
    id: 'wknd_park_concert',
    title: 'Free Concert in the Park',
    description: 'There\'s a free concert in the park! The band is enthusiastic. The genre is "experimental folk fusion." You might love it. You might not know what is happening.',
    options: [
      { id: 'front', label: 'Get a spot near the front', description: 'Full immersion. Possibly too much immersion.', resultText: 'The genre remains technically unclear but you were absolutely in it by the third song. Something about rivers and seasons.', effects: { morale: 20, energy: -15, hunger: -10 } },
      { id: 'picnic', label: 'Set up a picnic in the back', description: 'The music is ambient. The cheese is excellent.', resultText: 'The cheese was excellent. The music was ambient and strange. You left feeling mysteriously content.', effects: { morale: 20, hunger: 20, energy: -5, money: -20 }, available: p => p.money >= 20 },
      { id: 'podcast', label: 'Listen to a podcast instead', description: 'The park is still pleasant.', resultText: 'You found a bench, listened to a long episode about municipal infrastructure, and honestly it was great.', effects: { morale: 10, energy: 10 } },
    ],
  },

  {
    id: 'wknd_raccoon',
    title: 'Late Night Raccoon Standoff',
    description: 'A raccoon has been living in your trash cans and has gotten very comfortable. It is now 11pm and you are both staring at each other in the alley.',
    options: [
      { id: 'shoo', label: 'Attempt to shoo it away', description: 'It doesn\'t shoo.', resultText: 'It did not shoo. It looked at you. You went inside. Status quo was maintained. It\'s still out there.', effects: { morale: 5, energy: -10 } },
      { id: 'bribe', label: 'Offer it some leftover food to buy peace', description: 'Diplomatic solution.', resultText: 'The raccoon accepted the offering and retreated. A diplomatic success of limited durability.', effects: { morale: 15, hunger: -10, energy: -5 } },
      { id: 'accept', label: 'Accept you share a home now', description: 'Its name is Gerald.', resultText: 'Gerald has a schedule. You have adjusted yours accordingly. Cohabitation has begun.', effects: { morale: 20, energy: -5 } },
    ],
  },

  {
    id: 'wknd_accidentally_5k',
    title: 'Accidentally Entered a 5K',
    description: 'You were just walking through the park in comfortable clothes. Now you\'re at the starting line of a charity 5K with 400 other runners, and someone has already pinned a number on your shirt.',
    options: [
      { id: 'run', label: 'Run it — you\'re already here', description: 'YOLO, but with cardio.', resultText: 'You finished. Not fast, but running. The finisher medal was laminated cardboard. It still counts.', effects: { health: 20, energy: -30, morale: 20, money: 30 } },
      { id: 'walk', label: 'Walk the whole thing proudly', description: '"I\'m pacing myself."', resultText: 'You finished last, deliberately, having stopped twice for water and once to watch a dog in the crowd.', effects: { health: 10, energy: -15, morale: 15 } },
      { id: 'duck_out', label: 'Veer off at the first corner', description: 'Quick, blend into the spectators.', resultText: 'You merged with the spectators at the first corner and watched the rest from a folding chair. Efficient.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_bbq',
    title: 'Community Barbecue Drama',
    description: 'The neighborhood barbecue has escalated. Two grillmasters are in a silent but intense standoff over charcoal vs. gas. Everyone is picking sides.',
    options: [
      { id: 'charcoal', label: 'Side with Team Charcoal', description: '"Real smoke. Real flavor. Real commitment."', resultText: 'You chose your side. The charcoal master shook your hand. The food took longer and was slightly better.', effects: { morale: 15, hunger: 25, money: -10 } },
      { id: 'gas', label: 'Side with Team Gas', description: '"Consistent temperature. Reliable. Efficient."', resultText: 'Consistent temperature. Reliable cook. You ate first. The charcoal faction looked at you with tired eyes.', effects: { morale: 10, hunger: 25, money: -10 } },
      { id: 'neutral', label: 'Eat food from both and stay quiet', description: 'The Switzerland of barbecue.', resultText: 'You collected food from both grills and sat in the middle. Both factions regarded you with respect and suspicion.', effects: { morale: 20, hunger: 30, money: -10 } },
    ],
  },

  {
    id: 'wknd_goat_yoga',
    title: 'Goat Yoga Discovery',
    description: 'There\'s a goat yoga class at a local farm this weekend. The goats walk on you during poses. You don\'t know if this sounds relaxing or concerning.',
    options: [
      { id: 'attend', label: 'Book a spot and experience it fully', description: 'The goat doesn\'t care about your form.', resultText: 'A goat sat on your back during downward dog. You held the pose for a full minute. The goat remained unimpressed.', effects: { health: 10, morale: 25, energy: -10, money: -30 }, available: p => p.money >= 30 },
      { id: 'watch', label: 'Watch from the fence for free', description: 'Same content. Less goat contact.', resultText: 'You watched from the fence for forty minutes. The goat-to-human ratio was concerning. The goats were clearly winning.', effects: { morale: 15, energy: 5 } },
      { id: 'skip', label: 'Decide this is too much', description: '"I have limits."', resultText: 'You decided goat yoga was a line you were not prepared to cross. A very reasonable personal boundary.', effects: { energy: 10, morale: 5 } },
    ],
  },

  // ─── HOME & DOMESTIC ─────────────────────────────────────────────────────────

  {
    id: 'wknd_netflix',
    title: 'The Algorithm Rabbit Hole',
    description: 'You sat down for "one episode." Six hours later you\'re three seasons into a show about competitive sandcastle builders and emotionally invested.',
    options: [
      { id: 'commit', label: 'Finish the season tonight', description: 'Sleep is for people who aren\'t this invested.', resultText: 'Season finale at 1:30am. You are devastated, satisfied, and already curious about the next one.', effects: { morale: 15, energy: -25, hunger: -15 } },
      { id: 'exercise', label: 'Dramatically stop and go for a walk', description: 'Healthy. Disappointing. Responsible.', resultText: 'You walked for twenty minutes. It was fine. You finished the season later that night anyway.', effects: { health: 10, energy: -5, morale: 5 } },
      { id: 'continue', label: 'Watch two more and go to bed at a reasonable time', description: 'Balance. Sort of.', resultText: 'Two episodes, lights out at a sensible hour. You dream about competitive sandcastles. This is fine.', effects: { morale: 10, energy: -10, hunger: -10 } },
    ],
  },

  {
    id: 'wknd_diy',
    title: 'DIY Project Disaster',
    description: 'You were going to just fix a leaky faucet. The faucet is now in three pieces on the floor, you\'ve accidentally opened a wall panel, and there\'s water on the ceiling.',
    options: [
      { id: 'push_through', label: 'Push through and figure it out', description: 'YouTube tutorials have gotten you this far.', resultText: 'The faucet works. There are two new holes in the wall. The ceiling is dry. Close enough.', effects: { morale: 15, energy: -25, money: -50 } },
      { id: 'call_plumber', label: 'Call an emergency plumber', description: 'He doesn\'t laugh. Much.', resultText: 'He fixed it in eleven minutes and left without laughing. Outwardly. You are grateful and substantially poorer.', effects: { morale: -10, energy: -10, money: -120 }, available: p => p.money >= 120 },
      { id: 'tape', label: 'Apply industrial tape and pray', description: '"It\'s holding."', resultText: 'The tape is holding. You check it three times a day. It is still holding. For now.', effects: { morale: 5, energy: -15, money: -10 } },
    ],
  },

  {
    id: 'wknd_cooking',
    title: 'Experimental Cooking Session',
    description: 'You\'ve decided to attempt a recipe from a cooking show — the one that involves flambéeing something. The smoke alarm has already been removed from the kitchen.',
    options: [
      { id: 'attempt', label: 'Attempt the full recipe', description: 'It either works or it becomes a story.', resultText: 'The flambe worked on the third try. Most of the kitchen survived. The dish was genuinely impressive.', effects: { hunger: 30, morale: 20, energy: -20, money: -40 }, available: p => p.money >= 40 },
      { id: 'simplified', label: 'Make the easy version without the flambe', description: 'Tastier than the original, honestly.', resultText: 'You skipped the fire and the result was somehow better. The pan situation was entirely manageable.', effects: { hunger: 25, morale: 15, energy: -10, money: -20 }, available: p => p.money >= 20 },
      { id: 'order', label: 'Give up and order delivery instead', description: '"Learning from failure is also learning."', resultText: 'You ordered Thai. It arrived in 28 minutes. You ate it in front of the stove you had respectfully abandoned.', effects: { hunger: 25, morale: 5, energy: 5, money: -30 }, available: p => p.money >= 30 },
    ],
  },

  {
    id: 'wknd_cleaning',
    title: 'Deep Clean Archaeology',
    description: 'You started cleaning and have now discovered layers of forgotten items — a jacket you thought was stolen, $17 in change, and something in the back of the fridge with its own ecosystem.',
    options: [
      { id: 'full', label: 'Commit to a full deep clean', description: 'Hours of work. Worth it.', resultText: 'The apartment is clean. The jacket is found. The fridge ecosystem was composted with appropriate ceremony.', effects: { morale: 20, energy: -25, money: 17 } },
      { id: 'strategic', label: 'Clean only the visible surfaces', description: 'Company-ready in 20 minutes.', resultText: 'Visible surfaces: immaculate. Behind every door: unchanged. Company-approved in all the right places.', effects: { morale: 10, energy: -10 } },
      { id: 'pocket_money', label: 'Pocket the $17 and stop there', description: 'Good enough.', resultText: 'Seventeen dollars richer, you decided the rest was fine. The rest was not fine but you left it that way.', effects: { morale: 10, money: 17, energy: 5 } },
    ],
  },

  {
    id: 'wknd_gaming',
    title: 'Gaming Marathon',
    description: 'You started a "quick" gaming session at 10am. It\'s now 8pm and your character just reached a very important checkpoint. The real world feels distant.',
    options: [
      { id: 'one_more', label: 'Just one more hour', description: '(It\'s never one more hour.)', resultText: 'Four more hours. The checkpoint is secured. The real world returned slowly, as from a dream.', effects: { morale: 15, energy: -25, hunger: -20 } },
      { id: 'finish_quest', label: 'Finish this quest then stop', description: 'Disciplined. Mostly.', resultText: 'You finished the quest at the agreed time and then immediately started the next one. Still: improvement.', effects: { morale: 15, energy: -15, hunger: -15 } },
      { id: 'take_break', label: 'Take a real break, go outside', description: 'The sun still exists.', resultText: 'You found a street you\'d never been on. There was a mural of a goat. You felt unexpectedly good about this.', effects: { health: 10, energy: 5, morale: 5 } },
    ],
  },

  {
    id: 'wknd_roomba',
    title: 'Robot Vacuum Uprising',
    description: 'Your robot vacuum has developed opinions. It has knocked a plant off a shelf, trapped itself behind the couch, and is now emitting distress beeps in what sounds like a pattern.',
    options: [
      { id: 'rescue', label: 'Rescue it and reprogram it firmly', description: '"We will have boundaries."', resultText: 'You freed it, updated the no-go zones, and had a brief but firm conversation about expectations. Boundaries set.', effects: { morale: 10, energy: -10 } },
      { id: 'watch', label: 'Document its journey for 2 hours', description: 'It has more agency than you expected.', resultText: 'It completed a circuit you would describe as purposeful. You documented six minutes and watched twelve.', effects: { morale: 20, energy: 5 } },
      { id: 'negotiate', label: 'Leave it a snack and see what happens', description: 'This is how it starts in the movies.', resultText: 'You left it a cracker. It stopped beeping. It has not left the corner. You are both watching each other carefully.', effects: { morale: 15, hunger: -5, energy: 10 } },
    ],
  },

  {
    id: 'wknd_ikea',
    title: 'The IKEA Relationship Test',
    description: 'You ordered flat-pack furniture and it arrived Friday. Instructions: 47 steps. Allen keys provided: 1. Screws left over after completion: 4. Purpose unknown.',
    options: [
      { id: 'read', label: 'Read all the instructions first', description: 'Methodical. Respectful of the process.', resultText: 'All 47 steps completed. Four screws remain. Their absence has caused no structural issues. So far.', effects: { morale: 15, energy: -20 } },
      { id: 'improvise', label: 'Wing it and check instructions only when stuck', description: 'Faster. Structurally confident.', resultText: 'You got stuck at step 22. Step 19 was backwards. You fixed it. The result is solid and only slightly misaligned.', effects: { morale: 10, energy: -15 } },
      { id: 'pay', label: 'Pay someone else to assemble it', description: 'Money well spent.', resultText: 'They assembled it in under an hour and left without commentary. Every cent was justified.', effects: { morale: 20, energy: 5, money: -60 }, available: p => p.money >= 60 },
    ],
  },

  {
    id: 'wknd_baking',
    title: 'The Sourdough Crisis',
    description: 'Your sourdough starter — which has been living in your fridge for 4 months — is either very active or very dead. Only baking will reveal the truth.',
    options: [
      { id: 'bake', label: 'Bake the loaf and accept the outcome', description: 'Science. Sort of.', resultText: 'It worked. Not perfectly, but it worked. The crust was excellent. The interior was a conversation starter.', effects: { hunger: 25, morale: 20, energy: -20, money: -15 }, available: p => p.money >= 15 },
      { id: 'start_fresh', label: 'Throw it out and start a new one', description: 'A clean slate.', resultText: 'You threw out the old starter with appropriate ceremony and began again. The new one is already showing signs of life.', effects: { morale: 10, energy: -10, money: -10 }, available: p => p.money >= 10 },
      { id: 'ignore', label: 'Put it back in the fridge and decide later', description: 'It will keep. Probably.', resultText: 'It\'s still in the fridge. You have decided it is fine. You check it every few days. It is probably fine.', effects: { energy: 15, morale: 5 } },
    ],
  },

  {
    id: 'wknd_declutter',
    title: 'Spontaneous Declutter Urge',
    description: 'You\'ve been seized by an overwhelming need to throw things away. Your apartment feels smaller every day. It is time.',
    options: [
      { id: 'full_purge', label: 'Full purge: one bag per room', description: 'Ruthless. Liberating.', resultText: 'One bag per room, donated. The space feels genuinely, noticeably different now. You found $30 in a coat.', effects: { morale: 25, energy: -20, money: 30 } },
      { id: 'selective', label: 'Sort into donate vs. keep piles', description: 'The keep pile is very large.', resultText: 'The keep pile was suspiciously large, but three donation bags went out. Meaningful progress was made.', effects: { morale: 15, energy: -15 } },
      { id: 'decide_later', label: 'Take photos of everything and decide later', description: '"Archive mode activated."', resultText: 'You now have 200 photos of items labelled "decide later." This is functionally the same as keeping all of them.', effects: { morale: 5, energy: 5 } },
    ],
  },

  // ─── FOOD & DINING ───────────────────────────────────────────────────────────

  {
    id: 'wknd_food_truck',
    title: 'Mystery Food Truck Festival',
    description: 'A pop-up food truck festival has appeared downtown. Twelve trucks. No menus posted outside. You eat blind or you don\'t eat at all.',
    options: [
      { id: 'adventurous', label: 'Try the most mysterious truck', description: 'It said "fusion." Beyond that: unknown.', resultText: 'The mystery truck was Peruvian-Japanese fusion. It was extraordinary and also a significant amount of food.', effects: { hunger: 30, morale: 20, money: -25, health: 5 }, available: p => p.money >= 25 },
      { id: 'safe', label: 'Find the burger truck', description: 'There\'s always a burger truck.', resultText: 'There was a burger truck. There is always a burger truck. It was correct and entirely consistent.', effects: { hunger: 25, morale: 10, money: -15, health: -5 }, available: p => p.money >= 15 },
      { id: 'samples', label: 'Live off free samples alone', description: 'Walking very slowly. Strategically.', resultText: 'Seven trucks, one sample each. You ate more than expected and spent less than anyone else there. Excellent system.', effects: { hunger: 15, morale: 15, energy: -10 } },
    ],
  },

  {
    id: 'wknd_leftovers',
    title: 'Leftovers Roulette',
    description: 'The fridge contains five mystery containers of varying age. The risk-to-reward ratio is unclear. Science is watching.',
    options: [
      { id: 'eat_all', label: 'Eat the most recent-looking one', description: '"The texture is fine. Probably fine."', resultText: 'The texture was fine. You ate it. No consequences yet. You check in every few hours just in case.', effects: { hunger: 25, energy: 5, health: -5 } },
      { id: 'check', label: 'Smell-test every container carefully', description: 'Two survive. You eat both.', resultText: 'Two containers passed the smell test. You ate both. The smell test is a reliable and ancient technology.', effects: { hunger: 20, morale: 10, energy: 5 } },
      { id: 'throw_out', label: 'Throw everything out and cook fresh', description: 'Bold. Expensive. Worth it.', resultText: 'Everything went out. You cooked fresh with good ingredients. The result was excellent and your conscience is clear.', effects: { hunger: 25, morale: 15, money: -25, health: 10 }, available: p => p.money >= 25 },
    ],
  },

  {
    id: 'wknd_buffet',
    title: 'The Unlimited Breakfast Buffet',
    description: 'A hotel near you does an all-you-can-eat brunch on weekends for $18. You\'ve been told by multiple people that it "changes you."',
    options: [
      { id: 'go', label: 'Go to the buffet', description: 'You return a different person.', resultText: 'Three plates. Unlimited coffee. A small dessert situation. You return different, as advertised.', effects: { hunger: 40, morale: 20, money: -18, energy: -10 }, available: p => p.money >= 18 },
      { id: 'eat_twice', label: 'Go back twice and make it a project', description: 'You are getting your money\'s worth.', resultText: 'You went back twice for mains and once for dessert. The staff watched with quiet respect. You did not slow down.', effects: { hunger: 40, morale: 15, health: -10, money: -18, energy: -20 }, available: p => p.money >= 18 },
      { id: 'skip', label: 'Make breakfast at home instead', description: 'Cheaper. Respectable. Slightly sad.', resultText: 'You made eggs at home and they were good. You briefly thought about the buffet and then deliberately didn\'t.', effects: { hunger: 20, morale: 5, money: -10 }, available: p => p.money >= 10 },
    ],
  },

  {
    id: 'wknd_taco',
    title: 'All-You-Can-Eat Taco Challenge',
    description: 'The taco restaurant has launched an all-you-can-eat challenge for $20. The record is 22 tacos. You are a reasonable person. You will have maybe six.',
    options: [
      { id: 'challenge', label: 'Accept the challenge officially', description: 'Your name could be on the wall.', resultText: 'Nine tacos. Not the record, but the crowd appreciated the genuine effort. The record is not human.', effects: { hunger: 40, morale: 20, health: -10, money: -20, energy: -15 }, available: p => p.money >= 20 },
      { id: 'casual', label: 'Eat casually without the pressure', description: 'Seven tacos. Perfect.', resultText: 'Seven tacos at a comfortable pace. You sat for a while afterward. This was the correct choice.', effects: { hunger: 35, morale: 20, money: -20 }, available: p => p.money >= 20 },
      { id: 'skip', label: 'Make tacos at home with better ingredients', description: 'Artisanal taco energy.', resultText: 'You made tacos at home with good ingredients. They were excellent. This was also completely valid.', effects: { hunger: 25, morale: 15, money: -15 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_competitive_eating',
    title: 'Competitive Hot Dog Incident',
    description: 'You are at a street fair. There is a hot dog eating contest. First prize is $75. The defending champion is a 140-pound accountant named Pam.',
    options: [
      { id: 'enter', label: 'Enter the contest', description: 'May the best person win.', resultText: 'You ate eleven hot dogs and finished third. Pam ate eighteen and made direct eye contact with you the entire time.', effects: { hunger: 35, morale: 15, health: -15, money: 75, energy: -20 } },
      { id: 'watch', label: 'Watch and cheer for Pam', description: 'Pam eats 18 hot dogs. You eat a normal one.', resultText: 'Pam won with eighteen hot dogs and was gracious in victory. You ate a normal one and felt at peace.', effects: { morale: 20, hunger: 20, money: -8, energy: -5 } },
      { id: 'avoid', label: 'Get a funnel cake and leave quietly', description: 'The correct choice.', resultText: 'The funnel cake was excellent. You heard the crowd cheer from a safe distance. Zero regrets.', effects: { hunger: 20, morale: 15, money: -8 } },
    ],
  },

  {
    id: 'wknd_popup_restaurant',
    title: 'The Pop-Up Restaurant Lottery',
    description: 'A renowned chef is doing a one-night pop-up dinner in someone\'s garage. You won a spot via newsletter lottery. The email said "dress business casual."',
    options: [
      { id: 'go', label: 'Attend the garage dinner', description: 'Six courses. One folding table.', resultText: 'Six courses in a garage. The chef walked between folding chairs explaining every dish in detail. Extraordinary.', effects: { hunger: 35, morale: 25, money: -80, health: 10, energy: -10 }, available: p => p.money >= 80 },
      { id: 'sell', label: 'Sell the reservation online', description: 'Someone paid $40 for your spot.', resultText: 'Someone paid $40 for your spot and thanked you warmly. You ate at home for $15. Net outcome: positive.', effects: { morale: 10, money: 40 } },
      { id: 'no_show', label: 'Forget about it and order pizza', description: '"I was going to go."', resultText: 'You watched the cancellation fee leave your account and ordered pizza. The pizza was genuinely good.', effects: { morale: 5, hunger: 20, money: -15 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_chili_cookoff',
    title: 'Neighborhood Chili Cook-Off',
    description: 'Your block is hosting a chili cook-off. You could enter, judge, or just aggressively eat everyone else\'s entries and claim to be "gathering feedback."',
    options: [
      { id: 'enter', label: 'Enter with your secret recipe', description: 'The secret is cumin. Lots of cumin.', resultText: 'Your cumin-forward entry placed second. You are absolutely convinced the judging process was political.', effects: { hunger: 25, morale: 20, energy: -15, money: -20 }, available: p => p.money >= 20 },
      { id: 'eat', label: 'Eat all the samples with authority', description: '"I\'m assessing heat levels."', resultText: 'You circled the tables four times with full authority. Nobody stopped you. This is the correct way to do chili events.', effects: { hunger: 35, morale: 20, money: -5 } },
      { id: 'judge', label: 'Volunteer as an official judge', description: 'Power and free chili.', resultText: 'Power and free chili, exactly as advertised. Your feedback was taken seriously. The winner thanked you personally.', effects: { hunger: 30, morale: 25, energy: -10 } },
    ],
  },

  {
    id: 'wknd_michelin',
    title: 'Accidental Michelin Reservation',
    description: 'You booked what you thought was a casual Italian place. The menu is in French. There are eight courses. The amuse-bouche is a sphere.',
    options: [
      { id: 'enjoy', label: 'Embrace the experience', description: 'This is fine. You know which fork to use. Probably.', resultText: 'Eight courses. A sphere, a foam, three reductions, and something described as "an essence." Absolutely worth it.', effects: { hunger: 35, morale: 25, money: -150, health: 10 }, available: p => p.money >= 150 },
      { id: 'short', label: 'Leave after three courses citing an "appointment"', description: '"The sphere was enough."', resultText: 'You left after three courses. The amuse-bouche sphere alone was genuinely memorable. "The sphere was enough."', effects: { hunger: 20, morale: 10, money: -80, energy: 5 }, available: p => p.money >= 80 },
      { id: 'no_show', label: 'Don\'t show up and eat chips at home', description: 'They\'ll charge a cancellation fee but your dignity survives.', resultText: 'You paid the cancellation fee and ate chips at home. The chips were good. The dignity survived intact.', effects: { morale: 5, hunger: 10, money: -30, energy: 15 }, available: p => p.money >= 30 },
    ],
  },

  // ─── SHOPPING & MONEY ────────────────────────────────────────────────────────

  {
    id: 'wknd_garage_sale',
    title: 'Suspiciously Good Garage Sale',
    description: 'A garage sale on your street has what appears to be an original vintage concert poster, an unopened blender, and a full tuxedo for $5. You don\'t know the backstory and probably shouldn\'t ask.',
    options: [
      { id: 'buy_poster', label: 'Buy the poster and get it valued', description: 'Could be $20. Could be $400.', resultText: 'The poster appraised at $80. Not a fortune, but significantly more than the dollar you paid for it.', effects: { morale: 15, money: 80, energy: -5 }, available: p => p.money >= 5 },
      { id: 'buy_all', label: 'Buy everything suspicious', description: '"This has to be worth something."', effects: { morale: 20, money: 30, energy: -10 }, resultText: 'You now own a tuxedo, a blender, and the poster, all for twenty dollars. Unknown provenance. Worth it.', available: p => p.money >= 20 },
      { id: 'browse', label: 'Browse and buy nothing', description: 'You love the chaos.', resultText: 'You touched the poster. You felt something. You put it back. You think about it occasionally.', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_lottery',
    title: 'Scratch Ticket Discovery',
    description: 'You found an unscratched lottery ticket in a coat pocket. The jackpot on this one was $100,000. You have a coin. The moment is weirdly tense.',
    options: [
      { id: 'scratch', label: 'Scratch it immediately', description: 'Fortune favors the impatient.', resultText: 'Not the jackpot, but a bonus scratch revealed a $50 win. The coin worked its modest magic.', effects: { morale: 15, money: 50 } },
      { id: 'save', label: 'Save it for a lucky day', description: '"I\'m not ready."', resultText: 'It\'s in the drawer now. You are not yet ready. This feels like a reasonable personal decision.', effects: { morale: 10, energy: 5 } },
      { id: 'gift', label: 'Give it to a stranger on the street', description: 'Pure chaos energy.', resultText: 'The stranger scratched it immediately and won $10. They showed you the ticket with pure delight. Worth it.', effects: { morale: 25 } },
    ],
  },

  {
    id: 'wknd_investment_seminar',
    title: '"Free" Investment Seminar',
    description: 'A flyer promised a free brunch and wealth-building secrets. The brunch is one croissant and a coffee. The secret is: buy their course for $299.',
    options: [
      { id: 'leave', label: 'Leave immediately after the croissant', description: 'You got exactly what you came for.', resultText: 'You ate the croissant at professional speed and left before the course was announced. A clean extraction.', effects: { hunger: 10, morale: 10, energy: -5 } },
      { id: 'ask_hard', label: 'Ask increasingly difficult questions', description: '"What\'s your Sharpe ratio?"', resultText: 'Your fourth question caused a significant pause. Your fifth question brought the Q&A section to an early close.', effects: { morale: 20, energy: -10 } },
      { id: 'buy', label: 'Buy the course out of confusion', description: 'A mistake you\'ll understand in 6-8 weeks.', resultText: 'You bought the course. The content is available free on the internet. You will learn this fully in six weeks.', effects: { morale: -15, money: -299, education: 1 }, available: p => p.money >= 299 },
    ],
  },

  {
    id: 'wknd_yard_sale',
    title: 'Hosting Your Own Yard Sale',
    description: 'You\'ve dragged everything you don\'t want to your front yard. Your neighbors have stopped and are looking at your stuff in the same politely judgmental way you look at theirs.',
    options: [
      { id: 'negotiate', label: 'Negotiate hard on everything', description: '"This bread maker is worth $45."', resultText: 'Everything sold within three hours. The bread maker went for $45. You had principles and you held them.', effects: { morale: 15, energy: -20, money: 80 } },
      { id: 'give_away', label: 'Give everything away for free', description: 'The neighbors are very happy. You feel lighter.', resultText: 'You gave it all away. The neighbors helped carry things. You feel twenty pounds lighter and unexpectedly good.', effects: { morale: 25, energy: -10 } },
      { id: 'fixed_price', label: 'Use price tags and stick to them', description: 'Principled. Slower.', resultText: 'Half sold at tag price, the rest in the final hour at modest discounts. Principled and moderately profitable.', effects: { morale: 10, energy: -15, money: 40 } },
    ],
  },

  {
    id: 'wknd_dumpster',
    title: 'Dumpster Treasure Hunt',
    description: 'Your city has a "big rubbish" weekend where people put out furniture and electronics. You\'ve spotted a working lamp, an exercise bike, and a completely unexplained chandelier.',
    options: [
      { id: 'take_all', label: 'Take everything that fits', description: 'Your apartment will look eclectic.', resultText: 'The lamp works. The bike needs one part. The chandelier raises questions you are not yet prepared to answer.', effects: { morale: 20, money: 50, energy: -20 } },
      { id: 'selective', label: 'Take only the lamp', description: 'Disciplined scavenging.', resultText: 'The lamp works perfectly. You carried it six blocks with no regrets whatsoever. Excellent find.', effects: { morale: 10, money: 20, energy: -5 } },
      { id: 'photograph', label: 'Photograph everything and post online', description: '"Big rubbish content."', resultText: 'Your post reached twelve hundred people. Three people claimed items. You personally collected zero of it.', effects: { morale: 15, energy: 5 } },
    ],
  },

  {
    id: 'wknd_black_friday',
    title: 'Black Friday in July',
    description: 'A store near you has launched a "Black Friday in July" event. Lines formed at 4am. You arrived at 9am and are already in the queue. Items are limited.',
    options: [
      { id: 'queue', label: 'Commit to the queue', description: '2 hours for a $40 saving.', resultText: 'Two hours in the queue. You were second-to-last to get the item. You feel victorious and exhausted in equal measure.', effects: { morale: 10, energy: -20, money: -60 }, available: p => p.money >= 60 },
      { id: 'leave', label: 'Walk past and go get coffee', description: 'The real discount was the peace of mind.', resultText: 'The coffee shop three doors down was peaceful. The $40 you didn\'t spend felt immediately like a personal win.', effects: { morale: 15, energy: 5, money: -5 } },
      { id: 'online', label: 'Go home and buy it online instead', description: 'Same price. No queue.', resultText: 'Same price, ordered in four minutes, took a nap. Modern commerce working as intended.', effects: { morale: 10, money: -70, energy: 10 }, available: p => p.money >= 70 },
    ],
  },

  // ─── WEIRD & SUPERNATURAL ────────────────────────────────────────────────────

  {
    id: 'wknd_psychic',
    title: "The Fortune Teller's Reading",
    description: 'A fortune teller at the weekend market offers you a reading for $15. She says she sees "a great transformation." You have no idea what that means.',
    options: [
      { id: 'full_reading', label: 'Get the full reading', description: 'She\'s very convincing about mercury.', resultText: 'She was very convincing about mercury being in retrograde. Your third house is apparently "active." You feel watched.', effects: { morale: 15, energy: -5, money: -15 }, available: p => p.money >= 15 },
      { id: 'skeptical', label: 'Ask increasingly specific questions', description: '"What transformation, exactly? What direction?"', resultText: 'She answered with increasing vagueness. You left genuinely respecting the performance, if not the methodology.', effects: { morale: 10, energy: -5, money: -15 }, available: p => p.money >= 15 },
      { id: 'decline', label: 'Politely decline', description: 'You make your own fate.', resultText: 'You made your own fate and it was fine and free and entirely immediate.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_ufo',
    title: 'UFO Enthusiast Meetup',
    description: 'A sign at the library: "Saturday: UAP Evidence Sharing Group — All Welcome." You go in. There are maps, photos, and one extremely confident man named Dennis.',
    options: [
      { id: 'engage', label: 'Engage with Dennis\'s evidence seriously', description: 'The blur in photo 7 is compelling.', resultText: 'The blur in photo 7 is either a drone or a lens flare. You and Dennis disagree. The debate is ongoing.', effects: { morale: 20, energy: -10 } },
      { id: 'ask', label: 'Ask one very good skeptical question', description: 'The room goes quiet.', resultText: 'Your question produced a twelve-second silence. Dennis conceded the point, then pivoted gracefully. Impressive room.', effects: { morale: 15, energy: -10 } },
      { id: 'snacks', label: 'Eat the provided snacks and listen', description: 'Free pretzels. No commitments.', resultText: 'The pretzels were good. The evidence was interesting in a way that doesn\'t fully hold up. A pleasant afternoon.', effects: { morale: 10, hunger: 15, energy: -5 } },
    ],
  },

  {
    id: 'wknd_time_capsule',
    title: 'Neighborhood Time Capsule',
    description: 'The city is opening a time capsule buried 30 years ago in the park. It contains a letter, a mixtape, a small trophy, and what appears to be a legal document.',
    options: [
      { id: 'attend', label: 'Attend the official ceremony', description: 'The mayor reads the letter. There are tears.', resultText: 'The mayor cried reading the letter. The mixtape had three songs nobody could play. The deed named a community garden.', effects: { morale: 20, energy: -5 } },
      { id: 'read_doc', label: 'Push to the front to read the legal document', description: 'It\'s a deed. For what, unclear.', resultText: 'It was a land deed for a park plot that nobody knew had an owner. A lawyer was mentioned. The crowd murmured.', effects: { morale: 15, energy: -10 } },
      { id: 'pass', label: 'Watch from a distance and leave early', description: 'The vibe was enough.', resultText: 'You watched from near the fountain. The mayor read something that made people emotional. The vibe was enough.', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_conspiracy_con',
    title: 'Conspiracy Theory Convention',
    description: 'You\'ve wandered into a conspiracy theory expo. Booths include "The Moon is a Hologram" (compelling PowerPoint), "Birds Aren\'t Real" (merchandise available), and "Everything is Fine" (suspiciously empty).',
    options: [
      { id: 'browse', label: 'Browse all the booths open-mindedly', description: 'You leave with more questions than answers.', resultText: 'You left with four pamphlets and two new frameworks for understanding history. No firm conclusions reached.', effects: { morale: 20, energy: -10 } },
      { id: 'debate', label: 'Debate the bird people for 45 minutes', description: 'Neither side wins. Both sides are energized.', resultText: 'Both sides gave as good as they got. The bird argument is substantially stronger than you initially assumed.', effects: { morale: 15, energy: -20 } },
      { id: 'merch', label: 'Buy a "Birds Aren\'t Real" t-shirt', description: 'It\'s a good conversation starter.', resultText: 'The shirt is good quality. You\'ve worn it twice now. Both times, strangers made meaningful eye contact with you.', effects: { morale: 20, money: -20 }, available: p => p.money >= 20 },
    ],
  },

  {
    id: 'wknd_haunted_airbnb',
    title: 'The Allegedly Haunted Airbnb',
    description: 'A friend booked an Airbnb listed as "historically significant." The listing mentions "spirits" in the amenities. The door opens by itself. This is either the house settling or something else.',
    options: [
      { id: 'stay', label: 'Stay the whole night, ghost or no ghost', description: '"I paid for this room."', resultText: 'Nothing happened until 3am when the heating kicked on loudly. You screamed once. Nobody heard.', effects: { morale: 25, energy: -20, money: -40 }, available: p => p.money >= 40 },
      { id: 'investigate', label: 'Systematically investigate the noises', description: 'It\'s a bird. It\'s almost always a bird.', resultText: 'You tracked every sound to its source. Three were birds, two were pipes, one was unmistakably a cat next door.', effects: { morale: 20, energy: -25 } },
      { id: 'leave', label: 'Leave at midnight citing "vibes"', description: 'The hotel down the road has normal doors.', resultText: 'The hotel had entirely normal doors and blackout curtains. You slept remarkably, deeply well.', effects: { morale: 10, money: -60, energy: -10 }, available: p => p.money >= 60 },
    ],
  },

  {
    id: 'wknd_ghost_tour',
    title: 'Ghost Tour of the City',
    description: 'The weekend ghost tour starts at 9pm and visits seven "haunted" sites. The guide is extremely committed. It\'s $15 per person and genuinely atmospheric.',
    options: [
      { id: 'full_tour', label: 'Do the full tour', description: 'Two actual scares and one pigeon.', resultText: 'Two locations gave genuine chills. One was a pigeon. The guide committed fully throughout. An excellent evening.', effects: { morale: 20, energy: -15, money: -15 }, available: p => p.money >= 15 },
      { id: 'ask_questions', label: 'Ask the guide pointed questions throughout', description: '"What\'s the provenance on that sighting?"', resultText: 'You asked about documentation on sites 3 and 5. The guide appreciated the rigor. The other tourists did not.', effects: { morale: 15, energy: -15, money: -15 }, available: p => p.money >= 15 },
      { id: 'skip', label: 'Walk the same route but free', description: 'Same streets. Different ambiance.', resultText: 'You walked the same streets in the dark, alone, for free. They were atmospheric enough without the commentary.', effects: { morale: 10, energy: -10 } },
    ],
  },

  {
    id: 'wknd_paranormal',
    title: 'Paranormal Investigation',
    description: 'A group of amateur paranormal investigators needs a sixth person for a Saturday night session in an old warehouse. You\'ve been handed an EMF reader and a very serious clipboard.',
    options: [
      { id: 'investigate', label: 'Take it completely seriously', description: 'Zone B shows unusual EMF readings.', resultText: 'Zone B had readings. Everyone agreed something happened in Zone B. No consensus was reached on what that was.', effects: { morale: 20, energy: -20 } },
      { id: 'skeptic', label: 'Be the healthy skeptic of the group', description: 'Every noise gets a rational explanation.', resultText: 'Three noises, three rational explanations. The team appreciated the scientific counterweight, mostly.', effects: { morale: 15, energy: -15 } },
      { id: 'document', label: 'Film everything for your own purposes', description: 'This footage is gold.', resultText: 'Your footage contains one genuinely unexplainable moment — probably a reflection — but the internet says otherwise.', effects: { morale: 20, energy: -10, money: 30 } },
    ],
  },

  {
    id: 'wknd_crystal_healing',
    title: 'Crystal Healing Workshop',
    description: 'Your neighbor is hosting a crystal healing workshop in their apartment. "Just come for the snacks," they said. You\'ve now been told your third chakra is "concerning."',
    options: [
      { id: 'open_minded', label: 'Engage with genuine curiosity', description: 'The amethyst feels... something.', resultText: 'The amethyst did something. You\'re not sure what. Your third chakra remains a topic of ongoing discussion.', effects: { morale: 15, energy: 10, health: 5 } },
      { id: 'eat_snacks', label: 'Attend but focus on the snacks', description: 'The crystals are nice. The hummus is better.', resultText: 'The hummus was genuinely excellent. The crystals were interesting to look at. A thoroughly pleasant afternoon.', effects: { hunger: 20, morale: 10 } },
      { id: 'buy_crystal', label: 'Buy the "stress relief" obsidian stone', description: 'It\'s a rock. It\'s a very nice rock.', resultText: 'The obsidian is on your desk now. It doesn\'t do anything perceptible. It looks genuinely good though.', effects: { morale: 15, money: -25 }, available: p => p.money >= 25 },
    ],
  },

  {
    id: 'wknd_bigfoot',
    title: 'Bigfoot Hunting Weekend',
    description: 'A Bigfoot hunting group is taking a day trip to the nearby forest. Equipment provided: one pair of binoculars and a strong belief system.',
    options: [
      { id: 'go', label: 'Join the hunt', description: 'You find footprints. Possibly a bear.', resultText: 'You found large prints in the mud. The group spent forty minutes measuring them. Probably a bear. Probably.', effects: { morale: 20, health: 10, energy: -20 } },
      { id: 'guide', label: 'Become the de facto navigator', description: 'You have the only working compass.', resultText: 'You navigated the group to three good vantage points and back without anyone getting lost. A genuine success.', effects: { morale: 15, health: 10, energy: -20 } },
      { id: 'decline', label: 'Politely decline based on "prior commitments"', description: '"The forest and I have history."', resultText: 'You had the day entirely to yourself. You read. You ate well. The forest managed completely without you.', effects: { energy: 15, morale: 5 } },
    ],
  },

  {
    id: 'wknd_vampire_larp',
    title: 'Vampire LARP Accident',
    description: 'You\'ve stumbled into a live-action roleplay event. Everyone is in Victorian vampire costumes and you are wearing jeans. They have offered you a cloak.',
    options: [
      { id: 'join', label: 'Accept the cloak and improvise a character', description: '"I am Count... Gary. I have forgotten my accent."', resultText: 'Count Gary had unclear motivations but excellent posture. You improvised for ninety minutes and surprised yourself.', effects: { morale: 25, energy: -15 } },
      { id: 'watch', label: 'Observe from the edges respectfully', description: 'The lore is surprisingly deep.', resultText: 'The lore goes back seven centuries in-world. The costumes are all handmade. The commitment is entirely genuine.', effects: { morale: 20, energy: -5 } },
      { id: 'challenge', label: 'Challenge the most confident vampire to a duel', description: 'They beat you. It\'s part of the game.', resultText: 'You challenged Lord Blackmere to a duel of words and lost in under a minute. The crowd applauded your defeat warmly.', effects: { morale: 20, energy: -20 } },
    ],
  },

  {
    id: 'wknd_secret_society',
    title: 'Mysterious Invitation',
    description: 'An envelope was slid under your door. Inside: a time, a location, and the words "do not mention the pelican." No other context.',
    options: [
      { id: 'attend', label: 'Show up at the location', description: 'It\'s a book club. Surprisingly intense.', resultText: 'It was a very intense book club. The current read is a 900-page biography of a 17th-century maritime explorer.', effects: { morale: 20, energy: -15, education: 1 } },
      { id: 'ask', label: 'Go but immediately mention the pelican', description: 'Everyone freezes. Someone leaves.', resultText: 'You mentioned the pelican within thirty seconds. One person left immediately. The others watched you with new interest.', effects: { morale: 15, energy: -10 } },
      { id: 'ignore', label: 'Ignore it entirely', description: 'This choice haunts you briefly then you forget.', resultText: 'You never found out what it was. It was probably nothing important. You think about it occasionally.', effects: { energy: 10, morale: 5 } },
    ],
  },

  // ─── ENTERTAINMENT & CULTURE ─────────────────────────────────────────────────

  {
    id: 'wknd_museum',
    title: 'Museum Free Day Chaos',
    description: 'The city museum is free this Saturday. Every person in the city has made the same decision. The dinosaur skeleton is surrounded by a 20-person deep crowd. A child is crying near the meteorite.',
    options: [
      { id: 'brave_crowds', label: 'Brave the main exhibits', description: 'You see 40% of the pterodactyl.', resultText: 'You saw forty percent of the pterodactyl and had one brief, real look at the meteorite through a gap in the crowd.', effects: { morale: 15, energy: -20 } },
      { id: 'side_galleries', label: 'Find the quiet galleries nobody wants', description: 'The ancient pottery room is completely empty.', resultText: 'The ancient pottery room was completely empty and excellent. You spent an hour with no one else in sight.', effects: { morale: 20, energy: -10, education: 1 } },
      { id: 'gift_shop', label: 'Go straight to the gift shop', description: 'A rubber dinosaur and a tin of mints.', resultText: 'The rubber dinosaur lives in your bag now. The mints are good. Zero regrets about any of this.', effects: { morale: 15, money: -15 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_art_gallery',
    title: 'Art Gallery Opening Drama',
    description: 'A gallery opening downtown. Free wine. Intense art. A piece labeled "Untitled #7 (Interior Void)" is a blank white canvas and is selling for $4,000.',
    options: [
      { id: 'engage', label: 'Engage seriously with every piece', description: 'You now have opinions about negative space.', resultText: 'You left with firm opinions about negative space and a genuine emotional response to one of the smaller pieces.', effects: { morale: 20, energy: -15, education: 1 } },
      { id: 'wine', label: 'Focus on the free wine and small talk', description: 'Networking, sort of.', resultText: 'Two glasses, four interesting conversations, one business card. Technically networking. Genuinely pleasant.', effects: { morale: 15, energy: -10 } },
      { id: 'make_art', label: 'Leave and immediately start making art', description: '"If they can do it, so can I."', resultText: 'You went home and drew something. It is not for sale. It exists. You feel better about it than expected.', effects: { morale: 25, energy: -15 } },
    ],
  },

  {
    id: 'wknd_improv',
    title: 'Accidental Improv Volunteer',
    description: 'You went to watch a comedy improv show. The performer has pointed at you. The audience is clapping. You are now in the show.',
    options: [
      { id: 'commit', label: 'Commit completely to the bit', description: 'You play a very convincing Victorian scientist.', resultText: 'You played a Victorian scientist for eight uninterrupted minutes. The audience was warm. The performer bought you a drink.', effects: { morale: 25, energy: -20 } },
      { id: 'minimal', label: 'Do the minimum required to survive', description: '"Yes, and..." you whisper.', resultText: 'You said "yes, and" four times and survived without incident. Minimal participation, maximum dignity preserved.', effects: { morale: 15, energy: -10 } },
      { id: 'refuse', label: 'Politely refuse and sit back down', description: 'The performer respects this. Barely.', resultText: 'The performer respected the no. The audience moved on. You watched the rest from your seat with full dignity intact.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_magic',
    title: 'Magic Show Gone Wrong',
    description: 'A street magician picks you as their volunteer. Your job: hold the rings. You\'re doing it correctly. The trick still isn\'t working. The magician is looking at you differently now.',
    options: [
      { id: 'play_along', label: 'Play along enthusiastically', description: '"Wow! How did that happen!"', resultText: 'You performed the audience role to perfection. The trick eventually worked. There was genuine applause.', effects: { morale: 20, energy: -5 } },
      { id: 'explain', label: 'Explain to the crowd how the trick works', description: 'The magician walks away forever.', resultText: 'You explained the mechanism clearly and completely. The magician packed up and left. You feel no remorse.', effects: { morale: 10, energy: -10 } },
      { id: 'befriend', label: 'Buy the magician a coffee afterward', description: 'You\'re now friends. It\'s complicated.', resultText: 'You had coffee with the magician. He\'s been doing street magic for twelve years. The rings are borrowed from his uncle.', effects: { morale: 25, money: -10 }, available: p => p.money >= 10 },
    ],
  },

  {
    id: 'wknd_flash_mob',
    title: 'Flash Mob Recruitment',
    description: 'A very serious person with a clipboard stops you: "We need one more for the flash mob at 3pm. You\'re the right height. It\'s 14 steps. There\'s no time to explain the theme."',
    options: [
      { id: 'join', label: 'Say yes and learn the 14 steps', description: 'The theme is "accountants through time."', resultText: 'Fourteen steps, the theme was "accountants through time," performed in a pedestrian mall. It worked somehow.', effects: { morale: 25, energy: -20 } },
      { id: 'watch', label: 'Say no but stay to watch', description: 'One person is significantly out of step. Probably would\'ve been you.', resultText: 'One person was two full steps behind the entire time and it was magnificent. You made the right call.', effects: { morale: 20, energy: 5 } },
      { id: 'decline', label: 'Decline and continue your day', description: '"I have plans" (you don\'t).', resultText: 'You continued your day. The flash mob happened three minutes later, twelve feet from where you were standing.', effects: { morale: 5, energy: 10 } },
    ],
  },

  {
    id: 'wknd_chess',
    title: 'Underground Chess Tournament',
    description: 'A back room of a coffee shop hosts a Saturday chess tournament with a $30 entry fee and a $200 prize. The players look deceptively casual.',
    options: [
      { id: 'enter', label: 'Enter the tournament', description: 'Round 1 goes well. Round 2 does not.', resultText: 'Round one: won. Round two: defeated in eleven moves by a retired accountant named Gerald. A $30 education.', effects: { morale: 15, energy: -20, money: -30 }, available: p => p.money >= 30 },
      { id: 'watch', label: 'Watch the final rounds for free', description: 'These people are genuinely terrifying.', resultText: 'The final round was extraordinary. The level of play was genuinely terrifying. You understood about 40% of it.', effects: { morale: 15, energy: -5, education: 1 } },
      { id: 'hustle', label: 'Challenge random people to side games for $5', description: 'You win two and lose three.', resultText: 'Two wins, three losses, five dollars down. You are not yet a chess hustler. The process has meaningfully begun.', effects: { morale: 15, energy: -15, money: -5 } },
    ],
  },

  {
    id: 'wknd_poetry',
    title: 'Spoken Word Night',
    description: 'A bar is hosting spoken word poetry night. The MC asks if anyone has an original piece. You once wrote something in a notebook that you\'ve never shown anyone.',
    options: [
      { id: 'perform', label: 'Read your piece', description: 'It\'s about a parking ticket. It lands surprisingly well.', resultText: 'Your parking ticket poem landed perfectly on the final line. Two people came up afterward. A beginning.', effects: { morale: 25, energy: -15 }, available: p => p.morale >= 35 },
      { id: 'watch', label: 'Watch and appreciate the other performers', description: 'One poem genuinely moves you.', resultText: 'One poem genuinely moved you. You stayed for the whole night and left quieter and better than when you arrived.', effects: { morale: 20, energy: -10, education: 1 } },
      { id: 'heckle', label: 'Heckle supportively ("yeah!" / "preach!")', description: 'People appreciate the energy.', resultText: '"Yeah!" at the right moment, three times. The performers genuinely appreciated the energy. You were a presence.', effects: { morale: 15, energy: -10 } },
    ],
  },

  {
    id: 'wknd_axe_throwing',
    title: 'Axe Throwing Discovery',
    description: 'A new venue in the city: axe throwing. Walk-ins welcome. Safety briefing: 3 minutes. First throw: terrifying. The axe sticks on your fourth try.',
    options: [
      { id: 'play', label: 'Book two rounds and lean in', description: 'By round two you are dangerously comfortable with this.', resultText: 'By round two you were comfortable with axes and that is exactly as alarming as it sounds. A great afternoon.', effects: { morale: 25, energy: -20, money: -35 }, available: p => p.money >= 35 },
      { id: 'one_round', label: 'Do one round and call it done', description: 'Bucket list item: achieved.', resultText: 'First throw: miss. Fourth throw: stick. You left satisfied and with a very specific new confidence.', effects: { morale: 20, energy: -10, money: -20 }, available: p => p.money >= 20 },
      { id: 'decline', label: 'Watch through the window from safety', description: 'Smart.', resultText: 'You watched through the safety glass for twenty minutes. The competence on display was genuinely impressive.', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_trampoline',
    title: 'Adult Trampoline Night',
    description: 'A trampoline park runs an "adults only" session on Saturday nights. You are an adult. You have not been on a trampoline in 15 years. Your body has opinions.',
    options: [
      { id: 'jump', label: 'Jump until physically unable to continue', description: 'Your knees file a formal complaint.', resultText: 'Your knees filed a formal complaint at minute twelve. You continued until minute thirty-five. Completely worth it.', effects: { morale: 25, health: -10, energy: -25, money: -20 }, available: p => p.money >= 20 },
      { id: 'gentle', label: 'Bounce lightly and preserve your dignity', description: 'Still excellent. Still expensive.', resultText: 'You bounced at a dignified pace for forty minutes. It was still genuinely excellent. Dignity: intact.', effects: { morale: 20, energy: -15, money: -20 }, available: p => p.money >= 20 },
      { id: 'decline', label: 'Decide this is a phase you\'ve passed', description: '"I\'m a floor person."', resultText: 'The floor is fine. The floor is correct. You went home and took a long walk, which was also good.', effects: { energy: 15, morale: 5 } },
    ],
  },

  // ─── ACCIDENTAL & RANDOM ─────────────────────────────────────────────────────

  {
    id: 'wknd_viral',
    title: 'Accidental Viral Moment',
    description: 'Someone filmed you doing something completely ordinary and posted it. The clip is now at 40,000 views. The comment section is mostly supportive and partially unhinged.',
    options: [
      { id: 'lean_in', label: 'Lean into the fame, post a follow-up', description: '"The people want more."', resultText: 'You posted a follow-up. It got 30k. The original peaked at 80k. You have a moment now. Use it wisely.', effects: { morale: 25, energy: -10, money: 60 } },
      { id: 'ignore', label: 'Ignore it and let it pass', description: 'It peaks at 80k and disappears.', resultText: 'It peaked at 80k and disappeared in three days. The comment section was mostly kind. You are unchanged.', effects: { morale: 15, energy: 5 } },
      { id: 'request_removal', label: 'Ask for it to be taken down', description: 'It gets screenshotted first.', resultText: 'It got screenshotted before the takedown request went through. The screenshot is still circulating, mildly.', effects: { morale: 5, energy: -10 } },
    ],
  },

  {
    id: 'wknd_celebrity',
    title: 'Celebrity Sighting',
    description: 'You recognize a moderately famous person at the coffee shop. They\'re clearly trying to be normal. They\'ve made brief eye contact with you, which is probably not an invitation.',
    options: [
      { id: 'approach', label: 'Approach and say something human', description: '"I like your work" and then you leave. Well done.', resultText: 'You said "I like your work" and left immediately. They smiled. That was exactly the correct amount of interaction.', effects: { morale: 20, energy: -5 } },
      { id: 'stare', label: 'Stare from across the room in a way they notice', description: 'Awkward for everyone involved.', resultText: 'They noticed the staring. You pretended to look at your phone. The situation resolved itself awkwardly for everyone.', effects: { morale: 5, energy: -5 } },
      { id: 'photo', label: 'Try to get a photo without being weird about it', description: 'Mixed success.', resultText: 'You got a photo that is mostly the back of their shoulder and part of a menu. It still counts.', effects: { morale: 15, energy: -5 } },
    ],
  },

  {
    id: 'wknd_lost_dog',
    title: 'The Lost Dog',
    description: 'A golden retriever has been following you for four blocks. It has no collar. It seems to believe you are its person. It is wrong, but it\'s very committed.',
    options: [
      { id: 'keep_following', label: 'Let it follow you home while you figure it out', description: 'You now temporarily have a dog.', resultText: 'It followed you home. You fed it. You found the owner on the neighborhood app three hours later. The dog was unbothered.', effects: { morale: 25, energy: -10 } },
      { id: 'shelter', label: 'Take it to the animal shelter immediately', description: 'Responsible. The dog seems betrayed.', resultText: 'The shelter scanned it for a chip. Owner contacted within an hour. Reunion achieved. The dog still looked betrayed.', effects: { morale: 15, energy: -15 } },
      { id: 'post', label: 'Post on the neighborhood app and wait', description: 'Its owner arrives in 20 minutes.', resultText: 'The owner arrived in twenty minutes, enormously relieved. The dog was immediately distracted by a nearby squirrel.', effects: { morale: 20, energy: -5 } },
    ],
  },

  {
    id: 'wknd_wrong_package',
    title: 'The Wrong Package',
    description: 'A package arrived for someone else. It contains: one formal suit, one rubber duck, one bag of coffee from a country that doesn\'t export coffee, and a handwritten note that just says "good luck."',
    options: [
      { id: 'return', label: 'Return it to the correct address', description: 'The recipient stares at you for a long time.', resultText: 'You returned it. The recipient stared at you for a very long time and said "good luck" in return. Unsettling.', effects: { morale: 15, energy: -10 } },
      { id: 'open', label: 'Already opened it — own the consequences', description: 'You now have a rubber duck.', resultText: 'You now have a rubber duck. It lives by the sink. You have decided this is an acceptable outcome.', effects: { morale: 15, energy: -5 } },
      { id: 'keep', label: 'Keep the coffee, return the rest', description: 'The coffee is actually excellent.', resultText: 'The coffee was genuinely, unexpectedly excellent. You returned the rest without guilt. Good call.', effects: { morale: 20, energy: 10, hunger: 10 } },
    ],
  },

  {
    id: 'wknd_motivational',
    title: 'Motivational Speaker Ambush',
    description: 'A motivational speaker has set up in the community hall. They saw you walking by and are now making direct eye contact while saying "YOU are the change you seek." You are frozen.',
    options: [
      { id: 'sit', label: 'Sit down and absorb the whole session', description: 'You leave with three new personal mantras.', resultText: 'You absorbed three mantras: "Forward is forward," "The process is the destination," and one about tides.', effects: { morale: 20, energy: -15 } },
      { id: 'ask', label: 'Raise your hand and ask a challenging question', description: '"Define \'seek.\'"', resultText: 'You asked them to define "seek." They took eight full minutes. The definition remained genuinely unclear.', effects: { morale: 15, energy: -10 } },
      { id: 'walk', label: 'Maintain eye contact while slowly backing away', description: 'The speaker sees this as growth.', resultText: 'You backed out slowly, maintaining full eye contact. The speaker said "That\'s growth." They weren\'t entirely wrong.', effects: { morale: 10, energy: 10 } },
    ],
  },

  {
    id: 'wknd_podcast',
    title: 'Podcast Recording Ambush',
    description: 'Two people with a microphone and earnest expressions ask if you\'d like to be on their podcast: "Humans of This Specific Street." It has 200 listeners. You are a person.',
    options: [
      { id: 'agree', label: 'Agree and talk for 20 minutes', description: 'Your philosophy of breakfast becomes episode 47.', resultText: 'Episode 47: your complete philosophy of breakfast. Thirty-two minutes long. Two hundred people heard it.', effects: { morale: 20, energy: -15 } },
      { id: 'short', label: 'Do a quick two-minute spot', description: 'Good content. Limited exposure.', resultText: 'Two minutes on your commute. Good content. You are satisfied with the scope of your public exposure.', effects: { morale: 15, energy: -5 } },
      { id: 'decline', label: 'Decline with warmth', description: '"I\'m more of a listener."', resultText: 'You declined warmly and they respected it completely. You caught part of the episode later. It was genuinely good.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_community_theater',
    title: 'Community Theater Emergency',
    description: 'The community theater\'s lead actor has dropped out an hour before showtime. The director is looking at you with desperation. The script has 15 pages. The audience is arriving.',
    options: [
      { id: 'do_it', label: 'Accept the role with the script in hand', description: 'You improvise 30% of the lines. Nobody can tell.', resultText: 'You improvised thirty percent of the lines and the director said "you made it your own." You take that as a compliment.', effects: { morale: 30, energy: -25 } },
      { id: 'understudy', label: 'Offer to help backstage instead', description: 'You become the most important person with a headset.', resultText: 'Headset, cue sheets, calling entries from the wings. You were the most important person nobody could see.', effects: { morale: 20, energy: -15 } },
      { id: 'decline', label: 'Wish them luck and leave', description: '"I believe in you all."', resultText: 'You wished them luck and they found someone. The production received a good review. You feel fine about all of it.', effects: { morale: 5, energy: 10 } },
    ],
  },

  {
    id: 'wknd_competitive_ironing',
    title: 'Competitive Ironing Discovery',
    description: 'Extreme ironing is a real sport where people iron clothes in challenging locations. The local club is ironing at the skate park this weekend. An iron is available for you.',
    options: [
      { id: 'participate', label: 'Iron something at the skate park', description: 'Your form is unconventional but the shirt looks great.', resultText: 'Your form was entirely unconventional. The iron was hot. The shirt is genuinely smooth. No regrets.', effects: { morale: 25, energy: -15 } },
      { id: 'watch', label: 'Watch with growing respect', description: 'The technique is legitimately impressive.', resultText: 'The technique at the skate park was legitimately impressive and you are now a convert to extreme ironing.', effects: { morale: 20, energy: 5 } },
      { id: 'challenge', label: 'Challenge the best ironer to a head-to-head', description: 'You lose comprehensively but the crowd appreciates your confidence.', resultText: 'You lost comprehensively to someone ironing while riding a halfpipe. The crowd was very supportive about it.', effects: { morale: 20, energy: -20 } },
    ],
  },

  {
    id: 'wknd_cat_cafe',
    title: 'Cat Cafe Session',
    description: 'The new cat cafe charges $12/hour. There are 8 cats and only you and one other person. One cat has decided to sit on your bag and refuses to move.',
    options: [
      { id: 'stay_full', label: 'Stay for the full hour', description: 'Three cats. Simultaneous. Worth it.', resultText: 'Three cats simultaneously — one in your lap, one on your arm, one watching from a high shelf. One hour very well spent.', effects: { morale: 25, health: 5, energy: 10, money: -12 }, available: p => p.money >= 12 },
      { id: 'let_cat_stay', label: 'Let the cat on your bag stay forever', description: 'The staff gently intervenes after 90 minutes.', resultText: 'The cat was on your bag for ninety minutes. The staff gently relocated it. You stayed thirty minutes more anyway.', effects: { morale: 30, money: -18 }, available: p => p.money >= 18 },
      { id: 'pass', label: 'Watch through the window (it\'s also charming)', description: 'Free cats. Glass cats.', resultText: 'You watched through the window for twenty minutes. Glass cats are still cats. It was still good.', effects: { morale: 15, energy: 5 } },
    ],
  },

  {
    id: 'wknd_rollerderby',
    title: 'Roller Derby Night',
    description: 'You\'ve bought a ticket to a local roller derby bout. The sport is faster and more strategic than you expected. Someone on the team is called "Wrecking Bawl." She is frightening.',
    options: [
      { id: 'watch_full', label: 'Watch the full match and learn the rules', description: 'You leave a devoted fan.', resultText: 'You learned the scoring system by round two. You left a devoted and slightly terrified fan of the sport.', effects: { morale: 25, energy: -10, money: -15 }, available: p => p.money >= 15 },
      { id: 'cheer', label: 'Pick a team and cheer loudly the whole time', description: 'Your team wins. You feel personally responsible.', resultText: 'Your team won. You cheer-led with complete commitment. You feel personally, meaningfully responsible for this outcome.', effects: { morale: 25, energy: -15, money: -15 }, available: p => p.money >= 15 },
      { id: 'ask_tryout', label: 'Ask about tryouts after the match', description: 'They hand you a flyer. Your life may be changing.', resultText: 'They gave you a flyer and a serious look. The tryout is in three weeks. Your life may genuinely be changing.', effects: { morale: 20, health: 5, money: -15 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_urban_kayaking',
    title: 'Urban Kayak Rental',
    description: 'The city has launched a kayak rental service on the river. It\'s $25 for two hours. The river goes through downtown. You will pass directly under three office buildings.',
    options: [
      { id: 'kayak', label: 'Rent a kayak and paddle through downtown', description: 'The view from the water is genuinely different.', resultText: 'You paddled under three office bridges and waved at two people on phone calls who did not wave back. Still excellent.', effects: { morale: 25, health: 15, energy: -20, money: -25 }, available: p => p.money >= 25 },
      { id: 'watch', label: 'Watch from the bridge instead', description: 'Free. Less wet.', resultText: 'The view from the bridge was good. You watched five kayakers pass beneath you in twenty minutes. Free and dry.', effects: { morale: 10, energy: 5 } },
      { id: 'canoe', label: 'Upgrade to a tandem canoe alone', description: 'You spin in circles for 40 minutes. Still excellent.', resultText: 'You spun in circles for the first twenty minutes. By the second hour you had a system. Still entirely worth it.', effects: { morale: 20, health: 10, energy: -25, money: -35 }, available: p => p.money >= 35 },
    ],
  },

  {
    id: 'wknd_flea_market',
    title: 'The Great Flea Market',
    description: 'A giant flea market. Thousands of tables. Unknown treasures and unknown amounts of old printers. You have a budget and a vague sense of purpose.',
    options: [
      { id: 'strategic', label: 'Shop strategically with a list', description: 'Rare vinyl. Good price.', resultText: 'You found rare vinyl at a good price and left before the four-hour spiral could take hold. Disciplined.', effects: { morale: 20, money: -30, energy: -15 }, available: p => p.money >= 30 },
      { id: 'browse', label: 'Browse for four hours buying nothing', description: 'You carry nothing but have seen everything.', resultText: 'You walked every row. You bought nothing. You have now seen everything this market has to offer. Twice.', effects: { morale: 15, energy: -20 } },
      { id: 'resell', label: 'Buy low-value items and try to flip them', description: 'Mixed results. Net: -$5. Educational.', resultText: 'Down five dollars, up considerably in knowledge about what low-value things are actually worth in practice.', effects: { morale: 15, energy: -20, money: -5 } },
    ],
  },

  {
    id: 'wknd_neighborhood_watch',
    title: 'Neighborhood Watch Emergency',
    description: 'The neighborhood watch has called an emergency meeting. The situation: someone has been leaving incredibly well-crafted chalk art on the sidewalk without asking permission. Half the street thinks it\'s illegal. Half thinks it\'s wonderful.',
    options: [
      { id: 'defend_art', label: 'Defend the chalk artist passionately', description: 'It\'s chalk. It rains.', resultText: 'You gave a three-minute speech about chalk and weather. Half the room applauded. The other half filed something.', effects: { morale: 20, energy: -10 } },
      { id: 'report', label: 'Side with order and file a formal notice', description: 'You are the villain of the story.', resultText: 'You filed the notice. The chalk was gone by Thursday. You are now the villain in at least two separate accounts of this.', effects: { morale: -5, energy: -5 } },
      { id: 'add_chalk', label: 'Add your own art to the sidewalk that night', description: 'You contribute a very large sun.', resultText: 'You added a very large sun to the sidewalk at 10pm. It rained Thursday. Everyone moved on. The sun was good.', effects: { morale: 25, energy: -15 } },
    ],
  },

  {
    id: 'wknd_spa',
    title: 'The Accidental Spa Day',
    description: 'You meant to book a 30-minute massage. The receptionist misunderstood and you\'ve been booked for a full four-hour spa package. The price difference is significant.',
    options: [
      { id: 'full_package', label: 'Do the full package, no regrets', description: 'You are genuinely a different person afterward.', resultText: 'Four hours. Three treatments. One very long silence in a dark room. You emerged a different person, as promised.', effects: { health: 25, morale: 25, energy: 20, money: -120 }, available: p => p.money >= 120 },
      { id: 'half', label: 'Do two hours and leave early', description: 'Good. Sustainable.', resultText: 'Two hours of genuine restoration. You left early with full dignity and significantly less tension in your shoulders.', effects: { health: 15, morale: 20, energy: 15, money: -60 }, available: p => p.money >= 60 },
      { id: 'just_massage', label: 'Clarify the booking and get just the massage', description: 'They are very understanding.', resultText: 'Thirty minutes, clearly explained, professionally delivered. Exactly what was needed and nothing more.', effects: { health: 10, morale: 15, energy: 10, money: -30 }, available: p => p.money >= 30 },
    ],
  },

  {
    id: 'wknd_documentary',
    title: 'You Are in a Documentary',
    description: 'A documentary crew is filming "everyday life in the city." They\'d like to follow you for a Saturday. Six hours. They\'re very professional. You had no plans.',
    options: [
      { id: 'yes', label: 'Agree and live your best normal Saturday', description: 'The mundane becomes art.', resultText: 'You lived a completely normal Saturday while being filmed professionally. They used nine minutes of your day.', effects: { morale: 25, energy: -15, money: 50 } },
      { id: 'refuse', label: 'Decline on privacy grounds', description: 'They film someone else. The someone else seems interesting.', resultText: 'They filmed someone else who turned out to be extremely interesting. You feel fine about this. Mostly.', effects: { energy: 15, morale: 5 } },
      { id: 'perform', label: 'Agree but invent elaborate plans for the day', description: '"I always go to the cheese museum on Saturdays."', resultText: 'You visited four places you invented for the camera. The cheese museum was improvised brilliantly.', effects: { morale: 20, energy: -20, money: 40 } },
    ],
  },

  {
    id: 'wknd_sunrise',
    title: 'Spontaneous Sunrise Watch',
    description: 'Your alarm goes off by accident at 5am and you\'re now wide awake. The sunrise happens at 5:43. The roof of your building is technically accessible.',
    options: [
      { id: 'roof', label: 'Go to the roof and watch the sunrise', description: 'Genuinely beautiful. Worth the alarm.', resultText: 'You watched the sun come up over the city entirely alone. It was genuinely, quietly very good.', effects: { morale: 20, health: 5, energy: -5 } },
      { id: 'park', label: 'Walk to the park and watch it there', description: 'You have the park to yourself.', resultText: 'The park was completely empty. The light was excellent. You had the grass to yourself for twenty minutes.', effects: { morale: 25, health: 10, energy: -10 } },
      { id: 'sleep', label: 'Go back to sleep', description: 'Good decision. No regrets.', resultText: 'You went back to sleep immediately and woke at 9am feeling entirely correct about the decision.', effects: { energy: 20, morale: 5 } },
    ],
  },

  {
    id: 'wknd_book_fair',
    title: 'The Enormous Book Fair',
    description: 'A massive used book fair at the exhibition center. $1 per paperback, $3 per hardback. You have $20 and limited shelf space and absolutely no discipline.',
    options: [
      { id: 'limit', label: 'Set a strict budget and stick to it', description: 'Six books. A good haul.', resultText: 'Six books within budget. Two look very good. One is questionable. You are thoroughly satisfied.', effects: { education: 1, morale: 20, money: -20, energy: -15 }, available: p => p.money >= 20 },
      { id: 'browse', label: 'Browse without buying', description: 'Willpower used to maximum effect.', resultText: 'You walked every aisle. You touched many covers. You left with nothing and felt the full weight of restraint.', effects: { education: 1, morale: 10, energy: -10 } },
      { id: 'bag_deal', label: 'Pay for the "fill a bag for $15" deal', description: 'Seventeen books. One structural concern with your bag.', resultText: 'Seventeen books. The bag held. One seam is concerning. You have reading material for several comfortable months.', effects: { education: 1, morale: 25, money: -15, energy: -20 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_street_food',
    title: 'The International Street Food Weekend',
    description: 'A street food festival celebrating 20 different cuisines. You have $30, a strong stomach, and no plan. Every booth smells amazing in a different way.',
    options: [
      { id: 'ambitious', label: 'Try ten different dishes across ten cuisines', description: 'Incredible. Ambitious. You regret nothing.', resultText: 'Ten dishes, ten cuisines. You still think about the fourth one. Something happened at that booth.', effects: { hunger: 40, morale: 25, money: -30, health: -5, energy: -10 }, available: p => p.money >= 30 },
      { id: 'focused', label: 'Pick three dishes from cuisines you don\'t know', description: 'Deliberate. Educational.', resultText: 'Three cuisines you\'d never tried. One was remarkable. You learned two things you didn\'t know before.', effects: { hunger: 30, morale: 20, money: -18, education: 1 }, available: p => p.money >= 18 },
      { id: 'safe', label: 'Find something familiar and eat well', description: 'The pierogi line moves fast.', resultText: 'The pierogi were excellent and the line moved fast. A reliable choice that delivered fully on its promise.', effects: { hunger: 25, morale: 15, money: -12 }, available: p => p.money >= 12 },
    ],
  },

  {
    id: 'wknd_fitness_disaster',
    title: 'Fitness Challenge Sign-Up',
    description: 'A fitness studio is offering a free "try before you buy" class this Saturday. You didn\'t check what type of class it was. It\'s advanced aerial yoga. You are not flexible.',
    options: [
      { id: 'attempt', label: 'Attempt the full class with dignity', description: 'You complete approximately 40% of the moves. The instructor is supportive.', resultText: 'Forty percent of the moves, executed with full dignity. The instructor was genuinely supportive throughout.', effects: { health: 10, morale: 15, energy: -25 } },
      { id: 'modify', label: 'Ask for the modified version of every pose', description: 'Smart. Safe. Still exhausting.', resultText: 'The modified version was still genuinely difficult. You completed all of it. You feel it in places you forgot existed.', effects: { health: 10, morale: 20, energy: -20 } },
      { id: 'leave', label: 'Leave after the warm-up citing "a commitment"', description: 'You have no such commitment. The instructor understands.', resultText: 'You left after the warm-up and went for a walk instead. The warm-up alone was honestly quite informative.', effects: { morale: 5, energy: -5 } },
    ],
  },

  {
    id: 'wknd_astronomy',
    title: 'Rooftop Stargazing Night',
    description: 'An astronomy club is running a rooftop stargazing session. Equipment provided. The city light pollution is significant but Jupiter is clearly visible.',
    options: [
      { id: 'attend', label: 'Attend the full session', description: 'You identify Jupiter, Orion, and one satellite.', resultText: 'You identified Jupiter, confirmed Orion, and spotted one satellite that someone suggested might be the ISS.', effects: { morale: 20, energy: -10, education: 1 } },
      { id: 'telescope', label: 'Get time on the big telescope specifically', description: 'Saturn\'s rings. Actual Saturn\'s rings.', resultText: 'Saturn\'s rings. Actual Saturn\'s rings, clearly visible. You stared for three full minutes without speaking.', effects: { morale: 25, energy: -10, education: 1 } },
      { id: 'own_way', label: 'Lie on a blanket and just look up without equipment', description: 'Ancient and correct.', resultText: 'You lay on the grass and looked up for an hour without equipment. Ancient and correct and genuinely very good.', effects: { morale: 20, health: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_language_class',
    title: 'Free Language Taster Class',
    description: 'A language school is offering free one-hour taster sessions this Saturday for 12 different languages. You can try as many as you want. The Japanese class is full.',
    options: [
      { id: 'one', label: 'Pick one language and focus seriously', description: 'You can now say five sentences in Portuguese.', resultText: 'You can now say five sentences in Portuguese with reasonable confidence. The pronunciation needs work.', effects: { education: 1, morale: 15, energy: -15 } },
      { id: 'three', label: 'Do three languages in one morning', description: 'Your brain is a buffet of grammatical structures.', resultText: 'Your brain held three grammatical frameworks simultaneously. It is currently resting and should be left alone.', effects: { education: 1, morale: 20, energy: -25 } },
      { id: 'hardest', label: 'Sign up for the hardest-looking one', description: 'You chose Mandarin. Brave.', resultText: 'You chose Mandarin. You can now say hello and thank you with confidence. The rest is a significant journey.', effects: { education: 1, morale: 20, energy: -20 } },
    ],
  },

  {
    id: 'wknd_farmer_stay',
    title: 'The Farm Exchange Program',
    description: 'You\'ve won a free weekend spot at a working farm through a city-run exchange program you vaguely remember signing up for. They need help. The work starts at 6am.',
    options: [
      { id: 'go', label: 'Go and work the full day', description: 'You feed chickens, fix a fence, and eat the best dinner of your life.', resultText: 'You fed chickens, fixed a fence, and ate a dinner made from things that were alive this morning. Life-changing.', effects: { health: 20, morale: 20, hunger: 35, energy: -30 } },
      { id: 'morning_only', label: 'Go for the morning and leave after lunch', description: 'Dignified. The chickens seem fine.', resultText: 'Half a day of real farm work and one genuinely excellent lunch. The chickens seemed fine with your early exit.', effects: { health: 10, morale: 15, hunger: 25, energy: -15 } },
      { id: 'cancel', label: 'Cancel and stay in bed', description: 'Reasonable. The farm continues without you.', resultText: 'You slept until 9am. The farm continued entirely without you. You made eggs from the supermarket. They were fine.', effects: { energy: 20, morale: 5 } },
    ],
  },

  {
    id: 'wknd_meditation',
    title: 'The Questionable Meditation Retreat',
    description: 'A one-day urban meditation retreat for $25. The brochure promises "inner peace" and "a journey to your true self." The venue is a repurposed parking garage.',
    options: [
      { id: 'full', label: 'Commit to the full day', description: 'Four hours in, something genuinely clicks.', resultText: 'Four hours in a repurposed parking garage. Something clicked around hour three. You don\'t know what, but something.', effects: { health: 10, morale: 25, energy: 15, money: -25 }, available: p => p.money >= 25 },
      { id: 'morning', label: 'Do the morning session only', description: 'Half a journey. Still worth it.', resultText: 'Two hours of silence and mild discomfort followed by one genuine moment of real quiet. Worth every cent.', effects: { health: 5, morale: 15, energy: 10, money: -15 }, available: p => p.money >= 15 },
      { id: 'free_version', label: 'Meditate at home for free', description: 'You fall asleep in 12 minutes. Still restful.', resultText: 'You meditated at home and fell asleep in twelve minutes. Still genuinely restful. Entirely free.', effects: { health: 5, morale: 10, energy: 20 } },
    ],
  },

  {
    id: 'wknd_rest',
    title: 'The Unscheduled Weekend',
    description: 'No plans. No obligations. A rare and confusing situation. The couch is available. The city is outside. Both are valid choices.',
    options: [
      { id: 'rest', label: 'Rest aggressively — do nothing on purpose', description: 'Revolutionary.', resultText: 'You did nothing, deliberately, for an entire weekend. You feel slightly guilty and enormously, deeply restored.', effects: { energy: 30, morale: 15, hunger: -10 } },
      { id: 'explore', label: 'Wander the city with no destination', description: 'You find a street you\'ve never been on. There\'s a small mural.', resultText: 'You found a street you\'d never been on. There was a small mural of a bird. You sat near it for a while.', effects: { morale: 20, health: 5, energy: -10 } },
      { id: 'productive', label: 'Tackle one thing you\'ve been putting off', description: 'The tax forms are done. You feel lighter.', resultText: 'You completed the tax forms and cleaned one drawer. Light. Accomplished. Done.', effects: { morale: 20, energy: -15 } },
    ],
  },

  {
    id: 'wknd_picnic_swans',
    title: 'Picnic Ambushed by Swans',
    description: 'Perfect picnic spot in the park. Blue sky. Good sandwiches. Then: a swan. Then: more swans. They are not asking. They are advancing.',
    options: [
      { id: 'retreat', label: 'Retreat with dignity and the sandwiches', description: '"The park is theirs on Saturdays."', resultText: 'You retreated with full dignity and the sandwiches. You found a different bench. The sandwiches were excellent.', effects: { hunger: 20, morale: 10, energy: -5 } },
      { id: 'stand_ground', label: 'Stand your ground — this is your picnic', description: 'A standoff lasting 15 minutes. You win, but barely.', resultText: 'A fifteen-minute standoff. One swan blinked first. You ate the sandwiches in peace, victorious and slightly trembling.', effects: { hunger: 20, morale: 20, energy: -10 } },
      { id: 'offer', label: 'Offer the swans a corner of your sandwich', description: 'This was a mistake. More swans arrive.', resultText: 'You offered a corner of your sandwich. Six more swans arrived within two minutes. You retreated without the sandwich.', effects: { hunger: 10, morale: 20, energy: -15 } },
    ],
  },

  {
    id: 'wknd_impersonator_con',
    title: 'Celebrity Impersonator Convention',
    description: 'A convention for celebrity impersonators is happening downtown. Entry is $10. Inside: four Elvises, two Beyoncés, and one person who claims to be impersonating "a feeling."',
    options: [
      { id: 'attend', label: 'Attend and take it very seriously', description: 'The craft is real.', resultText: 'The craft was entirely genuine. Four Elvises, two Beyoncés, and one person who became a feeling. A real afternoon.', effects: { morale: 25, energy: -10, money: -10 }, available: p => p.money >= 10 },
      { id: 'enter_contest', label: 'Enter the amateur impersonation competition', description: 'You do your best impression of "confident." It goes okay.', resultText: 'You did your best impression of "confident." It was judged middle tier. A fair and accurate assessment.', effects: { morale: 20, energy: -15, money: -10 }, available: p => p.money >= 10 },
      { id: 'feeling', label: 'Track down the "feeling" impersonator', description: 'Profound conversation. Unresolved.', resultText: 'The "feeling" impersonator was representing "the specific anxiety of a Sunday afternoon." Profound. Still unresolved.', effects: { morale: 20, energy: -10, money: -10 }, available: p => p.money >= 10 },
    ],
  },

  {
    id: 'wknd_doomscroll',
    title: 'Social Media Detox (Attempted)',
    description: 'You\'ve decided to spend the weekend off social media. The first hour is peaceful. The second hour you wonder what you\'re missing. By hour three you\'ve reorganized your kitchen.',
    options: [
      { id: 'full_detox', label: 'Commit to the full weekend offline', description: 'You finish two books and feel smug.', resultText: 'Forty-eight hours offline. Two books finished. A kitchen reorganized. You feel smug and genuinely well-rested.', effects: { health: 10, morale: 20, energy: 15, education: 1 } },
      { id: 'partial', label: 'Limit yourself to 30 minutes a day', description: 'Moderate. Achievable. Still annoying.', resultText: 'Thirty minutes a day, enforced. You missed nothing important. You know this now. It helped moderately.', effects: { health: 5, morale: 15, energy: 10 } },
      { id: 'give_in', label: 'Give up by Saturday afternoon', description: 'You were gone for 14 hours. The internet missed nothing.', resultText: 'You lasted fourteen hours. The internet had continued without you and nothing had changed. You scrolled for two hours.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_talent_show',
    title: 'Neighborhood Talent Show',
    description: 'The community center is running a neighborhood talent show. First prize: $100. The competition includes a 9-year-old who plays violin and a retired teacher who does card tricks.',
    options: [
      { id: 'enter', label: 'Enter with an actual skill', description: 'You do something confidently.', resultText: 'You performed something confidently. You placed second to the nine-year-old. That was the correct outcome.', effects: { morale: 25, energy: -20, money: 100 } },
      { id: 'watch', label: 'Watch as an enthusiastic audience member', description: 'The 9-year-old wins. Obviously. Correctly.', resultText: 'The nine-year-old won. Correctly. Deservedly. You clapped longest and with the most genuine sincerity.', effects: { morale: 20, energy: -5 } },
      { id: 'volunteer', label: 'Volunteer to run the event backstage', description: 'Thankless but important.', resultText: 'You ran lights and cue cards for three hours. Nobody thanked you. The show was genuinely good. That\'s enough.', effects: { morale: 15, energy: -20 } },
    ],
  },
];

export function pickRandomWeekendEvent(): WeekendEvent {
  return ALL_WEEKEND_EVENTS[Math.floor(Math.random() * ALL_WEEKEND_EVENTS.length)];
}
