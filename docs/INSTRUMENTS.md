# The Rack — all 590 instruments

Every instrument is synthesised from scratch by `src/js/audio/voice.js`. There are no samples anywhere in this app: the whole rack is a few kilobytes of parameters, so it renders identically at any sample rate.

The tables live one family per module under `src/js/data/rack/`; `src/js/data/instruments.js` stitches them together and documents every field.

This file is generated — run `npm run docs` after changing the rack.

| Family | Count | Colour |
|---|---:|---|
| Kicks | 42 | `#ff3b30` |
| Snares | 42 | `#ff9f0a` |
| Hats | 36 | `#ffd60a` |
| Percussion | 40 | `#32d74b` |
| Cymbals | 22 | `#66d4cf` |
| Bass | 54 | `#0a84ff` |
| Guitars | 40 | `#bf5af2` |
| Leads | 54 | `#ff2d95` |
| Pads | 34 | `#5e5ce6` |
| Plucks | 30 | `#64d2ff` |
| Organs & Keys | 22 | `#efe3c8` |
| Chip & Console | 20 | `#c3f73a` |
| Mallets & Bells | 20 | `#d6a35c` |
| Strings & Bows | 20 | `#a8e6cf` |
| Brass & Winds | 22 | `#e07a5f` |
| Voices | 26 | `#ffb3c7` |
| Modular & Experimental | 22 | `#b388ff` |
| Atmospheres | 18 | `#7c9cbf` |
| FX & Noise | 26 | `#8e8e93` |
| **Total** | **590** | |

## Kicks (42)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Riot Kick** | drum | punchy, analog |
| 2 | **Concrete** | drum | hard, industrial |
| 3 | **808 Sub** | drum | sub, long |
| 4 | **909 Thump** | drum | classic, dance |
| 5 | **Gabber Core** | drum | distorted, hardcore |
| 6 | **Paper Cut** | drum | tight, lofi |
| 7 | **Boiler Room** | drum | deep, round |
| 8 | **Sledgehammer** | drum | huge, slow |
| 9 | **Tin Can** | drum | thin, trash |
| 10 | **Pitch Drop** | drum | fx, long |
| 11 | **Click Kick** | drum | minimal, tight |
| 12 | **Overdriver** | drum | distorted, mid |
| 13 | **House Kick** | drum | round, warm |
| 14 | **Berlin Rumble** | drum | techno, long |
| 15 | **Trap 808** | drum | sub, glide |
| 16 | **Snap Punch** | drum | tight, punchy |
| 17 | **Double Hit** | drum | layered, fat |
| 18 | **Reverse Kick** | drum | fx, swell |
| 19 | **Cassette Kick** | drum | lofi, dull |
| 20 | **Live Kick** | drum | acoustic, beater |
| 21 | **FM Kick** | drum | digital, metallic |
| 22 | **Zapper** | drum | fx, ring |
| 23 | **Minimal** | drum | dry, short |
| 24 | **Hardstyle Kick** | drum | hard, pitched |
| 25 | **Break Kick** | drum | breakbeat, mid |
| 26 | **Pure Sub** | drum | sub, clean |
| 27 | **Noise Kick** | drum | industrial, harsh |
| 28 | **Wood Kick** | drum | acoustic, dry |
| 29 | **Resonant Kick** | drum | tonal, ring |
| 30 | **Stomp** | drum | huge, room |
| 31 | **UK Garage Kick** | drum | garage, tight |
| 32 | **Jungle Kick** | drum | breakbeat, old |
| 33 | **DnB Kick** | drum | fast, punchy |
| 34 | **Soft Kick** | drum | ambient, gentle |
| 35 | **Dirty Kick** | drum | grit, mid |
| 36 | **Ultra Short** | drum | blip, tiny |
| 37 | **Boom** | drum | huge, sub |
| 38 | **Punch Tight** | drum | tight, modern |
| 39 | **Analog Kick** | drum | vintage, warm |
| 40 | **Digital Kick** | drum | fm, clean |
| 41 | **Click Layer** | drum | attack, layered |
| 42 | **Big Room Kick** | drum | edm, long |

## Snares (42)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Riot Snare** | drum | crack, punk |
| 2 | **909 Snap** | drum | classic, dance |
| 3 | **Rimshot** | drum | tight, sharp |
| 4 | **Brickwall** | drum | fat, compressed |
| 5 | **Tape Snare** | drum | lofi, warm |
| 6 | **Gated 80s** | drum | big, gated |
| 7 | **Trashcan** | drum | noisy, metal |
| 8 | **Clap Snare** | drum | layered, wide |
| 9 | **Ghost Note** | drum | soft, roll |
| 10 | **Amen Crack** | drum | breakbeat, bright |
| 11 | **Steel Mill** | drum | industrial, long |
| 12 | **Pitchbend Snare** | drum | fx, sweep |
| 13 | **808 Snare** | drum | classic, thin |
| 14 | **Live Snare** | drum | acoustic, room |
| 15 | **Piccolo Snare** | drum | high, crack |
| 16 | **Deep Snare** | drum | low, fat |
| 17 | **White Slap** | drum | noise, pure |
| 18 | **Electro Snare** | drum | fm, digital |
| 19 | **Reverse Snare** | drum | fx, swell |
| 20 | **Stacked** | drum | layered, huge |
| 21 | **Tight Crack** | drum | short, dry |
| 22 | **Hardcore Snare** | drum | distorted, clipped |
| 23 | **Dub Snare** | drum | wide, delay |
| 24 | **Cross Stick** | drum | tick, quiet |
| 25 | **Marching** | drum | roll, tight |
| 26 | **Metallic Snare** | drum | metal, ring |
| 27 | **Brush Snare** | drum | soft, jazz |
| 28 | **Sidestick Snap** | drum | snap, dry |
| 29 | **Big Room** | drum | huge, reverb |
| 30 | **Dusty Snare** | drum | lofi, dark |
| 31 | **Jungle Snare** | drum | breakbeat, old |
| 32 | **Garage Snare** | drum | garage, snappy |
| 33 | **Fat Snare** | drum | thick, body |
| 34 | **Bright Snare** | drum | cutting, high |
| 35 | **Thin Snare** | drum | dry, small |
| 36 | **Wood Snare** | drum | acoustic, woody |
| 37 | **808 Long** | drum | classic, tail |
| 38 | **Hall Snare** | drum | big, wet |
| 39 | **Grinder** | drum | distorted, industrial |
| 40 | **Flam** | drum | double, roll |
| 41 | **Power Rim** | drum | rimshot, loud |
| 42 | **Digital Snare** | drum | fm, clean |

## Hats (36)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Closed Hat** | drum | tight |
| 2 | **Open Hat** | drum | long |
| 3 | **Pedal Hat** | drum | short, dark |
| 4 | **Shuffle Tick** | drum | tiny |
| 5 | **Metal Hat** | drum | harsh, metal |
| 6 | **Noise Hat** | drum | digital |
| 7 | **Lo-Fi Hat** | drum | lofi, dark |
| 8 | **Sizzle** | drum | bright, long |
| 9 | **Click Hat** | drum | minimal |
| 10 | **Glass Hat** | drum | clean, tonal |
| 11 | **Grit Hat** | drum | distorted |
| 12 | **Reverse Hat** | drum | fx, swell |
| 13 | **808 Hat** | drum | classic, tight |
| 14 | **707 Hat** | drum | classic, bright |
| 15 | **Analog Hat** | drum | warm, round |
| 16 | **Dark Hat** | drum | dark, muted |
| 17 | **Ticky** | drum | tiny, dry |
| 18 | **Wide Hat** | drum | stereo, airy |
| 19 | **Ring Hat** | drum | metal, tonal |
| 20 | **Half Open** | drum | medium |
| 21 | **Foot Hat** | drum | pedal, soft |
| 22 | **Crisp Hat** | drum | clean, modern |
| 23 | **Trap Hat** | drum | trap, tight |
| 24 | **Vinyl Hat** | drum | lofi, dusty |
| 25 | **Bright Hat** | drum | sharp, cutting |
| 26 | **Long Open** | drum | long, wash |
| 27 | **Short Open** | drum | medium, tight |
| 28 | **Dirty Hat** | drum | grit, harsh |
| 29 | **Glassy Hat** | drum | clean, tonal |
| 30 | **Soft Hat** | drum | quiet, round |
| 31 | **909 Hat** | drum | classic, metallic |
| 32 | **606 Hat** | drum | classic, splashy |
| 33 | **Stutter Hat** | drum | glitch, gated |
| 34 | **Suck Hat** | drum | fx, reverse |
| 35 | **Wash Hat** | drum | long, noisy |
| 36 | **Pitched Hat** | drum | tonal, melodic |

## Percussion (40)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Riot Clap** | drum | clap, wide |
| 2 | **Crowd Clap** | drum | clap, big |
| 3 | **Finger Snap** | drum | clap, tight |
| 4 | **Low Tom** | drum | tom |
| 5 | **Mid Tom** | drum | tom |
| 6 | **High Tom** | drum | tom |
| 7 | **Rim Click** | drum | tick, wood |
| 8 | **Wood Block** | drum | wood, tonal |
| 9 | **Riot Bell** | drum | metal, tonal |
| 10 | **Conga** | drum | hand, tonal |
| 11 | **Shaker** | drum | noise, tiny |
| 12 | **Tambourine** | drum | metal, jingle |
| 13 | **Anvil** | drum | industrial, metal |
| 14 | **Glass Break** | drum | fx, noise |
| 15 | **Bongo** | drum | hand, high |
| 16 | **Timbale** | drum | metal, ring |
| 17 | **Clave** | drum | wood, tick |
| 18 | **Agogo** | drum | metal, tonal |
| 19 | **Triangle** | drum | metal, shimmer |
| 20 | **Guiro** | drum | scrape, noise |
| 21 | **Scaffold Pipe** | drum | industrial, metal |
| 22 | **Chain Rattle** | drum | metal, noise |
| 23 | **Cabasa** | drum | shaker, scrape |
| 24 | **Djembe** | drum | hand, deep |
| 25 | **Tabla** | drum | hand, tonal |
| 26 | **Castanet** | drum | wood, snap |
| 27 | **Bell Tree** | drum | metal, cascade |
| 28 | **Spring Boing** | drum | fx, ring |
| 29 | **Timpani** | drum | orchestral, deep |
| 30 | **Gran Cassa** | drum | orchestral, huge |
| 31 | **Concert Tom** | drum | tom, orchestral |
| 32 | **Snare Roll** | drum | roll, build |
| 33 | **Udu** | drum | hand, clay |
| 34 | **Cuica** | drum | friction, squeak |
| 35 | **Vibraslap** | drum | rattle, wood |
| 36 | **Wood Fish** | drum | wood, hollow |
| 37 | **Ratchet** | drum | noise, mechanical |
| 38 | **Whip** | drum | crack, sharp |
| 39 | **Hammer** | drum | industrial, impact |
| 40 | **Bucket Hit** | drum | junk, plastic |

## Cymbals (22)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Crash** | drum | big, long |
| 2 | **Ride** | drum | ping, sustain |
| 3 | **China Trash** | drum | trashy, harsh |
| 4 | **Splash** | drum | short, bright |
| 5 | **Reverse Crash** | drum | fx, swell |
| 6 | **Riot Gong** | drum | huge, metal |
| 7 | **Dark Crash** | drum | dark, wash |
| 8 | **Ride Bell** | drum | ping, tonal |
| 9 | **Sizzle Ride** | drum | rivets, long |
| 10 | **Trash Stack** | drum | short, harsh |
| 11 | **Bowed Cymbal** | drum | swell, drone |
| 12 | **Tam-Tam** | drum | huge, wash |
| 13 | **Bright Crash** | drum | bright, cutting |
| 14 | **Cymbal Roll** | drum | swell, build |
| 15 | **Choke Crash** | drum | short, stab |
| 16 | **Mini Splash** | drum | tiny, quick |
| 17 | **Dark Ride** | drum | dark, wash |
| 18 | **Short Crash** | drum | quick, tight |
| 19 | **Big Bell** | drum | tonal, loud |
| 20 | **Long Sizzle** | drum | rivets, wash |
| 21 | **Reverse Splash** | drum | fx, swell |
| 22 | **Junk Lid** | drum | trash, clang |

## Bass (54)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Riot Bass** | synth | distorted, driving |
| 2 | **Deep Sub** | synth | sub, clean |
| 3 | **Reese** | synth | wide, detuned |
| 4 | **Acid 303** | synth | acid, squelch |
| 5 | **Acid Square** | synth | acid, hollow |
| 6 | **Fuzz Bass** | synth | fuzz, punk |
| 7 | **Picked Bass** | synth | organic, attack |
| 8 | **Slap** | synth | funk, bright |
| 9 | **FM Growl** | synth | fm, metallic |
| 10 | **Neuro Growl** | synth | neuro, modulated |
| 11 | **Wobbler** | synth | dubstep, lfo |
| 12 | **Octave Saw** | synth | wide, bright |
| 13 | **Synthwave Bass** | synth | retro, pulse |
| 14 | **Rumble** | synth | sub, noise |
| 15 | **Grit Click** | synth | digital, short |
| 16 | **Organ Bass** | synth | warm, round |
| 17 | **Dirty Sub** | synth | sub, distorted |
| 18 | **Talkbox Bass** | synth | formant, vocal |
| 19 | **808 Glide** | synth | sub, slide |
| 20 | **Moog Ladder** | synth | analog, round |
| 21 | **Hardstyle Bass** | synth | hard, pitched |
| 22 | **Donk** | synth | bouncy, short |
| 23 | **Pluck Bass** | synth | tight, melodic |
| 24 | **Upright** | synth | acoustic, woody |
| 25 | **Triple Saw** | synth | wide, thick |
| 26 | **Metal Bass** | synth | distorted, picked |
| 27 | **Square Sub** | synth | hollow, deep |
| 28 | **Formant Bass** | synth | vowel, moving |
| 29 | **Drone Bass** | synth | sustain, dark |
| 30 | **Click 808** | synth | sub, attack |
| 31 | **Long 808** | synth | sub, tail |
| 32 | **Talk Wobble** | synth | dubstep, vowel |
| 33 | **FM Bass Bell** | synth | fm, tonal |
| 34 | **Triangle Sub** | synth | soft, deep |
| 35 | **Hard Dist Bass** | synth | distorted, hard |
| 36 | **Bounce** | synth | bouncy, short |
| 37 | **Cello Bass** | synth | bowed, sustain |
| 38 | **Bass Stab** | synth | stab, tight |
| 39 | **Arp Bass** | synth | arp, bright |
| 40 | **Fifth Bass** | synth | power, wide |
| 41 | **Gliss Bass** | synth | slide, mono |
| 42 | **Pulse Bass** | synth | hollow, pwm |
| 43 | **Dark Bass** | synth | muted, deep |
| 44 | **Bright Bass** | synth | cutting, open |
| 45 | **Dub Bass** | synth | round, reggae |
| 46 | **House Bass** | synth | bouncy, warm |
| 47 | **Techno Bass** | synth | driving, dark |
| 48 | **Psy Bass** | synth | tight, rolling |
| 49 | **Deep Wobble** | synth | dubstep, slow |
| 50 | **FM Snarl** | synth | fm, neuro |
| 51 | **Ring Bass** | synth | metallic, inharmonic |
| 52 | **Noise Bass** | synth | industrial, harsh |
| 53 | **Stack Sub** | synth | layered, huge |
| 54 | **Bass Guitar** | synth | organic, fingered |

## Guitars (40)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Power Chord** | synth | distorted, chug |
| 2 | **Palm Mute** | synth | tight, chug |
| 3 | **Clean Strat** | synth | clean, bright |
| 4 | **Overdrive** | synth | crunch, lead |
| 5 | **Fuzz Face** | synth | fuzz, vintage |
| 6 | **Wall of Noise** | synth | shoegaze, wide |
| 7 | **Pinch Harmonic** | synth | squeal, lead |
| 8 | **Steel String** | synth | acoustic, pluck |
| 9 | **Dead Notes** | synth | percussive, tight |
| 10 | **E-Bow Drone** | synth | sustain, drone |
| 11 | **Surf Twang** | synth | retro, clean |
| 12 | **Feedback Howl** | synth | noise, squeal |
| 13 | **Djent Chug** | synth | metal, tight |
| 14 | **Octave Fuzz** | synth | fuzz, octave |
| 15 | **Tremolo Picking** | synth | metal, fast |
| 16 | **Slide Guitar** | synth | glide, blues |
| 17 | **Resonator** | synth | metal body, twang |
| 18 | **Hollowbody** | synth | clean, warm |
| 19 | **12-String** | synth | acoustic, shimmer |
| 20 | **Wah Guitar** | synth | funk, filter |
| 21 | **Volume Swell** | synth | ambient, slow |
| 22 | **Baritone** | synth | low, dark |
| 23 | **Crunch Rhythm** | synth | rhythm, crunch |
| 24 | **Sludge** | synth | doom, slow |
| 25 | **Chime Guitar** | synth | clean, jangle |
| 26 | **Big Muff** | synth | fuzz, sustain |
| 27 | **Country Pick** | synth | clean, twang |
| 28 | **Shred Lead** | synth | lead, metal |
| 29 | **Dirty Clean** | synth | edge, breakup |
| 30 | **Drone Wall** | synth | drone, noise |
| 31 | **Stoner Riff** | synth | fuzz, heavy |
| 32 | **Thrash** | synth | metal, fast |
| 33 | **Emo Clean** | synth | clean, chorus |
| 34 | **Math Tap** | synth | tapping, bright |
| 35 | **Down Tuned** | synth | low, heavy |
| 36 | **Reverse Guitar** | synth | fx, swell |
| 37 | **Octave Up** | synth | octave, bright |
| 38 | **Lo-Fi Guitar** | synth | lofi, dusty |
| 39 | **Ambient Loop** | synth | ambient, wash |
| 40 | **Strum Chord** | synth | chord, wide |

## Leads (54)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Razorwire** | synth | saw, aggressive |
| 2 | **Supersaw** | synth | wide, trance |
| 3 | **Square Riot** | synth | chip, hollow |
| 4 | **Chiptune** | synth | 8bit, retro |
| 5 | **Acid Lead** | synth | acid, squelch |
| 6 | **FM Bell Lead** | synth | fm, bright |
| 7 | **FM Metal** | synth | fm, harsh |
| 8 | **Hoover** | synth | rave, classic |
| 9 | **Fifth Stack** | synth | wide, power |
| 10 | **Vox Machine** | synth | formant, vocal |
| 11 | **Glitch Lead** | synth | digital, crushed |
| 12 | **Distorted Pluck** | synth | pluck, punk |
| 13 | **Air Raid** | synth | fx, sweep |
| 14 | **Ghost Flute** | synth | soft, breathy |
| 15 | **Riot Brass** | synth | brass, fat |
| 16 | **Riot Organ** | synth | organ, retro |
| 17 | **Theremin** | synth | smooth, glide |
| 18 | **Rave Stab** | synth | stab, short |
| 19 | **Trance Pluck** | synth | pluck, bright |
| 20 | **Saw Solo** | synth | classic, mono |
| 21 | **PWM Lead** | synth | hollow, moving |
| 22 | **Sync Lead** | synth | aggressive, sweep |
| 23 | **Screech** | synth | dubstep, harsh |
| 24 | **Arp Runner** | synth | arp, short |
| 25 | **4-Bit** | synth | 8bit, crushed |
| 26 | **Whistle** | synth | pure, high |
| 27 | **Reed Harp** | synth | reed, bluesy |
| 28 | **Wide Saw** | synth | wide, anthem |
| 29 | **Metal Bell** | synth | fm, bell |
| 30 | **Riot Anthem** | synth | fat, distorted |
| 31 | **Detune Lead** | synth | thick, analog |
| 32 | **Ocarina** | synth | pure, folk |
| 33 | **NES Triangle** | synth | 8bit, retro |
| 34 | **Gliss Lead** | synth | portamento, smooth |
| 35 | **FM Pluck Lead** | synth | fm, short |
| 36 | **Hard Lead** | synth | aggressive, clipped |
| 37 | **Soft Sine** | synth | gentle, round |
| 38 | **Ring Lead** | synth | metallic, inharmonic |
| 39 | **Porta Lead** | synth | mono, slide |
| 40 | **Orch Stab** | synth | stab, cinematic |
| 41 | **Psy Lead** | synth | psy, squelch |
| 42 | **Hardcore Lead** | synth | harsh, rave |
| 43 | **Dreamy Lead** | synth | soft, wide |
| 44 | **Bright Lead** | synth | cutting, saw |
| 45 | **Dark Lead** | synth | muted, moody |
| 46 | **Bell Pluck Lead** | synth | fm, pluck |
| 47 | **Growl Lead** | synth | fm, aggressive |
| 48 | **Vibrato Lead** | synth | expressive, mono |
| 49 | **Octave Lead** | synth | stacked, big |
| 50 | **Tape Lead** | synth | lofi, warm |
| 51 | **Reso Lead** | synth | resonant, sweep |
| 52 | **Unison Wall** | synth | huge, detuned |
| 53 | **Glass Lead** | synth | bright, clean |
| 54 | **Warning Lead** | synth | siren, alarm |

## Pads (34)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Warm Wash** | synth | soft, wide |
| 2 | **Glass House** | synth | bright, shimmer |
| 3 | **Blackout** | synth | dark, ominous |
| 4 | **Riot Strings** | synth | strings, lush |
| 5 | **Riot Choir** | synth | vocal, ethereal |
| 6 | **Industrial Drone** | synth | drone, noise |
| 7 | **Sweep Pad** | synth | filter, movement |
| 8 | **Neon Pad** | synth | retro, 80s |
| 9 | **Bell Field** | synth | bell, sparse |
| 10 | **Tape Wash** | synth | lofi, warm |
| 11 | **Air** | synth | thin, breath |
| 12 | **Evolver** | synth | movement, long |
| 13 | **Sub Pad** | synth | low, foundation |
| 14 | **Grit Pad** | synth | dirty, noisy |
| 15 | **Ice Field** | synth | cold, bright |
| 16 | **Organ Pad** | synth | organ, steady |
| 17 | **Phase Pad** | synth | sweeping, wide |
| 18 | **Noise Bed** | synth | texture, atmos |
| 19 | **Crystal** | synth | bright, fm |
| 20 | **Reverse Wash** | synth | swell, fx |
| 21 | **Low Drone** | synth | sub, dark |
| 22 | **Breath Pad** | synth | soft, airy |
| 23 | **FM Pad** | synth | digital, evolving |
| 24 | **Saturated Pad** | synth | thick, driven |
| 25 | **Choir Pad** | synth | vocal, warm |
| 26 | **Void** | synth | dark, empty |
| 27 | **Sunrise** | synth | warm, rising |
| 28 | **Metal Pad** | synth | inharmonic, cold |
| 29 | **Rain Pad** | synth | texture, wet |
| 30 | **Octave Pad** | synth | stacked, full |
| 31 | **Soft Pad** | synth | gentle, round |
| 32 | **Wide Pad** | synth | stereo, huge |
| 33 | **Bright Pad** | synth | open, airy |
| 34 | **Lo-Fi Pad** | synth | lofi, dusty |

## Plucks (30)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Dry Pluck** | synth | short, clean |
| 2 | **String Snap** | synth | string, physical |
| 3 | **Riot Marimba** | synth | mallet, wood |
| 4 | **Kalimba** | synth | mallet, tonal |
| 5 | **Riot Rhodes** | synth | keys, warm |
| 6 | **Clav Attack** | synth | keys, funk |
| 7 | **Wire Harp** | synth | string, bright |
| 8 | **Music Box** | synth | bell, delicate |
| 9 | **Piano Stab** | synth | keys, percussive |
| 10 | **Arp Blip** | synth | arp, digital |
| 11 | **Nylon** | synth | acoustic, soft |
| 12 | **Koto** | synth | string, eastern |
| 13 | **Banjo** | synth | twang, bright |
| 14 | **Synth Pluck** | synth | digital, clean |
| 15 | **Celesta** | synth | bell, bright |
| 16 | **Dulcimer** | synth | hammered, ringing |
| 17 | **Sitar** | synth | string, buzz |
| 18 | **Charango** | synth | acoustic, small |
| 19 | **Glass Pluck** | synth | clean, bell |
| 20 | **FM Pluck** | synth | digital, tight |
| 21 | **Muted Pluck** | synth | short, dry |
| 22 | **Bell Pluck** | synth | bell, ring |
| 23 | **Oud** | synth | string, eastern |
| 24 | **Guzheng** | synth | string, eastern |
| 25 | **Bouzouki** | synth | string, bright |
| 26 | **Ukulele** | synth | acoustic, small |
| 27 | **Zither** | synth | string, ringing |
| 28 | **Soft Pluck** | synth | gentle, round |
| 29 | **Wide Pluck** | synth | stereo, lush |
| 30 | **Dark Pluck** | synth | muted, moody |

## Organs & Keys (22)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Soft Rhodes** | synth | electric, mellow |
| 2 | **Wurlitzer** | synth | electric, reedy |
| 3 | **Wah Clav** | synth | funk, filter |
| 4 | **Hammond** | synth | organ, drawbar |
| 5 | **Church Organ** | synth | organ, huge |
| 6 | **Pump Organ** | synth | reed, wheezy |
| 7 | **Accordion** | synth | reed, folk |
| 8 | **Harpsichord** | synth | plucked, baroque |
| 9 | **Toy Piano** | synth | tiny, bell |
| 10 | **Upright Piano** | synth | acoustic, boxy |
| 11 | **Grand Piano** | synth | acoustic, open |
| 12 | **Honky Tonk** | synth | detuned, saloon |
| 13 | **Farfisa** | synth | organ, thin |
| 14 | **Melodica** | synth | reed, breathy |
| 15 | **Electric Grand** | synth | electric, bright |
| 16 | **DX Piano** | synth | fm, 80s |
| 17 | **Perc Organ** | synth | organ, attack |
| 18 | **Theatre Organ** | synth | organ, vibrato |
| 19 | **Clavichord** | synth | plucked, quiet |
| 20 | **Spinet** | synth | plucked, thin |
| 21 | **Synth Piano** | synth | digital, hybrid |
| 22 | **Lo-Fi Piano** | synth | lofi, dusty |

## Chip & Console (20)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Pulse 12%** | synth | nes, thin |
| 2 | **Pulse 25%** | synth | nes, hollow |
| 3 | **Square 50%** | synth | nes, full |
| 4 | **Chip Triangle** | synth | nes, bass |
| 5 | **Chip Noise** | synth | nes, percussive |
| 6 | **Chip Arp** | synth | arp, fast |
| 7 | **Chip Bass** | synth | bass, square |
| 8 | **Chip Lead** | synth | lead, vibrato |
| 9 | **SID Saw** | synth | c64, buzzy |
| 10 | **SID Ring** | synth | c64, metallic |
| 11 | **SID Filter** | synth | c64, sweep |
| 12 | **Wave Channel** | synth | gameboy, soft |
| 13 | **FM Console Bell** | synth | ym2612, bright |
| 14 | **FM Console Bass** | synth | ym2612, punch |
| 15 | **FM Console Brass** | synth | ym2612, fat |
| 16 | **Pling** | synth | blip, short |
| 17 | **Coin** | synth | sfx, arcade |
| 18 | **Jump** | synth | sfx, arcade |
| 19 | **Hurt Blip** | synth | sfx, noisy |
| 20 | **Power Up** | synth | sfx, rise |

## Mallets & Bells (20)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Vibraphone** | synth | bar, tremolo |
| 2 | **Glockenspiel** | synth | bright, short |
| 3 | **Xylophone** | synth | wood, dry |
| 4 | **Tubular Bells** | synth | bell, long |
| 5 | **Steel Drum** | synth | metal, tuned |
| 6 | **Handpan** | synth | warm, hollow |
| 7 | **Crotales** | synth | tiny, piercing |
| 8 | **Gamelan** | synth | inharmonic, metal |
| 9 | **Log Drum** | synth | wood, round |
| 10 | **Bell Chime** | synth | bell, shimmer |
| 11 | **Bass Marimba** | synth | bar, low |
| 12 | **Carillon** | synth | bell, church |
| 13 | **Anvil Bell** | synth | metal, industrial |
| 14 | **Chime Bar** | synth | bar, clean |
| 15 | **Soft Marimba** | synth | bar, mellow |
| 16 | **Balafon** | synth | bar, buzzy |
| 17 | **Glass Armonica** | synth | bowed, eerie |
| 18 | **Singing Bowl** | synth | bell, meditative |
| 19 | **Temple Bell** | synth | bell, deep |
| 20 | **Metallophone** | synth | bar, metal |

## Strings & Bows (20)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **String Ensemble** | synth | lush, wide |
| 2 | **Cello** | synth | low, bowed |
| 3 | **Violin** | synth | high, bowed |
| 4 | **Pizzicato** | synth | pluck, short |
| 5 | **Tremolo Strings** | synth | tense, film |
| 6 | **Bowed Bass** | synth | low, drone |
| 7 | **Synth Strings** | synth | retro, 80s |
| 8 | **String Harmonics** | synth | glassy, thin |
| 9 | **String Swell** | synth | cinematic, slow |
| 10 | **Bow Scratch** | synth | noise, harsh |
| 11 | **Viola** | synth | mid, bowed |
| 12 | **String Stab** | synth | short, cinematic |
| 13 | **Col Legno** | synth | percussive, wood |
| 14 | **Gliss Strings** | synth | slide, tense |
| 15 | **Contrabass** | synth | low, orchestral |
| 16 | **String Quartet** | synth | chamber, intimate |
| 17 | **Sul Ponticello** | synth | glassy, tense |
| 18 | **Spiccato** | synth | short, bouncing |
| 19 | **Fiddle** | synth | folk, raw |
| 20 | **Bowed Pad** | synth | sustain, lush |

## Brass & Winds (22)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Trumpet** | synth | bright, solo |
| 2 | **Trombone** | synth | mid, slide |
| 3 | **Tuba** | synth | low, round |
| 4 | **French Horn** | synth | warm, noble |
| 5 | **Brass Section** | synth | wide, fat |
| 6 | **Brass Stab** | synth | short, hit |
| 7 | **Alto Sax** | synth | reed, solo |
| 8 | **Bari Sax** | synth | reed, low |
| 9 | **Flute** | synth | breathy, pure |
| 10 | **Clarinet** | synth | hollow, woody |
| 11 | **Oboe** | synth | reed, nasal |
| 12 | **Bagpipe** | synth | drone, folk |
| 13 | **Didgeridoo** | synth | drone, low |
| 14 | **Harmonica** | synth | reed, blues |
| 15 | **Muted Trumpet** | synth | mute, nasal |
| 16 | **Flugelhorn** | synth | warm, round |
| 17 | **Euphonium** | synth | low, mellow |
| 18 | **Soprano Sax** | synth | reed, high |
| 19 | **Tenor Sax** | synth | reed, breathy |
| 20 | **Piccolo** | synth | high, piercing |
| 21 | **Bassoon** | synth | reed, low |
| 22 | **Shakuhachi** | synth | breathy, eastern |

## Voices (26)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Aah** | synth | open, warm |
| 2 | **Ooh** | synth | dark, round |
| 3 | **Low Choir** | synth | choir, deep |
| 4 | **Robot Voice** | synth | digital, formant |
| 5 | **Riot Chant** | synth | crowd, shout |
| 6 | **Scream** | synth | harsh, punk |
| 7 | **Whisper** | synth | breath, soft |
| 8 | **Talkbox** | synth | formant, sweep |
| 9 | **Vocoder Pad** | synth | pad, robotic |
| 10 | **Crowd Hey** | synth | stab, percussive |
| 11 | **Gospel Stack** | synth | choir, lush |
| 12 | **Alien Voice** | synth | fx, ring |
| 13 | **Eeh** | synth | bright, formant |
| 14 | **Hum** | synth | closed, soft |
| 15 | **Falsetto** | synth | high, thin |
| 16 | **Vocal Growl** | synth | harsh, low |
| 17 | **Child Choir** | synth | choir, high |
| 18 | **Breath Hit** | synth | percussive, noise |
| 19 | **High Aah** | synth | open, soprano |
| 20 | **Ooh Pad** | synth | pad, dark |
| 21 | **Syllable** | synth | chop, rhythmic |
| 22 | **Doo** | synth | scat, short |
| 23 | **Throat Sing** | synth | harmonic, drone |
| 24 | **Opera** | synth | vibrato, big |
| 25 | **Radio Voice** | synth | lofi, narrow |
| 26 | **Vocal Chop** | synth | stab, edm |

## Modular & Experimental (22)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **West Coast** | synth | fold, buchla |
| 2 | **Complex Osc** | synth | fm, evolving |
| 3 | **Self Oscillation** | synth | resonant, pure |
| 4 | **Wavefolder** | synth | fold, harsh |
| 5 | **Lowpass Gate** | synth | vactrol, plucky |
| 6 | **Bucket Brigade** | synth | analog, delay |
| 7 | **Krell Patch** | synth | generative, random |
| 8 | **Sample & Hold** | synth | stepped, random |
| 9 | **Clock Divider** | synth | stepped, rhythmic |
| 10 | **Chaos** | synth | unstable, noise |
| 11 | **Ping Filter** | synth | resonant, percussive |
| 12 | **Physical String** | synth | karplus, plucked |
| 13 | **Metallic Resonator** | synth | inharmonic, ring |
| 14 | **Modular Drone** | synth | drone, slow |
| 15 | **FM Chaos** | synth | fm, inharmonic |
| 16 | **Ring Stack** | synth | ring, metallic |
| 17 | **Granular Cloud** | synth | texture, stutter |
| 18 | **Feedback Patch** | synth | howl, unstable |
| 19 | **Bleep Sequence** | synth | stepped, short |
| 20 | **Rumble Module** | synth | sub, noise |
| 21 | **Shimmer Cell** | synth | bright, texture |
| 22 | **Burst Generator** | synth | percussive, noise |

## Atmospheres (18)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Rain** | synth | weather, hiss |
| 2 | **Wind** | synth | weather, howl |
| 3 | **Ocean** | synth | weather, swell |
| 4 | **Machine Room** | synth | industrial, hum |
| 5 | **Engine Hum** | synth | industrial, low |
| 6 | **Crowd Murmur** | synth | human, bed |
| 7 | **Tape Hiss** | synth | lofi, texture |
| 8 | **Neon Buzz** | synth | electric, thin |
| 9 | **Underwater** | synth | muffled, deep |
| 10 | **Shortwave** | synth | radio, noisy |
| 11 | **Cathedral Air** | synth | holy, huge |
| 12 | **Static Field** | synth | harsh, digital |
| 13 | **Forest** | synth | nature, bright |
| 14 | **City Hum** | synth | urban, low |
| 15 | **Fire** | synth | crackle, warm |
| 16 | **Snowfall** | synth | soft, high |
| 17 | **Subway** | synth | industrial, rumble |
| 18 | **Deep Space** | synth | drone, vast |

## FX & Noise (26)

| # | Instrument | Engine | Character |
|---:|---|---|---|
| 1 | **Riser** | synth | transition, sweep |
| 2 | **Downlifter** | synth | transition, fall |
| 3 | **Impact** | synth | hit, huge |
| 4 | **Static Burst** | synth | noise, digital |
| 5 | **Vinyl Bed** | synth | texture, lofi |
| 6 | **Feedback Scream** | synth | noise, harsh |
| 7 | **Noise Sweep** | synth | transition, filter |
| 8 | **Suckback** | synth | transition, reverse |
| 9 | **Laser Zap** | synth | hit, digital |
| 10 | **Siren Wail** | synth | fx, lfo |
| 11 | **Tape Stop** | synth | fx, fall |
| 12 | **Radio Static** | synth | texture, noise |
| 13 | **Sub Drop** | synth | transition, sub |
| 14 | **Glitch Burst** | synth | digital, stutter |
| 15 | **White Hit** | synth | hit, noise |
| 16 | **Braam** | synth | hit, cinematic |
| 17 | **Bit Fall** | synth | digital, fall |
| 18 | **Alarm** | synth | siren, harsh |
| 19 | **Uplifter** | synth | transition, rise |
| 20 | **Reverse Impact** | synth | swell, hit |
| 21 | **Stutter Glitch** | synth | glitch, gated |
| 22 | **Metal Hit** | synth | hit, industrial |
| 23 | **Air Horn** | synth | rave, blast |
| 24 | **Turntable Scratch** | synth | dj, fx |
| 25 | **Rewind** | synth | fx, rise |
| 26 | **Drop Hit** | synth | hit, huge |
