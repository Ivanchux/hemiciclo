import re,sys
src=open('/home/claude/hemiciclo/index.html',encoding='utf8').read()
head=src[:src.index('<header class="top">')]
head=head.replace('<title>Hemiciclo Electoral</title>','<title>Carrera política</title>')
i=head.rindex('</style>')
head=head[:i]+open('/home/claude/carrera/game.css',encoding='utf8').read()+head[i:]
a=src.index('/* ===== DATOS ===== */')
b=src.index('/* ===== UTILIDADES ===== */')
c=src.index('/* ===== VEDA DE SONDEOS ===== */')
engine=src[a:c]
# norm100/shift/take viven más abajo; los incluimos si el juego los usa
shell='<header class="top"><div class="wrap"><button class="brand" data-act="home" aria-label="Volver al inicio"><i></i>CARRERA</button><span class="sp"></span></div></header>\n<main class="wrap" id="app"></main>\n<div class="modal" id="modal" hidden></div>\n<script>\n'
logic=open('/home/claude/carrera/logic.js',encoding='utf8').read()
ui=open('/home/claude/carrera/ui.js',encoding='utf8').read()
out=head+shell+engine+'\n'+logic+'\n'+ui+'\n</script>\n</body></html>\n'
open('/home/claude/carrera/Carrera.html','w',encoding='utf8').write(out)
print('OK',len(out))
