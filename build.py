"""Compila src/ en un único index.html (motor + core + ui + css + mapa). Uso: python build.py"""
import os
D=os.path.dirname(os.path.abspath(__file__)); S=os.path.join(D,'src')
rd=lambda p:open(os.path.join(S,p),encoding='utf8').read()
FONTS=('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
 '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800;900&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600;700&display=swap">')
ui=rd('ui.js').replace('__GEO__',rd('geo/spain.json'))
out=('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
 '<title>Hemiciclo · Elecciones generales en directo</title>'+FONTS+'<style>'+rd('app.css')+'</style></head><body><div id="app"></div>\n<script>\n'
 +rd('engine.js')+'\n'+rd('core.js')+'\n'+ui+'\n</script></body></html>\n')
open(os.path.join(D,'index.html'),'w',encoding='utf8').write(out); print('index.html',len(out),'bytes')
