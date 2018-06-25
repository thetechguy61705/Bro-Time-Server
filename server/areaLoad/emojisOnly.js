var { Guild, TextChannel } = require("discord.js");
var channels = [];
var listenersAdded = false;

/* eslint-disable line-comment-position */
const CHANNEL_NAME = "emoji-only";
const WHITESPACE = /\s+/;
const SINGLES = [
	0x2139, // information
	0x2328, // keyboard
	0x23CF, // eject button
	0x24C2, // circled M
	0x25B6, // play button
	0x25C0, // reverse button
	0x260E, // telephone
	0x2611, // ballot box with check
	0x2618, // shamrock
	0x261D, // index pointing up
	0x2620, // skull and crossbones
	0x2626, // orthodox cross
	0x262A, // star and crescent
	0x2640, // female sign
	0x2642, // male sign
	0x2663, // club suit
	0x2668, // hot springs
	0x267B, // recycling symbol
	0x2699, // gear
	0x26C8, // cloud with lightning and rain
	0x26CE, // Ophiuchus
	0x26CF, // pick
	0x26D1, // rescue worker’s helmet
	0x26FD, // fuel pump
	0x2702, // scissors
	0x2705, // white heavy check mark
	0x270F, // pencil
	0x2712, // black nib
	0x2714, // heavy check mark
	0x2716, // heavy multiplication x
	0x271D, // latin cross
	0x2721, // star of David
	0x2728, // sparkles
	0x2744, // snowflake
	0x2747, // sparkle
	0x274C, // cross mark
	0x274E, // cross mark button
	0x2757, // exclamation mark
	0x27A1, // right arrow
	0x27B0, // curly loop
	0x27BF, // double curly loop
	0x2B50, // star
	0x2B55, // heavy large circle
	0x3030, // wavy dash
	0x303D, // part alternation mark
	0x3297, // Japanese “congratulations” button
	0x3299, // Japanese “secret” button
	0x1F004, // mahjong red dragon
	0x1F0CF, // joker
	0x1F17F, // P button
	0x1F18E, // 1F191..1F19A  ; Emoji                #  6.0 [10] (🆑..🆚)    CL button..VS button
	0x1F21A, // Japanese “free of charge” button
	0x1F22F, // Japanese “reserved” button
	0x1F321, // thermometer
	0x1F336, // hot pepper
	0x1F37D, // fork and knife with plate
	0x1F3C5, // sports medal
	0x1F3F7, // label
	0x1F43F, // chipmunk
	0x1F440, // eyes
	0x1F441, // eye
	0x1F4F8, // camera with flash
	0x1F4FD, // film projector
	0x1F4FF, // prayer beads
	0x1F57A, // man dancing
	0x1F587, // linked paperclips
	0x1F590, // hand with fingers splayed
	0x1F5A4, // black heart
	0x1F5A5, // desktop computer
	0x1F5A8, // printer
	0x1F5BC, // framed picture
	0x1F5E1, // dagger
	0x1F5E3, // speaking head
	0x1F5E8, // left speech bubble
	0x1F5EF, // right anger bubble
	0x1F5F3, // ballot box with ballot
	0x1F5FA, // world map
	0x1F600, // grinning face
	0x1F611, // expressionless face
	0x1F615, // confused face
	0x1F616, // confounded face
	0x1F617, // kissing face
	0x1F618, // face blowing a kiss
	0x1F619, // kissing face with smiling eyes
	0x1F61A, // kissing face with closed eyes
	0x1F61B, // face with tongue
	0x1F61F, // worried face
	0x1F62C, // grimacing face
	0x1F62D, // loudly crying face
	0x1F634, // sleeping face
	0x1F6D0, // place of worship
	0x1F6E9, // small airplane
	0x1F6F0, // satellite
	0x1F6F3, // passenger ship
	0x1F6F9, // skateboard
	0x1F91F, // love-you gesture
	0x1F930, // pregnant woman
	0x1F94C, // curling stone
	0x1F97A, // pleading face
	0x1F9C0, // cheese wedge
	0x23F0, // alarm clock
	0x23F3, // hourglass not done
	0x267F, // wheelchair symbol
	0x2693, // anchor
	0x26A1, // high voltage
	0x26CE, // Ophiuchus
	0x26D4, // no entry
	0x26EA, // church
	0x26F5, // sailboat
	0x26FA, // tent
	0x26FD, // fuel pump
	0x2705, // white heavy check mark
	0x2728, // sparkles
	0x274C, // cross mark
	0x274E, // cross mark button
	0x2757, // exclamation mark
	0x27B0, // curly loop
	0x27BF, // double curly loop
	0x2B50, // star
	0x2B55, // heavy large circle
	0x1F004, // mahjong red dragon
	0x1F0CF, // joker
	0x1F18E, // 1F191..1F19A  ; Emoji_Presentation   #  6.0 [10] (🆑..🆚)    CL button..VS button
	0x1F201, // Japanese “here” button
	0x1F21A, // Japanese “free of charge” button
	0x1F22F, // Japanese “reserved” button
	0x1F3C5, // sports medal
	0x1F3F4, // black flag
	0x1F440, // eyes
	0x1F4F8, // camera with flash
	0x1F4FF, // prayer beads
	0x1F57A, // man dancing
	0x1F5A4, // black heart
	0x1F600, // grinning face
	0x1F611, // expressionless face
	0x1F615, // confused face
	0x1F616, // confounded face
	0x1F617, // kissing face
	0x1F618, // face blowing a kiss
	0x1F619, // kissing face with smiling eyes
	0x1F61A, // kissing face with closed eyes
	0x1F61B, // face with tongue
	0x1F61F, // worried face
	0x1F62C, // grimacing face
	0x1F62D, // loudly crying face
	0x1F634, // sleeping face
	0x1F6CC, // person in bed
	0x1F6D0, // place of worship
	0x1F6F9, // skateboard
	0x1F91F, // love-you gesture
	0x1F930, // pregnant woman
	0x1F94C, // curling stone
	0x1F97A, // pleading face
	0x1F9C0, // cheese wedge
	0x261D, // index pointing up
	0x26F9, // person bouncing ball
	0x1F385, // Santa Claus
	0x1F3C7, // horse racing
	0x1F3CA, // person swimming
	0x1F46E, // police officer
	0x1F47C, // baby angel
	0x1F4AA, // flexed biceps
	0x1F57A, // man dancing
	0x1F590, // hand with fingers splayed
	0x1F6A3, // person rowing boat
	0x1F6C0, // person taking bath
	0x1F6CC, // person in bed
	0x1F918, // sign of the horns
	0x1F91E, // crossed fingers
	0x1F91F, // love-you gesture
	0x1F926, // person facepalming
	0x1F930, // pregnant woman
	0x0023, // number sign
	0x002A, // asterisk
	0x200D, // zero width joiner
	0x20E3, // combining enclosing keycap
	0xFE0F, // VARIATION SELECTOR-16
	0x00A9, // copyright
	0x00AE, // registered
	0x203C, // double exclamation mark
	0x2049, // exclamation question mark
	0x2122, // trade mark
	0x2139, // information
	0x2328, // keyboard
	0x2388, // HELM SYMBOL
	0x23CF, // eject button
	0x24C2, // circled M
	0x25B6, // play button
	0x25C0, // reverse button
	0x2618, // shamrock
	0x2619, // REVERSED ROTATED FLORAL HEART BULLET
	0x269D, // OUTLINED WHITE STAR
	0x26B2, // NEUTER
	0x26CE, // Ophiuchus
	0x26E2, // ASTRONOMICAL SYMBOL FOR URANUS
	0x26E3, // HEAVY CIRCLE WITH STROKE AND TWO DOTS ABOVE
	0x2700, // BLACK SAFETY SCISSORS
	0x2705, // white heavy check mark
	0x2714, // heavy check mark
	0x2716, // heavy multiplication x
	0x271D, // latin cross
	0x2721, // star of David
	0x2728, // sparkles
	0x2744, // snowflake
	0x2747, // sparkle
	0x274C, // cross mark
	0x274E, // cross mark button
	0x2757, // exclamation mark
	0x27A1, // right arrow
	0x27B0, // curly loop
	0x27BF, // double curly loop
	0x2B50, // star
	0x2B55, // heavy large circle
	0x3030, // wavy dash
	0x303D, // part alternation mark
	0x3297, // Japanese “congratulations” button
	0x3299, // Japanese “secret” button
	0x1F0BF, // PLAYING CARD RED JOKER
	0x1F0C0, // <reserved-1F0C0>
	0x1F0D0, // <reserved-1F0D0>
	0x1F12F, // COPYLEFT SYMBOL
	0x1F17F, // P button
	0x1F18E, // 1F191..1F19A  ; Extended_Pictographic#  6.0 [10] (🆑..🆚)    CL button..VS button
	0x1F21A, // Japanese “free of charge” button
	0x1F22F, // Japanese “reserved” button
	0x1F336, // hot pepper
	0x1F37D, // fork and knife with plate
	0x1F3C5, // sports medal
	0x1F43F, // chipmunk
	0x1F440, // eyes
	0x1F441, // eye
	0x1F4F8, // camera with flash
	0x1F4FF, // prayer beads
	0x1F57A, // man dancing
	0x1F5A4, // black heart
	0x1F600, // grinning face
	0x1F611, // expressionless face
	0x1F615, // confused face
	0x1F616, // confounded face
	0x1F617, // kissing face
	0x1F618, // face blowing a kiss
	0x1F619, // kissing face with smiling eyes
	0x1F61A, // kissing face with closed eyes
	0x1F61B, // face with tongue
	0x1F61F, // worried face
	0x1F62C, // grimacing face
	0x1F62D, // loudly crying face
	0x1F634, // sleeping face
	0x1F6D0, // place of worship
	0x1F6F9, // skateboard
	0x1F91F, // love-you gesture
	0x1F930, // pregnant woman
	0x1F93F, // <reserved-1F93F>
	0x1F94C, // curling stone
	0x1F97A, // pleading face
	0x1F97B, // <reserved-1F97B>
	0x1F9C0, // cheese wedge
];
const RANGES = [
	{ min: 0x2194, max: 0x2199 }, // left-right arrow..down-left arrow
	{ min: 0x21A9, max: 0x21AA }, // right arrow curving left..left arrow curving right
	{ min: 0x231A, max: 0x231B }, // watch..hourglass done
	{ min: 0x23E9, max: 0x23F3 }, // fast-forward button..hourglass not done
	{ min: 0x23F8, max: 0x23FA }, // pause button..record button
	{ min: 0x25AA, max: 0x25AB }, // black small square..white small square
	{ min: 0x25FB, max: 0x25FE }, // white medium square..black medium-small square
	{ min: 0x2600, max: 0x2604 }, // sun..comet
	{ min: 0x2614, max: 0x2615 }, // umbrella with rain drops..hot beverage
	{ min: 0x2622, max: 0x2623 }, // radioactive..biohazard
	{ min: 0x262E, max: 0x262F }, // peace symbol..yin yang
	{ min: 0x2638, max: 0x263A }, // wheel of dharma..smiling face
	{ min: 0x2648, max: 0x2653 }, // Aries..Pisces
	{ min: 0x265F, max: 0x2660 }, // chess pawn..spade suit
	{ min: 0x2665, max: 0x2666 }, // heart suit..diamond suit
	{ min: 0x267E, max: 0x267F }, // infinity..wheelchair symbol
	{ min: 0x2692, max: 0x2697 }, // hammer and pick..alembic
	{ min: 0x269B, max: 0x269C }, // atom symbol..fleur-de-lis
	{ min: 0x26A0, max: 0x26A1 }, // warning..high voltage
	{ min: 0x26AA, max: 0x26AB }, // white circle..black circle
	{ min: 0x26B0, max: 0x26B1 }, // coffin..funeral urn
	{ min: 0x26BD, max: 0x26BE }, // soccer ball..baseball
	{ min: 0x26C4, max: 0x26C5 }, // snowman without snow..sun behind cloud
	{ min: 0x26D3, max: 0x26D4 }, // chains..no entry
	{ min: 0x26E9, max: 0x26EA }, // shinto shrine..church
	{ min: 0x26F0, max: 0x26F5 }, // mountain..sailboat
	{ min: 0x26F7, max: 0x26FA }, // skier..tent
	{ min: 0x2708, max: 0x2709 }, // airplane..envelope
	{ min: 0x270A, max: 0x270B }, // raised fist..raised hand
	{ min: 0x270C, max: 0x270D }, // victory hand..writing hand
	{ min: 0x2733, max: 0x2734 }, // eight-spoked asterisk..eight-pointed star
	{ min: 0x2753, max: 0x2755 }, // question mark..white exclamation mark
	{ min: 0x2763, max: 0x2764 }, // heavy heart exclamation..red heart
	{ min: 0x2795, max: 0x2797 }, // heavy plus sign..heavy division sign
	{ min: 0x2934, max: 0x2935 }, // right arrow curving up..right arrow curving down
	{ min: 0x2B05, max: 0x2B07 }, // left arrow..down arrow
	{ min: 0x2B1B, max: 0x2B1C }, // black large square..white large square
	{ min: 0x1F170, max: 0x1F171 }, // 1F17E         ; Emoji                #  6.0  [1] (🅾️)       O button (blood type)
	{ min: 0x1F1E6, max: 0x1F1FF }, // regional indicator symbol letter a..regional indicator symbol letter z
	{ min: 0x1F201, max: 0x1F202 }, // Japanese “here” button..Japanese “service charge” button
	{ min: 0x1F232, max: 0x1F23A }, // Japanese “prohibited” button..Japanese “open for business” button
	{ min: 0x1F250, max: 0x1F251 }, // Japanese “bargain” button..Japanese “acceptable” button
	{ min: 0x1F300, max: 0x1F320 }, // cyclone..shooting star
	{ min: 0x1F324, max: 0x1F32C }, // sun behind small cloud..wind face
	{ min: 0x1F32D, max: 0x1F32F }, // hot dog..burrito
	{ min: 0x1F330, max: 0x1F335 }, // chestnut..cactus
	{ min: 0x1F337, max: 0x1F37C }, // tulip..baby bottle
	{ min: 0x1F37E, max: 0x1F37F }, // bottle with popping cork..popcorn
	{ min: 0x1F380, max: 0x1F393 }, // ribbon..graduation cap
	{ min: 0x1F396, max: 0x1F397 }, // military medal..reminder ribbon
	{ min: 0x1F399, max: 0x1F39B }, // studio microphone..control knobs
	{ min: 0x1F39E, max: 0x1F39F }, // film frames..admission tickets
	{ min: 0x1F3A0, max: 0x1F3C4 }, // carousel horse..person surfing
	{ min: 0x1F3C6, max: 0x1F3CA }, // trophy..person swimming
	{ min: 0x1F3CB, max: 0x1F3CE }, // person lifting weights..racing car
	{ min: 0x1F3CF, max: 0x1F3D3 }, // cricket game..ping pong
	{ min: 0x1F3D4, max: 0x1F3DF }, // snow-capped mountain..stadium
	{ min: 0x1F3E0, max: 0x1F3F0 }, // house..castle
	{ min: 0x1F3F3, max: 0x1F3F5 }, // white flag..rosette
	{ min: 0x1F3F8, max: 0x1F3FF }, // badminton..dark skin tone
	{ min: 0x1F400, max: 0x1F43E }, // rat..paw prints
	{ min: 0x1F442, max: 0x1F4F7 }, // ear..camera
	{ min: 0x1F4F9, max: 0x1F4FC }, // video camera..videocassette
	{ min: 0x1F500, max: 0x1F53D }, // shuffle tracks button..downwards button
	{ min: 0x1F549, max: 0x1F54A }, // om..dove
	{ min: 0x1F54B, max: 0x1F54E }, // kaaba..menorah
	{ min: 0x1F550, max: 0x1F567 }, // one o’clock..twelve-thirty
	{ min: 0x1F56F, max: 0x1F570 }, // candle..mantelpiece clock
	{ min: 0x1F573, max: 0x1F579 }, // hole..joystick
	{ min: 0x1F58A, max: 0x1F58D }, // pen..crayon
	{ min: 0x1F595, max: 0x1F596 }, // middle finger..vulcan salute
	{ min: 0x1F5B1, max: 0x1F5B2 }, // computer mouse..trackball
	{ min: 0x1F5C2, max: 0x1F5C4 }, // card index dividers..file cabinet
	{ min: 0x1F5D1, max: 0x1F5D3 }, // wastebasket..spiral calendar
	{ min: 0x1F5DC, max: 0x1F5DE }, // clamp..rolled-up newspaper
	{ min: 0x1F5FB, max: 0x1F5FF }, // mount fuji..moai
	{ min: 0x1F601, max: 0x1F610 }, // beaming face with smiling eyes..neutral face
	{ min: 0x1F612, max: 0x1F614 }, // unamused face..pensive face
	{ min: 0x1F61C, max: 0x1F61E }, // winking face with tongue..disappointed face
	{ min: 0x1F620, max: 0x1F625 }, // angry face..sad but relieved face
	{ min: 0x1F626, max: 0x1F627 }, // frowning face with open mouth..anguished face
	{ min: 0x1F628, max: 0x1F62B }, // fearful face..tired face
	{ min: 0x1F62E, max: 0x1F62F }, // face with open mouth..hushed face
	{ min: 0x1F630, max: 0x1F633 }, // anxious face with sweat..flushed face
	{ min: 0x1F635, max: 0x1F640 }, // dizzy face..weary cat face
	{ min: 0x1F641, max: 0x1F642 }, // slightly frowning face..slightly smiling face
	{ min: 0x1F643, max: 0x1F644 }, // upside-down face..face with rolling eyes
	{ min: 0x1F645, max: 0x1F64F }, // person gesturing NO..folded hands
	{ min: 0x1F680, max: 0x1F6C5 }, // rocket..left luggage
	{ min: 0x1F6CB, max: 0x1F6CF }, // couch and lamp..bed
	{ min: 0x1F6D1, max: 0x1F6D2 }, // stop sign..shopping cart
	{ min: 0x1F6E0, max: 0x1F6E5 }, // hammer and wrench..motor boat
	{ min: 0x1F6EB, max: 0x1F6EC }, // airplane departure..airplane arrival
	{ min: 0x1F6F4, max: 0x1F6F6 }, // kick scooter..canoe
	{ min: 0x1F6F7, max: 0x1F6F8 }, // sled..flying saucer
	{ min: 0x1F910, max: 0x1F918 }, // zipper-mouth face..sign of the horns
	{ min: 0x1F919, max: 0x1F91E }, // call me hand..crossed fingers
	{ min: 0x1F920, max: 0x1F927 }, // cowboy hat face..sneezing face
	{ min: 0x1F928, max: 0x1F92F }, // face with raised eyebrow..exploding head
	{ min: 0x1F931, max: 0x1F932 }, // breast-feeding..palms up together
	{ min: 0x1F933, max: 0x1F93A }, // selfie..person fencing
	{ min: 0x1F93C, max: 0x1F93E }, // people wrestling..person playing handball
	{ min: 0x1F940, max: 0x1F945 }, // wilted flower..goal net
	{ min: 0x1F947, max: 0x1F94B }, // 1st place medal..martial arts uniform
	{ min: 0x1F94D, max: 0x1F94F }, // lacrosse..flying disc
	{ min: 0x1F950, max: 0x1F95E }, // croissant..pancakes
	{ min: 0x1F95F, max: 0x1F96B }, // dumpling..canned food
	{ min: 0x1F96C, max: 0x1F970 }, // leafy green..smiling face with 3 hearts
	{ min: 0x1F973, max: 0x1F976 }, // partying face..cold face
	{ min: 0x1F97C, max: 0x1F97F }, // lab coat..woman’s flat shoe
	{ min: 0x1F980, max: 0x1F984 }, // crab..unicorn face
	{ min: 0x1F985, max: 0x1F991 }, // eagle..squid
	{ min: 0x1F992, max: 0x1F997 }, // giraffe..cricket
	{ min: 0x1F998, max: 0x1F9A2 }, // kangaroo..swan
	{ min: 0x1F9B0, max: 0x1F9B9 }, // red-haired..supervillain
	{ min: 0x1F9C1, max: 0x1F9C2 }, // cupcake..salt
	{ min: 0x1F9D0, max: 0x1F9E6 }, // face with monocle..socks
	{ min: 0x1F9E7, max: 0x1F9FF }, // red envelope..nazar amulet
	{ min: 0x231A, max: 0x231B }, // watch..hourglass done
	{ min: 0x23E9, max: 0x23EC }, // fast-forward button..fast down button
	{ min: 0x25FD, max: 0x25FE }, // white medium-small square..black medium-small square
	{ min: 0x2614, max: 0x2615 }, // umbrella with rain drops..hot beverage
	{ min: 0x2648, max: 0x2653 }, // Aries..Pisces
	{ min: 0x26AA, max: 0x26AB }, // white circle..black circle
	{ min: 0x26BD, max: 0x26BE }, // soccer ball..baseball
	{ min: 0x26C4, max: 0x26C5 }, // snowman without snow..sun behind cloud
	{ min: 0x26F2, max: 0x26F3 }, // fountain..flag in hole
	{ min: 0x270A, max: 0x270B }, // raised fist..raised hand
	{ min: 0x2753, max: 0x2755 }, // question mark..white exclamation mark
	{ min: 0x2795, max: 0x2797 }, // heavy plus sign..heavy division sign
	{ min: 0x2B1B, max: 0x2B1C }, // black large square..white large square
	{ min: 0x1F1E6, max: 0x1F1FF }, // regional indicator symbol letter a..regional indicator symbol letter z
	{ min: 0x1F232, max: 0x1F236 }, // Japanese “prohibited” button..Japanese “not free of charge” button
	{ min: 0x1F238, max: 0x1F23A }, // Japanese “application” button..Japanese “open for business” button
	{ min: 0x1F250, max: 0x1F251 }, // Japanese “bargain” button..Japanese “acceptable” button
	{ min: 0x1F300, max: 0x1F320 }, // cyclone..shooting star
	{ min: 0x1F32D, max: 0x1F32F }, // hot dog..burrito
	{ min: 0x1F330, max: 0x1F335 }, // chestnut..cactus
	{ min: 0x1F337, max: 0x1F37C }, // tulip..baby bottle
	{ min: 0x1F37E, max: 0x1F37F }, // bottle with popping cork..popcorn
	{ min: 0x1F380, max: 0x1F393 }, // ribbon..graduation cap
	{ min: 0x1F3A0, max: 0x1F3C4 }, // carousel horse..person surfing
	{ min: 0x1F3C6, max: 0x1F3CA }, // trophy..person swimming
	{ min: 0x1F3CF, max: 0x1F3D3 }, // cricket game..ping pong
	{ min: 0x1F3E0, max: 0x1F3F0 }, // house..castle
	{ min: 0x1F3F8, max: 0x1F3FF }, // badminton..dark skin tone
	{ min: 0x1F400, max: 0x1F43E }, // rat..paw prints
	{ min: 0x1F442, max: 0x1F4F7 }, // ear..camera
	{ min: 0x1F4F9, max: 0x1F4FC }, // video camera..videocassette
	{ min: 0x1F500, max: 0x1F53D }, // shuffle tracks button..downwards button
	{ min: 0x1F54B, max: 0x1F54E }, // kaaba..menorah
	{ min: 0x1F550, max: 0x1F567 }, // one o’clock..twelve-thirty
	{ min: 0x1F595, max: 0x1F596 }, // middle finger..vulcan salute
	{ min: 0x1F5FB, max: 0x1F5FF }, // mount fuji..moai
	{ min: 0x1F601, max: 0x1F610 }, // beaming face with smiling eyes..neutral face
	{ min: 0x1F612, max: 0x1F614 }, // unamused face..pensive face
	{ min: 0x1F61C, max: 0x1F61E }, // winking face with tongue..disappointed face
	{ min: 0x1F620, max: 0x1F625 }, // angry face..sad but relieved face
	{ min: 0x1F626, max: 0x1F627 }, // frowning face with open mouth..anguished face
	{ min: 0x1F628, max: 0x1F62B }, // fearful face..tired face
	{ min: 0x1F62E, max: 0x1F62F }, // face with open mouth..hushed face
	{ min: 0x1F630, max: 0x1F633 }, // anxious face with sweat..flushed face
	{ min: 0x1F635, max: 0x1F640 }, // dizzy face..weary cat face
	{ min: 0x1F641, max: 0x1F642 }, // slightly frowning face..slightly smiling face
	{ min: 0x1F643, max: 0x1F644 }, // upside-down face..face with rolling eyes
	{ min: 0x1F645, max: 0x1F64F }, // person gesturing NO..folded hands
	{ min: 0x1F680, max: 0x1F6C5 }, // rocket..left luggage
	{ min: 0x1F6D1, max: 0x1F6D2 }, // stop sign..shopping cart
	{ min: 0x1F6EB, max: 0x1F6EC }, // airplane departure..airplane arrival
	{ min: 0x1F6F4, max: 0x1F6F6 }, // kick scooter..canoe
	{ min: 0x1F6F7, max: 0x1F6F8 }, // sled..flying saucer
	{ min: 0x1F910, max: 0x1F918 }, // zipper-mouth face..sign of the horns
	{ min: 0x1F919, max: 0x1F91E }, // call me hand..crossed fingers
	{ min: 0x1F920, max: 0x1F927 }, // cowboy hat face..sneezing face
	{ min: 0x1F928, max: 0x1F92F }, // face with raised eyebrow..exploding head
	{ min: 0x1F931, max: 0x1F932 }, // breast-feeding..palms up together
	{ min: 0x1F933, max: 0x1F93A }, // selfie..person fencing
	{ min: 0x1F93C, max: 0x1F93E }, // people wrestling..person playing handball
	{ min: 0x1F940, max: 0x1F945 }, // wilted flower..goal net
	{ min: 0x1F947, max: 0x1F94B }, // 1st place medal..martial arts uniform
	{ min: 0x1F94D, max: 0x1F94F }, // lacrosse..flying disc
	{ min: 0x1F950, max: 0x1F95E }, // croissant..pancakes
	{ min: 0x1F95F, max: 0x1F96B }, // dumpling..canned food
	{ min: 0x1F96C, max: 0x1F970 }, // leafy green..smiling face with 3 hearts
	{ min: 0x1F973, max: 0x1F976 }, // partying face..cold face
	{ min: 0x1F97C, max: 0x1F97F }, // lab coat..woman’s flat shoe
	{ min: 0x1F980, max: 0x1F984 }, // crab..unicorn face
	{ min: 0x1F985, max: 0x1F991 }, // eagle..squid
	{ min: 0x1F992, max: 0x1F997 }, // giraffe..cricket
	{ min: 0x1F998, max: 0x1F9A2 }, // kangaroo..swan
	{ min: 0x1F9B0, max: 0x1F9B9 }, // red-haired..supervillain
	{ min: 0x1F9C1, max: 0x1F9C2 }, // cupcake..salt
	{ min: 0x1F9D0, max: 0x1F9E6 }, // face with monocle..socks
	{ min: 0x1F9E7, max: 0x1F9FF }, // red envelope..nazar amulet
	{ min: 0x270A, max: 0x270B }, // raised fist..raised hand
	{ min: 0x270C, max: 0x270D }, // victory hand..writing hand
	{ min: 0x1F3C2, max: 0x1F3C4 }, // snowboarder..person surfing
	{ min: 0x1F3CB, max: 0x1F3CC }, // person lifting weights..person golfing
	{ min: 0x1F442, max: 0x1F443 }, // ear..nose
	{ min: 0x1F446, max: 0x1F450 }, // backhand index pointing up..open hands
	{ min: 0x1F466, max: 0x1F469 }, // boy..woman
	{ min: 0x1F470, max: 0x1F478 }, // bride with veil..princess
	{ min: 0x1F481, max: 0x1F483 }, // person tipping hand..woman dancing
	{ min: 0x1F485, max: 0x1F487 }, // nail polish..person getting haircut
	{ min: 0x1F574, max: 0x1F575 }, // man in suit levitating..detective
	{ min: 0x1F595, max: 0x1F596 }, // middle finger..vulcan salute
	{ min: 0x1F645, max: 0x1F647 }, // person gesturing NO..person bowing
	{ min: 0x1F64B, max: 0x1F64F }, // person raising hand..folded hands
	{ min: 0x1F6B4, max: 0x1F6B6 }, // person biking..person walking
	{ min: 0x1F919, max: 0x1F91C }, // call me hand..right-facing fist
	{ min: 0x1F931, max: 0x1F932 }, // breast-feeding..palms up together
	{ min: 0x1F933, max: 0x1F939 }, // selfie..person juggling
	{ min: 0x1F93D, max: 0x1F93E }, // person playing water polo..person playing handball
	{ min: 0x1F9B5, max: 0x1F9B6 }, // leg..foot
	{ min: 0x1F9B8, max: 0x1F9B9 }, // superhero..supervillain
	{ min: 0x1F9D1, max: 0x1F9DD }, // adult..elf
	{ min: 0x0030, max: 0x0039 }, // digit zero..digit nine
	{ min: 0x1F1E6, max: 0x1F1FF }, // regional indicator symbol letter a..regional indicator symbol letter z
	{ min: 0x1F3FB, max: 0x1F3FF }, // light skin tone..dark skin tone
	{ min: 0x1F9B0, max: 0x1F9B3 }, // red-haired..white-haired
	{ min: 0xE0020, max: 0xE007F }, // tag space..cancel tag
	{ min: 0x2194, max: 0x2199 }, // left-right arrow..down-left arrow
	{ min: 0x21A9, max: 0x21AA }, // right arrow curving left..left arrow curving right
	{ min: 0x231A, max: 0x231B }, // watch..hourglass done
	{ min: 0x23E9, max: 0x23F3 }, // fast-forward button..hourglass not done
	{ min: 0x23F8, max: 0x23FA }, // pause button..record button
	{ min: 0x25AA, max: 0x25AB }, // black small square..white small square
	{ min: 0x25FB, max: 0x25FE }, // white medium square..black medium-small square
	{ min: 0x2600, max: 0x2605 }, // sun..BLACK STAR
	{ min: 0x2607, max: 0x2612 }, // LIGHTNING..BALLOT BOX WITH X
	{ min: 0x2614, max: 0x2615 }, // umbrella with rain drops..hot beverage
	{ min: 0x2616, max: 0x2617 }, // WHITE SHOGI PIECE..BLACK SHOGI PIECE
	{ min: 0x261A, max: 0x266F }, // BLACK LEFT POINTING INDEX..MUSIC SHARP SIGN
	{ min: 0x2670, max: 0x2671 }, // WEST SYRIAC CROSS..EAST SYRIAC CROSS
	{ min: 0x2672, max: 0x267D }, // UNIVERSAL RECYCLING SYMBOL..PARTIALLY-RECYCLED PAPER SYMBOL
	{ min: 0x267E, max: 0x267F }, // infinity..wheelchair symbol
	{ min: 0x2680, max: 0x2685 }, // DIE FACE-1..DIE FACE-6
	{ min: 0x2690, max: 0x2691 }, // WHITE FLAG..BLACK FLAG
	{ min: 0x2692, max: 0x269C }, // hammer and pick..fleur-de-lis
	{ min: 0x269E, max: 0x269F }, // THREE LINES CONVERGING RIGHT..THREE LINES CONVERGING LEFT
	{ min: 0x26A0, max: 0x26A1 }, // warning..high voltage
	{ min: 0x26A2, max: 0x26B1 }, // DOUBLED FEMALE SIGN..funeral urn
	{ min: 0x26B3, max: 0x26BC }, // CERES..SESQUIQUADRATE
	{ min: 0x26BD, max: 0x26BF }, // soccer ball..SQUARED KEY
	{ min: 0x26C0, max: 0x26C3 }, // WHITE DRAUGHTS MAN..BLACK DRAUGHTS KING
	{ min: 0x26C4, max: 0x26CD }, // snowman without snow..DISABLED CAR
	{ min: 0x26CF, max: 0x26E1 }, // pick..RESTRICTED LEFT ENTRY-2
	{ min: 0x26E4, max: 0x26E7 }, // PENTAGRAM..INVERTED PENTAGRAM
	{ min: 0x26E8, max: 0x26FF }, // BLACK CROSS ON SHIELD..WHITE FLAG WITH HORIZONTAL MIDDLE BLACK STRIPE
	{ min: 0x2701, max: 0x2704 }, // UPPER BLADE SCISSORS..WHITE SCISSORS
	{ min: 0x2708, max: 0x2709 }, // airplane..envelope
	{ min: 0x270A, max: 0x270B }, // raised fist..raised hand
	{ min: 0x270C, max: 0x2712 }, // victory hand..black nib
	{ min: 0x2733, max: 0x2734 }, // eight-spoked asterisk..eight-pointed star
	{ min: 0x2753, max: 0x2755 }, // question mark..white exclamation mark
	{ min: 0x2763, max: 0x2767 }, // heavy heart exclamation..ROTATED FLORAL HEART BULLET
	{ min: 0x2795, max: 0x2797 }, // heavy plus sign..heavy division sign
	{ min: 0x2934, max: 0x2935 }, // right arrow curving up..right arrow curving down
	{ min: 0x2B05, max: 0x2B07 }, // left arrow..down arrow
	{ min: 0x2B1B, max: 0x2B1C }, // black large square..white large square
	{ min: 0x1F000, max: 0x1F02B }, // MAHJONG TILE EAST WIND..MAHJONG TILE BACK
	{ min: 0x1F02C, max: 0x1F02F }, // <reserved-1F02C>..<reserved-1F02F>
	{ min: 0x1F030, max: 0x1F093 }, // DOMINO TILE HORIZONTAL BACK..DOMINO TILE VERTICAL-06-06
	{ min: 0x1F094, max: 0x1F09F }, // <reserved-1F094>..<reserved-1F09F>
	{ min: 0x1F0A0, max: 0x1F0AE }, // PLAYING CARD BACK..PLAYING CARD KING OF SPADES
	{ min: 0x1F0AF, max: 0x1F0B0 }, // <reserved-1F0AF>..<reserved-1F0B0>
	{ min: 0x1F0B1, max: 0x1F0BE }, // PLAYING CARD ACE OF HEARTS..PLAYING CARD KING OF HEARTS
	{ min: 0x1F0C1, max: 0x1F0CF }, // PLAYING CARD ACE OF DIAMONDS..joker
	{ min: 0x1F0D1, max: 0x1F0DF }, // PLAYING CARD ACE OF CLUBS..PLAYING CARD WHITE JOKER
	{ min: 0x1F0E0, max: 0x1F0F5 }, // PLAYING CARD FOOL..PLAYING CARD TRUMP-21
	{ min: 0x1F0F6, max: 0x1F0FF }, // <reserved-1F0F6>..<reserved-1F0FF>
	{ min: 0x1F10D, max: 0x1F10F }, // <reserved-1F10D>..<reserved-1F10F>
	{ min: 0x1F16C, max: 0x1F16F }, // <reserved-1F16C>..<reserved-1F16F>
	{ min: 0x1F170, max: 0x1F171 }, // 1F17E         ; Extended_Pictographic#  6.0  [1] (🅾️)       O button (blood type)
	{ min: 0x1F1AD, max: 0x1F1E5 }, // <reserved-1F1AD>..<reserved-1F1E5>
	{ min: 0x1F201, max: 0x1F202 }, // Japanese “here” button..Japanese “service charge” button
	{ min: 0x1F203, max: 0x1F20F }, // <reserved-1F203>..<reserved-1F20F>
	{ min: 0x1F232, max: 0x1F23A }, // Japanese “prohibited” button..Japanese “open for business” button
	{ min: 0x1F23C, max: 0x1F23F }, // <reserved-1F23C>..<reserved-1F23F>
	{ min: 0x1F249, max: 0x1F24F }, // <reserved-1F249>..<reserved-1F24F>
	{ min: 0x1F250, max: 0x1F251 }, // Japanese “bargain” button..Japanese “acceptable” button
	{ min: 0x1F252, max: 0x1F25F }, // <reserved-1F252>..<reserved-1F25F>
	{ min: 0x1F260, max: 0x1F265 }, // ROUNDED SYMBOL FOR FU..ROUNDED SYMBOL FOR CAI
	{ min: 0x1F266, max: 0x1F2FF }, // <reserved-1F266>..<reserved-1F2FF>
	{ min: 0x1F300, max: 0x1F320 }, // cyclone..shooting star
	{ min: 0x1F321, max: 0x1F32C }, // thermometer..wind face
	{ min: 0x1F32D, max: 0x1F32F }, // hot dog..burrito
	{ min: 0x1F330, max: 0x1F335 }, // chestnut..cactus
	{ min: 0x1F337, max: 0x1F37C }, // tulip..baby bottle
	{ min: 0x1F37E, max: 0x1F37F }, // bottle with popping cork..popcorn
	{ min: 0x1F380, max: 0x1F393 }, // ribbon..graduation cap
	{ min: 0x1F394, max: 0x1F39F }, // HEART WITH TIP ON THE LEFT..admission tickets
	{ min: 0x1F3A0, max: 0x1F3C4 }, // carousel horse..person surfing
	{ min: 0x1F3C6, max: 0x1F3CA }, // trophy..person swimming
	{ min: 0x1F3CB, max: 0x1F3CE }, // person lifting weights..racing car
	{ min: 0x1F3CF, max: 0x1F3D3 }, // cricket game..ping pong
	{ min: 0x1F3D4, max: 0x1F3DF }, // snow-capped mountain..stadium
	{ min: 0x1F3E0, max: 0x1F3F0 }, // house..castle
	{ min: 0x1F3F1, max: 0x1F3F7 }, // WHITE PENNANT..label
	{ min: 0x1F3F8, max: 0x1F3FA }, // badminton..amphora
	{ min: 0x1F400, max: 0x1F43E }, // rat..paw prints
	{ min: 0x1F442, max: 0x1F4F7 }, // ear..camera
	{ min: 0x1F4F9, max: 0x1F4FC }, // video camera..videocassette
	{ min: 0x1F4FD, max: 0x1F4FE }, // film projector..PORTABLE STEREO
	{ min: 0x1F500, max: 0x1F53D }, // shuffle tracks button..downwards button
	{ min: 0x1F546, max: 0x1F54A }, // WHITE LATIN CROSS..dove
	{ min: 0x1F54B, max: 0x1F54F }, // kaaba..BOWL OF HYGIEIA
	{ min: 0x1F550, max: 0x1F567 }, // one o’clock..twelve-thirty
	{ min: 0x1F568, max: 0x1F579 }, // RIGHT SPEAKER..joystick
	{ min: 0x1F57B, max: 0x1F5A3 }, // LEFT HAND TELEPHONE RECEIVER..BLACK DOWN POINTING BACKHAND INDEX
	{ min: 0x1F5A5, max: 0x1F5FA }, // desktop computer..world map
	{ min: 0x1F5FB, max: 0x1F5FF }, // mount fuji..moai
	{ min: 0x1F601, max: 0x1F610 }, // beaming face with smiling eyes..neutral face
	{ min: 0x1F612, max: 0x1F614 }, // unamused face..pensive face
	{ min: 0x1F61C, max: 0x1F61E }, // winking face with tongue..disappointed face
	{ min: 0x1F620, max: 0x1F625 }, // angry face..sad but relieved face
	{ min: 0x1F626, max: 0x1F627 }, // frowning face with open mouth..anguished face
	{ min: 0x1F628, max: 0x1F62B }, // fearful face..tired face
	{ min: 0x1F62E, max: 0x1F62F }, // face with open mouth..hushed face
	{ min: 0x1F630, max: 0x1F633 }, // anxious face with sweat..flushed face
	{ min: 0x1F635, max: 0x1F640 }, // dizzy face..weary cat face
	{ min: 0x1F641, max: 0x1F642 }, // slightly frowning face..slightly smiling face
	{ min: 0x1F643, max: 0x1F644 }, // upside-down face..face with rolling eyes
	{ min: 0x1F645, max: 0x1F64F }, // person gesturing NO..folded hands
	{ min: 0x1F680, max: 0x1F6C5 }, // rocket..left luggage
	{ min: 0x1F6C6, max: 0x1F6CF }, // TRIANGLE WITH ROUNDED CORNERS..bed
	{ min: 0x1F6D1, max: 0x1F6D2 }, // stop sign..shopping cart
	{ min: 0x1F6D3, max: 0x1F6D4 }, // STUPA..PAGODA
	{ min: 0x1F6D5, max: 0x1F6DF }, // <reserved-1F6D5>..<reserved-1F6DF>
	{ min: 0x1F6E0, max: 0x1F6EC }, // hammer and wrench..airplane arrival
	{ min: 0x1F6ED, max: 0x1F6EF }, // <reserved-1F6ED>..<reserved-1F6EF>
	{ min: 0x1F6F0, max: 0x1F6F3 }, // satellite..passenger ship
	{ min: 0x1F6F4, max: 0x1F6F6 }, // kick scooter..canoe
	{ min: 0x1F6F7, max: 0x1F6F8 }, // sled..flying saucer
	{ min: 0x1F6FA, max: 0x1F6FF }, // <reserved-1F6FA>..<reserved-1F6FF>
	{ min: 0x1F774, max: 0x1F77F }, // <reserved-1F774>..<reserved-1F77F>
	{ min: 0x1F7D5, max: 0x1F7D8 }, // CIRCLED TRIANGLE..NEGATIVE CIRCLED SQUARE
	{ min: 0x1F7D9, max: 0x1F7FF }, // <reserved-1F7D9>..<reserved-1F7FF>
	{ min: 0x1F80C, max: 0x1F80F }, // <reserved-1F80C>..<reserved-1F80F>
	{ min: 0x1F848, max: 0x1F84F }, // <reserved-1F848>..<reserved-1F84F>
	{ min: 0x1F85A, max: 0x1F85F }, // <reserved-1F85A>..<reserved-1F85F>
	{ min: 0x1F888, max: 0x1F88F }, // <reserved-1F888>..<reserved-1F88F>
	{ min: 0x1F8AE, max: 0x1F8FF }, // <reserved-1F8AE>..<reserved-1F8FF>
	{ min: 0x1F90C, max: 0x1F90F }, // <reserved-1F90C>..<reserved-1F90F>
	{ min: 0x1F910, max: 0x1F918 }, // zipper-mouth face..sign of the horns
	{ min: 0x1F919, max: 0x1F91E }, // call me hand..crossed fingers
	{ min: 0x1F920, max: 0x1F927 }, // cowboy hat face..sneezing face
	{ min: 0x1F928, max: 0x1F92F }, // face with raised eyebrow..exploding head
	{ min: 0x1F931, max: 0x1F932 }, // breast-feeding..palms up together
	{ min: 0x1F933, max: 0x1F93A }, // selfie..person fencing
	{ min: 0x1F93C, max: 0x1F93E }, // people wrestling..person playing handball
	{ min: 0x1F940, max: 0x1F945 }, // wilted flower..goal net
	{ min: 0x1F947, max: 0x1F94B }, // 1st place medal..martial arts uniform
	{ min: 0x1F94D, max: 0x1F94F }, // lacrosse..flying disc
	{ min: 0x1F950, max: 0x1F95E }, // croissant..pancakes
	{ min: 0x1F95F, max: 0x1F96B }, // dumpling..canned food
	{ min: 0x1F96C, max: 0x1F970 }, // leafy green..smiling face with 3 hearts
	{ min: 0x1F971, max: 0x1F972 }, // <reserved-1F971>..<reserved-1F972>
	{ min: 0x1F973, max: 0x1F976 }, // partying face..cold face
	{ min: 0x1F977, max: 0x1F979 }, // <reserved-1F977>..<reserved-1F979>
	{ min: 0x1F97C, max: 0x1F97F }, // lab coat..woman’s flat shoe
	{ min: 0x1F980, max: 0x1F984 }, // crab..unicorn face
	{ min: 0x1F985, max: 0x1F991 }, // eagle..squid
	{ min: 0x1F992, max: 0x1F997 }, // giraffe..cricket
	{ min: 0x1F998, max: 0x1F9A2 }, // kangaroo..swan
	{ min: 0x1F9A3, max: 0x1F9AF }, // <reserved-1F9A3>..<reserved-1F9AF>
	{ min: 0x1F9B0, max: 0x1F9B9 }, // red-haired..supervillain
	{ min: 0x1F9BA, max: 0x1F9BF }, // <reserved-1F9BA>..<reserved-1F9BF>
	{ min: 0x1F9C1, max: 0x1F9C2 }, // cupcake..salt
	{ min: 0x1F9C3, max: 0x1F9CF }, // <reserved-1F9C3>..<reserved-1F9CF>
	{ min: 0x1F9D0, max: 0x1F9E6 }, // face with monocle..socks
	{ min: 0x1F9E7, max: 0x1F9FF }, // red envelope..nazar amulet
	{ min: 0x1FA00, max: 0x1FA5F }, // <reserved-1FA00>..<reserved-1FA5F>
	{ min: 0x1FA60, max: 0x1FA6D }, // XIANGQI RED GENERAL..XIANGQI BLACK SOLDIER
	{ min: 0x1FA6E, max: 0x1FFFD }, // <reserved-1FA6E>..<reserved-1FFFD>
];
const EMOTICONS = [
	":D"
];
/* eslint-enable line-comment-position */

function addChannel(channel) {
	channels.push(channel);
}

function removeChannel(channel) {
	var index = channels.indexOf(channel);
	if (index >= 0)
		channels.splice(index, 1);
}

function isValid(char) {
	var result = false;
	result = WHITESPACE.test(char);
	if (!result) {
		for (var codepoint of SINGLES) {
			if (char === codepoint) {
				result = true;
				break;
			}
		}
	}
	if (!result) {
		for (var range of RANGES) {
			if (char >= range.min && char <= range.max) {
				result = true;
				break;
			}
		}
	}
	return result;
}

function onMessage(message, newMessage) {
	if (newMessage != null)
		message = newMessage;
	if (channels.includes(message.channel) && message.deletable) {
		var content = message.content;
		var identifier = message.content.replace(":", "");
		var isInvalid = false;
		for (var char of Array.from(content)) {
			if (!isValid(char.codePointAt(0))) {
				isInvalid = true;
			}
		}
		if (isInvalid && message.guild != null) {
			isInvalid = !message.guild.emojis.some((emoji) => {
				return identifier == emoji.identifier &&
					(!emoji.requiresColons ||
						(content.startsWith(":") && content.endsWith(":")));
			});
		}
		if (isInvalid)
			isInvalid = !EMOTICONS.includes(content);
		if (!isInvalid)
			isInvalid = message.attachments.size > 0;
		if (isInvalid)
			message.delete();
	}
}

module.exports = {
	id: "emojisOnly",
	exec(area, client) {
		if (!listenersAdded) {
			listenersAdded = true;
			client.on("channelDelete", removeChannel);
			client.on("message", onMessage);
			client.on("messageUpdate", onMessage);
		}
		if (area instanceof Guild) {
			for (var channel of area.channels.values())
				this.exec(channel, client);
		} else if (area instanceof TextChannel && area.name === CHANNEL_NAME)
			addChannel(area);
	}
};
