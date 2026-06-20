// Hiragana stroke data — each character has an array of strokes,
// each stroke is an array of [x, y] control points (0–100 coordinate space).
// Points are connected via smooth curves for animation/tracing.

export interface StrokeChar {
  char: string;
  rom: string;
  strokes: number[][][]; // strokes[i] = array of [x,y] points for stroke i
}

export const HIRAGANA_STROKES: StrokeChar[] = [
  // あ行
  { char: 'あ', rom: 'a', strokes: [
    [[20, 30], [50, 28], [80, 32]], // stroke 1: horizontal
    [[55, 15], [52, 45], [48, 70], [55, 85]], // stroke 2: vertical curve
    [[25, 55], [40, 50], [60, 55], [70, 65], [65, 78], [50, 80], [35, 72]], // stroke 3: loop
  ]},
  { char: 'い', rom: 'i', strokes: [
    [[30, 25], [35, 50], [38, 75]], // stroke 1: left curve
    [[65, 30], [62, 55], [58, 70], [55, 80]], // stroke 2: right curve
  ]},
  { char: 'う', rom: 'u', strokes: [
    [[45, 20], [55, 20]], // stroke 1: short top
    [[35, 35], [50, 32], [65, 38], [68, 50], [60, 65], [45, 75], [35, 80]], // stroke 2: body curve
  ]},
  { char: 'え', rom: 'e', strokes: [
    [[35, 25], [50, 22], [60, 25]], // stroke 1: top
    [[45, 35], [30, 55], [50, 60], [65, 55], [60, 70], [40, 82]], // stroke 2: body
  ]},
  { char: 'お', rom: 'o', strokes: [
    [[20, 35], [50, 32], [75, 35]], // stroke 1: horizontal
    [[45, 15], [43, 40], [40, 65], [38, 80]], // stroke 2: vertical
    [[55, 50], [65, 55], [68, 65], [60, 75], [50, 73]], // stroke 3: right loop
  ]},
  // か行
  { char: 'か', rom: 'ka', strokes: [
    [[20, 30], [50, 28], [70, 32]], // stroke 1: horizontal
    [[45, 15], [42, 45], [38, 70], [42, 85]], // stroke 2: vertical curve
    [[60, 40], [65, 55], [62, 70], [55, 80]], // stroke 3: right
  ]},
  { char: 'き', rom: 'ki', strokes: [
    [[25, 25], [55, 22], [75, 25]], // stroke 1: top horizontal
    [[20, 45], [50, 42], [72, 45]], // stroke 2: middle horizontal
    [[55, 15], [50, 40], [45, 60]], // stroke 3: vertical
    [[35, 65], [50, 62], [60, 68], [55, 78], [42, 80]], // stroke 4: bottom curve
  ]},
  { char: 'く', rom: 'ku', strokes: [
    [[65, 20], [40, 50], [65, 80]], // stroke 1: angle
  ]},
  { char: 'け', rom: 'ke', strokes: [
    [[25, 20], [25, 50], [28, 75]], // stroke 1: left vertical
    [[25, 38], [50, 35], [70, 38]], // stroke 2: horizontal
    [[62, 25], [60, 50], [57, 70], [55, 82]], // stroke 3: right vertical
  ]},
  { char: 'こ', rom: 'ko', strokes: [
    [[30, 35], [50, 32], [70, 35]], // stroke 1: top horizontal
    [[30, 68], [50, 72], [70, 68]], // stroke 2: bottom curve
  ]},
  // さ行
  { char: 'さ', rom: 'sa', strokes: [
    [[25, 28], [50, 25], [72, 28]], // stroke 1: top horizontal
    [[20, 50], [50, 47], [72, 50]], // stroke 2: middle horizontal
    [[55, 20], [50, 45], [45, 60], [50, 72], [60, 75], [55, 82]], // stroke 3: vertical with curve
  ]},
  { char: 'し', rom: 'shi', strokes: [
    [[35, 20], [33, 45], [35, 65], [45, 75], [60, 72], [70, 60]], // stroke 1: hook
  ]},
  { char: 'す', rom: 'su', strokes: [
    [[20, 30], [50, 27], [75, 30]], // stroke 1: horizontal
    [[50, 15], [48, 40], [45, 55], [50, 65], [58, 68], [55, 78], [45, 82]], // stroke 2: vertical loop
  ]},
  { char: 'せ', rom: 'se', strokes: [
    [[30, 20], [28, 45], [30, 70]], // stroke 1: left vertical
    [[20, 45], [45, 42], [70, 45]], // stroke 2: horizontal
    [[60, 25], [58, 50], [55, 65], [60, 75], [70, 72]], // stroke 3: right curve
  ]},
  { char: 'そ', rom: 'so', strokes: [
    [[30, 20], [55, 22], [60, 30], [40, 50], [55, 65], [50, 78], [35, 82]], // stroke 1: zigzag
  ]},
  // た行
  { char: 'た', rom: 'ta', strokes: [
    [[20, 28], [50, 25], [72, 28]], // stroke 1: horizontal
    [[45, 15], [42, 40], [40, 60]], // stroke 2: vertical
    [[20, 55], [35, 52], [50, 55], [55, 62], [50, 70], [38, 72]], // stroke 3: left loop
    [[65, 50], [68, 62], [65, 75]], // stroke 4: right dot/stroke
  ]},
  { char: 'ち', rom: 'chi', strokes: [
    [[25, 28], [50, 25], [70, 28]], // stroke 1: horizontal
    [[45, 20], [40, 45], [50, 60], [65, 62], [70, 55]], // stroke 2: hook body
  ]},
  { char: 'つ', rom: 'tsu', strokes: [
    [[25, 35], [45, 30], [65, 35], [70, 50], [60, 65], [45, 72]], // stroke 1: curve
  ]},
  { char: 'て', rom: 'te', strokes: [
    [[25, 30], [50, 27], [70, 32], [55, 50], [40, 65], [35, 78]], // stroke 1: sweep
  ]},
  { char: 'と', rom: 'to', strokes: [
    [[40, 20], [38, 45], [40, 65]], // stroke 1: vertical
    [[40, 45], [50, 55], [60, 68], [65, 78]], // stroke 2: angle
  ]},
  // な行
  { char: 'な', rom: 'na', strokes: [
    [[20, 30], [50, 27], [72, 30]], // stroke 1: horizontal
    [[45, 15], [42, 40], [38, 65], [35, 80]], // stroke 2: vertical
    [[55, 45], [65, 50], [68, 60], [60, 70], [50, 68]], // stroke 3: right loop
    [[22, 60], [25, 70], [28, 75]], // stroke 4: left dot
  ]},
  { char: 'に', rom: 'ni', strokes: [
    [[25, 20], [25, 50], [28, 78]], // stroke 1: left vertical
    [[45, 35], [65, 35]], // stroke 2: top right horizontal
    [[45, 60], [65, 60]], // stroke 3: bottom right horizontal
  ]},
  { char: 'ぬ', rom: 'nu', strokes: [
    [[20, 35], [50, 32], [70, 38], [65, 50], [50, 55]], // stroke 1: top curve
    [[50, 55], [35, 65], [40, 78], [55, 80], [68, 72], [72, 60]], // stroke 2: bottom loop
  ]},
  { char: 'ね', rom: 'ne', strokes: [
    [[25, 20], [25, 50], [30, 75]], // stroke 1: left vertical
    [[25, 40], [45, 35], [60, 40], [55, 55], [40, 60], [50, 72], [65, 75], [72, 65]], // stroke 2: body
  ]},
  { char: 'の', rom: 'no', strokes: [
    [[60, 20], [35, 40], [30, 60], [40, 75], [60, 72], [68, 55], [60, 40]], // stroke 1: loop
  ]},
  // は行
  { char: 'は', rom: 'ha', strokes: [
    [[25, 20], [25, 50], [28, 78]], // stroke 1: left vertical
    [[40, 30], [60, 28], [72, 32]], // stroke 2: right horizontal
    [[58, 35], [55, 50], [52, 62], [58, 72], [68, 75], [72, 68]], // stroke 3: right loop
  ]},
  { char: 'ひ', rom: 'hi', strokes: [
    [[30, 25], [25, 50], [35, 70], [55, 72], [70, 60], [68, 45], [55, 40], [40, 48]], // stroke 1: wave
  ]},
  { char: 'ふ', rom: 'fu', strokes: [
    [[48, 18], [52, 22]], // stroke 1: top dot
    [[30, 40], [40, 38], [50, 42]], // stroke 2: left stroke
    [[55, 40], [65, 38], [75, 42]], // stroke 3: right stroke
    [[25, 55], [40, 60], [55, 68], [65, 78]], // stroke 4: bottom
  ]},
  { char: 'へ', rom: 'he', strokes: [
    [[20, 55], [50, 30], [80, 55]], // stroke 1: mountain
  ]},
  { char: 'ほ', rom: 'ho', strokes: [
    [[25, 20], [25, 50], [28, 78]], // stroke 1: left vertical
    [[38, 30], [58, 28], [72, 30]], // stroke 2: right horizontal top
    [[55, 20], [53, 42], [50, 58]], // stroke 3: right vertical
    [[40, 55], [55, 58], [65, 65], [60, 75], [48, 78], [38, 72]], // stroke 4: bottom loop
  ]},
  // ま行
  { char: 'ま', rom: 'ma', strokes: [
    [[20, 28], [50, 25], [75, 28]], // stroke 1: top horizontal
    [[20, 50], [50, 47], [75, 50]], // stroke 2: middle horizontal
    [[50, 15], [48, 42], [45, 58], [50, 68], [60, 72], [55, 80]], // stroke 3: vertical + loop
  ]},
  { char: 'み', rom: 'mi', strokes: [
    [[35, 20], [45, 25], [50, 35], [40, 45], [30, 42]], // stroke 1: top loop
    [[40, 50], [50, 55], [55, 65], [45, 75], [35, 72]], // stroke 2: bottom loop
  ]},
  { char: 'む', rom: 'mu', strokes: [
    [[20, 35], [50, 32], [70, 35]], // stroke 1: horizontal
    [[45, 20], [42, 45], [38, 60], [42, 72], [55, 75]], // stroke 2: vertical curve
    [[65, 55], [68, 62], [65, 68]], // stroke 3: right dot
  ]},
  { char: 'め', rom: 'me', strokes: [
    [[25, 35], [28, 55], [30, 75]], // stroke 1: left
    [[25, 45], [45, 40], [60, 45], [65, 58], [55, 70], [40, 68], [50, 78], [65, 80]], // stroke 2: body
  ]},
  { char: 'も', rom: 'mo', strokes: [
    [[25, 32], [55, 30], [72, 32]], // stroke 1: top horizontal
    [[25, 55], [55, 53], [72, 55]], // stroke 2: bottom horizontal
    [[45, 20], [42, 45], [40, 60], [45, 72], [55, 78], [60, 72]], // stroke 3: vertical + hook
  ]},
  // や行
  { char: 'や', rom: 'ya', strokes: [
    [[20, 30], [45, 28], [55, 35], [50, 48]], // stroke 1: top left
    [[50, 40], [48, 55], [45, 72], [48, 82]], // stroke 2: vertical
    [[60, 25], [65, 45], [62, 65], [58, 78]], // stroke 3: right
  ]},
  { char: 'ゆ', rom: 'yu', strokes: [
    [[30, 25], [28, 50], [35, 70], [50, 72]], // stroke 1: left
    [[50, 30], [60, 35], [65, 50], [60, 65], [50, 72], [55, 80], [68, 78]], // stroke 2: right body
  ]},
  { char: 'よ', rom: 'yo', strokes: [
    [[35, 30], [60, 28], [65, 38], [50, 48], [35, 45]], // stroke 1: top loop
    [[50, 20], [48, 45], [45, 65], [48, 82]], // stroke 2: vertical
  ]},
  // ら行
  { char: 'ら', rom: 'ra', strokes: [
    [[35, 20], [50, 18], [60, 22]], // stroke 1: top
    [[48, 30], [45, 50], [50, 65], [60, 70], [65, 62]], // stroke 2: body
  ]},
  { char: 'り', rom: 'ri', strokes: [
    [[35, 20], [33, 42], [35, 55]], // stroke 1: left short
    [[62, 20], [60, 45], [58, 62], [55, 72], [50, 78]], // stroke 2: right long
  ]},
  { char: 'る', rom: 'ru', strokes: [
    [[35, 20], [55, 18], [60, 28], [45, 45], [35, 55], [40, 68], [55, 72], [62, 65], [58, 58]], // stroke 1: full curve
  ]},
  { char: 'れ', rom: 're', strokes: [
    [[25, 20], [25, 50], [28, 75]], // stroke 1: left vertical
    [[25, 38], [45, 35], [58, 40], [50, 55], [38, 60], [45, 72], [60, 78]], // stroke 2: body
  ]},
  { char: 'ろ', rom: 'ro', strokes: [
    [[35, 20], [55, 18], [60, 28], [45, 45], [35, 58], [40, 72], [55, 75], [68, 70]], // stroke 1: full curve
  ]},
  // わ行
  { char: 'わ', rom: 'wa', strokes: [
    [[30, 20], [28, 50], [30, 75]], // stroke 1: left vertical
    [[30, 38], [50, 35], [62, 42], [58, 58], [48, 65], [42, 72], [50, 80]], // stroke 2: body
  ]},
  { char: 'を', rom: 'wo', strokes: [
    [[20, 25], [50, 22], [70, 25]], // stroke 1: top horizontal
    [[30, 42], [50, 40], [65, 45]], // stroke 2: middle
    [[50, 35], [45, 55], [40, 68], [50, 78], [62, 75], [65, 65]], // stroke 3: bottom curve
  ]},
  { char: 'ん', rom: 'n', strokes: [
    [[35, 25], [30, 50], [35, 68], [50, 75], [65, 65], [70, 50]], // stroke 1: curve
  ]},
];
