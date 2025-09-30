import React, { useState, useCallback } from 'react';
import { Copy, Check, Instagram, Type, ChevronDown } from 'lucide-react';

interface FontStyle {
  id: string;
  name: string;
  preview: string;
  generator: (text: string) => string;
}

const fontStyles: FontStyle[] = [
  {
    id: 'bold',
    name: 'Gras',
    preview: '𝐆𝐫𝐚𝐬',
    generator: (text: string) => {
      const boldMap: { [key: string]: string } = {
        'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
        'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩',
        'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱',
        'y': '𝐲', 'z': '𝐳', 'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅',
        'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍',
        'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕',
        'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙', '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑',
        '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
      };
      return text.split('').map(char => boldMap[char] || char).join('');
    }
  },
  {
    id: 'italic',
    name: 'Italique',
    preview: '𝐼𝑡𝑎𝑙𝑖𝑞𝑢𝑒',
    generator: (text: string) => {
      const italicMap: { [key: string]: string } = {
        'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ',
        'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝',
        'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥',
        'y': '𝑦', 'z': '𝑧', 'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹',
        'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁',
        'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉',
        'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
      };
      return text.split('').map(char => italicMap[char] || char).join('');
    }
  },
  {
    id: 'double-struck',
    name: 'Double Barré',
    preview: '𝔻𝕠𝕦𝕓𝕝𝕖 𝔹𝕒𝕣𝕣é',
    generator: (text: string) => {
      const doubleStruckMap: { [key: string]: string } = {
        'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙',
        'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡',
        'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩',
        'y': '𝕪', 'z': '𝕫', 'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽',
        'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ',
        'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍',
        'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ', '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛',
        '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
      };
      return text.split('').map(char => doubleStruckMap[char] || char).join('');
    }
  },
  {
    id: 'script',
    name: 'Script',
    preview: '𝒮𝒸𝓇𝒾𝓅𝓉',
    generator: (text: string) => {
      const scriptMap: { [key: string]: string } = {
        'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽',
        'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅',
        'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
        'y': '𝓎', 'z': '𝓏', 'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ',
        'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩',
        'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱',
        'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
      };
      return text.split('').map(char => scriptMap[char] || char).join('');
    }
  },
  {
    id: 'fraktur',
    name: 'Gothique',
    preview: '𝔊𝔬𝔱𝔥𝔦𝔮𝔲𝔢',
    generator: (text: string) => {
      const frakturMap: { [key: string]: string } = {
        'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥',
        'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭',
        'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵',
        'y': '𝔶', 'z': '𝔷', 'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉',
        'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑',
        'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙',
        'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ'
      };
      return text.split('').map(char => frakturMap[char] || char).join('');
    }
  },
  {
    id: 'monospace',
    name: 'Monospace',
    preview: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎',
    generator: (text: string) => {
      const monospaceMap: { [key: string]: string } = {
        'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑',
        'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙',
        'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡',
        'y': '𝚢', 'z': '𝚣', 'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵',
        'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽',
        'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅',
        'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉', '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹',
        '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
      };
      return text.split('').map(char => monospaceMap[char] || char).join('');
    }
  },
  {
    id: 'circled',
    name: 'Cerclé',
    preview: 'ⓒⓔⓡⓒⓛé',
    generator: (text: string) => {
      const circledMap: { [key: string]: string } = {
        'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ',
        'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ',
        'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ',
        'y': 'ⓨ', 'z': 'ⓩ', 'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ',
        'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ',
        'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ',
        'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ', '0': '⓪', '1': '①', '2': '②', '3': '③',
        '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
      };
      return text.split('').map(char => circledMap[char] || char).join('');
    }
  },
  {
    id: 'squared',
    name: 'Carré',
    preview: '🅲🅰🆁🆁é',
    generator: (text: string) => {
      const squaredMap: { [key: string]: string } = {
        'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷',
        'i': '🅸', 'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿',
        'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇',
        'y': '🆈', 'z': '🆉', 'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵',
        'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹', 'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽',
        'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃', 'U': '🆄', 'V': '🆅',
        'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉', '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
        '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣'
      };
      return text.split('').map(char => squaredMap[char] || char).join('');
    }
  },
  {
    id: 'upside-down',
    name: 'À l\'envers',
    preview: 'ɯɐɹǝu ǝl ɐ',
    generator: (text: string) => {
      const upsideDownMap: { [key: string]: string } = {
        'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
        'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
        'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
        'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ',
        'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N',
        'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ɹ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ',
        'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ',
        '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6'
      };
      return text.split('').map(char => upsideDownMap[char] || char).join('');
    }
  },
  {
    id: 'small-caps',
    name: 'Petites Majuscules',
    preview: 'ᴘᴇᴛɪᴛᴇꜱ ᴍᴀᴊᴜꜱᴄᴜʟᴇꜱ',
    generator: (text: string) => {
      const smallCapsMap: { [key: string]: string } = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ',
        'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
        'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
        'y': 'ʏ', 'z': 'ᴢ', 'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ꜰ',
        'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ',
        'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ', 'S': 'ꜱ', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ',
        'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
      };
      return text.split('').map(char => smallCapsMap[char] || char).join('');
    }
  },
  {
    id: 'strikethrough',
    name: 'Barré',
    preview: 'B̶a̶r̶r̶é',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0336').join('');
    }
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    preview: 'υи єχємρℓє ∂є тєχтє',
    generator: (text: string) => {
      const vaporwaveMap: { [key: string]: string } = {
        'a': 'α', 'b': 'в', 'c': '¢', 'd': '∂', 'e': 'є', 'f': 'ƒ', 'g': 'g', 'h': 'н',
        'i': 'ι', 'j': 'נ', 'k': 'к', 'l': 'ℓ', 'm': 'м', 'n': 'и', 'o': 'σ', 'p': 'ρ',
        'q': 'q', 'r': 'я', 's': 'ѕ', 't': 'т', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ',
        'y': 'у', 'z': 'z', 'A': 'Α', 'B': 'Β', 'C': 'Ϲ', 'D': 'Ⅾ', 'E': 'Ε', 'F': 'Ϝ',
        'G': 'Ԍ', 'H': 'Η', 'I': 'Ι', 'J': 'Ј', 'K': 'Κ', 'L': 'Ⅼ', 'M': 'Μ', 'N': 'Ν',
        'O': 'Ο', 'P': 'Ρ', 'Q': 'Q', 'R': 'R', 'S': 'Ѕ', 'T': 'Τ', 'U': 'U', 'V': 'V',
        'W': 'W', 'X': 'Χ', 'Y': 'Υ', 'Z': 'Ζ'
      };
      return text.split('').map(char => vaporwaveMap[char] || char).join('');
    }
  },
  {
    id: 'gothic-mixed',
    name: 'Gothique Mixte',
    preview: '𝕰𝖃𝕰𝖒𝕻𝕷𝕰 𝕯𝕰 𝕿𝕰𝖃𝕿𝕰',
    generator: (text: string) => {
      const gothicMixedMap: { [key: string]: string } = {
        'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍',
        'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕',
        'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝',
        'y': '𝖞', 'z': '𝖟', 'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱',
        'G': '𝕲', 'H': '𝕳', 'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹',
        'O': '𝕺', 'P': '𝕻', 'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁',
        'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅'
      };
      return text.split('').map(char => gothicMixedMap[char] || char).join('');
    }
  },
  {
    id: 'outline',
    name: 'Contour',
    preview: 'Ⓒⓞⓝⓣⓞⓤⓡ',
    generator: (text: string) => {
      const outlineMap: { [key: string]: string } = {
        'a': '⒜', 'b': '⒝', 'c': '⒞', 'd': '⒟', 'e': '⒠', 'f': '⒡', 'g': '⒢', 'h': '⒣',
        'i': '⒤', 'j': '⒥', 'k': '⒦', 'l': '⒧', 'm': '⒨', 'n': '⒩', 'o': '⒪', 'p': '⒫',
        'q': '⒬', 'r': '⒭', 's': '⒮', 't': '⒯', 'u': '⒰', 'v': '⒱', 'w': '⒲', 'x': '⒳',
        'y': '⒴', 'z': '⒵', 'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ',
        'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ',
        'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ',
        'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ'
      };
      return text.split('').map(char => outlineMap[char] || char).join('');
    }
  }
];

export default function FontGenerator() {
  const [inputText, setInputText] = useState('');
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [selectedStyles, setSelectedStyles] = useState<{ [key: string]: boolean }>({});
  const [showAllStyles, setShowAllStyles] = useState(false);

  const copyToClipboard = useCallback(async (text: string, styleId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [styleId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [styleId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  }, []);

  const toggleStyleSelection = (styleId: string) => {
    setSelectedStyles(prev => ({
      ...prev,
      [styleId]: !prev[styleId]
    }));
  };

  const generatedTexts = fontStyles.map(style => ({
    ...style,
    generated: style.generator(inputText)
  }));

  const displayedStyles = showAllStyles ? generatedTexts : generatedTexts.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Instagram Générateur de texte</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nos générateurs de polices Instagram vous permettent de créer un texte agréable que vous pouvez copier et coller dans votre bio, légendes, commentaires et histoires Instagram.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
            Tapez le texte que vous voulez faire gras dans la case ci-dessous..
          </label>
          <textarea
            id="text-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ex: Mon compte Instagram"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none resize-none"
            rows={3}
          />
        </div>

        {/* Styles Counter and Dropdown */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600">Montrant: {generatedTexts.length} texte instagram</span>
            <button
              onClick={() => setShowAllStyles(!showAllStyles)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllStyles ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Styles List */}
        <div className="space-y-2">
          {displayedStyles.map((style) => (
            <div key={style.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
              <input
                type="checkbox"
                checked={selectedStyles[style.id] || false}
                onChange={() => toggleStyleSelection(style.id)}
                className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-lg font-medium text-gray-900">
                  {style.generated || 'Votre texte stylisé apparaîtra ici...'}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(style.generated, style.id)}
                disabled={!style.generated}
                className="ml-3 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {copiedStates[style.id] ? (
                  <span className="flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Copié
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="w-3 h-3 mr-1" />
                    Copie
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Instagram Preview */}
        {inputText && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu Instagram</h2>
            
            <div className="max-w-sm mx-auto bg-gradient-to-b from-purple-500 to-pink-500 rounded-3xl p-6 text-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                  <Instagram className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <div className="font-semibold">doctor_followers</div>
                  <div className="text-sm opacity-75">Compte vérifié</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {generatedTexts.slice(0, 3).map((style) => (
                  <div key={style.id} className="text-sm">
                    <div className="font-medium">{style.generated}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-blue-600 rounded-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-3">💡 Conseils d'utilisation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Pour votre bio Instagram :</h3>
              <ul className="space-y-1 opacity-90">
                <li>• Utilisez des polices différentes pour créer du contraste</li>
                <li>• Évitez d'en faire trop, 2-3 styles maximum</li>
                <li>• Testez la lisibilité sur mobile</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Pour vos légendes :</h3>
              <ul className="space-y-1 opacity-90">
                <li>• Utilisez les polices pour mettre en valeur des mots-clés</li>
                <li>• Créez des séparateurs visuels avec les symboles</li>
                <li>• Gardez la cohérence avec votre identité de marque</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
