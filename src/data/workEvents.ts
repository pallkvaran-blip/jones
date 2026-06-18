import type { CareerTrack } from '../state/types'

export interface WorkEventChoice {
  label: string
  delta: {
    money?: number
    morale?: number
    energy?: number
    health?: number
    education?: number
    creditScore?: number
    fired?: boolean   // if true, player gets fired on the spot
    petId?: string    // if set, player gets that pet for free
  }
  logMsg: string
}

export interface WorkEvent {
  id: string
  title: string
  description: string
  choices: WorkEventChoice[]
}

export const WORK_EVENTS: Record<CareerTrack, WorkEvent[]> = {
  trades: [
    {
      id: 'trades_wrong_tiles',
      title: 'The Tile Situation',
      description: "The client wants the bathroom tiles in a pattern you'd describe as 'aggressively wrong.' Your professional soul is weeping. What do you do?",
      choices: [
        { label: 'Diplomatically suggest alternatives', delta: { money: 100, morale: 5 }, logMsg: 'Tactfully redirected the client toward better tile choices. They begrudgingly agreed.' },
        { label: "Just do it — it's their money", delta: { morale: 15, money: 20 }, logMsg: "You installed the nightmare tiles. Client was thrilled. You'll need therapy." },
        { label: 'Tell them straight: those tiles are hideous', delta: { morale: 15 }, logMsg: "You spoke the truth. The client appreciated your honesty. Mostly." },
      ],
    },
    {
      id: 'trades_suspicious_wall',
      title: 'Something in the Wall',
      description: "You find something suspicious inside the wall. Very suspicious. It's wrapped in a bin bag and you don't want to know, but you have to decide.",
      choices: [
        { label: 'Report it immediately', delta: { money: 200, morale: 10 }, logMsg: 'Reported the suspicious wall contents. Turned out to be a 1989 lunchbox. Still, good call.' },
        { label: 'Seal it back up — not your problem', delta: { money: -80, morale: -5 }, logMsg: "You sealed the wall. It's someone else's mystery now." },
        { label: 'Take a photo and post it online', delta: { morale: 20 }, logMsg: 'Your post went semi-viral. Turned out it was a hamster funeral. The internet loved it.' },
      ],
    },
    {
      id: 'trades_apprentice_gas_line',
      title: 'Gas Line Incident',
      description: "Your apprentice hit a gas line. The foreman is five minutes away and everyone on site is staring at you.",
      choices: [
        { label: 'Take the blame yourself', delta: { money: -150, morale: 20 }, logMsg: "You took the hit for the apprentice. They owe you one. Big time." },
        { label: 'Blame the apprentice', delta: { morale: -15 }, logMsg: 'You threw the apprentice under the bus. Efficient but not your finest hour.' },
        { label: 'Fix it before anyone notices', delta: { money: 200, energy: -20 }, logMsg: 'You fixed the gas line in record time. No one will ever know. Probably.' },
      ],
    },
    {
      id: 'trades_helpful_client',
      title: 'The Helpful Client',
      description: "A client insists on watching you work and 'helping' by holding tools incorrectly. They are very enthusiastic and very wrong.",
      choices: [
        { label: 'Politely redirect them to another room', delta: { money: 200, morale: 10 }, logMsg: "You gave the client a 'very important task' in the living room. Bliss." },
        { label: "Let them help — it's fine", delta: { money: -80, morale: -10 }, logMsg: "They stripped three screws and knocked over your toolbox. It was not fine." },
        { label: 'Give them a fake task to keep them busy', delta: { money: 200, morale: 10 }, logMsg: "You told them to 'hold this level perfectly still' in the hallway for 40 minutes. Genius." },
      ],
    },
    {
      id: 'trades_radio_repeat',
      title: 'The Radio',
      description: "The job site radio is playing nothing but one artist, all day, on repeat. It has been six hours. You can hum every song backwards.",
      choices: [
        { label: 'Bring your own earbuds tomorrow', delta: { morale: 15, money: 50 }, logMsg: 'You made a mental note to bring earbuds. Tomorrow will be better.' },
        { label: 'Smash the radio', delta: { fired: true, morale: 30 }, logMsg: "You smashed the radio. Everyone cheered. You're buying a new one, but it was worth it." },
        { label: 'Learn to love it', delta: { morale: -5 }, logMsg: "You didn't smash the radio. You should have smashed the radio." },
      ],
    },
    {
      id: 'trades_wrong_measurements',
      title: 'Measurement Error',
      description: "Halfway through the job you realise your measurements are off by 15 centimetres. The materials are already cut.",
      choices: [
        { label: 'Own up and order new materials', delta: { money: -40, morale: 5 }, logMsg: 'You ate the cost and ordered correct materials. Expensive integrity.' },
        { label: 'Get creative with the gap', delta: { morale: 5 }, logMsg: "You filled the gap with 'architectural sealant.' It holds. Technically." },
        { label: 'Blame the original plans', delta: { money: -80, morale: -5 }, logMsg: 'You blamed the architect. They pushed back with emails. You lost.' },
      ],
    },
    {
      id: 'trades_no_permit',
      title: 'No Permit',
      description: "The homeowner casually mentions they forgot to get a permit for this renovation. The inspector is due Tuesday.",
      choices: [
        { label: 'Stop work until permit is obtained', delta: { money: 200, morale: 10 }, logMsg: 'You halted work. Annoyed client, but saved everyone from a fine.' },
        { label: 'Keep going — probably fine', delta: { money: -150, morale: -10 }, logMsg: "The inspector showed up Monday. It was not fine." },
        { label: 'Advise them in writing and continue', delta: { morale: 15, money: 50 }, logMsg: 'Documented your concerns and continued. Paper trail secured.' },
      ],
    },
    {
      id: 'trades_broken_tool',
      title: 'Borrowed Tool Returns',
      description: "A colleague borrowed your best drill three weeks ago. Today they returned it with a new crack in the housing and a casual shrug.",
      choices: [
        { label: 'Calmly ask them to replace it', delta: { morale: 15, money: 50 }, logMsg: "Handled it professionally. They paid up, eventually." },
        { label: 'Say nothing, seethe internally', delta: { morale: -15 }, logMsg: "You said nothing. You are still thinking about it right now." },
        { label: 'Never lend tools again — announce it loudly', delta: { morale: 15 }, logMsg: "You made a speech. Nobody argues with you about tools anymore." },
      ],
    },
    {
      id: 'trades_rain_delay',
      title: 'Roof Job in the Rain',
      description: "You're scheduled for a roof job but it's pelting rain. The site manager says push through. Your gut says no.",
      choices: [
        { label: 'Refuse — it is a safety issue', delta: { money: 100, morale: 15 }, logMsg: 'You stood your ground on safety. Site manager grumbled, but agreed.' },
        { label: 'Push through carefully', delta: { morale: 15, energy: -20, health: -5 }, logMsg: 'You got it done in the rain. Soaking wet, slightly miserable, professionally capable.' },
        { label: 'Stall until conditions improve', delta: { morale: 5 }, logMsg: 'You found eleven other tasks to do until the rain stopped.' },
      ],
    },
    {
      id: 'trades_overcharge',
      title: 'The Invoice',
      description: "You're filling out the invoice and realise you could easily add two extra hours and the client would never know.",
      choices: [
        { label: 'Invoice honestly', delta: { money: 200, morale: 10 }, logMsg: "You invoiced exactly what was owed. Reputation points earned." },
        { label: 'Add an hour — call it admin time', delta: { morale: -10, money: 60 }, logMsg: "You padded the invoice. It worked. You feel a little weird about it." },
        { label: 'Invoice honestly and add a discount for their loyalty', delta: { money: 300, morale: 15 }, logMsg: 'Client was thrilled. They booked you for three more jobs on the spot.' },
      ],
    },
    {
      id: 'trades_confined_space',
      title: 'The Crawl Space',
      description: "There's a fault inside a crawl space that's definitely smaller than you remember crawl spaces being. Someone has to go in.",
      choices: [
        { label: 'You go in — no excuses', delta: { money: 200, energy: -15, health: -5 }, logMsg: 'You went in. Fixed it. Emerged covered in insulation and minor regrets.' },
        { label: 'Ask for a volunteer', delta: { morale: 5 }, logMsg: 'Nobody volunteered. You went in anyway. So much for that plan.' },
        { label: 'Reroute to avoid the crawl space', delta: { morale: 15, money: -30 }, logMsg: 'You found a longer route that avoided the crawl space. Pricier, but your dignity is intact.' },
      ],
    },
    {
      id: 'trades_mystery_plumbing',
      title: 'Vintage Plumbing',
      description: "The pipes behind this wall are not like any pipes you've seen before. They predate the building itself, somehow.",
      choices: [
        { label: 'Document everything and get help', delta: { money: 200, education: 2 }, logMsg: 'Called in an expert. Turns out it was a historically notable installation. You learned something.' },
        { label: 'Improvise a solution', delta: { morale: 15, money: 50 }, logMsg: "You improvised. It held. You'll never speak of the method publicly." },
        { label: 'Replace everything — start fresh', delta: { morale: -10, money: -50 }, logMsg: 'You ripped it all out and started from scratch. Expensive, but you sleep soundly.' },
      ],
    },
    {
      id: 'trades_ladder_incident',
      title: 'The Ladder Wobble',
      description: "A visiting executive from the client company starts climbing your unsecured ladder 'just to see the view.' They are in a suit.",
      choices: [
        { label: 'Intervene immediately and firmly', delta: { money: 300, morale: 10 }, logMsg: 'You stopped the executive. Explained safety. They thanked you. Their PA looked relieved.' },
        { label: 'Loudly clear your throat from below', delta: { money: 100, morale: 5 }, logMsg: 'The cough did the job. They stepped down. Nobody acknowledged what happened.' },
        { label: 'Let them figure it out', delta: { money: -150, morale: -10 }, logMsg: 'They got three rungs up before their dignity stepped in. You got a safety briefing the next day.' },
      ],
    },
    {
      id: 'trades_wrong_colour',
      title: 'Wrong Paint Colour',
      description: "You've painted the entire exterior of the house. The client comes out, stares at it, and says: 'That's the wrong colour.'",
      choices: [
        { label: 'Check the order — confirm who is right', delta: { money: 100, morale: 5 }, logMsg: "You checked the order. You were right. You showed them the email. They apologised." },
        { label: 'Repaint at your cost to keep the peace', delta: { morale: 15, money: -80 }, logMsg: 'You repainted the house. The new colour is identical. Client is somehow happier.' },
        { label: "It's on the work order — stand firm", delta: { morale: 15 }, logMsg: 'You held your ground with the paperwork. Client disputed it for three days, then dropped it.' },
      ],
    },
    {
      id: 'trades_hot_works',
      title: 'Hot Works Permit',
      description: "You need to do welding inside a building, but no one can find the hot works permit. The foreman says just get it done.",
      choices: [
        { label: 'Refuse until the permit is located', delta: { money: 100, morale: 10 }, logMsg: 'You held firm. The permit was found in a coat pocket 20 minutes later.' },
        { label: 'Do it quickly — in and out', delta: { money: -80, morale: -5, health: -5 }, logMsg: "You did it without the permit. It went fine. It shouldn't have." },
        { label: 'Issue a written refusal and escalate', delta: { money: 200, morale: 5 }, logMsg: 'You escalated. Got the permit within the hour. Proper process wins.' },
      ],
    },
  ],

  tech: [
    {
      id: 'tech_unplugged_computer',
      title: "It's Unplugged",
      description: "A user calls. Their computer is broken. You get there. It's unplugged. They are watching you. You have options.",
      choices: [
        { label: 'Fix it without saying a word', delta: { money: 100, morale: 5 }, logMsg: "You plugged it in. Smiled. Left. The mystery lives on." },
        { label: 'Explain patiently and walk them through it', delta: { money: 200, morale: 10 }, logMsg: "You gave a kind explanation. They now check the plug first. Progress." },
        { label: 'Send a passive-aggressive all-staff email about plugs', delta: { money: -150, morale: 25 }, logMsg: "Your email about 'power socket awareness' is now office legend. Nobody thanked you." },
      ],
    },
    {
      id: 'tech_blockchain_request',
      title: 'Add Blockchain',
      description: "The CEO wants to 'add blockchain' to the company's static brochure website. They saw it at a conference. They are very excited.",
      choices: [
        { label: "Nod, take notes, do nothing, wait", delta: { morale: -10, money: 50 }, logMsg: "You nodded. Two weeks later they forgot. Classic." },
        { label: "Build a prototype that's 'blockchain-powered' in name only", delta: { money: 100, morale: 5 }, logMsg: "You built 'BlockBrochure v1.0' — just a cached JSON file. CEO demoed it at the board meeting." },
        { label: 'Explain why this is not a good idea', delta: { morale: 15, education: 3 }, logMsg: "You spent 20 minutes educating the CEO. They were annoyed then thoughtful. Respect was gained." },
      ],
    },
    {
      id: 'tech_pushed_to_prod',
      title: 'Production Deployment',
      description: "You accidentally pushed to production instead of staging. The homepage now says 'TEST TEST TEST' in 48-point font. Everything is on fire.",
      choices: [
        { label: 'Own it immediately and fix it', delta: { money: -80, morale: 10 }, logMsg: "You owned the mistake and reverted fast. Team appreciated the honesty." },
        { label: 'Quietly fix it before anyone notices', delta: { money: 200, energy: -25 }, logMsg: "You rolled it back in 4 minutes. Three people noticed. Two stayed quiet. One wrote a Slack message." },
        { label: 'Blame the CI pipeline', delta: { fired: true, morale: -5 }, logMsg: "You blamed the CI. The logs disagreed. The logs were very clear." },
      ],
    },
    {
      id: 'tech_intern_code_review',
      title: 'The Intern Review',
      description: "Your code review was picked apart by the newest intern. They found four bugs and a memory leak. Their comments are accurate.",
      choices: [
        { label: 'Graciously accept the feedback', delta: { money: 200, education: 5 }, logMsg: "You thanked the intern and fixed everything. They look up to you now. Deserved." },
        { label: 'Die inside silently and merge the fixes', delta: { morale: -20 }, logMsg: "You merged the fixes without acknowledgement. Nobody believes you're okay." },
        { label: 'Review their code back with extreme thoroughness', delta: { morale: 10 }, logMsg: "You found one minor thing in their code. They fixed it immediately. Honours even." },
      ],
    },
    {
      id: 'tech_printer',
      title: 'The Printer',
      description: "The printer is broken again. In a new and creative way. It has produced a single page that is 100% black with one white dot in the centre.",
      choices: [
        { label: 'Fix it heroically', delta: { money: 200, energy: -15 }, logMsg: "You fixed the printer. They broke it again by lunch. Sisyphean." },
        { label: "Tape an 'Out of Order' sign on it", delta: { morale: 15, money: 50 }, logMsg: "You signed it off. Tomorrow's problem." },
        { label: "Suggest buying a new one — for the seventh time", delta: { morale: 15, education: 2 }, logMsg: "You raised it in the meeting. It was minuted. It will be ignored. It was still the right call." },
      ],
    },
    {
      id: 'tech_password_forever',
      title: 'Password Reset Loop',
      description: "A senior manager has been locked out of their account for three days. They're too embarrassed to admit they keep resetting to the same forbidden password.",
      choices: [
        { label: 'Help them without making them feel judged', delta: { money: 200, morale: 10 }, logMsg: "You sorted it discreetly. They were grateful. You will never speak of this." },
        { label: 'Show them the password policy screen in detail', delta: { morale: 15, money: 50 }, logMsg: "You walked them through the policy. They absorbed 40% of it. Good enough." },
        { label: 'Set a temporary password and walk away', delta: { morale: 5 }, logMsg: "You fixed it technically. They got locked out again tomorrow." },
      ],
    },
    {
      id: 'tech_3am_call',
      title: 'The 3AM Slack Ping',
      description: "You wake up to 14 Slack notifications. The server is down. It happened 20 minutes ago. Your manager pinged 'anyone there??'",
      choices: [
        { label: 'Jump on it immediately', delta: { money: 300, energy: -25, morale: -10 }, logMsg: "You fixed it at 3AM. Full marks. Also no sleep. You have a meeting at 9." },
        { label: 'Set up the on-call rotation properly tomorrow', delta: { morale: 15, money: 50 }, logMsg: "You messaged the on-call person (who was asleep). Server stayed down until 6AM. You made the rotation doc." },
        { label: 'Sleep through it — not officially on-call', delta: { money: -150, morale: 5 }, logMsg: "You weren't officially on-call, so you slept. The postmortem meeting was a bit tense." },
      ],
    },
    {
      id: 'tech_requirements_change',
      title: 'Changed Requirements',
      description: "You've been building a feature for three weeks. A product manager just sent a Slack message saying the requirements 'evolved a bit' — the feature is now entirely different.",
      choices: [
        { label: 'Ask for a formal change request', delta: { money: 100, morale: 5 }, logMsg: "You requested documentation. It created a 2-day paper trail but protected the timeline." },
        { label: 'Start over with a smile', delta: { morale: -15, money: 50 }, logMsg: "You smiled. You started over. Internally, something has died." },
        { label: 'Push back: previous work was already signed off', delta: { money: 200, morale: 10 }, logMsg: "You escalated. Half the original scope was reinstated. Boundaries respected." },
      ],
    },
    {
      id: 'tech_legacy_code',
      title: 'The Legacy File',
      description: "You open a file that is twelve years old. There are no comments. The variable names are single letters. There is a comment that says 'DO NOT TOUCH.'",
      choices: [
        { label: 'Refactor it properly — document everything', delta: { money: 200, energy: -20, education: 3 }, logMsg: "You refactored the file. Took four hours. It's beautiful. It might break something else." },
        { label: 'Make your change and close the file', delta: { morale: -5, money: 50 }, logMsg: "You made the minimal change. Closed the file. Did not touch the 'DO NOT TOUCH' section." },
        { label: 'Ask who wrote it and why', delta: { morale: 15, money: 50 }, logMsg: "The original developer is now the CTO. They laughed nervously and said 'I was younger then.'" },
      ],
    },
    {
      id: 'tech_wifi_down',
      title: 'WiFi is Down',
      description: "The office WiFi is down. 40 people are staring at you. You did not touch the WiFi. You were eating lunch.",
      choices: [
        { label: 'Investigate and fix it anyway', delta: { money: 100, energy: -15 }, logMsg: "You fixed the WiFi. Someone had bumped the router. You are a hero. You hate this." },
        { label: 'Direct them to the IT ticket system', delta: { morale: 15, money: 50 }, logMsg: "You pointed at the ticket portal. Half of them used it. WiFi was restored in 30 minutes by someone else." },
        { label: "Tell them it's not your area", delta: { money: -80, morale: 15 }, logMsg: "You held the line. True. But they will still come to you next time." },
      ],
    },
    {
      id: 'tech_data_breach_near_miss',
      title: 'The Near Miss',
      description: "You notice a misconfigured S3 bucket — public read access on a folder that contains customer data. Nobody else has noticed.",
      choices: [
        { label: 'Fix and report immediately', delta: { money: 300, morale: 15 }, logMsg: "You fixed it and reported. Management were very glad you found it first." },
        { label: 'Fix quietly and say nothing', delta: { morale: -10, money: 50 }, logMsg: "You fixed it. No one knows. You know. You'll think about this for a while." },
        { label: "File a security ticket and set it to 'low priority'", delta: { money: -150, morale: -10 }, logMsg: "You filed it low priority. It sat in the queue for four days. That postmortem was uncomfortable." },
      ],
    },
    {
      id: 'tech_demo_crash',
      title: 'The Demo Crash',
      description: "Your feature is being demoed to the VP in 10 minutes. It just crashed in local testing. You found a workaround — but it's not pretty.",
      choices: [
        { label: 'Use the workaround and say nothing', delta: { money: 100, morale: -5 }, logMsg: "The demo went flawlessly. You will fix the bug tonight. All is well." },
        { label: 'Delay the demo and fix it properly', delta: { morale: 15, energy: -20 }, logMsg: "You fixed the bug. Demo pushed 30 minutes. VP was understanding. Feature was solid." },
        { label: 'Disclose the bug before the demo', delta: { money: 200, morale: 10 }, logMsg: "You told the VP beforehand. They respected the transparency and extended the timeline." },
      ],
    },
    {
      id: 'tech_scope_creep_request',
      title: "While You're In There",
      description: "A colleague sees you working on a module and asks if you could 'also just quickly' add a feature that is absolutely not quick.",
      choices: [
        { label: 'Politely redirect them to raise a ticket', delta: { money: 100, morale: 5 }, logMsg: "They raised a ticket. It was properly scoped and scheduled. Revolutionary." },
        { label: "Do it — it is quick actually", delta: { morale: -10, energy: -15 }, logMsg: "Three hours later you understand why the original developers avoided this module." },
        { label: 'Agree and never do it', delta: { money: -80, morale: -5 }, logMsg: "You said yes. You forgot. They remembered. Awkward stand-up tomorrow." },
      ],
    },
    {
      id: 'tech_meeting_that_could_be_email',
      title: 'The Meeting',
      description: "You have been in a meeting for 90 minutes. The agenda is three lines. You could have read it in 40 seconds.",
      choices: [
        { label: 'Propose async updates going forward', delta: { money: 100, morale: 15, energy: 5 }, logMsg: "You suggested async. Half the room agreed. The other half looked offended. Progress." },
        { label: 'Endure it and take thorough notes', delta: { morale: 15, energy: -10 }, logMsg: "You survived. Your notes are extraordinarily detailed. Nobody will read them." },
        { label: 'Multitask with your laptop open', delta: { morale: 5 }, logMsg: "You shipped a bug fix during the meeting. Your manager noticed the typing. It was noted." },
      ],
    },
    {
      id: 'tech_the_bus_factor',
      title: 'You Are the Bus Factor',
      description: "You realise you are the only person who knows how a critical internal system works. Your colleague is going on parental leave next week.",
      choices: [
        { label: 'Document everything this week', delta: { money: 300, education: 3, energy: -15 }, logMsg: "You wrote comprehensive docs. You are now indispensable for the right reasons." },
        { label: 'Write a handover doc — minimal version', delta: { money: 100, morale: 5 }, logMsg: "You wrote a short handover. Not perfect, but better than nothing." },
        { label: 'Do nothing — job security', delta: { money: -80, morale: -5 }, logMsg: "You did nothing. The system broke while your colleague was away. It was your call." },
      ],
    },
  ],

  finance: [
    {
      id: 'finance_meme_coin',
      title: 'The Meme Coin Client',
      description: "A client wants to put their entire retirement savings into a meme coin they found on a forum at 2AM. They are very confident about this.",
      choices: [
        { label: 'Talk them out of it firmly', delta: { money: 200, morale: 10 }, logMsg: "You talked them down. They were annoyed at the time. Called to thank you three months later." },
        { label: 'Document your advice and let them decide', delta: { morale: 15, money: 50 }, logMsg: "You advised, documented, let them decide. They invested 10% instead of 100%. Diplomatic win." },
        { label: 'Process it — their money, their choice', delta: { money: -80, morale: -15 }, logMsg: "You processed the transaction. The coin dropped 80% in a week. They remember who processed it." },
      ],
    },
    {
      id: 'finance_boss_error',
      title: 'The $40k Mistake',
      description: "You spot a $40,000 error in the quarterly report. It's your boss's mistake. The report goes to the board tomorrow.",
      choices: [
        { label: "Report it to your boss privately", delta: { money: 300, morale: 10 }, logMsg: "You told your boss privately. They fixed it and thanked you quietly. Kept in the vault." },
        { label: 'Fix it without saying anything', delta: { money: 100, morale: -5 }, logMsg: "You fixed it silently. Nobody knows. You know. Your boss owes you one." },
        { label: "Escalate above your boss", delta: { morale: 15, creditScore: 5 }, logMsg: "You went above. The error was corrected. The board were relieved. Your boss was not." },
      ],
    },
    {
      id: 'finance_rude_client',
      title: 'The Difficult Client',
      description: "A very wealthy client is being aggressively rude about a standard service fee. They are using volume as a negotiating tactic.",
      choices: [
        { label: 'Apologise professionally and absorb it', delta: { money: 100, morale: -15 }, logMsg: "You apologised professionally. They calmed down. You feel a little hollow." },
        { label: 'Waive the fee to end the interaction', delta: { money: -80, morale: -5 }, logMsg: "You waived the fee. They'll expect this every time." },
        { label: 'Hold your ground politely but firmly', delta: { money: 200, morale: 10 }, logMsg: "You held firm. The client huffed and paid. Respect established." },
      ],
    },
    {
      id: 'finance_party_stock_tips',
      title: 'Stock Tips at a Party',
      description: "Someone at a party finds out you work in finance. They immediately ask for a hot stock tip. You are holding a drink. You just wanted a quiet evening.",
      choices: [
        { label: 'Give generic diversification advice', delta: { morale: -5, money: 50 }, logMsg: "You gave the standard speech. They looked disappointed but nodded." },
        { label: 'Give them a genuinely good tip', delta: { money: 100, morale: 15 }, logMsg: "You gave real advice. They texted you three months later saying it worked." },
        { label: "Pretend you're an accountant", delta: { morale: 10 }, logMsg: "You claimed to be a tax accountant. The conversation immediately ended. Perfect." },
      ],
    },
    {
      id: 'finance_wrong_lunch_order',
      title: 'The Lunch Order',
      description: "You organised the branch's lunch order. It arrived wrong. Everyone is looking at you.",
      choices: [
        { label: 'Fix it at your own cost', delta: { money: -40, morale: 15 }, logMsg: "You reordered at your own expense. The team was grateful. You're eating toast tonight." },
        { label: 'It is what it is — redistribute and move on', delta: { morale: -10, money: 50 }, logMsg: "You managed the redistribution. Some people got chips instead of salad. They survived." },
        { label: 'Blame the delivery app publicly', delta: { morale: 5 }, logMsg: "You blamed the app. Technically accurate. Widely unconvinced." },
      ],
    },
    {
      id: 'finance_audit_surprise',
      title: 'The Audit',
      description: "An unannounced internal audit is happening today. A colleague has asked you to 'not mention' a file you both know about.",
      choices: [
        { label: 'Disclose everything you know to the auditors', delta: { money: 300, morale: 10 }, logMsg: "You disclosed fully. The matter was investigated. You slept well." },
        { label: 'Stay neutral — answer only what is asked', delta: { money: 100, morale: -5 }, logMsg: "You answered precisely and honestly. The file came up anyway. You were clear." },
        { label: "Stay quiet — not your file, not your problem", delta: { money: -150, morale: -15 }, logMsg: "You stayed quiet. The audit found it later. Your name was near it. Long week." },
      ],
    },
    {
      id: 'finance_wrong_trade',
      title: 'Wrong Trade Executed',
      description: "You executed a trade for the wrong client. It was a buy order. The right client needed a sell. Markets move fast.",
      choices: [
        { label: 'Reverse it immediately and notify compliance', delta: { money: 100, morale: 5 }, logMsg: "You reversed it and reported. Compliance appreciated the speed. Client was notified." },
        { label: 'Try to unwind it quietly', delta: { morale: -10 }, logMsg: "You tried to unwind it. It took three hours and two phone calls. It worked, barely." },
        { label: 'Freeze and ask a senior colleague', delta: { morale: 15, money: 50 }, logMsg: "You escalated immediately. Senior colleague sorted it. You learned the process." },
      ],
    },
    {
      id: 'finance_insider_gossip',
      title: 'The Overheard Conversation',
      description: "You overheard two executives discussing an acquisition that hasn't been announced. You own shares in the target company.",
      choices: [
        { label: 'Sell nothing, report what you heard to compliance', delta: { money: 300, morale: 15 }, logMsg: "You reported it immediately. Compliance thanked you. You did the right thing." },
        { label: "Do nothing — you'll just hold the shares", delta: { morale: -5, money: 50 }, logMsg: "You did nothing and held. Uncomfortable, but you didn't act on the information." },
        { label: 'Sell the shares immediately', delta: { fired: true, morale: -20 }, logMsg: "You sold. The compliance team noticed the timing. Very long conversation followed." },
      ],
    },
    {
      id: 'finance_inheritance_advice',
      title: 'The Inheritance',
      description: "A client just inherited a significant sum from a relative they barely knew. They want to spend it all within the week on 'experiences.'",
      choices: [
        { label: 'Advise a structured plan: spend some, invest the rest', delta: { money: 200, morale: 10 }, logMsg: "They agreed to a 70/30 split. Experiences funded. Future secured." },
        { label: 'Honour their request without comment', delta: { morale: -10 }, logMsg: "You processed it. They had an amazing week. You watched the balance drop to zero." },
        { label: 'Ask them to sleep on it for 48 hours first', delta: { money: 100, morale: 10 }, logMsg: "They slept on it. On day two they asked for the structured plan. Good call." },
      ],
    },
    {
      id: 'finance_expense_claim',
      title: 'The Expense Report',
      description: "A colleague has submitted an expense report with a $900 'team dinner.' You were at the dinner. It was pizza. For five people.",
      choices: [
        { label: 'Flag it to your manager', delta: { money: 200, morale: 5 }, logMsg: "You flagged it. The claim was queried. The colleague went very quiet." },
        { label: 'Mention it to the colleague first', delta: { money: 100, morale: 5 }, logMsg: "You raised it privately. They corrected the figure. Favour owed." },
        { label: 'Say nothing — not your business', delta: { morale: -5 }, logMsg: "You let it go. The accounts team caught it anyway. You knew and said nothing." },
      ],
    },
    {
      id: 'finance_market_crash_call',
      title: 'The Market is Moving',
      description: "The market is dropping fast and a client is calling in a panic asking you to sell everything immediately. Your analysis says hold.",
      choices: [
        { label: 'Talk them through it calmly and recommend holding', delta: { money: 200, morale: 10 }, logMsg: "You talked them down. Market recovered 48 hours later. They sent a thank-you note." },
        { label: 'Execute the sell as instructed', delta: { morale: -5, money: 50 }, logMsg: "You executed the sell. It was their call. They locked in the loss. They accepted it." },
        { label: 'Buy time — stall the order and call a senior colleague', delta: { money: 100, morale: 5 }, logMsg: "You stalled, escalated, and the senior colleague confirmed your read. Client held." },
      ],
    },
    {
      id: 'finance_spreadsheet_error',
      title: 'The Spreadsheet',
      description: "You discover that a projection model your team has been presenting for three months contains a formula error in cell B47. It affects every slide.",
      choices: [
        { label: 'Correct it and reissue with a clear note', delta: { money: 300, morale: 10 }, logMsg: "You reissued with a correction notice. Management respected the transparency." },
        { label: 'Fix it quietly before the next presentation', delta: { money: 100, morale: -5 }, logMsg: "You fixed it quietly. The next deck was correct. Nobody knows what B47 did." },
        { label: 'Check who built the model before deciding anything', delta: { morale: 15, money: 50 }, logMsg: "You traced it back. It was a contractor. You fixed it and documented the source." },
      ],
    },
    {
      id: 'finance_cold_call',
      title: 'Cold Call Success',
      description: "You make a cold call that you expected to go nowhere and the prospect says 'actually, we've been looking for someone exactly like you.'",
      choices: [
        { label: 'Schedule a full meeting immediately', delta: { money: 200, morale: 20 }, logMsg: "Meeting scheduled. Excellent lead. Your pipeline is looking healthy." },
        { label: 'Take their details and send a formal intro', delta: { money: 100, morale: 10 }, logMsg: "You followed process. The relationship progressed professionally." },
        { label: 'Stay on the call for two hours and close it today', delta: { money: 100, morale: 15, energy: -15 }, logMsg: "You stayed on the call. Two hours later, you had a verbal agreement. Exhausted but triumphant." },
      ],
    },
    {
      id: 'finance_regulatory_change',
      title: 'New Regulation',
      description: "A new regulatory requirement lands on your desk. It requires significant changes to your client reporting workflow. By next week.",
      choices: [
        { label: 'Prioritise compliance — work late to get it done', delta: { money: 200, energy: -20 }, logMsg: "You got it done on time. Compliance confirmed. Energy: depleted." },
        { label: 'Raise the timeline issue with management immediately', delta: { money: 100, morale: 5 }, logMsg: "You escalated the timeline. Extra resource was allocated. Crisis avoided." },
        { label: 'Adapt the closest existing template and submit', delta: { morale: 5 }, logMsg: "You adapted a template. Compliance requested amendments. Two extra days lost." },
      ],
    },
    {
      id: 'finance_client_gift',
      title: "The Client's Gift",
      description: "A high-value client sends you a very expensive bottle of whisky as a thank-you. Your company has a strict gifts policy. The limit is $50.",
      choices: [
        { label: 'Declare it to compliance and return it', delta: { money: 200, morale: 5 }, logMsg: "You declared and returned it. The client understood. Your record is clean." },
        { label: "Keep it — it's just a whisky", delta: { money: -80, morale: 10 }, logMsg: "You kept it. It was excellent whisky. The compliance audit mentioned it." },
        { label: 'Donate it to the team Christmas raffle', delta: { money: 100, morale: 15 }, logMsg: "You put it in the raffle and declared it. Everyone was happy. Technically creative compliance." },
      ],
    },
  ],

  healthcare: [
    {
      id: 'health_webmd_patient',
      title: 'Dr. WebMD',
      description: "A patient insists they have a rare tropical disease they self-diagnosed online at midnight. They have printed 11 pages of forum posts as evidence.",
      choices: [
        { label: 'Listen patiently and gently redirect to the actual symptoms', delta: { money: 200, morale: 10 }, logMsg: "You listened fully and redirected to the relevant symptoms. They left reassured." },
        { label: 'Order the tests they requested to be thorough', delta: { money: -80, morale: -5 }, logMsg: "You ordered the tests. All negative. They found a new condition online by Thursday." },
        { label: "Tell them they're fine in a tone that ends the conversation", delta: { morale: -10 }, logMsg: "You ended the consultation abruptly. They left unhappy. You were probably right." },
      ],
    },
    {
      id: 'health_iguana',
      title: 'The Iguana',
      description: "A patient has smuggled an iguana into the waiting room in their coat. It is now on the reception desk. It is very large. Nobody knows what to do.",
      choices: [
        { label: 'Remove the iguana professionally and explain the policy', delta: { money: 100, morale: 15 }, logMsg: "You handled the iguana removal with grace. Patient was apologetic. Iguana was unbothered." },
        { label: "Let it stay — it's actually quite calming for patients", delta: { money: -80, morale: 20 }, logMsg: "The iguana stayed. Patients were bizarrely relaxed. Management had questions." },
        { label: 'Try to examine the iguana while you have the chance', delta: { morale: 25, health: -5, petId: 'bubbles' }, logMsg: "You examined the iguana. It had a minor skin condition. You treated it. The grateful owner insisted you take their spare lizard as thanks. You now have a lizard named Bubbles." },
      ],
    },
    {
      id: 'health_sleeping_colleague',
      title: 'The Supply Closet',
      description: "You open the supply closet to find a colleague standing completely asleep, upright, still holding their clipboard.",
      choices: [
        { label: 'Wake them up kindly', delta: { money: 100, morale: 10 }, logMsg: "You woke them gently. They were three shifts into a double run. They thanked you quietly." },
        { label: 'Close the door and come back in 10 minutes', delta: { morale: 15, money: 50 }, logMsg: "You closed the door. When you returned, they were awake. Nobody ever spoke of it." },
        { label: 'Take a photo', delta: { money: -80, morale: 25 }, logMsg: "You took a photo. You never posted it. But you still have it. Just in case." },
      ],
    },
    {
      id: 'health_vending_machine',
      title: 'The Vending Machine',
      description: "The vending machine ate your last coins. Your lunch break is 8 minutes. Everyone else's food is in the fridge but you didn't bring anything.",
      choices: [
        { label: 'Shake the machine until something falls', delta: { energy: 10, health: -5 }, logMsg: "You shook the machine. A bag of crisps fell. You ate them in 90 seconds. No regrets." },
        { label: 'Skip lunch entirely', delta: { energy: -20 }, logMsg: "You skipped lunch. The 3PM patient noticed you were quieter than usual." },
        { label: 'Ask a colleague to borrow $2', delta: { morale: 15, energy: 15 }, logMsg: "Your colleague gave you a whole meal they'd packed extra. Unexpected kindness." },
      ],
    },
    {
      id: 'health_off_topic_symptoms',
      title: 'While You Are Here',
      description: "A patient asks you to quickly look at something completely unrelated to their appointment while you have you. It could be serious. Or nothing.",
      choices: [
        { label: 'Help anyway — you are already here', delta: { energy: -15, morale: 15 }, logMsg: "You looked at it. It needed follow-up. You flagged it. You might have caught something." },
        { label: 'Refer them properly for a separate appointment', delta: { money: 200, morale: 5 }, logMsg: "You referred them through the right channel. Proper process. They appreciated the thoroughness." },
        { label: 'Pretend you did not hear it and wrap up', delta: { money: -80, morale: -10 }, logMsg: "You wrapped up. The symptom goes unlogged. It was probably nothing. Probably." },
      ],
    },
    {
      id: 'health_late_patient',
      title: 'The 40-Minute Late',
      description: "A patient arrives 40 minutes late for a 20-minute appointment. They have a long, complicated story. The waiting room is full.",
      choices: [
        { label: 'See them — it might be important', delta: { morale: 15, energy: -15 }, logMsg: "You saw them. It was important. Your day ran an hour over. It was the right call." },
        { label: 'Rebook them for a new appointment', delta: { money: 100, morale: 5 }, logMsg: "You rebooked them. They understood. Your schedule held. Process was followed." },
        { label: 'Fit in a five-minute assessment only', delta: { money: 100, morale: 10 }, logMsg: "You did a triage-level check and rebooked the full appointment. Good middle ground." },
      ],
    },
    {
      id: 'health_medication_error_catch',
      title: 'Caught It',
      description: "You catch what looks like a prescription dosage error from a colleague. It has not yet been dispensed.",
      choices: [
        { label: 'Raise it with the colleague immediately and privately', delta: { money: 200, morale: 10 }, logMsg: "You flagged it privately. The colleague thanked you. Prescription corrected before dispensing." },
        { label: 'Raise it formally through the error-reporting system', delta: { money: 300, morale: 5 }, logMsg: "You reported it formally. The system logged it. Safety protocols worked as intended." },
        { label: 'Double-check your assumption before saying anything', delta: { money: 100, morale: 5 }, logMsg: "You verified your read. You were right. You flagged it. Caught in time." },
      ],
    },
    {
      id: 'health_crying_relative',
      title: 'The Relative in the Corridor',
      description: "A patient's relative is crying alone in the corridor. It is your break. It is your only break today.",
      choices: [
        { label: 'Sit with them for a few minutes', delta: { money: 100, morale: 15, energy: -5 }, logMsg: "You sat with them. Five minutes. It helped more than you could measure." },
        { label: 'Find a counsellor or chaplain to support them', delta: { money: 200, morale: 10 }, logMsg: "You found someone qualified and connected them. Proper support in place." },
        { label: 'Walk past — you need your break', delta: { morale: -15 }, logMsg: "You walked past. You thought about them for the rest of your shift." },
      ],
    },
    {
      id: 'health_rude_surgeon',
      title: 'The Surgeon',
      description: "A surgeon barks an order at you during a procedure in a way that is genuinely humiliating. Everyone in the room hears it.",
      choices: [
        { label: 'Complete the task, address it afterwards professionally', delta: { money: 200, morale: -5 }, logMsg: "You completed the task, then raised it with them calmly afterward. They apologised. Briefly." },
        { label: 'Push back in the moment — professionally', delta: { money: 100, morale: 15 }, logMsg: "You quietly said your piece. The surgeon paused. The room appreciated it." },
        { label: 'Let it go — pick your battles', delta: { morale: -20, money: 50 }, logMsg: "You let it go. The procedure went well. The frustration sat with you all day." },
      ],
    },
    {
      id: 'health_double_booking',
      title: 'Double Booked',
      description: "Two patients show up at the same time for the same appointment slot. The booking system made an error. Both are elderly. Both need to sit down.",
      choices: [
        { label: 'Get both seated and see the more urgent case first', delta: { money: 200, morale: 15 }, logMsg: "You triaged quickly and managed both patients with dignity. They both thanked you." },
        { label: 'Apologise and rebook one immediately with a priority slot', delta: { money: 100, morale: 10 }, logMsg: "You rebooked with a priority slot today. Patient was gracious." },
        { label: 'Call reception to sort it out while you wait', delta: { morale: -10 }, logMsg: "Reception was on hold. You waited. The patients waited. Everyone waited." },
      ],
    },
    {
      id: 'health_no_gloves',
      title: 'Out of Stock',
      description: "The supply cupboard is out of your preferred glove size. There are gloves two sizes too large and one size too small.",
      choices: [
        { label: 'Raise the stock issue and use the larger size carefully', delta: { money: 100, morale: 5 }, logMsg: "You flagged the stock issue and made do safely. Supply manager was notified." },
        { label: 'Use the smaller size — they are snug but functional', delta: { morale: -5, health: -5 }, logMsg: "You used the smaller gloves. They were not functional. Your hands did not enjoy it." },
        { label: "Delay the procedure until stock arrives", delta: { morale: 15, money: 50 }, logMsg: "You delayed and sourced the right supplies. Correct call." },
      ],
    },
    {
      id: 'health_child_patient',
      title: 'The Tiny Patient',
      description: "A very small child is refusing to open their mouth for an examination. Their parent is getting embarrassed. You have seen this before.",
      choices: [
        { label: "Turn it into a game — 'say aaah like a lion'", delta: { money: 200, morale: 20 }, logMsg: "The child roared. You got a perfect look. The parent was delighted. Pure medicine." },
        { label: 'Let the parent coax them and wait', delta: { morale: 15, money: 50 }, logMsg: "The parent prevailed after four minutes. Examination completed." },
        { label: 'Offer a sticker as negotiation currency', delta: { money: 100, morale: 15 }, logMsg: "The child accepted the sticker deal immediately. You are a natural diplomat." },
      ],
    },
    {
      id: 'health_long_night',
      title: 'Hour Fourteen',
      description: "You are on hour fourteen of a twelve-hour shift. There are still patients waiting. You are running on determination and cold coffee.",
      choices: [
        { label: 'Push through — the patients need you', delta: { money: 100, energy: -25, health: -5 }, logMsg: "You pushed through. Every patient was seen. You got home at midnight." },
        { label: 'Hand off and go — you are past safe limits', delta: { morale: 15, money: 50 }, logMsg: "You handed off safely and left. It was the right call. You were past safe-to-practice." },
        { label: 'Ask a colleague to take the last two patients', delta: { money: 100, morale: 10 }, logMsg: "Your colleague covered the last two. You covered for them the following week." },
      ],
    },
    {
      id: 'health_protocol_shortcut',
      title: 'The Shortcut',
      description: "A colleague suggests skipping a documentation step 'everyone skips' to get through the queue faster. It is technically mandatory.",
      choices: [
        { label: 'Decline and do the documentation properly', delta: { money: 200, morale: 5 }, logMsg: "You did the documentation. The queue moved slower. Your record stayed clean." },
        { label: 'Skip it this once — the queue is brutal today', delta: { morale: -5 }, logMsg: "You skipped it. So did everyone. An auditor came by the following day." },
        { label: 'Raise the queue issue with the supervisor instead', delta: { money: 100, morale: 10 }, logMsg: "You escalated the queue problem. An additional practitioner was rostered. Queue cleared." },
      ],
    },
    {
      id: 'health_wrong_patient_name',
      title: 'Wrong Name on the Chart',
      description: "You are about to start a procedure and notice the patient name on the chart does not quite match the patient in front of you.",
      choices: [
        { label: 'Stop and verify before proceeding — no exceptions', delta: { money: 300, morale: 10 }, logMsg: "You stopped and verified. It was a middle name discrepancy. Correct patient. Protocol followed." },
        { label: 'Ask the patient to confirm their details verbally', delta: { money: 200, morale: 10 }, logMsg: "You asked. They confirmed. Chart was a nickname error. Crisis averted." },
        { label: 'They look like the photo — proceed', delta: { fired: true, morale: -15 }, logMsg: "You proceeded. It was the right patient. But it should never have been a guess." },
      ],
    },
  ],

  creative: [
    {
      id: 'creative_escaped_parrot',
      title: 'The Parrot',
      description: "A parrot has escaped its cage, flown to the top shelf, and is now doing an extremely accurate impression of a dissatisfied customer. Actual customers are watching.",
      choices: [
        { label: 'Coax it down with treats — slowly', delta: { money: 200, morale: 20 }, logMsg: "The parrot descended for a sunflower seed. You are a parrot whisperer." },
        { label: 'Close the shop briefly to deal with it', delta: { morale: 15, money: -20 }, logMsg: "You closed for 20 minutes. Parrot was retrieved. Customers waited. Reviews were mixed." },
        { label: 'Let the customers try to catch it', delta: { money: -80, morale: 30 }, logMsg: "You deputised the customers. Chaos ensued. The parrot was eventually caught by a retired zookeeper who happened to be there." },
      ],
    },
    {
      id: 'creative_return_goldfish',
      title: 'The Return',
      description: "A customer wants to return a goldfish. They have had it for three years. It has gotten 'a bit boring.'",
      choices: [
        { label: 'Accept the return graciously', delta: { money: 100, morale: -5 }, logMsg: "You accepted Gerald back. He seems fine. He was always fine." },
        { label: "Offer an exchange for a 'more exciting fish'", delta: { money: 200, morale: 15 }, logMsg: "You upsold them a koi with a dramatic backstory. Everyone left happy. Gerald stayed." },
        { label: 'Explain the no-return policy on fish, with empathy', delta: { morale: 5 }, logMsg: "You declined the return but had a lovely chat about fish personality. They kept Gerald." },
      ],
    },
    {
      id: 'creative_five_puppies',
      title: 'The Puppy Request',
      description: "A child is crying because they want all five puppies in the window. Their parents are trying to reason with them. It is not going well.",
      choices: [
        { label: 'Distract them with the hamster display', delta: { money: 200, morale: 20 }, logMsg: "You introduced the hamsters. Crisis averted. The child left with a hamster and dignity." },
        { label: 'Go and find the parents to take over', delta: { money: 100, morale: 5 }, logMsg: "You facilitated a family conversation. One puppy was agreed upon. A victory for all." },
        { label: "Promise that all five puppies will find wonderful homes", delta: { morale: 15, money: 50 }, logMsg: "You made the speech about loving homes. The child calmed down. One puppy left that day." },
      ],
    },
    {
      id: 'creative_loose_python',
      title: 'Python Situation',
      description: "A ball python got out of its enclosure in the back room. Nobody wants to go in. It is in there somewhere. Probably behind the bird food.",
      choices: [
        { label: 'Handle it yourself — you are a professional', delta: { money: 300, health: -10, morale: 25, petId: 'whiskers' }, logMsg: "You found the python behind the mealworms. Returned to enclosure. The owner was so impressed they gifted you their spare cat, Whiskers. Legend status achieved." },
        { label: 'Call animal control to be safe', delta: { morale: 5 }, logMsg: "Animal control came. Found the python immediately. You paid for the visit. Worth it." },
        { label: "Send the new employee in to 'tidy the back room'", delta: { money: -150, morale: 10 }, logMsg: "The new employee found the python. They shrieked. The python was fine. The employee put in a complaint." },
      ],
    },
    {
      id: 'creative_ethical_fish',
      title: 'Ethical Sourcing',
      description: "A customer asks if the fish are ethically sourced, locally farmed, and carbon neutral. They have a notebook. They are taking notes.",
      choices: [
        { label: 'Give a detailed, honest answer about your supply chain', delta: { money: 100, morale: 5, education: 2 }, logMsg: "You gave a thorough answer. They were satisfied. They also bought a snail." },
        { label: 'Construct a plausible-sounding story', delta: { morale: 15, money: 50 }, logMsg: "You told an impressive story. They bought three fish. You now need to actually investigate your supply chain." },
        { label: "Point at the fish and say 'they seem happy'", delta: { morale: 20, money: 50 }, logMsg: "You indicated the fish with confidence. They looked at the fish. The fish looked back. The customer bought two." },
      ],
    },
    {
      id: 'creative_dog_and_cat',
      title: 'Accidental Introduction',
      description: "A visiting dog and a caged cat have made prolonged, intense eye contact. The cat is vibrating. The dog is frozen. You have maybe 8 seconds.",
      choices: [
        { label: 'Move one of them immediately', delta: { money: 200, energy: -10 }, logMsg: "You intervened in time. Nobody was harmed. Your reflexes are excellent." },
        { label: 'Let nature take its course and watch closely', delta: { morale: 10 }, logMsg: "You watched. There was a brief standoff. The dog backed down. The cat will never forgive anyone." },
        { label: 'Distract the dog with a treat', delta: { money: 100, morale: 15 }, logMsg: "You redirected the dog with a treat. Crisis averted via bribery. The classic approach." },
      ],
    },
    {
      id: 'creative_expired_food',
      title: 'Best Before',
      description: "You find a bag of premium dog food at the back of the shelf that expired three days ago. There are several on the shelf.",
      choices: [
        { label: 'Pull them all and update the stock log', delta: { money: -30, morale: 5 }, logMsg: "You pulled the stock and logged it. Cost you, but it was right." },
        { label: 'Leave them — three days is close enough', delta: { money: -80, morale: -10 }, logMsg: "You left them. A customer noticed. They told their friends. Yelp review inbound." },
        { label: 'Discount them and move them quickly', delta: { morale: 15, money: 50 }, logMsg: "You marked them down. They sold in an hour. Technically compliant." },
      ],
    },
    {
      id: 'creative_birthday_rabbit',
      title: 'The Birthday Rabbit',
      description: "A parent bought a rabbit as a birthday surprise for their 5-year-old. They are asking you to gift-wrap it. The rabbit disagrees with this plan.",
      choices: [
        { label: "Explain why that's not great for the rabbit", delta: { money: 100, morale: 10 }, logMsg: "You explained rabbit welfare. The parent reconsidered. They brought the child in to choose instead." },
        { label: 'Offer a gift card and a card with a photo of the rabbit', delta: { money: 200, morale: 20 }, logMsg: "You suggested the photo card reveal. The parent loved it. The child's face was apparently incredible." },
        { label: 'Attempt the gift-wrap situation', delta: { money: -150, morale: -5, health: -5 }, logMsg: "You attempted it. The rabbit was fine. You were not. You have a scratch from your elbow to your wrist." },
      ],
    },
    {
      id: 'creative_sick_pet',
      title: 'Something is Wrong',
      description: "A customer brings in an animal they bought last week. It is clearly unwell. They did not buy the health guarantee. They are getting emotional.",
      choices: [
        { label: 'Offer a replacement or partial refund out of goodwill', delta: { money: -40, morale: 15 }, logMsg: "You offered goodwill support. The customer was moved. They became a regular." },
        { label: 'Refer them to a vet and document the incident', delta: { money: 100, morale: 5 }, logMsg: "You referred them with care. Documented the issue. Professional and thorough." },
        { label: 'Point out that the guarantee was not purchased', delta: { money: -80, morale: -15 }, logMsg: "You cited the policy. You were technically correct. The customer left in tears and never returned." },
      ],
    },
    {
      id: 'creative_very_loud_bird',
      title: 'The Cockatoo',
      description: "A cockatoo in the back has decided today is the day for maximum volume. It has been screaming for 45 minutes. Customers are struggling.",
      choices: [
        { label: 'Cover the cage — they often calm down in the dark', delta: { money: 100, morale: 15 }, logMsg: "The cage cover worked. Silence descended. Everyone exhaled." },
        { label: 'Move the cockatoo to a quieter room', delta: { money: 200, energy: -10 }, logMsg: "You relocated the cockatoo. It immediately became serene. You were not." },
        { label: 'Offer a small discount to the customers currently in the shop', delta: { money: -25, morale: 20 }, logMsg: "You offered a 10% apology discount. Every customer bought something. Net positive." },
      ],
    },
    {
      id: 'creative_cage_mix_up',
      title: 'The Wrong Cage',
      description: "Two mice have ended up in the wrong enclosures after cleaning. You're 70% sure you know which one goes where. The other 30% is relevant.",
      choices: [
        { label: 'Check the tags carefully before moving anyone', delta: { money: 200, morale: 10 }, logMsg: "You verified the tags. They had been swapped during cleaning. Returned correctly." },
        { label: 'Move them and hope for the best', delta: { morale: -5 }, logMsg: "You moved them. One of them was defensive about the swap. Minor incident. Logged." },
        { label: 'Ask a colleague who was on cleaning duty', delta: { money: 100, morale: 5 }, logMsg: "Your colleague remembered. Both mice were correctly housed within two minutes." },
      ],
    },
    {
      id: 'creative_aquarium_crack',
      title: 'The Crack',
      description: "You notice a hairline crack in one of the large display aquariums. It is small. But you know how this story goes.",
      choices: [
        { label: 'Empty the tank and replace the glass today', delta: { money: 300, energy: -20 }, logMsg: "You sorted it immediately. No flood, no fish casualties, no drama. Cost you though." },
        { label: 'Seal it temporarily and order replacement glass', delta: { money: 100, morale: 5 }, logMsg: "You sealed it and ordered glass. It held. Fish were monitored." },
        { label: 'Monitor it closely and see if it spreads', delta: { money: -80, morale: -10 }, logMsg: "You monitored it. It spread. The resulting flood was impressive and very cold." },
      ],
    },
    {
      id: 'creative_wrong_pet_sold',
      title: 'The Mix-Up',
      description: "A customer comes back to say the 'hamster' they bought is actually a gerbil. They are not angry — they are fascinated. But they came for a hamster.",
      choices: [
        { label: 'Offer an exchange for the correct species', delta: { money: 100, morale: 10 }, logMsg: "You offered the exchange. They took it. The gerbil found a new home within the day." },
        { label: "Explain the differences and let them decide what to do", delta: { money: 200, morale: 20, education: 1 }, logMsg: "You gave a thorough gerbil vs hamster briefing. They kept the gerbil. Named it 'Technically.'" },
        { label: 'Apologise and give them a discount on their next purchase', delta: { morale: 15, money: 50 }, logMsg: "You apologised and offered a discount. They seemed fine. They are now a gerbil person." },
      ],
    },
    {
      id: 'creative_customer_expert',
      title: 'The Self-Proclaimed Expert',
      description: "A customer is explaining fish care to you with total confidence. They are wrong about several things, some of them importantly wrong.",
      choices: [
        { label: 'Gently correct the most dangerous errors', delta: { money: 200, morale: 10 }, logMsg: "You course-corrected the critical errors politely. They listened and updated their approach." },
        { label: 'Let them finish and then recommend some reading', delta: { money: 100, morale: 5 }, logMsg: "You let them speak and then handed them a care sheet. They read it on the spot." },
        { label: "Agree with everything — they seem confident", delta: { money: -80, morale: -5 }, logMsg: "You agreed. Their fish did not do well. They came back confused. You had known." },
      ],
    },
    {
      id: 'creative_slow_day',
      title: 'The Incredibly Slow Day',
      description: "It is Tuesday. Nobody has come in for three hours. The fish are staring at you. The hamsters have gone to sleep. You have counted the bags of cat litter twice.",
      choices: [
        { label: 'Use the time to deep-clean and reorganise', delta: { money: 200, morale: 5, energy: -15 }, logMsg: "You deep-cleaned everything. The shop looks incredible. You feel strangely accomplished." },
        { label: 'Catch up on supplier invoices and admin', delta: { money: 100, morale: 5 }, logMsg: "You cleared the admin backlog. The inbox is empty. A rare peace." },
        { label: 'Have a long, meaningful conversation with the parrot', delta: { morale: 20, petId: 'polly' }, logMsg: "The parrot expanded your vocabulary. You discussed the nature of time. At the end of the day, the owner said you two were clearly meant for each other, and gave you the parrot. You now have a parrot named Polly." },
      ],
    },
  ],
}

export function rollWorkEvent(track: CareerTrack): string | null {
  const events = WORK_EVENTS[track]
  if (!events?.length) return null
  return events[Math.floor(Math.random() * events.length)].id
}

export function getWorkEvent(track: CareerTrack, id: string): WorkEvent | undefined {
  return WORK_EVENTS[track]?.find(e => e.id === id)
}
