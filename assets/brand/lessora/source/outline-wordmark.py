# Writes wordmark.json: "Lessora" in Geist Medium (wght 500), 25px, -0.6 tracking, as SVG path data at origin.
# Usage: python3 outline-wordmark.py path/to/Geist-Variable.woff2
import json, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

font = instancer.instantiateVariableFont(TTFont(sys.argv[1]), {'wght': 500})
upm = font['head'].unitsPerEm
cmap, glyphs, hmtx = font.getBestCmap(), font.getGlyphSet(), font['hmtx']
scale, x, parts = 25 / upm, 0, []
for ch in 'Lessora':
    name = cmap[ord(ch)]
    pen = SVGPathPen(glyphs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, 0)))
    parts.append(pen.getCommands())
    x += hmtx[name][0] * scale - 0.6
json.dump({'d': ' '.join(parts), 'w': round(x + 0.6, 2), 'cap': font['OS/2'].sCapHeight * scale},
          open(__file__.replace('outline-wordmark.py', 'wordmark.json'), 'w'))
