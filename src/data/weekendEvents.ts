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
      { id: 'sing', label: 'Belt out a classic', description: 'Full commitment. Zero shame.', effects: { morale: 20, energy: -20, hunger: -10 } },
      { id: 'duet', label: 'Force someone into a duet', description: 'Shared trauma is half the trauma.', effects: { morale: 15, energy: -10 }, available: p => p.morale >= 30 },
      { id: 'escape', label: 'Fake an emergency and leave', description: '"My houseplant is on fire."', effects: { morale: -10, energy: 15 } },
    ],
  },

  {
    id: 'wknd_trivia',
    title: 'Bar Trivia Night',
    description: 'The local pub is hosting its weekly trivia night. First prize is $50. Last prize is humiliation. You\'ve already paid for a drink.',
    options: [
      { id: 'compete', label: 'Compete seriously', description: 'You did watch a lot of documentaries.', effects: { morale: 15, energy: -15, money: 50, hunger: -10 }, available: p => p.education >= 1 },
      { id: 'phone', label: 'Quietly use your phone', description: 'Is it cheating if nobody catches you?', effects: { morale: 10, energy: -10, money: 20, hunger: -10 } },
      { id: 'drink', label: 'Just drink and heckle', description: 'The real quiz was the friends we made.', effects: { morale: 10, energy: -20, money: -30, hunger: 10 } },
    ],
  },

  {
    id: 'wknd_speed_dating',
    title: 'Speed Dating at the Brewery',
    description: 'A friend signed you up for speed dating without asking. You have exactly 3 minutes per person to convince a stranger you\'re interesting.',
    options: [
      { id: 'honest', label: 'Be completely honest', description: 'Refreshing or repellent — 50/50.', effects: { morale: 15, energy: -15, money: -20 } },
      { id: 'fictional', label: 'Invent a better version of yourself', description: '"I\'m a yacht captain who also sculpts."', effects: { morale: 20, energy: -20, money: -20 } },
      { id: 'bail', label: 'Eat the free snacks and leave early', description: 'A win, technically.', effects: { morale: 5, hunger: 20, money: -15, energy: 10 } },
    ],
  },

  {
    id: 'wknd_house_party',
    title: "Neighbor's Rager",
    description: 'The neighbors are throwing an enormous party and the music is already at structural-damage levels. You\'ve been personally invited through the shared wall.',
    options: [
      { id: 'join', label: 'Join the party', description: 'If you can\'t beat them...', effects: { morale: 20, energy: -25, money: -20, hunger: 10 } },
      { id: 'complain', label: 'File a noise complaint', description: 'You become a local villain overnight.', effects: { morale: -5, energy: 10 } },
      { id: 'earplugs', label: 'Put in earplugs and sleep through it', description: 'Rest, interrupted.', effects: { energy: 20, morale: -5 } },
    ],
  },

  {
    id: 'wknd_comedy',
    title: 'Open Mic Comedy Night',
    description: 'You somehow end up at an open mic comedy night. The MC is staring directly at you and asking if anyone wants to try a set.',
    options: [
      { id: 'perform', label: 'Get up and do 5 minutes', description: 'You have two good jokes and a story about a pigeon.', effects: { morale: 20, energy: -20 }, available: p => p.morale >= 40 },
      { id: 'watch', label: 'Watch and heckle strategically', description: 'The audience is on your side.', effects: { morale: 15, energy: -10, money: -15 } },
      { id: 'leave', label: 'Quietly exit during the applause', description: 'Tactical retreat.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_escape_room',
    title: 'Escape Room Disaster',
    description: 'Your group has 60 minutes to escape the "Haunted Lighthouse" room. 55 minutes in, nobody has found the first clue.',
    options: [
      { id: 'try', label: 'Redouble your efforts', description: 'The answer is definitely behind that painting.', effects: { morale: 10, energy: -20, money: -25 } },
      { id: 'cheat', label: 'Ask for unlimited hints', description: 'You ruin the immersion but escape with your dignity.', effects: { morale: 5, energy: -15, money: -25 } },
      { id: 'give_up', label: 'Accept defeat gracefully', description: '"We let the lighthouse win today."', effects: { morale: 5, energy: -10, money: -25 } },
    ],
  },

  {
    id: 'wknd_silent_disco',
    title: 'Silent Disco Confusion',
    description: 'You\'ve accidentally joined a silent disco. Everyone is dancing intensely to music only they can hear. You have no headphones.',
    options: [
      { id: 'fake', label: 'Dance confidently to nothing', description: 'Commit to the bit.', effects: { morale: 20, energy: -20 } },
      { id: 'borrow', label: 'Borrow headphones from someone', description: 'DJ 3 is playing yacht rock. This is fine.', effects: { morale: 15, energy: -15, money: -10 } },
      { id: 'watch', label: 'Document it from the sidelines', description: 'This needs to be on the internet.', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_cocktail',
    title: 'Cocktail Masterclass',
    description: 'A local bar is offering a Saturday cocktail-making class for $40. You\'ll learn three recipes and go home either enlightened or sticky.',
    options: [
      { id: 'attend', label: 'Sign up and learn properly', description: 'You\'re basically a mixologist now.', effects: { morale: 20, energy: -10, money: -40 }, available: p => p.money >= 40 },
      { id: 'watch_free', label: 'Watch from the bar for free', description: 'Observational learning.', effects: { morale: 10, energy: -10, money: -20 } },
      { id: 'skip', label: 'Make drinks at home instead', description: 'Same result, lower standards.', effects: { morale: 10, money: -15, hunger: 10 } },
    ],
  },

  {
    id: 'wknd_bowling',
    title: 'Midnight Bowling League',
    description: 'A work acquaintance has a spare spot in their midnight bowling league. Rental shoes are mandatory. The carpet is aggressively patterned.',
    options: [
      { id: 'bowl', label: 'Bowl your heart out', description: 'Three gutter balls and then a strike. Classic arc.', effects: { morale: 20, energy: -20, money: -15, hunger: -10 } },
      { id: 'competitive', label: 'Take it unnervingly seriously', description: 'You brought your own shoes.', effects: { morale: 15, energy: -25, money: -30, health: 5 } },
      { id: 'sit_out', label: 'Score-keep and eat nachos', description: 'The supporting role has nachos.', effects: { morale: 10, hunger: 25, money: -20 } },
    ],
  },

  {
    id: 'wknd_bingo',
    title: 'Retirement Home Bingo Night',
    description: 'You volunteered to help at the community center. The activity: competitive bingo. The stakes: bragging rights and a fruit basket. The competition: genuinely ferocious.',
    options: [
      { id: 'compete', label: 'Play to win', description: 'You want that fruit basket.', effects: { morale: 20, energy: -10, money: 30, hunger: 15 } },
      { id: 'volunteer', label: 'Help call the numbers', description: 'B-12! As in the vitamin!', effects: { morale: 15, energy: -5 } },
      { id: 'chat', label: 'Just talk to people', description: 'Turns out Edna was a competitive swimmer.', effects: { morale: 20, energy: 5, health: 5 } },
    ],
  },

  // ─── OUTDOOR & NATURE ────────────────────────────────────────────────────────

  {
    id: 'wknd_hiking',
    title: 'Hiking "Shortcut" Discovery',
    description: 'You\'re on a trail. The map app has confidently led you to a gap in a fence labeled "not a trail." On the other side: possibly a better view, or a swamp.',
    options: [
      { id: 'shortcut', label: 'Take the shortcut', description: 'Adventure awaits. Maybe also mud.', effects: { health: 15, energy: -20, morale: 15 } },
      { id: 'official', label: 'Stick to the official trail', description: 'It adds 40 minutes but has handrails.', effects: { health: 10, energy: -15, morale: 10 } },
      { id: 'turn_back', label: 'Turn around and get coffee', description: 'The real hike was the friends we made.', effects: { morale: 10, energy: 5, money: -10 } },
    ],
  },

  {
    id: 'wknd_beach',
    title: 'Spontaneous Beach Day',
    description: 'Perfect beach weather and you\'ve just remembered you live 40 minutes from the coast. The only question is how committed you are to this plan.',
    options: [
      { id: 'full_day', label: 'Full beach day, packed lunch and all', description: 'Sunscreen applied. Towel secured.', effects: { health: 15, morale: 25, energy: -15, hunger: -15 } },
      { id: 'afternoon', label: 'Quick afternoon trip', description: 'Two hours. Maximum efficiency.', effects: { health: 10, morale: 15, energy: -10 }, available: p => p.hasTransport },
      { id: 'stay_home', label: 'Watch beach videos on your couch', description: 'Sounds the same. Costs less.', effects: { morale: 5, energy: 15 } },
    ],
  },

  {
    id: 'wknd_bird_watching',
    title: 'Extreme Bird Watching',
    description: 'You spotted a rare bird in the park. The bird watching community is already there — camouflaged, silent, and intensely judgmental of your regular clothing.',
    options: [
      { id: 'commit', label: 'Lie down in the bushes to observe', description: 'Full dedication.', effects: { morale: 15, health: 5, energy: -15 } },
      { id: 'binoculars', label: 'Buy binoculars from the gift shop', description: 'You\'re immediately accepted into the group.', effects: { morale: 20, money: -35, health: 5 }, available: p => p.money >= 35 },
      { id: 'pigeons', label: 'Loudly point out pigeons instead', description: '"That one looks special."', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_farmers_market',
    title: "Farmer's Market Rabbit Hole",
    description: 'You went for one tomato. Two hours later you have artisanal cheese, a handmade broom, three different hot sauces, and a very persuasive conversation with a jam vendor.',
    options: [
      { id: 'buy_all', label: 'Commit fully to the lifestyle', description: 'You now own a sourdough starter.', effects: { hunger: 25, morale: 20, money: -60, health: 10 }, available: p => p.money >= 60 },
      { id: 'selective', label: 'Buy the tomato and leave immediately', description: 'One item. Victory.', effects: { hunger: 15, morale: 10, money: -10 } },
      { id: 'browse', label: 'Browse but buy nothing', description: 'Willpower: maximum.', effects: { morale: 10, energy: -10 } },
    ],
  },

  {
    id: 'wknd_park_concert',
    title: 'Free Concert in the Park',
    description: 'There\'s a free concert in the park! The band is enthusiastic. The genre is "experimental folk fusion." You might love it. You might not know what is happening.',
    options: [
      { id: 'front', label: 'Get a spot near the front', description: 'Full immersion. Possibly too much immersion.', effects: { morale: 20, energy: -15, hunger: -10 } },
      { id: 'picnic', label: 'Set up a picnic in the back', description: 'The music is ambient. The cheese is excellent.', effects: { morale: 20, hunger: 20, energy: -5, money: -20 }, available: p => p.money >= 20 },
      { id: 'podcast', label: 'Listen to a podcast instead', description: 'The park is still pleasant.', effects: { morale: 10, energy: 10 } },
    ],
  },

  {
    id: 'wknd_raccoon',
    title: 'Late Night Raccoon Standoff',
    description: 'A raccoon has been living in your trash cans and has gotten very comfortable. It is now 11pm and you are both staring at each other in the alley.',
    options: [
      { id: 'shoo', label: 'Attempt to shoo it away', description: 'It doesn\'t shoo.', effects: { morale: 5, energy: -10 } },
      { id: 'bribe', label: 'Offer it some leftover food to buy peace', description: 'Diplomatic solution.', effects: { morale: 15, hunger: -10, energy: -5 } },
      { id: 'accept', label: 'Accept you share a home now', description: 'Its name is Gerald.', effects: { morale: 20, energy: -5 } },
    ],
  },

  {
    id: 'wknd_accidentally_5k',
    title: 'Accidentally Entered a 5K',
    description: 'You were just walking through the park in comfortable clothes. Now you\'re at the starting line of a charity 5K with 400 other runners, and someone has already pinned a number on your shirt.',
    options: [
      { id: 'run', label: 'Run it — you\'re already here', description: 'YOLO, but with cardio.', effects: { health: 20, energy: -30, morale: 20, money: 30 } },
      { id: 'walk', label: 'Walk the whole thing proudly', description: '"I\'m pacing myself."', effects: { health: 10, energy: -15, morale: 15 } },
      { id: 'duck_out', label: 'Veer off at the first corner', description: 'Quick, blend into the spectators.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_bbq',
    title: 'Community Barbecue Drama',
    description: 'The neighborhood barbecue has escalated. Two grillmasters are in a silent but intense standoff over charcoal vs. gas. Everyone is picking sides.',
    options: [
      { id: 'charcoal', label: 'Side with Team Charcoal', description: '"Real smoke. Real flavor. Real commitment."', effects: { morale: 15, hunger: 25, money: -10 } },
      { id: 'gas', label: 'Side with Team Gas', description: '"Consistent temperature. Reliable. Efficient."', effects: { morale: 10, hunger: 25, money: -10 } },
      { id: 'neutral', label: 'Eat food from both and stay quiet', description: 'The Switzerland of barbecue.', effects: { morale: 20, hunger: 30, money: -10 } },
    ],
  },

  {
    id: 'wknd_goat_yoga',
    title: 'Goat Yoga Discovery',
    description: 'There\'s a goat yoga class at a local farm this weekend. The goats walk on you during poses. You don\'t know if this sounds relaxing or concerning.',
    options: [
      { id: 'attend', label: 'Book a spot and experience it fully', description: 'The goat doesn\'t care about your form.', effects: { health: 10, morale: 25, energy: -10, money: -30 }, available: p => p.money >= 30 },
      { id: 'watch', label: 'Watch from the fence for free', description: 'Same content. Less goat contact.', effects: { morale: 15, energy: 5 } },
      { id: 'skip', label: 'Decide this is too much', description: '"I have limits."', effects: { energy: 10, morale: 5 } },
    ],
  },

  // ─── HOME & DOMESTIC ─────────────────────────────────────────────────────────

  {
    id: 'wknd_netflix',
    title: 'The Algorithm Rabbit Hole',
    description: 'You sat down for "one episode." Six hours later you\'re three seasons into a show about competitive sandcastle builders and emotionally invested.',
    options: [
      { id: 'commit', label: 'Finish the season tonight', description: 'Sleep is for people who aren\'t this invested.', effects: { morale: 15, energy: -25, hunger: -15 } },
      { id: 'exercise', label: 'Dramatically stop and go for a walk', description: 'Healthy. Disappointing. Responsible.', effects: { health: 10, energy: -5, morale: 5 } },
      { id: 'continue', label: 'Watch two more and go to bed at a reasonable time', description: 'Balance. Sort of.', effects: { morale: 10, energy: -10, hunger: -10 } },
    ],
  },

  {
    id: 'wknd_diy',
    title: 'DIY Project Disaster',
    description: 'You were going to just fix a leaky faucet. The faucet is now in three pieces on the floor, you\'ve accidentally opened a wall panel, and there\'s water on the ceiling.',
    options: [
      { id: 'push_through', label: 'Push through and figure it out', description: 'YouTube tutorials have gotten you this far.', effects: { morale: 15, energy: -25, money: -50 } },
      { id: 'call_plumber', label: 'Call an emergency plumber', description: 'He doesn\'t laugh. Much.', effects: { morale: -10, energy: -10, money: -120 }, available: p => p.money >= 120 },
      { id: 'tape', label: 'Apply industrial tape and pray', description: '"It\'s holding."', effects: { morale: 5, energy: -15, money: -10 } },
    ],
  },

  {
    id: 'wknd_cooking',
    title: 'Experimental Cooking Session',
    description: 'You\'ve decided to attempt a recipe from a cooking show — the one that involves flambéeing something. The smoke alarm has already been removed from the kitchen.',
    options: [
      { id: 'attempt', label: 'Attempt the full recipe', description: 'It either works or it becomes a story.', effects: { hunger: 30, morale: 20, energy: -20, money: -40 }, available: p => p.money >= 40 },
      { id: 'simplified', label: 'Make the easy version without the flambe', description: 'Tastier than the original, honestly.', effects: { hunger: 25, morale: 15, energy: -10, money: -20 }, available: p => p.money >= 20 },
      { id: 'order', label: 'Give up and order delivery instead', description: '"Learning from failure is also learning."', effects: { hunger: 25, morale: 5, energy: 5, money: -30 }, available: p => p.money >= 30 },
    ],
  },

  {
    id: 'wknd_cleaning',
    title: 'Deep Clean Archaeology',
    description: 'You started cleaning and have now discovered layers of forgotten items — a jacket you thought was stolen, $17 in change, and something in the back of the fridge with its own ecosystem.',
    options: [
      { id: 'full', label: 'Commit to a full deep clean', description: 'Hours of work. Worth it.', effects: { morale: 20, energy: -25, money: 17 } },
      { id: 'strategic', label: 'Clean only the visible surfaces', description: 'Company-ready in 20 minutes.', effects: { morale: 10, energy: -10 } },
      { id: 'pocket_money', label: 'Pocket the $17 and stop there', description: 'Good enough.', effects: { morale: 10, money: 17, energy: 5 } },
    ],
  },

  {
    id: 'wknd_gaming',
    title: 'Gaming Marathon',
    description: 'You started a "quick" gaming session at 10am. It\'s now 8pm and your character just reached a very important checkpoint. The real world feels distant.',
    options: [
      { id: 'one_more', label: 'Just one more hour', description: '(It\'s never one more hour.)', effects: { morale: 15, energy: -25, hunger: -20 } },
      { id: 'finish_quest', label: 'Finish this quest then stop', description: 'Disciplined. Mostly.', effects: { morale: 15, energy: -15, hunger: -15 } },
      { id: 'take_break', label: 'Take a real break, go outside', description: 'The sun still exists.', effects: { health: 10, energy: 5, morale: 5 } },
    ],
  },

  {
    id: 'wknd_roomba',
    title: 'Robot Vacuum Uprising',
    description: 'Your robot vacuum has developed opinions. It has knocked a plant off a shelf, trapped itself behind the couch, and is now emitting distress beeps in what sounds like a pattern.',
    options: [
      { id: 'rescue', label: 'Rescue it and reprogram it firmly', description: '"We will have boundaries."', effects: { morale: 10, energy: -10 } },
      { id: 'watch', label: 'Document its journey for 2 hours', description: 'It has more agency than you expected.', effects: { morale: 20, energy: 5 } },
      { id: 'negotiate', label: 'Leave it a snack and see what happens', description: 'This is how it starts in the movies.', effects: { morale: 15, hunger: -5, energy: 10 } },
    ],
  },

  {
    id: 'wknd_ikea',
    title: 'The IKEA Relationship Test',
    description: 'You ordered flat-pack furniture and it arrived Friday. Instructions: 47 steps. Allen keys provided: 1. Screws left over after completion: 4. Purpose unknown.',
    options: [
      { id: 'read', label: 'Read all the instructions first', description: 'Methodical. Respectful of the process.', effects: { morale: 15, energy: -20 } },
      { id: 'improvise', label: 'Wing it and check instructions only when stuck', description: 'Faster. Structurally confident.', effects: { morale: 10, energy: -15 } },
      { id: 'pay', label: 'Pay someone else to assemble it', description: 'Money well spent.', effects: { morale: 20, energy: 5, money: -60 }, available: p => p.money >= 60 },
    ],
  },

  {
    id: 'wknd_baking',
    title: 'The Sourdough Crisis',
    description: 'Your sourdough starter — which has been living in your fridge for 4 months — is either very active or very dead. Only baking will reveal the truth.',
    options: [
      { id: 'bake', label: 'Bake the loaf and accept the outcome', description: 'Science. Sort of.', effects: { hunger: 25, morale: 20, energy: -20, money: -15 }, available: p => p.money >= 15 },
      { id: 'start_fresh', label: 'Throw it out and start a new one', description: 'A clean slate.', effects: { morale: 10, energy: -10, money: -10 }, available: p => p.money >= 10 },
      { id: 'ignore', label: 'Put it back in the fridge and decide later', description: 'It will keep. Probably.', effects: { energy: 15, morale: 5 } },
    ],
  },

  {
    id: 'wknd_declutter',
    title: 'Spontaneous Declutter Urge',
    description: 'You\'ve been seized by an overwhelming need to throw things away. Your apartment feels smaller every day. It is time.',
    options: [
      { id: 'full_purge', label: 'Full purge: one bag per room', description: 'Ruthless. Liberating.', effects: { morale: 25, energy: -20, money: 30 } },
      { id: 'selective', label: 'Sort into donate vs. keep piles', description: 'The keep pile is very large.', effects: { morale: 15, energy: -15 } },
      { id: 'decide_later', label: 'Take photos of everything and decide later', description: '"Archive mode activated."', effects: { morale: 5, energy: 5 } },
    ],
  },

  // ─── FOOD & DINING ───────────────────────────────────────────────────────────

  {
    id: 'wknd_food_truck',
    title: 'Mystery Food Truck Festival',
    description: 'A pop-up food truck festival has appeared downtown. Twelve trucks. No menus posted outside. You eat blind or you don\'t eat at all.',
    options: [
      { id: 'adventurous', label: 'Try the most mysterious truck', description: 'It said "fusion." Beyond that: unknown.', effects: { hunger: 30, morale: 20, money: -25, health: 5 }, available: p => p.money >= 25 },
      { id: 'safe', label: 'Find the burger truck', description: 'There\'s always a burger truck.', effects: { hunger: 25, morale: 10, money: -15, health: -5 }, available: p => p.money >= 15 },
      { id: 'samples', label: 'Live off free samples alone', description: 'Walking very slowly. Strategically.', effects: { hunger: 15, morale: 15, energy: -10 } },
    ],
  },

  {
    id: 'wknd_leftovers',
    title: 'Leftovers Roulette',
    description: 'The fridge contains five mystery containers of varying age. The risk-to-reward ratio is unclear. Science is watching.',
    options: [
      { id: 'eat_all', label: 'Eat the most recent-looking one', description: '"The texture is fine. Probably fine."', effects: { hunger: 25, energy: 5, health: -5 } },
      { id: 'check', label: 'Smell-test every container carefully', description: 'Two survive. You eat both.', effects: { hunger: 20, morale: 10, energy: 5 } },
      { id: 'throw_out', label: 'Throw everything out and cook fresh', description: 'Bold. Expensive. Worth it.', effects: { hunger: 25, morale: 15, money: -25, health: 10 }, available: p => p.money >= 25 },
    ],
  },

  {
    id: 'wknd_buffet',
    title: 'The Unlimited Breakfast Buffet',
    description: 'A hotel near you does an all-you-can-eat brunch on weekends for $18. You\'ve been told by multiple people that it "changes you."',
    options: [
      { id: 'go', label: 'Go to the buffet', description: 'You return a different person.', effects: { hunger: 40, morale: 20, money: -18, energy: -10 }, available: p => p.money >= 18 },
      { id: 'eat_twice', label: 'Go back twice and make it a project', description: 'You are getting your money\'s worth.', effects: { hunger: 40, morale: 15, health: -10, money: -18, energy: -20 }, available: p => p.money >= 18 },
      { id: 'skip', label: 'Make breakfast at home instead', description: 'Cheaper. Respectable. Slightly sad.', effects: { hunger: 20, morale: 5, money: -10 }, available: p => p.money >= 10 },
    ],
  },

  {
    id: 'wknd_taco',
    title: 'All-You-Can-Eat Taco Challenge',
    description: 'The taco restaurant has launched an all-you-can-eat challenge for $20. The record is 22 tacos. You are a reasonable person. You will have maybe six.',
    options: [
      { id: 'challenge', label: 'Accept the challenge officially', description: 'Your name could be on the wall.', effects: { hunger: 40, morale: 20, health: -10, money: -20, energy: -15 }, available: p => p.money >= 20 },
      { id: 'casual', label: 'Eat casually without the pressure', description: 'Seven tacos. Perfect.', effects: { hunger: 35, morale: 20, money: -20 }, available: p => p.money >= 20 },
      { id: 'skip', label: 'Make tacos at home with better ingredients', description: 'Artisanal taco energy.', effects: { hunger: 25, morale: 15, money: -15 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_competitive_eating',
    title: 'Competitive Hot Dog Incident',
    description: 'You are at a street fair. There is a hot dog eating contest. First prize is $75. The defending champion is a 140-pound accountant named Pam.',
    options: [
      { id: 'enter', label: 'Enter the contest', description: 'May the best person win.', effects: { hunger: 35, morale: 15, health: -15, money: 75, energy: -20 } },
      { id: 'watch', label: 'Watch and cheer for Pam', description: 'Pam eats 18 hot dogs. You eat a normal one.', effects: { morale: 20, hunger: 20, money: -8, energy: -5 } },
      { id: 'avoid', label: 'Get a funnel cake and leave quietly', description: 'The correct choice.', effects: { hunger: 20, morale: 15, money: -8 } },
    ],
  },

  {
    id: 'wknd_popup_restaurant',
    title: 'The Pop-Up Restaurant Lottery',
    description: 'A renowned chef is doing a one-night pop-up dinner in someone\'s garage. You won a spot via newsletter lottery. The email said "dress business casual."',
    options: [
      { id: 'go', label: 'Attend the garage dinner', description: 'Six courses. One folding table.', effects: { hunger: 35, morale: 25, money: -80, health: 10, energy: -10 }, available: p => p.money >= 80 },
      { id: 'sell', label: 'Sell the reservation online', description: 'Someone paid $40 for your spot.', effects: { morale: 10, money: 40 } },
      { id: 'no_show', label: 'Forget about it and order pizza', description: '"I was going to go."', effects: { morale: 5, hunger: 20, money: -15 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_chili_cookoff',
    title: 'Neighborhood Chili Cook-Off',
    description: 'Your block is hosting a chili cook-off. You could enter, judge, or just aggressively eat everyone else\'s entries and claim to be "gathering feedback."',
    options: [
      { id: 'enter', label: 'Enter with your secret recipe', description: 'The secret is cumin. Lots of cumin.', effects: { hunger: 25, morale: 20, energy: -15, money: -20 }, available: p => p.money >= 20 },
      { id: 'eat', label: 'Eat all the samples with authority', description: '"I\'m assessing heat levels."', effects: { hunger: 35, morale: 20, money: -5 } },
      { id: 'judge', label: 'Volunteer as an official judge', description: 'Power and free chili.', effects: { hunger: 30, morale: 25, energy: -10 } },
    ],
  },

  {
    id: 'wknd_michelin',
    title: 'Accidental Michelin Reservation',
    description: 'You booked what you thought was a casual Italian place. The menu is in French. There are eight courses. The amuse-bouche is a sphere.',
    options: [
      { id: 'enjoy', label: 'Embrace the experience', description: 'This is fine. You know which fork to use. Probably.', effects: { hunger: 35, morale: 25, money: -150, health: 10 }, available: p => p.money >= 150 },
      { id: 'short', label: 'Leave after three courses citing an "appointment"', description: '"The sphere was enough."', effects: { hunger: 20, morale: 10, money: -80, energy: 5 }, available: p => p.money >= 80 },
      { id: 'no_show', label: 'Don\'t show up and eat chips at home', description: 'They\'ll charge a cancellation fee but your dignity survives.', effects: { morale: 5, hunger: 10, money: -30, energy: 15 }, available: p => p.money >= 30 },
    ],
  },

  // ─── SHOPPING & MONEY ────────────────────────────────────────────────────────

  {
    id: 'wknd_garage_sale',
    title: 'Suspiciously Good Garage Sale',
    description: 'A garage sale on your street has what appears to be an original vintage concert poster, an unopened blender, and a full tuxedo for $5. You don\'t know the backstory and probably shouldn\'t ask.',
    options: [
      { id: 'buy_poster', label: 'Buy the poster and get it valued', description: 'Could be $20. Could be $400.', effects: { morale: 15, money: 80, energy: -5 }, available: p => p.money >= 5 },
      { id: 'buy_all', label: 'Buy everything suspicious', description: '"This has to be worth something."', effects: { morale: 20, money: 30, energy: -10 }, available: p => p.money >= 20 },
      { id: 'browse', label: 'Browse and buy nothing', description: 'You love the chaos.', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_lottery',
    title: 'Scratch Ticket Discovery',
    description: 'You found an unscratched lottery ticket in a coat pocket. The jackpot on this one was $100,000. You have a coin. The moment is weirdly tense.',
    options: [
      { id: 'scratch', label: 'Scratch it immediately', description: 'Fortune favors the impatient.', effects: { morale: 15, money: 50 } },
      { id: 'save', label: 'Save it for a lucky day', description: '"I\'m not ready."', effects: { morale: 10, energy: 5 } },
      { id: 'gift', label: 'Give it to a stranger on the street', description: 'Pure chaos energy.', effects: { morale: 25 } },
    ],
  },

  {
    id: 'wknd_investment_seminar',
    title: '"Free" Investment Seminar',
    description: 'A flyer promised a free brunch and wealth-building secrets. The brunch is one croissant and a coffee. The secret is: buy their course for $299.',
    options: [
      { id: 'leave', label: 'Leave immediately after the croissant', description: 'You got exactly what you came for.', effects: { hunger: 10, morale: 10, energy: -5 } },
      { id: 'ask_hard', label: 'Ask increasingly difficult questions', description: '"What\'s your Sharpe ratio?"', effects: { morale: 20, energy: -10 } },
      { id: 'buy', label: 'Buy the course out of confusion', description: 'A mistake you\'ll understand in 6-8 weeks.', effects: { morale: -15, money: -299, education: 1 }, available: p => p.money >= 299 },
    ],
  },

  {
    id: 'wknd_yard_sale',
    title: 'Hosting Your Own Yard Sale',
    description: 'You\'ve dragged everything you don\'t want to your front yard. Your neighbors have stopped and are looking at your stuff in the same politely judgmental way you look at theirs.',
    options: [
      { id: 'negotiate', label: 'Negotiate hard on everything', description: '"This bread maker is worth $45."', effects: { morale: 15, energy: -20, money: 80 } },
      { id: 'give_away', label: 'Give everything away for free', description: 'The neighbors are very happy. You feel lighter.', effects: { morale: 25, energy: -10 } },
      { id: 'fixed_price', label: 'Use price tags and stick to them', description: 'Principled. Slower.', effects: { morale: 10, energy: -15, money: 40 } },
    ],
  },

  {
    id: 'wknd_dumpster',
    title: 'Dumpster Treasure Hunt',
    description: 'Your city has a "big rubbish" weekend where people put out furniture and electronics. You\'ve spotted a working lamp, an exercise bike, and a completely unexplained chandelier.',
    options: [
      { id: 'take_all', label: 'Take everything that fits', description: 'Your apartment will look eclectic.', effects: { morale: 20, money: 50, energy: -20 } },
      { id: 'selective', label: 'Take only the lamp', description: 'Disciplined scavenging.', effects: { morale: 10, money: 20, energy: -5 } },
      { id: 'photograph', label: 'Photograph everything and post online', description: '"Big rubbish content."', effects: { morale: 15, energy: 5 } },
    ],
  },

  {
    id: 'wknd_black_friday',
    title: 'Black Friday in July',
    description: 'A store near you has launched a "Black Friday in July" event. Lines formed at 4am. You arrived at 9am and are already in the queue. Items are limited.',
    options: [
      { id: 'queue', label: 'Commit to the queue', description: '2 hours for a $40 saving.', effects: { morale: 10, energy: -20, money: -60 }, available: p => p.money >= 60 },
      { id: 'leave', label: 'Walk past and go get coffee', description: 'The real discount was the peace of mind.', effects: { morale: 15, energy: 5, money: -5 } },
      { id: 'online', label: 'Go home and buy it online instead', description: 'Same price. No queue.', effects: { morale: 10, money: -70, energy: 10 }, available: p => p.money >= 70 },
    ],
  },

  // ─── WEIRD & SUPERNATURAL ────────────────────────────────────────────────────

  {
    id: 'wknd_psychic',
    title: "The Fortune Teller's Reading",
    description: 'A fortune teller at the weekend market offers you a reading for $15. She says she sees "a great transformation." You have no idea what that means.',
    options: [
      { id: 'full_reading', label: 'Get the full reading', description: 'She\'s very convincing about mercury.', effects: { morale: 15, energy: -5, money: -15 }, available: p => p.money >= 15 },
      { id: 'skeptical', label: 'Ask increasingly specific questions', description: '"What transformation, exactly? What direction?"', effects: { morale: 10, energy: -5, money: -15 }, available: p => p.money >= 15 },
      { id: 'decline', label: 'Politely decline', description: 'You make your own fate.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_ufo',
    title: 'UFO Enthusiast Meetup',
    description: 'A sign at the library: "Saturday: UAP Evidence Sharing Group — All Welcome." You go in. There are maps, photos, and one extremely confident man named Dennis.',
    options: [
      { id: 'engage', label: 'Engage with Dennis\'s evidence seriously', description: 'The blur in photo 7 is compelling.', effects: { morale: 20, energy: -10 } },
      { id: 'ask', label: 'Ask one very good skeptical question', description: 'The room goes quiet.', effects: { morale: 15, energy: -10 } },
      { id: 'snacks', label: 'Eat the provided snacks and listen', description: 'Free pretzels. No commitments.', effects: { morale: 10, hunger: 15, energy: -5 } },
    ],
  },

  {
    id: 'wknd_time_capsule',
    title: 'Neighborhood Time Capsule',
    description: 'The city is opening a time capsule buried 30 years ago in the park. It contains a letter, a mixtape, a small trophy, and what appears to be a legal document.',
    options: [
      { id: 'attend', label: 'Attend the official ceremony', description: 'The mayor reads the letter. There are tears.', effects: { morale: 20, energy: -5 } },
      { id: 'read_doc', label: 'Push to the front to read the legal document', description: 'It\'s a deed. For what, unclear.', effects: { morale: 15, energy: -10 } },
      { id: 'pass', label: 'Watch from a distance and leave early', description: 'The vibe was enough.', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_conspiracy_con',
    title: 'Conspiracy Theory Convention',
    description: 'You\'ve wandered into a conspiracy theory expo. Booths include "The Moon is a Hologram" (compelling PowerPoint), "Birds Aren\'t Real" (merchandise available), and "Everything is Fine" (suspiciously empty).',
    options: [
      { id: 'browse', label: 'Browse all the booths open-mindedly', description: 'You leave with more questions than answers.', effects: { morale: 20, energy: -10 } },
      { id: 'debate', label: 'Debate the bird people for 45 minutes', description: 'Neither side wins. Both sides are energized.', effects: { morale: 15, energy: -20 } },
      { id: 'merch', label: 'Buy a "Birds Aren\'t Real" t-shirt', description: 'It\'s a good conversation starter.', effects: { morale: 20, money: -20 }, available: p => p.money >= 20 },
    ],
  },

  {
    id: 'wknd_haunted_airbnb',
    title: 'The Allegedly Haunted Airbnb',
    description: 'A friend booked an Airbnb listed as "historically significant." The listing mentions "spirits" in the amenities. The door opens by itself. This is either the house settling or something else.',
    options: [
      { id: 'stay', label: 'Stay the whole night, ghost or no ghost', description: '"I paid for this room."', effects: { morale: 25, energy: -20, money: -40 }, available: p => p.money >= 40 },
      { id: 'investigate', label: 'Systematically investigate the noises', description: 'It\'s a bird. It\'s almost always a bird.', effects: { morale: 20, energy: -25 } },
      { id: 'leave', label: 'Leave at midnight citing "vibes"', description: 'The hotel down the road has normal doors.', effects: { morale: 10, money: -60, energy: -10 }, available: p => p.money >= 60 },
    ],
  },

  {
    id: 'wknd_ghost_tour',
    title: 'Ghost Tour of the City',
    description: 'The weekend ghost tour starts at 9pm and visits seven "haunted" sites. The guide is extremely committed. It\'s $15 per person and genuinely atmospheric.',
    options: [
      { id: 'full_tour', label: 'Do the full tour', description: 'Two actual scares and one pigeon.', effects: { morale: 20, energy: -15, money: -15 }, available: p => p.money >= 15 },
      { id: 'ask_questions', label: 'Ask the guide pointed questions throughout', description: '"What\'s the provenance on that sighting?"', effects: { morale: 15, energy: -15, money: -15 }, available: p => p.money >= 15 },
      { id: 'skip', label: 'Walk the same route but free', description: 'Same streets. Different ambiance.', effects: { morale: 10, energy: -10 } },
    ],
  },

  {
    id: 'wknd_paranormal',
    title: 'Paranormal Investigation',
    description: 'A group of amateur paranormal investigators needs a sixth person for a Saturday night session in an old warehouse. You\'ve been handed an EMF reader and a very serious clipboard.',
    options: [
      { id: 'investigate', label: 'Take it completely seriously', description: 'Zone B shows unusual EMF readings.', effects: { morale: 20, energy: -20 } },
      { id: 'skeptic', label: 'Be the healthy skeptic of the group', description: 'Every noise gets a rational explanation.', effects: { morale: 15, energy: -15 } },
      { id: 'document', label: 'Film everything for your own purposes', description: 'This footage is gold.', effects: { morale: 20, energy: -10, money: 30 } },
    ],
  },

  {
    id: 'wknd_crystal_healing',
    title: 'Crystal Healing Workshop',
    description: 'Your neighbor is hosting a crystal healing workshop in their apartment. "Just come for the snacks," they said. You\'ve now been told your third chakra is "concerning."',
    options: [
      { id: 'open_minded', label: 'Engage with genuine curiosity', description: 'The amethyst feels... something.', effects: { morale: 15, energy: 10, health: 5 } },
      { id: 'eat_snacks', label: 'Attend but focus on the snacks', description: 'The crystals are nice. The hummus is better.', effects: { hunger: 20, morale: 10 } },
      { id: 'buy_crystal', label: 'Buy the "stress relief" obsidian stone', description: 'It\'s a rock. It\'s a very nice rock.', effects: { morale: 15, money: -25 }, available: p => p.money >= 25 },
    ],
  },

  {
    id: 'wknd_bigfoot',
    title: 'Bigfoot Hunting Weekend',
    description: 'A Bigfoot hunting group is taking a day trip to the nearby forest. Equipment provided: one pair of binoculars and a strong belief system.',
    options: [
      { id: 'go', label: 'Join the hunt', description: 'You find footprints. Possibly a bear.', effects: { morale: 20, health: 10, energy: -20 } },
      { id: 'guide', label: 'Become the de facto navigator', description: 'You have the only working compass.', effects: { morale: 15, health: 10, energy: -20 } },
      { id: 'decline', label: 'Politely decline based on "prior commitments"', description: '"The forest and I have history."', effects: { energy: 15, morale: 5 } },
    ],
  },

  {
    id: 'wknd_vampire_larp',
    title: 'Vampire LARP Accident',
    description: 'You\'ve stumbled into a live-action roleplay event. Everyone is in Victorian vampire costumes and you are wearing jeans. They have offered you a cloak.',
    options: [
      { id: 'join', label: 'Accept the cloak and improvise a character', description: '"I am Count... Gary. I have forgotten my accent."', effects: { morale: 25, energy: -15 } },
      { id: 'watch', label: 'Observe from the edges respectfully', description: 'The lore is surprisingly deep.', effects: { morale: 20, energy: -5 } },
      { id: 'challenge', label: 'Challenge the most confident vampire to a duel', description: 'They beat you. It\'s part of the game.', effects: { morale: 20, energy: -20 } },
    ],
  },

  {
    id: 'wknd_secret_society',
    title: 'Mysterious Invitation',
    description: 'An envelope was slid under your door. Inside: a time, a location, and the words "do not mention the pelican." No other context.',
    options: [
      { id: 'attend', label: 'Show up at the location', description: 'It\'s a book club. Surprisingly intense.', effects: { morale: 20, energy: -15, education: 1 } },
      { id: 'ask', label: 'Go but immediately mention the pelican', description: 'Everyone freezes. Someone leaves.', effects: { morale: 15, energy: -10 } },
      { id: 'ignore', label: 'Ignore it entirely', description: 'This choice haunts you briefly then you forget.', effects: { energy: 10, morale: 5 } },
    ],
  },

  // ─── ENTERTAINMENT & CULTURE ─────────────────────────────────────────────────

  {
    id: 'wknd_museum',
    title: 'Museum Free Day Chaos',
    description: 'The city museum is free this Saturday. Every person in the city has made the same decision. The dinosaur skeleton is surrounded by a 20-person deep crowd. A child is crying near the meteorite.',
    options: [
      { id: 'brave_crowds', label: 'Brave the main exhibits', description: 'You see 40% of the pterodactyl.', effects: { morale: 15, energy: -20 } },
      { id: 'side_galleries', label: 'Find the quiet galleries nobody wants', description: 'The ancient pottery room is completely empty.', effects: { morale: 20, energy: -10, education: 1 } },
      { id: 'gift_shop', label: 'Go straight to the gift shop', description: 'A rubber dinosaur and a tin of mints.', effects: { morale: 15, money: -15 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_art_gallery',
    title: 'Art Gallery Opening Drama',
    description: 'A gallery opening downtown. Free wine. Intense art. A piece labeled "Untitled #7 (Interior Void)" is a blank white canvas and is selling for $4,000.',
    options: [
      { id: 'engage', label: 'Engage seriously with every piece', description: 'You now have opinions about negative space.', effects: { morale: 20, energy: -15, education: 1 } },
      { id: 'wine', label: 'Focus on the free wine and small talk', description: 'Networking, sort of.', effects: { morale: 15, energy: -10 } },
      { id: 'make_art', label: 'Leave and immediately start making art', description: '"If they can do it, so can I."', effects: { morale: 25, energy: -15 } },
    ],
  },

  {
    id: 'wknd_improv',
    title: 'Accidental Improv Volunteer',
    description: 'You went to watch a comedy improv show. The performer has pointed at you. The audience is clapping. You are now in the show.',
    options: [
      { id: 'commit', label: 'Commit completely to the bit', description: 'You play a very convincing Victorian scientist.', effects: { morale: 25, energy: -20 } },
      { id: 'minimal', label: 'Do the minimum required to survive', description: '"Yes, and..." you whisper.', effects: { morale: 15, energy: -10 } },
      { id: 'refuse', label: 'Politely refuse and sit back down', description: 'The performer respects this. Barely.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_magic',
    title: 'Magic Show Gone Wrong',
    description: 'A street magician picks you as their volunteer. Your job: hold the rings. You\'re doing it correctly. The trick still isn\'t working. The magician is looking at you differently now.',
    options: [
      { id: 'play_along', label: 'Play along enthusiastically', description: '"Wow! How did that happen!"', effects: { morale: 20, energy: -5 } },
      { id: 'explain', label: 'Explain to the crowd how the trick works', description: 'The magician walks away forever.', effects: { morale: 10, energy: -10 } },
      { id: 'befriend', label: 'Buy the magician a coffee afterward', description: 'You\'re now friends. It\'s complicated.', effects: { morale: 25, money: -10 }, available: p => p.money >= 10 },
    ],
  },

  {
    id: 'wknd_flash_mob',
    title: 'Flash Mob Recruitment',
    description: 'A very serious person with a clipboard stops you: "We need one more for the flash mob at 3pm. You\'re the right height. It\'s 14 steps. There\'s no time to explain the theme."',
    options: [
      { id: 'join', label: 'Say yes and learn the 14 steps', description: 'The theme is "accountants through time."', effects: { morale: 25, energy: -20 } },
      { id: 'watch', label: 'Say no but stay to watch', description: 'One person is significantly out of step. Probably would\'ve been you.', effects: { morale: 20, energy: 5 } },
      { id: 'decline', label: 'Decline and continue your day', description: '"I have plans" (you don\'t).', effects: { morale: 5, energy: 10 } },
    ],
  },

  {
    id: 'wknd_chess',
    title: 'Underground Chess Tournament',
    description: 'A back room of a coffee shop hosts a Saturday chess tournament with a $30 entry fee and a $200 prize. The players look deceptively casual.',
    options: [
      { id: 'enter', label: 'Enter the tournament', description: 'Round 1 goes well. Round 2 does not.', effects: { morale: 15, energy: -20, money: -30 }, available: p => p.money >= 30 },
      { id: 'watch', label: 'Watch the final rounds for free', description: 'These people are genuinely terrifying.', effects: { morale: 15, energy: -5, education: 1 } },
      { id: 'hustle', label: 'Challenge random people to side games for $5', description: 'You win two and lose three.', effects: { morale: 15, energy: -15, money: -5 } },
    ],
  },

  {
    id: 'wknd_poetry',
    title: 'Spoken Word Night',
    description: 'A bar is hosting spoken word poetry night. The MC asks if anyone has an original piece. You once wrote something in a notebook that you\'ve never shown anyone.',
    options: [
      { id: 'perform', label: 'Read your piece', description: 'It\'s about a parking ticket. It lands surprisingly well.', effects: { morale: 25, energy: -15 }, available: p => p.morale >= 35 },
      { id: 'watch', label: 'Watch and appreciate the other performers', description: 'One poem genuinely moves you.', effects: { morale: 20, energy: -10, education: 1 } },
      { id: 'heckle', label: 'Heckle supportively ("yeah!" / "preach!")', description: 'People appreciate the energy.', effects: { morale: 15, energy: -10 } },
    ],
  },

  {
    id: 'wknd_axe_throwing',
    title: 'Axe Throwing Discovery',
    description: 'A new venue in the city: axe throwing. Walk-ins welcome. Safety briefing: 3 minutes. First throw: terrifying. The axe sticks on your fourth try.',
    options: [
      { id: 'play', label: 'Book two rounds and lean in', description: 'By round two you are dangerously comfortable with this.', effects: { morale: 25, energy: -20, money: -35 }, available: p => p.money >= 35 },
      { id: 'one_round', label: 'Do one round and call it done', description: 'Bucket list item: achieved.', effects: { morale: 20, energy: -10, money: -20 }, available: p => p.money >= 20 },
      { id: 'decline', label: 'Watch through the window from safety', description: 'Smart.', effects: { morale: 10, energy: 5 } },
    ],
  },

  {
    id: 'wknd_trampoline',
    title: 'Adult Trampoline Night',
    description: 'A trampoline park runs an "adults only" session on Saturday nights. You are an adult. You have not been on a trampoline in 15 years. Your body has opinions.',
    options: [
      { id: 'jump', label: 'Jump until physically unable to continue', description: 'Your knees file a formal complaint.', effects: { morale: 25, health: -10, energy: -25, money: -20 }, available: p => p.money >= 20 },
      { id: 'gentle', label: 'Bounce lightly and preserve your dignity', description: 'Still excellent. Still expensive.', effects: { morale: 20, energy: -15, money: -20 }, available: p => p.money >= 20 },
      { id: 'decline', label: 'Decide this is a phase you\'ve passed', description: '"I\'m a floor person."', effects: { energy: 15, morale: 5 } },
    ],
  },

  // ─── ACCIDENTAL & RANDOM ─────────────────────────────────────────────────────

  {
    id: 'wknd_viral',
    title: 'Accidental Viral Moment',
    description: 'Someone filmed you doing something completely ordinary and posted it. The clip is now at 40,000 views. The comment section is mostly supportive and partially unhinged.',
    options: [
      { id: 'lean_in', label: 'Lean into the fame, post a follow-up', description: '"The people want more."', effects: { morale: 25, energy: -10, money: 60 } },
      { id: 'ignore', label: 'Ignore it and let it pass', description: 'It peaks at 80k and disappears.', effects: { morale: 15, energy: 5 } },
      { id: 'request_removal', label: 'Ask for it to be taken down', description: 'It gets screenshotted first.', effects: { morale: 5, energy: -10 } },
    ],
  },

  {
    id: 'wknd_celebrity',
    title: 'Celebrity Sighting',
    description: 'You recognize a moderately famous person at the coffee shop. They\'re clearly trying to be normal. They\'ve made brief eye contact with you, which is probably not an invitation.',
    options: [
      { id: 'approach', label: 'Approach and say something human', description: '"I like your work" and then you leave. Well done.', effects: { morale: 20, energy: -5 } },
      { id: 'stare', label: 'Stare from across the room in a way they notice', description: 'Awkward for everyone involved.', effects: { morale: 5, energy: -5 } },
      { id: 'photo', label: 'Try to get a photo without being weird about it', description: 'Mixed success.', effects: { morale: 15, energy: -5 } },
    ],
  },

  {
    id: 'wknd_lost_dog',
    title: 'The Lost Dog',
    description: 'A golden retriever has been following you for four blocks. It has no collar. It seems to believe you are its person. It is wrong, but it\'s very committed.',
    options: [
      { id: 'keep_following', label: 'Let it follow you home while you figure it out', description: 'You now temporarily have a dog.', effects: { morale: 25, energy: -10 } },
      { id: 'shelter', label: 'Take it to the animal shelter immediately', description: 'Responsible. The dog seems betrayed.', effects: { morale: 15, energy: -15 } },
      { id: 'post', label: 'Post on the neighborhood app and wait', description: 'Its owner arrives in 20 minutes.', effects: { morale: 20, energy: -5 } },
    ],
  },

  {
    id: 'wknd_wrong_package',
    title: 'The Wrong Package',
    description: 'A package arrived for someone else. It contains: one formal suit, one rubber duck, one bag of coffee from a country that doesn\'t export coffee, and a handwritten note that just says "good luck."',
    options: [
      { id: 'return', label: 'Return it to the correct address', description: 'The recipient stares at you for a long time.', effects: { morale: 15, energy: -10 } },
      { id: 'open', label: 'Already opened it — own the consequences', description: 'You now have a rubber duck.', effects: { morale: 15, energy: -5 } },
      { id: 'keep', label: 'Keep the coffee, return the rest', description: 'The coffee is actually excellent.', effects: { morale: 20, energy: 10, hunger: 10 } },
    ],
  },

  {
    id: 'wknd_motivational',
    title: 'Motivational Speaker Ambush',
    description: 'A motivational speaker has set up in the community hall. They saw you walking by and are now making direct eye contact while saying "YOU are the change you seek." You are frozen.',
    options: [
      { id: 'sit', label: 'Sit down and absorb the whole session', description: 'You leave with three new personal mantras.', effects: { morale: 20, energy: -15 } },
      { id: 'ask', label: 'Raise your hand and ask a challenging question', description: '"Define \'seek.\'"', effects: { morale: 15, energy: -10 } },
      { id: 'walk', label: 'Maintain eye contact while slowly backing away', description: 'The speaker sees this as growth.', effects: { morale: 10, energy: 10 } },
    ],
  },

  {
    id: 'wknd_podcast',
    title: 'Podcast Recording Ambush',
    description: 'Two people with a microphone and earnest expressions ask if you\'d like to be on their podcast: "Humans of This Specific Street." It has 200 listeners. You are a person.',
    options: [
      { id: 'agree', label: 'Agree and talk for 20 minutes', description: 'Your philosophy of breakfast becomes episode 47.', effects: { morale: 20, energy: -15 } },
      { id: 'short', label: 'Do a quick two-minute spot', description: 'Good content. Limited exposure.', effects: { morale: 15, energy: -5 } },
      { id: 'decline', label: 'Decline with warmth', description: '"I\'m more of a listener."', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_community_theater',
    title: 'Community Theater Emergency',
    description: 'The community theater\'s lead actor has dropped out an hour before showtime. The director is looking at you with desperation. The script has 15 pages. The audience is arriving.',
    options: [
      { id: 'do_it', label: 'Accept the role with the script in hand', description: 'You improvise 30% of the lines. Nobody can tell.', effects: { morale: 30, energy: -25 } },
      { id: 'understudy', label: 'Offer to help backstage instead', description: 'You become the most important person with a headset.', effects: { morale: 20, energy: -15 } },
      { id: 'decline', label: 'Wish them luck and leave', description: '"I believe in you all."', effects: { morale: 5, energy: 10 } },
    ],
  },

  {
    id: 'wknd_competitive_ironing',
    title: 'Competitive Ironing Discovery',
    description: 'Extreme ironing is a real sport where people iron clothes in challenging locations. The local club is ironing at the skate park this weekend. An iron is available for you.',
    options: [
      { id: 'participate', label: 'Iron something at the skate park', description: 'Your form is unconventional but the shirt looks great.', effects: { morale: 25, energy: -15 } },
      { id: 'watch', label: 'Watch with growing respect', description: 'The technique is legitimately impressive.', effects: { morale: 20, energy: 5 } },
      { id: 'challenge', label: 'Challenge the best ironer to a head-to-head', description: 'You lose comprehensively but the crowd appreciates your confidence.', effects: { morale: 20, energy: -20 } },
    ],
  },

  {
    id: 'wknd_cat_cafe',
    title: 'Cat Cafe Session',
    description: 'The new cat cafe charges $12/hour. There are 8 cats and only you and one other person. One cat has decided to sit on your bag and refuses to move.',
    options: [
      { id: 'stay_full', label: 'Stay for the full hour', description: 'Three cats. Simultaneous. Worth it.', effects: { morale: 25, health: 5, energy: 10, money: -12 }, available: p => p.money >= 12 },
      { id: 'let_cat_stay', label: 'Let the cat on your bag stay forever', description: 'The staff gently intervenes after 90 minutes.', effects: { morale: 30, money: -18 }, available: p => p.money >= 18 },
      { id: 'pass', label: 'Watch through the window (it\'s also charming)', description: 'Free cats. Glass cats.', effects: { morale: 15, energy: 5 } },
    ],
  },

  {
    id: 'wknd_rollerderby',
    title: 'Roller Derby Night',
    description: 'You\'ve bought a ticket to a local roller derby bout. The sport is faster and more strategic than you expected. Someone on the team is called "Wrecking Bawl." She is frightening.',
    options: [
      { id: 'watch_full', label: 'Watch the full match and learn the rules', description: 'You leave a devoted fan.', effects: { morale: 25, energy: -10, money: -15 }, available: p => p.money >= 15 },
      { id: 'cheer', label: 'Pick a team and cheer loudly the whole time', description: 'Your team wins. You feel personally responsible.', effects: { morale: 25, energy: -15, money: -15 }, available: p => p.money >= 15 },
      { id: 'ask_tryout', label: 'Ask about tryouts after the match', description: 'They hand you a flyer. Your life may be changing.', effects: { morale: 20, health: 5, money: -15 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_urban_kayaking',
    title: 'Urban Kayak Rental',
    description: 'The city has launched a kayak rental service on the river. It\'s $25 for two hours. The river goes through downtown. You will pass directly under three office buildings.',
    options: [
      { id: 'kayak', label: 'Rent a kayak and paddle through downtown', description: 'The view from the water is genuinely different.', effects: { morale: 25, health: 15, energy: -20, money: -25 }, available: p => p.money >= 25 },
      { id: 'watch', label: 'Watch from the bridge instead', description: 'Free. Less wet.', effects: { morale: 10, energy: 5 } },
      { id: 'canoe', label: 'Upgrade to a tandem canoe alone', description: 'You spin in circles for 40 minutes. Still excellent.', effects: { morale: 20, health: 10, energy: -25, money: -35 }, available: p => p.money >= 35 },
    ],
  },

  {
    id: 'wknd_flea_market',
    title: 'The Great Flea Market',
    description: 'A giant flea market. Thousands of tables. Unknown treasures and unknown amounts of old printers. You have a budget and a vague sense of purpose.',
    options: [
      { id: 'strategic', label: 'Shop strategically with a list', description: 'Rare vinyl. Good price.', effects: { morale: 20, money: -30, energy: -15 }, available: p => p.money >= 30 },
      { id: 'browse', label: 'Browse for four hours buying nothing', description: 'You carry nothing but have seen everything.', effects: { morale: 15, energy: -20 } },
      { id: 'resell', label: 'Buy low-value items and try to flip them', description: 'Mixed results. Net: -$5. Educational.', effects: { morale: 15, energy: -20, money: -5 } },
    ],
  },

  {
    id: 'wknd_neighborhood_watch',
    title: 'Neighborhood Watch Emergency',
    description: 'The neighborhood watch has called an emergency meeting. The situation: someone has been leaving incredibly well-crafted chalk art on the sidewalk without asking permission. Half the street thinks it\'s illegal. Half thinks it\'s wonderful.',
    options: [
      { id: 'defend_art', label: 'Defend the chalk artist passionately', description: 'It\'s chalk. It rains.', effects: { morale: 20, energy: -10 } },
      { id: 'report', label: 'Side with order and file a formal notice', description: 'You are the villain of the story.', effects: { morale: -5, energy: -5 } },
      { id: 'add_chalk', label: 'Add your own art to the sidewalk that night', description: 'You contribute a very large sun.', effects: { morale: 25, energy: -15 } },
    ],
  },

  {
    id: 'wknd_spa',
    title: 'The Accidental Spa Day',
    description: 'You meant to book a 30-minute massage. The receptionist misunderstood and you\'ve been booked for a full four-hour spa package. The price difference is significant.',
    options: [
      { id: 'full_package', label: 'Do the full package, no regrets', description: 'You are genuinely a different person afterward.', effects: { health: 25, morale: 25, energy: 20, money: -120 }, available: p => p.money >= 120 },
      { id: 'half', label: 'Do two hours and leave early', description: 'Good. Sustainable.', effects: { health: 15, morale: 20, energy: 15, money: -60 }, available: p => p.money >= 60 },
      { id: 'just_massage', label: 'Clarify the booking and get just the massage', description: 'They are very understanding.', effects: { health: 10, morale: 15, energy: 10, money: -30 }, available: p => p.money >= 30 },
    ],
  },

  {
    id: 'wknd_documentary',
    title: 'You Are in a Documentary',
    description: 'A documentary crew is filming "everyday life in the city." They\'d like to follow you for a Saturday. Six hours. They\'re very professional. You had no plans.',
    options: [
      { id: 'yes', label: 'Agree and live your best normal Saturday', description: 'The mundane becomes art.', effects: { morale: 25, energy: -15, money: 50 } },
      { id: 'refuse', label: 'Decline on privacy grounds', description: 'They film someone else. The someone else seems interesting.', effects: { energy: 15, morale: 5 } },
      { id: 'perform', label: 'Agree but invent elaborate plans for the day', description: '"I always go to the cheese museum on Saturdays."', effects: { morale: 20, energy: -20, money: 40 } },
    ],
  },

  {
    id: 'wknd_sunrise',
    title: 'Spontaneous Sunrise Watch',
    description: 'Your alarm goes off by accident at 5am and you\'re now wide awake. The sunrise happens at 5:43. The roof of your building is technically accessible.',
    options: [
      { id: 'roof', label: 'Go to the roof and watch the sunrise', description: 'Genuinely beautiful. Worth the alarm.', effects: { morale: 20, health: 5, energy: -5 } },
      { id: 'park', label: 'Walk to the park and watch it there', description: 'You have the park to yourself.', effects: { morale: 25, health: 10, energy: -10 } },
      { id: 'sleep', label: 'Go back to sleep', description: 'Good decision. No regrets.', effects: { energy: 20, morale: 5 } },
    ],
  },

  {
    id: 'wknd_book_fair',
    title: 'The Enormous Book Fair',
    description: 'A massive used book fair at the exhibition center. $1 per paperback, $3 per hardback. You have $20 and limited shelf space and absolutely no discipline.',
    options: [
      { id: 'limit', label: 'Set a strict budget and stick to it', description: 'Six books. A good haul.', effects: { education: 1, morale: 20, money: -20, energy: -15 }, available: p => p.money >= 20 },
      { id: 'browse', label: 'Browse without buying', description: 'Willpower used to maximum effect.', effects: { education: 1, morale: 10, energy: -10 } },
      { id: 'bag_deal', label: 'Pay for the "fill a bag for $15" deal', description: 'Seventeen books. One structural concern with your bag.', effects: { education: 1, morale: 25, money: -15, energy: -20 }, available: p => p.money >= 15 },
    ],
  },

  {
    id: 'wknd_street_food',
    title: 'The International Street Food Weekend',
    description: 'A street food festival celebrating 20 different cuisines. You have $30, a strong stomach, and no plan. Every booth smells amazing in a different way.',
    options: [
      { id: 'ambitious', label: 'Try ten different dishes across ten cuisines', description: 'Incredible. Ambitious. You regret nothing.', effects: { hunger: 40, morale: 25, money: -30, health: -5, energy: -10 }, available: p => p.money >= 30 },
      { id: 'focused', label: 'Pick three dishes from cuisines you don\'t know', description: 'Deliberate. Educational.', effects: { hunger: 30, morale: 20, money: -18, education: 1 }, available: p => p.money >= 18 },
      { id: 'safe', label: 'Find something familiar and eat well', description: 'The pierogi line moves fast.', effects: { hunger: 25, morale: 15, money: -12 }, available: p => p.money >= 12 },
    ],
  },

  {
    id: 'wknd_fitness_disaster',
    title: 'Fitness Challenge Sign-Up',
    description: 'A fitness studio is offering a free "try before you buy" class this Saturday. You didn\'t check what type of class it was. It\'s advanced aerial yoga. You are not flexible.',
    options: [
      { id: 'attempt', label: 'Attempt the full class with dignity', description: 'You complete approximately 40% of the moves. The instructor is supportive.', effects: { health: 10, morale: 15, energy: -25 } },
      { id: 'modify', label: 'Ask for the modified version of every pose', description: 'Smart. Safe. Still exhausting.', effects: { health: 10, morale: 20, energy: -20 } },
      { id: 'leave', label: 'Leave after the warm-up citing "a commitment"', description: 'You have no such commitment. The instructor understands.', effects: { morale: 5, energy: -5 } },
    ],
  },

  {
    id: 'wknd_astronomy',
    title: 'Rooftop Stargazing Night',
    description: 'An astronomy club is running a rooftop stargazing session. Equipment provided. The city light pollution is significant but Jupiter is clearly visible.',
    options: [
      { id: 'attend', label: 'Attend the full session', description: 'You identify Jupiter, Orion, and one satellite.', effects: { morale: 20, energy: -10, education: 1 } },
      { id: 'telescope', label: 'Get time on the big telescope specifically', description: 'Saturn\'s rings. Actual Saturn\'s rings.', effects: { morale: 25, energy: -10, education: 1 } },
      { id: 'own_way', label: 'Lie on a blanket and just look up without equipment', description: 'Ancient and correct.', effects: { morale: 20, health: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_language_class',
    title: 'Free Language Taster Class',
    description: 'A language school is offering free one-hour taster sessions this Saturday for 12 different languages. You can try as many as you want. The Japanese class is full.',
    options: [
      { id: 'one', label: 'Pick one language and focus seriously', description: 'You can now say five sentences in Portuguese.', effects: { education: 1, morale: 15, energy: -15 } },
      { id: 'three', label: 'Do three languages in one morning', description: 'Your brain is a buffet of grammatical structures.', effects: { education: 1, morale: 20, energy: -25 } },
      { id: 'hardest', label: 'Sign up for the hardest-looking one', description: 'You chose Mandarin. Brave.', effects: { education: 1, morale: 20, energy: -20 } },
    ],
  },

  {
    id: 'wknd_farmer_stay',
    title: 'The Farm Exchange Program',
    description: 'You\'ve won a free weekend spot at a working farm through a city-run exchange program you vaguely remember signing up for. They need help. The work starts at 6am.',
    options: [
      { id: 'go', label: 'Go and work the full day', description: 'You feed chickens, fix a fence, and eat the best dinner of your life.', effects: { health: 20, morale: 20, hunger: 35, energy: -30 } },
      { id: 'morning_only', label: 'Go for the morning and leave after lunch', description: 'Dignified. The chickens seem fine.', effects: { health: 10, morale: 15, hunger: 25, energy: -15 } },
      { id: 'cancel', label: 'Cancel and stay in bed', description: 'Reasonable. The farm continues without you.', effects: { energy: 20, morale: 5 } },
    ],
  },

  {
    id: 'wknd_meditation',
    title: 'The Questionable Meditation Retreat',
    description: 'A one-day urban meditation retreat for $25. The brochure promises "inner peace" and "a journey to your true self." The venue is a repurposed parking garage.',
    options: [
      { id: 'full', label: 'Commit to the full day', description: 'Four hours in, something genuinely clicks.', effects: { health: 10, morale: 25, energy: 15, money: -25 }, available: p => p.money >= 25 },
      { id: 'morning', label: 'Do the morning session only', description: 'Half a journey. Still worth it.', effects: { health: 5, morale: 15, energy: 10, money: -15 }, available: p => p.money >= 15 },
      { id: 'free_version', label: 'Meditate at home for free', description: 'You fall asleep in 12 minutes. Still restful.', effects: { health: 5, morale: 10, energy: 20 } },
    ],
  },

  {
    id: 'wknd_rest',
    title: 'The Unscheduled Weekend',
    description: 'No plans. No obligations. A rare and confusing situation. The couch is available. The city is outside. Both are valid choices.',
    options: [
      { id: 'rest', label: 'Rest aggressively — do nothing on purpose', description: 'Revolutionary.', effects: { energy: 30, morale: 15, hunger: -10 } },
      { id: 'explore', label: 'Wander the city with no destination', description: 'You find a street you\'ve never been on. There\'s a small mural.', effects: { morale: 20, health: 5, energy: -10 } },
      { id: 'productive', label: 'Tackle one thing you\'ve been putting off', description: 'The tax forms are done. You feel lighter.', effects: { morale: 20, energy: -15 } },
    ],
  },

  {
    id: 'wknd_picnic_swans',
    title: 'Picnic Ambushed by Swans',
    description: 'Perfect picnic spot in the park. Blue sky. Good sandwiches. Then: a swan. Then: more swans. They are not asking. They are advancing.',
    options: [
      { id: 'retreat', label: 'Retreat with dignity and the sandwiches', description: '"The park is theirs on Saturdays."', effects: { hunger: 20, morale: 10, energy: -5 } },
      { id: 'stand_ground', label: 'Stand your ground — this is your picnic', description: 'A standoff lasting 15 minutes. You win, but barely.', effects: { hunger: 20, morale: 20, energy: -10 } },
      { id: 'offer', label: 'Offer the swans a corner of your sandwich', description: 'This was a mistake. More swans arrive.', effects: { hunger: 10, morale: 20, energy: -15 } },
    ],
  },

  {
    id: 'wknd_impersonator_con',
    title: 'Celebrity Impersonator Convention',
    description: 'A convention for celebrity impersonators is happening downtown. Entry is $10. Inside: four Elvises, two Beyoncés, and one person who claims to be impersonating "a feeling."',
    options: [
      { id: 'attend', label: 'Attend and take it very seriously', description: 'The craft is real.', effects: { morale: 25, energy: -10, money: -10 }, available: p => p.money >= 10 },
      { id: 'enter_contest', label: 'Enter the amateur impersonation competition', description: 'You do your best impression of "confident." It goes okay.', effects: { morale: 20, energy: -15, money: -10 }, available: p => p.money >= 10 },
      { id: 'feeling', label: 'Track down the "feeling" impersonator', description: 'Profound conversation. Unresolved.', effects: { morale: 20, energy: -10, money: -10 }, available: p => p.money >= 10 },
    ],
  },

  {
    id: 'wknd_doomscroll',
    title: 'Social Media Detox (Attempted)',
    description: 'You\'ve decided to spend the weekend off social media. The first hour is peaceful. The second hour you wonder what you\'re missing. By hour three you\'ve reorganized your kitchen.',
    options: [
      { id: 'full_detox', label: 'Commit to the full weekend offline', description: 'You finish two books and feel smug.', effects: { health: 10, morale: 20, energy: 15, education: 1 } },
      { id: 'partial', label: 'Limit yourself to 30 minutes a day', description: 'Moderate. Achievable. Still annoying.', effects: { health: 5, morale: 15, energy: 10 } },
      { id: 'give_in', label: 'Give up by Saturday afternoon', description: 'You were gone for 14 hours. The internet missed nothing.', effects: { morale: 5, energy: 5 } },
    ],
  },

  {
    id: 'wknd_talent_show',
    title: 'Neighborhood Talent Show',
    description: 'The community center is running a neighborhood talent show. First prize: $100. The competition includes a 9-year-old who plays violin and a retired teacher who does card tricks.',
    options: [
      { id: 'enter', label: 'Enter with an actual skill', description: 'You do something confidently.', effects: { morale: 25, energy: -20, money: 100 } },
      { id: 'watch', label: 'Watch as an enthusiastic audience member', description: 'The 9-year-old wins. Obviously. Correctly.', effects: { morale: 20, energy: -5 } },
      { id: 'volunteer', label: 'Volunteer to run the event backstage', description: 'Thankless but important.', effects: { morale: 15, energy: -20 } },
    ],
  },
];

export function pickRandomWeekendEvent(): WeekendEvent {
  return ALL_WEEKEND_EVENTS[Math.floor(Math.random() * ALL_WEEKEND_EVENTS.length)];
}
