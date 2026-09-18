# The Rack — all 260 instruments

Every instrument is synthesised from scratch by `src/js/audio/voice.js`. There are no samples anywhere in this app: the whole rack is a few kilobytes of parameters, so it renders identically at any sample rate.

The tables live one family per module under `src/js/data/rack/`; `src/js/data/instruments.js` stitches them together and documents every field.

| Family | Count | Colour |
|---|---:|---|
| Kicks | 22 | `#ff3b30` |
| Snares | 22 | `#ff9f0a` |
| Hats | 20 | `#ffd60a` |
| Percussion | 22 | `#32d74b` |
| Cymbals | 12 | `#66d4cf` |
| Bass | 30 | `#0a84ff` |
| Guitars | 22 | `#bf5af2` |
| Leads | 30 | `#ff2d95` |
| Pads | 18 | `#5e5ce6` |
| Plucks & Keys | 16 | `#64d2ff` |
| Voices | 12 | `#ffb3c7` |
| Mallets & Bells | 10 | `#d6a35c` |
| Strings & Bows | 10 | `#a8e6cf` |
| FX & Noise | 14 | `#8e8e93` |
| **Total** | **260** | |

## Kicks (22)

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

## Snares (22)

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
| 15 | **Piccolo** | drum | high, crack |
| 16 | **Deep Snare** | drum | low, fat |
| 17 | **White Slap** | drum | noise, pure |
| 18 | **Electro Snare** | drum | fm, digital |
| 19 | **Reverse Snare** | drum | fx, swell |
| 20 | **Stacked** | drum | layered, huge |
| 21 | **Tight Crack** | drum | short, dry |
| 22 | **Hardcore Snare** | drum | distorted, clipped |

## Hats (20)

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

## Percussion (22)

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

## Cymbals (12)

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

## Bass (30)

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

## Guitars (22)

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

## Leads (30)

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

## Pads (18)

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

## Plucks & Keys (16)

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

## Voices (12)

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

## Mallets & Bells (10)

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

## Strings & Bows (10)

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

## FX & Noise (14)

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

