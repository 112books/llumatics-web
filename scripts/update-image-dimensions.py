import os, subprocess, collections
root='static'
imgs=[]
for dp,_,fs in os.walk(os.path.join(root,'images')):
    for fn in fs:
        if os.path.splitext(fn)[1].lower() in ('.jpg','.jpeg','.png','.webp'):
            imgs.append(os.path.join(dp,fn))
imgs.sort()
dims={}
def flush(batch):
    if not batch: return
    p=subprocess.run(['identify','-format','%w|%h|%i\n']+batch,capture_output=True,text=True)
    for line in p.stdout.splitlines():
        parts=line.split('|',2)
        if len(parts)!=3: continue
        w,h,path=parts
        rel=os.path.relpath(path, root).replace(os.sep,'/')
        try: dims[rel]=(int(w),int(h))
        except: pass
batch=[]
for f in imgs:
    batch.append(f)
    if len(batch)>=80:
        flush(batch); batch=[]
flush(batch)
lines=['# Generat automaticament per scripts/update-image-dimensions.py','# Mapa de ruta (relativa a static/) -> amplada x alcada en px']
for k in sorted(dims):
    w,h=dims[k]
    lines.append('"%s": { w: %d, h: %d }'%(k,w,h))
os.makedirs('data',exist_ok=True)
open('data/image_dimensions.yaml','w',encoding='utf-8').write('\n'.join(lines)+'\n')
print('images:', len(dims))
print('sample:')
for k in list(sorted(dims))[:5]:
    print('  ',k,dims[k])
