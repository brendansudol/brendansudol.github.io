try:
    from urllib.parse import quote  # Py 3
except ImportError:
    from urllib2 import quote  # Py 2
import os
import sys

MAIN_DIR = '/Users/bren/Documents/code/brendansudol.github.io/ipy-notebooks'

f = None
for arg in sys.argv:
    if arg.endswith('.ipynb'):
        f = arg.split('.ipynb')[0].split('/')[-1]
        break

c = get_config()
c.NbConvertApp.export_format = 'markdown'
c.MarkdownExporter.template_path = ['%s/templates' % MAIN_DIR]
c.MarkdownExporter.template_file = 'jekyll'

def path2support(path):
    """Turn a file path into a URL"""
    parts = path.split(os.path.sep)
    return '/public/notebooks/' + '/'.join(quote(part) for part in parts)

c.MarkdownExporter.filters = {'path2support': path2support}

if f:
    c.NbConvertApp.output_base = f.lower().replace(' ', '-')
    c.FilesWriter.build_directory = '%s/markdown' % MAIN_DIR
