import aifc
import os
import json
d={}
for x in os.listdir('.') :
  if 'aif' in x :
    f = aifc.open(x,'r')
    d['.'.join(x.split('.')[:-1])]=f.getnframes()*1.0/f.getframerate()
    f.close()

print json.dumps(d)
