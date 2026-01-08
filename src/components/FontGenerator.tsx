import React, { useState, useCallback, useEffect } from 'react';
import { Copy, Check, Instagram, Type, ChevronDown } from 'lucide-react';
import { PageService, FontGeneratorPageData } from '../services/pageService';
import PortableText from './PortableText';
import FAQSection from './FAQSection';

interface FontStyle {
  id: string;
  name: string;
  preview: string;
  generator: (text: string) => string;
}

// Helper function to create font style generators
const createFontGenerator = (map: { [key: string]: string }) => {
  return (text: string) => {
    return text.split('').map(char => map[char.toLowerCase()] || map[char] || char).join('');
  };
};

const fontStyles: FontStyle[] = [
  {
    id: 'bold',
    name: 'Gras',
    preview: '𝐆𝐫𝐚𝐬',
    generator: createFontGenerator({
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
      'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩',
      'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱',
      'y': '𝐲', 'z': '𝐳', 'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅',
      'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍',
      'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕',
      'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙', '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑',
      '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    })
  },
  {
    id: 'bold-italic',
    name: 'Gras Italique',
    preview: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄',
    generator: createFontGenerator({
      'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉',
      'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑',
      'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙',
      'y': '𝒚', 'z': '𝒛', 'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭',
      'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵',
      'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽',
      'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
    })
  },
  {
    id: 'sans-serif-bold',
    name: 'Sans Serif Gras',
    preview: '𝗦𝗮𝗻𝘀 𝗦𝗲𝗿𝗶𝗳 𝗕𝗼𝗹𝗱',
    generator: createFontGenerator({
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
      'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
      'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
      'y': '𝘆', 'z': '𝘇', 'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙',
      'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
      'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩',
      'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯',
      '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    })
  },
  {
    id: 'sans-serif-italic',
    name: 'Sans Serif Italique',
    preview: '𝘚𝘢𝘯𝘴 𝘚𝘦𝘳𝘪𝘧 𝘐𝘵𝘢𝘭𝘪𝘤',
    generator: createFontGenerator({
      'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩',
      'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱',
      'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹',
      'y': '𝘺', 'z': '𝘻', 'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍',
      'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕',
      'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝',
      'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
    })
  },
  {
    id: 'sans-serif-bold-italic',
    name: 'Sans Serif Gras Italique',
    preview: '𝙎𝙖𝙣𝙨 𝙎𝙚𝙧𝙞𝙛 𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘',
    generator: createFontGenerator({
      'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝',
      'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥',
      'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭',
      'y': '𝙮', 'z': '𝙯', 'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁',
      'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉',
      'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑',
      'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕'
    })
  },
  {
    id: 'italic',
    name: 'Italique',
    preview: '𝐼𝑡𝑎𝑙𝑖𝑞𝑢𝑒',
    generator: createFontGenerator({
      'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ',
      'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝',
      'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥',
      'y': '𝑦', 'z': '𝑧', 'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹',
      'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁',
      'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉',
      'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
    })
  },
  {
    id: 'fullwidth',
    name: 'Pleine Largeur',
    preview: 'Ｆｕｌｌｗｉｄｔｈ',
    generator: createFontGenerator({
      'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ',
      'i': 'ｉ', 'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ',
      'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ', 'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ',
      'y': 'ｙ', 'z': 'ｚ', 'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ',
      'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ',
      'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ', 'U': 'Ｕ', 'V': 'Ｖ',
      'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ', '0': '０', '1': '１', '2': '２', '3': '３',
      '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９', ' ': '　'
    })
  },
  {
    id: 'parenthesized',
    name: 'Entre Parenthèses',
    preview: '⒫⒜⒭⒠⒩⒯⒣⒠⒮⒤⒵⒠⒟',
    generator: createFontGenerator({
      'a': '⒜', 'b': '⒝', 'c': '⒞', 'd': '⒟', 'e': '⒠', 'f': '⒡', 'g': '⒢', 'h': '⒣',
      'i': '⒤', 'j': '⒥', 'k': '⒦', 'l': '⒧', 'm': '⒨', 'n': '⒩', 'o': '⒪', 'p': '⒫',
      'q': '⒬', 'r': '⒭', 's': '⒮', 't': '⒯', 'u': '⒰', 'v': '⒱', 'w': '⒲', 'x': '⒳',
      'y': '⒴', 'z': '⒵', 'A': '⒜', 'B': '⒝', 'C': '⒞', 'D': '⒟', 'E': '⒠', 'F': '⒡',
      'G': '⒢', 'H': '⒣', 'I': '⒤', 'J': '⒥', 'K': '⒦', 'L': '⒧', 'M': '⒨', 'N': '⒩',
      'O': '⒪', 'P': '⒫', 'Q': '⒬', 'R': '⒭', 'S': '⒮', 'T': '⒯', 'U': '⒰', 'V': '⒱',
      'W': '⒲', 'X': '⒳', 'Y': '⒴', 'Z': '⒵', '0': '⓪', '1': '①', '2': '②', '3': '③',
      '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
    })
  },
  {
    id: 'negative-circled',
    name: 'Cerclé Négatif',
    preview: '🅐🅑🅒',
    generator: createFontGenerator({
      'a': '🅐', 'b': '🅑', 'c': '🅒', 'd': '🅓', 'e': '🅔', 'f': '🅕', 'g': '🅖', 'h': '🅗',
      'i': '🅘', 'j': '🅙', 'k': '🅚', 'l': '🅛', 'm': '🅜', 'n': '🅝', 'o': '🅞', 'p': '🅟',
      'q': '🅠', 'r': '🅡', 's': '🅢', 't': '🅣', 'u': '🅤', 'v': '🅥', 'w': '🅦', 'x': '🅧',
      'y': '🅨', 'z': '🅩', 'A': '🅐', 'B': '🅑', 'C': '🅒', 'D': '🅓', 'E': '🅔', 'F': '🅕',
      'G': '🅖', 'H': '🅗', 'I': '🅘', 'J': '🅙', 'K': '🅚', 'L': '🅛', 'M': '🅜', 'N': '🅝',
      'O': '🅞', 'P': '🅟', 'Q': '🅠', 'R': '🅡', 'S': '🅢', 'T': '🅣', 'U': '🅤', 'V': '🅥',
      'W': '🅦', 'X': '🅧', 'Y': '🅨', 'Z': '🅩'
    })
  },
  {
    id: 'double-struck',
    name: 'Double Barré',
    preview: '𝔻𝕠𝕦𝕓𝕝𝕖 𝔹𝕒𝕣𝕣é',
    generator: createFontGenerator({
      'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙',
      'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡',
      'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩',
      'y': '𝕪', 'z': '𝕫', 'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽',
      'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ',
      'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍',
      'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ', '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛',
      '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
    })
  },
  {
    id: 'sans-serif',
    name: 'Sans Serif',
    preview: '𝖲𝖺𝗇𝗌 𝖲𝖾𝗋𝗂𝖿',
    generator: createFontGenerator({
      'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁',
      'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉',
      'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑',
      'y': '𝗒', 'z': '𝗓', 'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥',
      'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭',
      'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵',
      'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹', '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥',
      '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫'
    })
  },
  {
    id: 'script',
    name: 'Script',
    preview: '𝒮𝒸𝓇𝒾𝓅𝓉',
    generator: createFontGenerator({
      'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽',
      'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅',
      'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
      'y': '𝓎', 'z': '𝓏', 'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ',
      'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩',
      'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱',
      'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
    })
  },
  {
    id: 'fraktur',
    name: 'Gothique',
    preview: '𝔊𝔬𝔱𝔥𝔦𝔮𝔲𝔢',
    generator: createFontGenerator({
      'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥',
      'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭',
      'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵',
      'y': '𝔶', 'z': '𝔷', 'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉',
      'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑',
      'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙',
      'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ'
    })
  },
  {
    id: 'monospace',
    name: 'Monospace',
    preview: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎',
    generator: createFontGenerator({
      'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑',
      'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙',
      'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡',
      'y': '𝚢', 'z': '𝚣', 'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵',
      'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽',
      'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅',
      'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉', '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹',
      '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
    })
  },
  {
    id: 'circled',
    name: 'Cerclé',
    preview: 'ⓒⓔⓡⓒⓛé',
    generator: createFontGenerator({
      'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ',
      'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ',
      'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ',
      'y': 'ⓨ', 'z': 'ⓩ', 'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ',
      'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ',
      'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ',
      'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ', '0': '⓪', '1': '①', '2': '②', '3': '③',
      '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
    })
  },
  {
    id: 'squared',
    name: 'Carré',
    preview: '🅲🅰🆁🆁é',
    generator: createFontGenerator({
      'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷',
      'i': '🅸', 'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿',
      'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇',
      'y': '🆈', 'z': '🆉', 'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵',
      'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹', 'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽',
      'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃', 'U': '🆄', 'V': '🆅',
      'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉', '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
      '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣'
    })
  },
  {
    id: 'upside-down',
    name: 'À l\'envers',
    preview: 'ɯɐɹǝu ǝl ɐ',
    generator: createFontGenerator({
      'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
      'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
      'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
      'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ',
      'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N',
      'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ɹ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ',
      'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ',
      '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6'
    })
  },
  {
    id: 'small-caps',
    name: 'Petites Majuscules',
    preview: 'ᴘᴇᴛɪᴛᴇꜱ ᴍᴀᴊᴜꜱᴄᴜʟᴇꜱ',
    generator: createFontGenerator({
      'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ',
      'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
      'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
      'y': 'ʏ', 'z': 'ᴢ', 'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ꜰ',
      'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ',
      'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ', 'S': 'ꜱ', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ',
      'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
    })
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
    id: 'subscript',
    name: 'Indice',
    preview: 'Sᵤᵦₛcᵣᵢₚₜ',
    generator: createFontGenerator({
      'a': 'ₐ', 'b': 'ᵦ', 'c': 'c', 'd': 'ᵈ', 'e': 'ₑ', 'f': 'f', 'g': 'ᵍ', 'h': 'ₕ',
      'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ',
      'q': 'q', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'w': 'w', 'x': 'ₓ',
      'y': 'y', 'z': 'z', 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F',
      'G': 'G', 'H': 'H', 'I': 'I', 'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N',
      'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V',
      'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z', '0': '₀', '1': '₁', '2': '₂', '3': '₃',
      '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    })
  },
  {
    id: 'superscript',
    name: 'Exposant',
    preview: 'Sᵘᵖᵉʳˢᶜʳⁱᵖᵗ',
    generator: createFontGenerator({
      'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ',
      'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ',
      'q': 'q', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ',
      'y': 'ʸ', 'z': 'ᶻ', 'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ',
      'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ',
      'O': 'ᴼ', 'P': 'ᴾ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ',
      'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ', '0': '⁰', '1': '¹', '2': '²', '3': '³',
      '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    })
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
  },
  {
    id: 'underlined',
    name: 'Souligné',
    preview: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲d̲',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0332').join('');
    }
  },
  {
    id: 'double-underlined',
    name: 'Double Souligné',
    preview: 'D̳o̳u̳b̳l̳e̳ ̳U̳n̳d̳e̳r̳l̳i̳n̳e̳d̳',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0333').join('');
    }
  },
  {
    id: 'overlined',
    name: 'Ligné au-dessus',
    preview: 'O̅v̅e̅r̅l̅i̅n̅e̅d̅',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0305').join('');
    }
  },
  {
    id: 'dotted',
    name: 'Pointillé',
    preview: 'Ḋȯṫṫėḋ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0307').join('');
    }
  },
  {
    id: 'double-dotted',
    name: 'Double Pointillé',
    preview: 'D̤o̤ṳb̤l̤e̤ ̤D̤o̤t̤t̤e̤d̤',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0324').join('');
    }
  },
  {
    id: 'wavy-underlined',
    name: 'Souligné Ondulé',
    preview: 'W̰a̰v̰y̰ ̰Ṵn̰d̰ḛr̰l̰ḭn̰ḛd̰',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0330').join('');
    }
  },
  {
    id: 'crossed-out',
    name: 'Rayé',
    preview: 'C̶r̶o̶s̶s̶e̶d̶ ̶O̶u̶t̶',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0336').join('');
    }
  },
  {
    id: 'double-crossed',
    name: 'Double Rayé',
    preview: 'D̶̶o̶̶u̶̶b̶̶l̶̶e̶̶ ̶̶C̶̶r̶̶o̶̶s̶̶s̶̶e̶̶d̶̶',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0336' + '\u0336').join('');
    }
  },
  {
    id: 'slash-through',
    name: 'Barré Oblique',
    preview: 'S̸l̸a̸s̸h̸ ̸T̸h̸r̸o̸u̸g̸h̸',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0338').join('');
    }
  },
  {
    id: 'tilde-over',
    name: 'Tilde au-dessus',
    preview: 'T̴i̴l̴d̴e̴ ̴O̴v̴e̴r̴',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0334').join('');
    }
  },
  {
    id: 'acute-accent',
    name: 'Accent Aigu',
    preview: 'Ác̲c̲e̲n̲t̲ ̲A̲i̲g̲u̲',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0301').join('');
    }
  },
  {
    id: 'grave-accent',
    name: 'Accent Grave',
    preview: 'Àc̲c̲e̲n̲t̲ ̲G̲r̲a̲v̲e̲',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0300').join('');
    }
  },
  {
    id: 'circumflex',
    name: 'Accent Circonflexe',
    preview: 'Âc̲c̲e̲n̲t̲ ̲C̲i̲r̲c̲o̲n̲f̲l̲e̲x̲e̲',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0302').join('');
    }
  },
  {
    id: 'diaeresis',
    name: 'Tréma',
    preview: 'T̤r̤é̤m̤a̤',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0308').join('');
    }
  },
  {
    id: 'ring-above',
    name: 'Cercle au-dessus',
    preview: 'R̊i̊n̊g̊ ̊Åb̊o̊v̊e̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u030A').join('');
    }
  },
  {
    id: 'caron',
    name: 'Caron',
    preview: 'Čǎřǒň',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u030C').join('');
    }
  },
  {
    id: 'macron',
    name: 'Macron',
    preview: 'M̅a̅c̅r̅o̅n̅',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0304').join('');
    }
  },
  {
    id: 'breve',
    name: 'Brève',
    preview: 'B̆r̆ĕv̆ĕ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0306').join('');
    }
  },
  {
    id: 'dot-below',
    name: 'Point en-dessous',
    preview: 'D̤o̤t̤ ̤B̤e̤l̤o̤w̤',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0323').join('');
    }
  },
  {
    id: 'hook-above',
    name: 'Crochet au-dessus',
    preview: 'H̉ỏỏk̉ ̉Ảb̉ỏv̉ẻ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0309').join('');
    }
  },
  {
    id: 'horn',
    name: 'Corne',
    preview: 'H̛ơr̛n̛',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u031B').join('');
    }
  },
  {
    id: 'cedilla',
    name: 'Cédille',
    preview: 'Çȩḑi̧ļļȩ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0327').join('');
    }
  },
  {
    id: 'ogonek',
    name: 'Ogonek',
    preview: 'Ǫg̨ǫn̨ęk̨',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0328').join('');
    }
  },
  {
    id: 'double-struck-italic',
    name: 'Double Barré Italique',
    preview: '𝕯𝕺𝖀𝕭𝕷𝕰 𝕭𝕬𝕽𝕽é 𝕴𝕿𝕬𝕷𝕴𝕰',
    generator: createFontGenerator({
      'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍',
      'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕',
      'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝',
      'y': '𝖞', 'z': '𝖟', 'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱',
      'G': '𝕲', 'H': '𝕳', 'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹',
      'O': '𝕺', 'P': '𝕻', 'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁',
      'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅'
    })
  },
  {
    id: 'script-bold',
    name: 'Script Gras',
    preview: '𝓢𝓬𝓻𝓲𝓹𝓽 𝓑𝓸𝓵𝓭',
    generator: createFontGenerator({
      'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
      'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹',
      'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁',
      'y': '𝔂', 'z': '𝔃', 'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕',
      'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝',
      'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥',
      'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩'
    })
  },
  {
    id: 'fraktur-bold',
    name: 'Gothique Gras',
    preview: '𝕲𝕺𝕿𝕳𝕴𝕼𝕰 𝕭𝕺𝕷𝕯',
    generator: createFontGenerator({
      'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍',
      'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕',
      'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝',
      'y': '𝖞', 'z': '𝖟', 'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱',
      'G': '𝕲', 'H': '𝕳', 'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹',
      'O': '𝕺', 'P': '𝕻', 'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁',
      'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅'
    })
  },
  {
    id: 'squared-negative',
    name: 'Carré Négatif',
    preview: '🅰🅱🅲',
    generator: createFontGenerator({
      'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷',
      'i': '🅸', 'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿',
      'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇',
      'y': '🆈', 'z': '🆉', 'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵',
      'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹', 'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽',
      'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃', 'U': '🆄', 'V': '🆅',
      'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉'
    })
  },
  {
    id: 'circled-latin',
    name: 'Latin Cerclé',
    preview: 'Ⓒⓘⓡⓒⓛⓔⓓ Ⓛⓐⓣⓘⓝ',
    generator: createFontGenerator({
      'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ',
      'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ',
      'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ',
      'y': 'ⓨ', 'z': 'ⓩ', 'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ',
      'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ',
      'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ',
      'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ'
    })
  },
  {
    id: 'full-stop',
    name: 'Point Final',
    preview: 'F̸u̸l̸l̸ ̸S̸t̸o̸p̸',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0338').join('');
    }
  },
  {
    id: 'combining-long-solidus',
    name: 'Barre Oblique Longue',
    preview: 'L̷o̷n̷g̷ ̷S̷o̷l̷i̷d̷u̷s̷',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0337').join('');
    }
  },
  {
    id: 'combining-short-stroke',
    name: 'Trait Court',
    preview: 'S̵h̵o̵r̵t̵ ̵S̵t̵r̵o̵k̵e̵',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0335').join('');
    }
  },
  {
    id: 'combining-x-below',
    name: 'X en-dessous',
    preview: 'X̽ ̽B̽e̽l̽o̽w̽',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u033D').join('');
    }
  },
  {
    id: 'combining-vertical-line',
    name: 'Ligne Verticale',
    preview: 'V̎e̎r̎t̎i̎c̎a̎l̎ ̎L̎i̎n̎e̎',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u030E').join('');
    }
  },
  {
    id: 'combining-double-vertical-line',
    name: 'Double Ligne Verticale',
    preview: 'D̋őűb̋l̋e̋ ̋V̋e̋r̋t̋i̋c̋a̋l̋',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u030B').join('');
    }
  },
  {
    id: 'combining-double-breve',
    name: 'Double Brève',
    preview: 'D̏ȍȕb̏l̏ȅ ̏B̏ȑȅv̏ȅ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u030F').join('');
    }
  },
  {
    id: 'combining-inverted-breve',
    name: 'Brève Inversée',
    preview: 'Ȋn̑v̑ȇȓt̑ȇd̑ ̑B̑ȓȇv̑ȇ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0311').join('');
    }
  },
  {
    id: 'combining-turned-comma',
    name: 'Virgule Retournée',
    preview: 'T̒u̒r̒n̒e̒d̒ ̒C̒o̒m̒m̒a̒',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0312').join('');
    }
  },
  {
    id: 'combining-apostrophe',
    name: 'Apostrophe',
    preview: 'A̓p̓o̓s̓t̓r̓o̓p̓h̓e̓',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0313').join('');
    }
  },
  {
    id: 'combining-reversed-comma',
    name: 'Virgule Inversée',
    preview: 'R̔e̔v̔e̔r̔s̔e̔d̔ ̔C̔o̔m̔m̔a̔',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0314').join('');
    }
  },
  {
    id: 'combining-comma-above',
    name: 'Virgule au-dessus',
    preview: 'C̓o̓m̓m̓a̓ ̓A̓b̓o̓v̓e̓',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0315').join('');
    }
  },
  {
    id: 'combining-reversed-comma-above',
    name: 'Virgule Inversée au-dessus',
    preview: 'R̓e̓v̓ ̓C̓o̓m̓m̓a̓',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0316').join('');
    }
  },
  {
    id: 'combining-comma-above-right',
    name: 'Virgule Droite au-dessus',
    preview: 'C̕o̕m̕m̕a̕ ̕R̕i̕g̕h̕t̕',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0317').join('');
    }
  },
  {
    id: 'combining-grave-accent-below',
    name: 'Accent Grave en-dessous',
    preview: 'G̖r̖a̖v̖e̖ ̖B̖e̖l̖o̖w̖',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0316').join('');
    }
  },
  {
    id: 'combining-acute-accent-below',
    name: 'Accent Aigu en-dessous',
    preview: 'A̗c̗u̗t̗e̗ ̗B̗e̗l̗o̗w̗',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0317').join('');
    }
  },
  {
    id: 'combining-left-tack-below',
    name: 'Tack Gauche en-dessous',
    preview: 'L̗e̗f̗t̗ ̗T̗a̗c̗k̗',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0318').join('');
    }
  },
  {
    id: 'combining-right-tack-below',
    name: 'Tack Droit en-dessous',
    preview: 'R̗i̗g̗h̗t̗ ̗T̗a̗c̗k̗',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0319').join('');
    }
  },
  {
    id: 'combining-left-angle-above',
    name: 'Angle Gauche au-dessus',
    preview: 'L̗e̗f̗t̗ ̗A̗n̗g̗l̗e̗',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u031A').join('');
    }
  },
  {
    id: 'combining-horn',
    name: 'Corne Combinée',
    preview: 'H̛ơr̛n̛ ̛C̛ơm̛b̛i̛n̛e̛d̛',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u031B').join('');
    }
  },
  {
    id: 'combining-left-half-ring-below',
    name: 'Demi-anneau Gauche en-dessous',
    preview: 'L̗e̗f̗t̗ ̗H̗a̗l̗f̗ ̗R̗i̗n̗g̗',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u031C').join('');
    }
  },
  {
    id: 'combining-up-tack-below',
    name: 'Tack Haut en-dessous',
    preview: 'U̗p̗ ̗T̗a̗c̗k̗ ̗B̗e̗l̗o̗w̗',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u031D').join('');
    }
  },
  {
    id: 'combining-down-tack-below',
    name: 'Tack Bas en-dessous',
    preview: 'D̗o̗w̗n̗ ̗T̗a̗c̗k̗ ̗B̗e̗l̗o̗w̗',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u031E').join('');
    }
  },
  {
    id: 'combining-plus-sign-below',
    name: 'Signe Plus en-dessous',
    preview: 'P̟l̟u̟s̟ ̟S̟i̟g̟n̟',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u031F').join('');
    }
  },
  {
    id: 'combining-minus-sign-below',
    name: 'Signe Moins en-dessous',
    preview: 'M̠i̠n̠u̠s̠ ̠S̠i̠g̠n̠',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0320').join('');
    }
  },
  {
    id: 'combining-palatalized-hook-below',
    name: 'Crochet Palatalisé en-dessous',
    preview: 'P̡a̡l̡a̡t̡a̡l̡i̡z̡e̡d̡',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0321').join('');
    }
  },
  {
    id: 'combining-retroflex-hook-below',
    name: 'Crochet Rétroflexe en-dessous',
    preview: 'R̢e̢t̢r̢o̢f̢l̢e̢x̢',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0322').join('');
    }
  },
  {
    id: 'combining-dot-below-right',
    name: 'Point Droite en-dessous',
    preview: 'D̡o̡t̡ ̡R̡i̡g̡h̡t̡',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0323').join('');
    }
  },
  {
    id: 'combining-diaeresis-below',
    name: 'Tréma en-dessous',
    preview: 'D̤i̤a̤e̤r̤e̤s̤i̤s̤',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0324').join('');
    }
  },
  {
    id: 'combining-ring-below',
    name: 'Cercle en-dessous',
    preview: 'R̥i̥n̥g̥ ̥B̥e̥l̥o̥w̥',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0325').join('');
    }
  },
  {
    id: 'combining-comma-below',
    name: 'Virgule en-dessous',
    preview: 'C̦o̦m̦m̦a̦ ̦B̦e̦l̦o̦w̦',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0326').join('');
    }
  },
  {
    id: 'combining-cedilla',
    name: 'Cédille Combinée',
    preview: 'Çȩḑi̧ļļȩ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0327').join('');
    }
  },
  {
    id: 'combining-ogonek',
    name: 'Ogonek Combiné',
    preview: 'Ǫg̨ǫn̨ęk̨',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0328').join('');
    }
  },
  {
    id: 'combining-vertical-line-below',
    name: 'Ligne Verticale en-dessous',
    preview: 'V̩e̩r̩t̩i̩c̩a̩l̩',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0329').join('');
    }
  },
  {
    id: 'combining-bridge-below',
    name: 'Pont en-dessous',
    preview: 'B̪r̪i̪d̪g̪e̪',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u032A').join('');
    }
  },
  {
    id: 'combining-inverted-double-arch-below',
    name: 'Double Arc Inversé en-dessous',
    preview: 'D̫o̫u̫b̫l̫e̫ ̫A̫r̫c̫',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u032B').join('');
    }
  },
  {
    id: 'combining-caron-below',
    name: 'Caron en-dessous',
    preview: 'C̬a̬r̬o̬n̬ ̬B̬e̬l̬o̬w̬',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u032C').join('');
    }
  },
  {
    id: 'combining-circumflex-accent-below',
    name: 'Accent Circonflexe en-dessous',
    preview: 'C̭i̭r̭c̭ṷm̭f̭ḽḙx̭',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u032D').join('');
    }
  },
  {
    id: 'combining-breve-below',
    name: 'Brève en-dessous',
    preview: 'B̮r̮e̮v̮e̮ ̮B̮e̮l̮o̮w̮',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u032E').join('');
    }
  },
  {
    id: 'combining-inverted-breve-below',
    name: 'Brève Inversée en-dessous',
    preview: 'I̮n̮v̮ ̮B̮r̮e̮v̮e̮',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u032F').join('');
    }
  },
  {
    id: 'combining-tilde-below',
    name: 'Tilde en-dessous',
    preview: 'T̰ḭl̰d̰ḛ ̰B̰ḛl̰o̰w̰',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0330').join('');
    }
  },
  {
    id: 'combining-overline',
    name: 'Ligne au-dessus Combinée',
    preview: 'O̅v̅e̅r̅l̅i̅n̅e̅',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0305').join('');
    }
  },
  {
    id: 'combining-short-stroke-overlay',
    name: 'Trait Court Superposé',
    preview: 'S̵h̵o̵r̵t̵ ̵S̵t̵r̵o̵k̵e̵',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0335').join('');
    }
  },
  {
    id: 'combining-long-stroke-overlay',
    name: 'Trait Long Superposé',
    preview: 'L̶o̶n̶g̶ ̶S̶t̶r̶o̶k̶e̶',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0336').join('');
    }
  },
  {
    id: 'combining-short-solidus-overlay',
    name: 'Barre Oblique Courte Superposée',
    preview: 'S̸h̸o̸r̸t̸ ̸S̸o̸l̸i̸d̸u̸s̸',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0338').join('');
    }
  },
  {
    id: 'combining-long-solidus-overlay',
    name: 'Barre Oblique Longue Superposée',
    preview: 'L̷o̷n̷g̷ ̷S̷o̷l̷i̷d̷u̷s̷',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0337').join('');
    }
  },
  {
    id: 'combining-right-half-ring-above',
    name: 'Demi-anneau Droit au-dessus',
    preview: 'R̊i̊g̊h̊t̊ ̊H̊ål̊f̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u030A').join('');
    }
  },
  {
    id: 'combining-inverted-bridge-below',
    name: 'Pont Inversé en-dessous',
    preview: 'I̪n̪v̪ ̪B̪r̪i̪d̪g̪e̪',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u032A').join('');
    }
  },
  {
    id: 'combining-square-below',
    name: 'Carré en-dessous',
    preview: 'S̤q̤ṳa̤r̤e̤',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0339').join('');
    }
  },
  {
    id: 'combining-seagull-below',
    name: 'Mouette en-dessous',
    preview: 'S̤e̤a̤g̤ṳl̤l̤',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u033A').join('');
    }
  },
  {
    id: 'combining-x-above',
    name: 'X au-dessus',
    preview: 'X̽ ̽A̽b̽o̽v̽e̽',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u033D').join('');
    }
  },
  {
    id: 'combining-vertical-tilde',
    name: 'Tilde Verticale',
    preview: 'V̊e̊r̊t̊ ̊T̊i̊l̊d̊e̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u033E').join('');
    }
  },
  {
    id: 'combining-double-overline',
    name: 'Double Ligne au-dessus',
    preview: 'D̿o̿u̿b̿l̿e̿ ̿O̿v̿e̿r̿',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u033F').join('');
    }
  },
  {
    id: 'combining-grave-tone-mark',
    name: 'Marque de Ton Grave',
    preview: 'G̗r̗a̗v̗e̗ ̗T̗o̗n̗e̗',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0340').join('');
    }
  },
  {
    id: 'combining-acute-tone-mark',
    name: 'Marque de Ton Aigu',
    preview: 'A̗c̗u̗t̗e̗ ̗T̗o̗n̗e̗',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0341').join('');
    }
  },
  {
    id: 'combining-greek-perispomeni',
    name: 'Périspomène Grec',
    preview: 'G̊r̊e̊e̊k̊ ̊P̊e̊r̊i̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0342').join('');
    }
  },
  {
    id: 'combining-greek-koronis',
    name: 'Coronis Grec',
    preview: 'G̊r̊e̊e̊k̊ ̊K̊o̊r̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0343').join('');
    }
  },
  {
    id: 'combining-greek-dialytika-tonos',
    name: 'Dialytika Tonos Grec',
    preview: 'G̊r̊e̊e̊k̊ ̊D̊i̊å',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0344').join('');
    }
  },
  {
    id: 'combining-greek-ypogegrammeni',
    name: 'Ypogegrammeni Grec',
    preview: 'G̊r̊e̊e̊k̊ ̊Y̊p̊o̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0345').join('');
    }
  },
  {
    id: 'combining-ideographic-iteration-mark',
    name: 'Marque d\'Itération Idéographique',
    preview: 'I̊d̊e̊o̊ ̊I̊t̊e̊r̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0346').join('');
    }
  },
  {
    id: 'combining-ideographic-closing-mark',
    name: 'Marque de Fermeture Idéographique',
    preview: 'I̊d̊e̊o̊ ̊C̊l̊o̊s̊e̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0347').join('');
    }
  },
  {
    id: 'combining-left-angle-above',
    name: 'Angle Gauche au-dessus',
    preview: 'L̊e̊f̊t̊ ̊Ån̊g̊l̊e̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0348').join('');
    }
  },
  {
    id: 'combining-not-tilde-above',
    name: 'Non-Tilde au-dessus',
    preview: 'N̊o̊t̊ ̊T̊i̊l̊d̊e̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0349').join('');
    }
  },
  {
    id: 'combining-homothetic-above',
    name: 'Homothétique au-dessus',
    preview: 'H̊o̊m̊o̊t̊h̊e̊t̊i̊c̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u034A').join('');
    }
  },
  {
    id: 'combining-almost-equal-to-above',
    name: 'Presque Égal au-dessus',
    preview: 'Ål̊m̊o̊s̊t̊ ̊E̊q̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u034B').join('');
    }
  },
  {
    id: 'combining-left-right-arrow-below',
    name: 'Flèche Gauche-Droite en-dessous',
    preview: 'L̊R̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u034C').join('');
    }
  },
  {
    id: 'combining-upwards-arrow-below',
    name: 'Flèche Vers le Haut en-dessous',
    preview: 'Ůp̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u034D').join('');
    }
  },
  {
    id: 'combining-raphe',
    name: 'Raphé',
    preview: 'R̊åp̊h̊e̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u034E').join('');
    }
  },
  {
    id: 'combining-left-harpoon-above',
    name: 'Harpon Gauche au-dessus',
    preview: 'L̊e̊f̊t̊ ̊H̊år̊p̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u034F').join('');
    }
  },
  {
    id: 'combining-right-harpoon-above',
    name: 'Harpon Droit au-dessus',
    preview: 'R̊i̊g̊h̊t̊ ̊H̊år̊p̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0350').join('');
    }
  },
  {
    id: 'combining-long-double-solidus-overlay',
    name: 'Double Barre Oblique Longue Superposée',
    preview: 'D̸o̸u̸b̸l̸e̸ ̸S̸o̸l̸i̸d̸u̸s̸',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0351').join('');
    }
  },
  {
    id: 'combining-rightwards-arrow-below',
    name: 'Flèche Droite en-dessous',
    preview: 'R̊i̊g̊h̊t̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0352').join('');
    }
  },
  {
    id: 'combining-leftwards-arrow-below',
    name: 'Flèche Gauche en-dessous',
    preview: 'L̊e̊f̊t̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0353').join('');
    }
  },
  {
    id: 'combining-left-arrow-overlay',
    name: 'Flèche Gauche Superposée',
    preview: 'L̊e̊f̊t̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0354').join('');
    }
  },
  {
    id: 'combining-right-arrow-overlay',
    name: 'Flèche Droite Superposée',
    preview: 'R̊i̊g̊h̊t̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0355').join('');
    }
  },
  {
    id: 'combining-double-vertical-stroke-overlay',
    name: 'Double Trait Vertical Superposé',
    preview: 'D̊o̊ůb̊l̊e̊ ̊V̊e̊r̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0356').join('');
    }
  },
  {
    id: 'combining-left-arrow-below',
    name: 'Flèche Gauche en-dessous',
    preview: 'L̊e̊f̊t̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0357').join('');
    }
  },
  {
    id: 'combining-right-arrow-below',
    name: 'Flèche Droite en-dessous',
    preview: 'R̊i̊g̊h̊t̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0358').join('');
    }
  },
  {
    id: 'combining-ring-dot',
    name: 'Cercle Point',
    preview: 'R̊i̊n̊g̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0359').join('');
    }
  },
  {
    id: 'combining-upward-arrow',
    name: 'Flèche Vers le Haut',
    preview: 'Ůp̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u035A').join('');
    }
  },
  {
    id: 'combining-downward-arrow',
    name: 'Flèche Vers le Bas',
    preview: 'D̊o̊ẘn̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u035B').join('');
    }
  },
  {
    id: 'combining-left-right-arrow',
    name: 'Flèche Gauche-Droite',
    preview: 'L̊R̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u035C').join('');
    }
  },
  {
    id: 'combining-up-down-arrow',
    name: 'Flèche Haut-Bas',
    preview: 'ŮD̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u035D').join('');
    }
  },
  {
    id: 'combining-rightwards-harpoon-with-barb-upwards',
    name: 'Harpon Droit avec Barbillon Vers le Haut',
    preview: 'R̊i̊g̊h̊t̊ ̊H̊år̊p̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u035E').join('');
    }
  },
  {
    id: 'combining-rightwards-harpoon-with-barb-downwards',
    name: 'Harpon Droit avec Barbillon Vers le Bas',
    preview: 'R̊i̊g̊h̊t̊ ̊H̊år̊p̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u035F').join('');
    }
  },
  {
    id: 'combining-leftwards-harpoon-with-barb-upwards',
    name: 'Harpon Gauche avec Barbillon Vers le Haut',
    preview: 'L̊e̊f̊t̊ ̊H̊år̊p̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0360').join('');
    }
  },
  {
    id: 'combining-leftwards-harpoon-with-barb-downwards',
    name: 'Harpon Gauche avec Barbillon Vers le Bas',
    preview: 'L̊e̊f̊t̊ ̊H̊år̊p̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0361').join('');
    }
  },
  {
    id: 'combining-left-right-harpoon',
    name: 'Harpon Gauche-Droite',
    preview: 'L̊R̊ ̊H̊år̊p̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0362').join('');
    }
  },
  {
    id: 'combining-up-down-harpoon',
    name: 'Harpon Haut-Bas',
    preview: 'ŮD̊ ̊H̊år̊p̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0363').join('');
    }
  },
  {
    id: 'combining-rightwards-arrow-overlay',
    name: 'Flèche Droite Superposée',
    preview: 'R̊i̊g̊h̊t̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0364').join('');
    }
  },
  {
    id: 'combining-leftwards-arrow-overlay',
    name: 'Flèche Gauche Superposée',
    preview: 'L̊e̊f̊t̊ ̊År̊r̊o̊ẘ',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0365').join('');
    }
  },
  {
    id: 'combining-triple-dot',
    name: 'Triple Point',
    preview: 'T̊r̊i̊p̊l̊e̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0366').join('');
    }
  },
  {
    id: 'combining-quadruple-dot',
    name: 'Quadruple Point',
    preview: 'Q̊ůåd̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0367').join('');
    }
  },
  {
    id: 'combining-five-dot',
    name: 'Cinq Points',
    preview: 'F̊i̊v̊e̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0368').join('');
    }
  },
  {
    id: 'combining-six-dot',
    name: 'Six Points',
    preview: 'S̊i̊x̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u0369').join('');
    }
  },
  {
    id: 'combining-seven-dot',
    name: 'Sept Points',
    preview: 'S̊e̊v̊e̊n̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u036A').join('');
    }
  },
  {
    id: 'combining-eight-dot',
    name: 'Huit Points',
    preview: 'E̊i̊g̊h̊t̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u036B').join('');
    }
  },
  {
    id: 'combining-nine-dot',
    name: 'Neuf Points',
    preview: 'N̊i̊n̊e̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u036C').join('');
    }
  },
  {
    id: 'combining-ten-dot',
    name: 'Dix Points',
    preview: 'T̊e̊n̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u036D').join('');
    }
  },
  {
    id: 'combining-eleven-dot',
    name: 'Onze Points',
    preview: 'E̊l̊e̊v̊e̊n̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u036E').join('');
    }
  },
  {
    id: 'combining-twelve-dot',
    name: 'Douze Points',
    preview: 'T̊ẘe̊l̊v̊e̊ ̊D̊o̊t̊',
    generator: (text: string) => {
      return text.split('').map(char => char + '\u036F').join('');
    }
  },
  {
    id: 'wide',
    name: 'Large',
    preview: 'Ｗｉｄｅ Ｔｅｘｔ',
    generator: createFontGenerator({
      'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ',
      'i': 'ｉ', 'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ',
      'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ', 'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ',
      'y': 'ｙ', 'z': 'ｚ', 'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ',
      'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ',
      'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ', 'U': 'Ｕ', 'V': 'Ｖ',
      'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ', '0': '０', '1': '１', '2': '２', '3': '３',
      '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９', ' ': '　'
    })
  },
  {
    id: 'bubble',
    name: 'Bulle',
    preview: 'Ⓑⓤⓑⓑⓛⓔ',
    generator: createFontGenerator({
      'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ',
      'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ',
      'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ',
      'y': 'ⓨ', 'z': 'ⓩ', 'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ',
      'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ',
      'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ',
      'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ'
    })
  },
  {
    id: 'black-square',
    name: 'Carré Noir',
    preview: '🅰🅱🅲',
    generator: createFontGenerator({
      'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷',
      'i': '🅸', 'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿',
      'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇',
      'y': '🆈', 'z': '🆉', 'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵',
      'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹', 'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽',
      'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃', 'U': '🆄', 'V': '🆅',
      'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉'
    })
  },
  {
    id: 'regional-indicator',
    name: 'Indicateur Régional',
    preview: '🇦🇧🇨',
    generator: (text: string) => {
      const regionalMap: { [key: string]: string } = {
        'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭',
        'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵',
        'q': '🇶', 'r': '🇷', 's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽',
        'y': '🇾', 'z': '🇿', 'A': '🇦', 'B': '🇧', 'C': '🇨', 'D': '🇩', 'E': '🇪', 'F': '🇫',
        'G': '🇬', 'H': '🇭', 'I': '🇮', 'J': '🇯', 'K': '🇰', 'L': '🇱', 'M': '🇲', 'N': '🇳',
        'O': '🇴', 'P': '🇵', 'Q': '🇶', 'R': '🇷', 'S': '🇸', 'T': '🇹', 'U': '🇺', 'V': '🇻',
        'W': '🇼', 'X': '🇽', 'Y': '🇾', 'Z': '🇿'
      };
      return text.split('').map(char => regionalMap[char.toLowerCase()] || char).join(' ');
    }
  },
  {
    id: 'squared-katakana',
    name: 'Katakana Carré',
    preview: '🈀🈁🈂',
    generator: (text: string) => {
      // Limited support for katakana, using available symbols
      return text.split('').map(char => {
        const katakanaMap: { [key: string]: string } = {
          'a': '🈀', 'b': '🈁', 'c': '🈂', 'd': '🈃', 'e': '🈄', 'f': '🈅', 'g': '🈆', 'h': '🈇',
          'i': '🈈', 'j': '🈉', 'k': '🈊', 'l': '🈋', 'm': '🈌', 'n': '🈍', 'o': '🈎', 'p': '🈏',
          'q': '🈐', 'r': '🈑', 's': '🈒', 't': '🈓', 'u': '🈔', 'v': '🈕', 'w': '🈖', 'x': '🈗',
          'y': '🈘', 'z': '🈙'
        };
        return katakanaMap[char.toLowerCase()] || char;
      }).join('');
    }
  },
  {
    id: 'circled-katakana',
    name: 'Katakana Cerclé',
    preview: '㋐㋑㋒',
    generator: (text: string) => {
      const katakanaCircledMap: { [key: string]: string } = {
        'a': '㋐', 'b': '㋑', 'c': '㋒', 'd': '㋓', 'e': '㋔', 'f': '㋕', 'g': '㋖', 'h': '㋗',
        'i': '㋘', 'j': '㋙', 'k': '㋚', 'l': '㋛', 'm': '㋜', 'n': '㋝', 'o': '㋞', 'p': '㋟',
        'q': '㋠', 'r': '㋡', 's': '㋢', 't': '㋣', 'u': '㋤', 'v': '㋥', 'w': '㋦', 'x': '㋧',
        'y': '㋨', 'z': '㋩'
      };
      return text.split('').map(char => katakanaCircledMap[char.toLowerCase()] || char).join('');
    }
  },
  {
    id: 'mathematical-bold',
    name: 'Mathématique Gras',
    preview: '𝐌𝐚𝐭𝐡 𝐁𝐨𝐥𝐝',
    generator: createFontGenerator({
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
      'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩',
      'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱',
      'y': '𝐲', 'z': '𝐳', 'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅',
      'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍',
      'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕',
      'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
    })
  },
  {
    id: 'mathematical-italic',
    name: 'Mathématique Italique',
    preview: '𝑀𝑎𝑡ℎ 𝐼𝑡𝑎𝑙𝑖𝑐',
    generator: createFontGenerator({
      'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ',
      'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝',
      'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥',
      'y': '𝑦', 'z': '𝑧', 'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹',
      'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁',
      'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉',
      'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
    })
  },
  {
    id: 'mathematical-bold-italic',
    name: 'Mathématique Gras Italique',
    preview: '𝑴𝒂𝒕𝒉 𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄',
    generator: createFontGenerator({
      'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉',
      'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑',
      'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙',
      'y': '𝒚', 'z': '𝒛', 'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭',
      'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵',
      'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽',
      'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
    })
  },
  {
    id: 'mathematical-script',
    name: 'Mathématique Script',
    preview: '𝒮𝒸𝓇𝒾𝓅𝓉',
    generator: createFontGenerator({
      'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽',
      'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅',
      'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
      'y': '𝓎', 'z': '𝓏', 'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ',
      'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩',
      'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱',
      'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
    })
  },
  {
    id: 'mathematical-bold-script',
    name: 'Mathématique Script Gras',
    preview: '𝓢𝓬𝓻𝓲𝓹𝓽 𝓑𝓸𝓵𝓭',
    generator: createFontGenerator({
      'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
      'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹',
      'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁',
      'y': '𝔂', 'z': '𝔃', 'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕',
      'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝',
      'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥',
      'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩'
    })
  },
  {
    id: 'mathematical-fraktur',
    name: 'Mathématique Gothique',
    preview: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯',
    generator: createFontGenerator({
      'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥',
      'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭',
      'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵',
      'y': '𝔶', 'z': '𝔷', 'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉',
      'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑',
      'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙',
      'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ'
    })
  },
  {
    id: 'mathematical-bold-fraktur',
    name: 'Mathématique Gothique Gras',
    preview: '𝕲𝕺𝕿𝕳𝕴𝕼 𝕭𝕺𝕷𝕯',
    generator: createFontGenerator({
      'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍',
      'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕',
      'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝',
      'y': '𝖞', 'z': '𝖟', 'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱',
      'G': '𝕲', 'H': '𝕳', 'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹',
      'O': '𝕺', 'P': '𝕻', 'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁',
      'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅'
    })
  },
  {
    id: 'mathematical-double-struck',
    name: 'Mathématique Double Barré',
    preview: '𝔻𝕠𝕦𝕓𝕝𝕖 𝔹𝕒𝕣𝕣é',
    generator: createFontGenerator({
      'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙',
      'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡',
      'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩',
      'y': '𝕪', 'z': '𝕫', 'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽',
      'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ',
      'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍',
      'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ', '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛',
      '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
    })
  },
  {
    id: 'mathematical-sans-serif',
    name: 'Mathématique Sans Serif',
    preview: '𝖲𝖺𝗇𝗌 𝖲𝖾𝗋𝗂𝖿',
    generator: createFontGenerator({
      'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁',
      'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉',
      'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑',
      'y': '𝗒', 'z': '𝗓', 'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥',
      'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭',
      'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵',
      'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹', '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥',
      '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫'
    })
  },
  {
    id: 'mathematical-sans-serif-bold',
    name: 'Mathématique Sans Serif Gras',
    preview: '𝗦𝗮𝗻𝘀 𝗦𝗲𝗿𝗶𝗳 𝗕𝗼𝗹𝗱',
    generator: createFontGenerator({
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
      'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
      'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
      'y': '𝘆', 'z': '𝘇', 'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙',
      'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
      'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩',
      'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯',
      '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    })
  },
  {
    id: 'mathematical-sans-serif-italic',
    name: 'Mathématique Sans Serif Italique',
    preview: '𝘚𝘢𝘯𝘴 𝘚𝘦𝘳𝘪𝘧 𝘐𝘵𝘢𝘭𝘪𝘤',
    generator: createFontGenerator({
      'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩',
      'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱',
      'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹',
      'y': '𝘺', 'z': '𝘻', 'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍',
      'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕',
      'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝',
      'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
    })
  },
  {
    id: 'mathematical-sans-serif-bold-italic',
    name: 'Mathématique Sans Serif Gras Italique',
    preview: '𝙎𝙖𝙣𝙨 𝙎𝙚𝙧𝙞𝙛 𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘',
    generator: createFontGenerator({
      'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝',
      'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥',
      'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭',
      'y': '𝙮', 'z': '𝙯', 'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁',
      'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉',
      'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑',
      'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕'
    })
  },
  {
    id: 'mathematical-monospace',
    name: 'Mathématique Monospace',
    preview: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎',
    generator: createFontGenerator({
      'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑',
      'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙',
      'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡',
      'y': '𝚢', 'z': '𝚣', 'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵',
      'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽',
      'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅',
      'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉', '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹',
      '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
    })
  }
];

export default function FontGenerator() {
  const [inputText, setInputText] = useState('');
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [selectedStyles, setSelectedStyles] = useState<{ [key: string]: boolean }>({});
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [pageData, setPageData] = useState<FontGeneratorPageData | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis Sanity
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const data = await PageService.getFontGeneratorPage();
        setPageData(data);
      } catch (error) {
        console.error('Erreur lors du chargement de la page:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  // Mise à jour des métadonnées SEO
  useEffect(() => {
    if (pageData?.seo) {
      // Mise à jour du titre de la page
      if (pageData.seo.metaTitle) {
        document.title = pageData.seo.metaTitle;
      }
      
      // Mise à jour de la meta description
      if (pageData.seo.metaDescription) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', pageData.seo.metaDescription);
        } else {
          const metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          metaDesc.content = pageData.seo.metaDescription;
          document.head.appendChild(metaDesc);
        }
      }

      // Mise à jour des meta keywords
      if (pageData.seo.keywords && pageData.seo.keywords.length > 0) {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', pageData.seo.keywords.join(', '));
        } else {
          const metaKw = document.createElement('meta');
          metaKw.name = 'keywords';
          metaKw.content = pageData.seo.keywords.join(', ');
          document.head.appendChild(metaKw);
        }
      }

      // Mise à jour de l'URL canonique
      if (pageData.seo.canonicalUrl) {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', pageData.seo.canonicalUrl);
        } else {
          const linkCanonical = document.createElement('link');
          linkCanonical.rel = 'canonical';
          linkCanonical.href = pageData.seo.canonicalUrl;
          document.head.appendChild(linkCanonical);
        }
      }
    }

    // Open Graph
    if (pageData?.openGraph) {
      if (pageData.openGraph.title) {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', pageData.openGraph.title);
        } else {
          const metaOgTitle = document.createElement('meta');
          metaOgTitle.setAttribute('property', 'og:title');
          metaOgTitle.setAttribute('content', pageData.openGraph.title);
          document.head.appendChild(metaOgTitle);
        }
      }

      if (pageData.openGraph.description) {
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', pageData.openGraph.description);
        } else {
          const metaOgDesc = document.createElement('meta');
          metaOgDesc.setAttribute('property', 'og:description');
          metaOgDesc.setAttribute('content', pageData.openGraph.description);
          document.head.appendChild(metaOgDesc);
        }
      }

      if (pageData.openGraph.url) {
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
          ogUrl.setAttribute('content', pageData.openGraph.url);
        } else {
          const metaOgUrl = document.createElement('meta');
          metaOgUrl.setAttribute('property', 'og:url');
          metaOgUrl.setAttribute('content', pageData.openGraph.url);
          document.head.appendChild(metaOgUrl);
        }
      }

      if (pageData.openGraph.image?.url) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', pageData.openGraph.image.url);
        } else {
          const metaOgImage = document.createElement('meta');
          metaOgImage.setAttribute('property', 'og:image');
          metaOgImage.setAttribute('content', pageData.openGraph.image.url);
          document.head.appendChild(metaOgImage);
        }
      }
    }
  }, [pageData]);

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

  const displayedStyles = showAllStyles ? generatedTexts : generatedTexts.slice(0, 50);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-rounded">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-rounded">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-6">
            {pageData?.hero?.title || 'Instagram Générateur de texte'}
          </h1>
          {pageData?.hero?.description ? (
            <div className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-lg">
              <PortableText content={pageData.hero.description} />
            </div>
          ) : (
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-lg">
              Nos générateurs de polices Instagram vous permettent de créer un texte agréable que vous pouvez copier et coller dans votre bio, légendes, commentaires et histoires Instagram.
            </p>
          )}
        </div>

        {/* H2 avant le générateur */}
        {pageData?.h2BeforeGenerator && (
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4 text-center">
              {pageData.h2BeforeGenerator}
            </h2>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 p-8 mb-8">
          <label htmlFor="text-input" className="block text-sm font-medium text-slate-700 mb-3">
            Tapez le texte que vous voulez faire gras dans la case ci-dessous..
          </label>
          <textarea
            id="text-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ex: Mon compte Instagram"
            className="w-full p-4 border border-soft-pink-200/50 rounded-button focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 focus:outline-none resize-none bg-white/80 backdrop-blur-sm transition-all text-slate-900"
            rows={3}
          />
        </div>

        {/* Styles Counter */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-slate-600 font-medium">
            {showAllStyles 
              ? `Affichage de tous les ${generatedTexts.length} styles` 
              : `Affichage de ${displayedStyles.length} sur ${generatedTexts.length} styles`}
          </span>
        </div>

        {/* Styles List */}
        <div className="space-y-3">
          {displayedStyles.map((style) => (
            <div key={style.id} className="bg-white/80 backdrop-blur-sm rounded-card-sm border border-soft-pink-200/50 p-5 flex items-center shadow-soft hover:shadow-soft-lg transition-all">
              <input
                type="checkbox"
                checked={selectedStyles[style.id] || false}
                onChange={() => toggleStyleSelection(style.id)}
                className="mr-4 w-5 h-5 text-soft-pink-600 border-soft-pink-300 rounded focus:ring-soft-pink-500"
              />
              <div className="flex-1">
                <span className="text-lg font-medium text-slate-800">
                  {style.generated || 'Votre texte stylisé apparaîtra ici...'}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(style.generated, style.id)}
                disabled={!style.generated}
                className="ml-4 px-4 py-2 text-sm bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white rounded-button hover:shadow-soft-lg disabled:bg-gray-400 disabled:opacity-50 transition-all shadow-soft font-medium"
              >
                {copiedStates[style.id] ? (
                  <span className="flex items-center">
                    <Check className="w-3 h-3 mr-1" strokeWidth={2} />
                    Copié
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="w-3 h-3 mr-1" strokeWidth={1.5} />
                    Copie
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Bouton pour voir tous les styles - après les 50 premiers */}
        {!showAllStyles && generatedTexts.length > 50 && (
          <div className="flex justify-center mt-6 mb-6">
            <button
              onClick={() => setShowAllStyles(true)}
              className="px-6 py-3 text-base bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white rounded-button hover:shadow-soft-lg transition-all shadow-soft font-medium flex items-center gap-2"
            >
              <span>Voir tous les styles ({generatedTexts.length - 50} styles supplémentaires)</span>
              <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Bouton pour voir moins - après tous les styles */}
        {showAllStyles && generatedTexts.length > 50 && (
          <div className="flex justify-center mt-6 mb-6">
            <button
              onClick={() => {
                setShowAllStyles(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 text-base bg-slate-200 text-slate-700 rounded-button hover:bg-slate-300 transition-all shadow-soft font-medium flex items-center gap-2"
            >
              <span>Voir moins (afficher seulement les 50 premiers)</span>
              <ChevronDown className="w-5 h-5 rotate-180" strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Instagram Preview */}
        {inputText && (
          <div className="mt-10 bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Aperçu Instagram</h2>
            
            <div className="max-w-sm mx-auto bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 rounded-card p-8 text-white shadow-soft-xl">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-soft-lg">
                  <Instagram className="w-7 h-7 bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-semibold text-lg">doctor_followers</div>
                  <div className="text-sm opacity-90">Compte vérifié</div>
                </div>
              </div>
              
              <div className="space-y-3">
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
        <div className="mt-10 bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 rounded-card p-8 text-white shadow-soft-xl">
          <h2 className="text-lg font-semibold mb-6">💡 Conseils d'utilisation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-card-sm p-5 border border-white/20">
              <h3 className="font-semibold mb-3">Pour votre bio Instagram :</h3>
              <ul className="space-y-2 opacity-90">
                <li>• Utilisez des polices différentes pour créer du contraste</li>
                <li>• Évitez d'en faire trop, 2-3 styles maximum</li>
                <li>• Testez la lisibilité sur mobile</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-card-sm p-5 border border-white/20">
              <h3 className="font-semibold mb-3">Pour vos légendes :</h3>
              <ul className="space-y-2 opacity-90">
                <li>• Utilisez les polices pour mettre en valeur des mots-clés</li>
                <li>• Créez des séparateurs visuels avec les symboles</li>
                <li>• Gardez la cohérence avec votre identité de marque</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contenu enrichi après le générateur */}
        {pageData?.contentAfterGenerator && (
          <div className="mt-10 bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 p-8">
            <PortableText content={pageData.contentAfterGenerator} />
          </div>
        )}

        {/* FAQ Section */}
        {pageData?.faq?.questions && pageData.faq.questions.length > 0 && (
          <div className="mt-10">
            <FAQSection 
              title={pageData.faq.title || "Questions fréquentes"}
              faqs={pageData.faq.questions.map(q => ({
                question: q.question || '',
                answer: q.answer || ''
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
