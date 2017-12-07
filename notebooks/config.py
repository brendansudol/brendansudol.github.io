import os
import sys


def path2url(path):
    return '/public/notebooks/md/{}'.format(path)


main_dir = os.getcwd()
c = get_config()

c.NbConvertApp.export_format = 'markdown'
c.MarkdownExporter.template_path = ['%s/tpl' % main_dir]
c.MarkdownExporter.template_file = 'jekyll'
c.MarkdownExporter.filters = {'path2url': path2url}

f = None
for arg in sys.argv:
    if arg.endswith('.ipynb'):
        f = arg.split('.ipynb')[0].split('/')[-1]
        break

if f:
    c.NbConvertApp.output_base = f.lower().replace(' ', '-')
    c.FilesWriter.build_directory = '%s/md' % main_dir
