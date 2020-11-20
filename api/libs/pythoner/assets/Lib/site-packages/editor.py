import sys
import time
import binascii

import tb as traceback
import javascript

from browser import document as doc, window, alert, bind, html
from browser.widgets import dialog

from browser import html

editor = doc["editor"]
output = ''

class cOutput:
    encoding = 'utf-8'

    def __init__(self):
        self.cons = doc["console"]
        self.buf = ''

    def write(self, data):
        self.buf += str(data)

    def flush(self):
        self.cons.value += self.buf
        self.buf = ''

    def __len__(self):
        return len(self.buf)


def get_value():
	return editor.value

def set_value(x):
	editor.value = x

def to_str(xx):
    return str(xx)

def show_console(ev):
    doc["console"].value = output
    doc["console"].cols = 60

def load_script(file):
    _name = file + '?foo=%s' % time.time()
    editor.setValue(open(_name).read())

def run(*args):
    global output
    doc["console"].value = ''
    src = editor.getValue()

    t0 = time.perf_counter()
    try:
        ns = {'__name__':'__main__'}
        exec(src, ns)
        state = 1
    except Exception as exc:
        traceback.print_exc(file=sys.stderr)
        state = 0
    sys.stdout.flush()
    output = doc["console"].value

    print('<completed in %6.2f ms>' % ((time.perf_counter() - t0) * 1000.0))
    return state
    
if "console" in doc:
    cOut = cOutput()
    sys.stdout = cOut
    sys.stderr = cOut
    
editor.getValue = get_value
editor.setValue = set_value