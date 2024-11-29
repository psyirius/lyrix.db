import json
import re

from docx import Document  # pip install python-docx


def is_bold(paragraph):
    """
    Check if the paragraph is bolded.
    Returns True if any run in the paragraph is bolded.
    """
    for run in paragraph.runs:
        if run.bold:
            return True
    return False

def is_song_number(paragraph):
    """
    Check if the paragraph is a song number.
    It must be bolded and consist solely of a number.
    """
    if not is_bold(paragraph):
        return False
    text = paragraph.text.strip()
    return re.fullmatch(r'\d+', text) is not None

def is_subheading(paragraph):
    """
    Check if the paragraph is a subheading.
    Any bolded paragraph that is not a song number is considered a subheading.
    """
    if not is_bold(paragraph):
        return False
    text = paragraph.text.strip()
    # Ensure it's not a song number
    return not re.fullmatch(r'\d+', text)

def get_subheading_type(paragraph):
    """
    Extract the subheading type from the paragraph.
    """
    return paragraph.text.strip()

def is_empty(paragraph):
    """
    Check if the paragraph is empty.
    """
    return paragraph.text.strip() == ''

def is_verse_numbered_line(line):
    """
    Check if the line starts with a number followed by a dot and a space.
    Example: "1. This is a verse line"
    """
    return re.match(r'^\d+\.\s+', line) is not None

def sanitize_filename(s):
    """
    Sanitize the string to be safe for filenames by removing or replacing invalid characters,
    and whitespace issues such as non-breaking spaces and tabs.
    """
    s = s.strip()  # Remove leading/trailing whitespace
    s = re.sub(r'[\s\xa0\t]+', '_', s)  # Replace spaces, non-breaking spaces, and tabs with underscores
    s = re.sub(r'[\\/:"*?<>|]+', '_', s)  # Replace invalid characters with underscores
    return s

def normalize_spacing(text):
    """
    Normalize the spacing in the text.
    Replace multiple spaces with a single space.
    """
    return re.sub(r'\s+', ' ', text).strip()

def extract_songs(docx_path: str, r: range):
    doc = Document(docx_path)

    songs = []
    current_song = None
    current_seq = None

    for paragraph in doc.paragraphs:
        paragraph_text = normalize_spacing(paragraph.text)

        if is_song_number(paragraph):
            current_seq = int(paragraph_text)

            # skip songs before the starting range
            if current_seq not in r:
                continue

            # save the previous song
            if current_song is not None:
                songs.append(current_song)

            # init a new song
            current_song = {
                'sequence': int(paragraph_text),
                'contents': []
            }

            continue

        if current_song is None:
            continue

        # skip songs before the starting range
        if current_seq not in r:
            continue

        if is_empty(paragraph):
            current_song['contents'].append({
                'type': 'break',
            })
            continue

        if is_subheading(paragraph):
            current_song['contents'].append({
                'type': 'sub',
                'content': paragraph_text
            })
            continue

        if is_verse_numbered_line(paragraph_text):
            # extract the verse number
            verse_num = re.match(r'^(\d+)\.\s+', paragraph_text).group(1)

            current_song['contents'].append({
                'type': 'verse',
                'sequence': int(verse_num)
            })

            # remove the verse number from the line
            paragraph_text = re.sub(r'^\d+\.\s+', '', paragraph_text)

        current_song['contents'].append({
            'type': 'line',
            'content': paragraph_text
        })

    # save the last song
    if current_song is not None:
        songs.append(current_song)

    # consolidate consecutive lines
    for song in songs:
        cons_contents = []
        curr_slide = None

        for i in range(len(song['contents'])):
            item = song['contents'][i]

            match item['type']:
                case 'sub':
                    if curr_slide is not None:
                        cons_contents.append(curr_slide)
                        curr_slide = None

                    cons_contents.append(item)
                case 'verse':
                    if curr_slide is not None:
                        cons_contents.append(curr_slide)
                        curr_slide = None

                    cons_contents.append(item)
                case 'line':
                    line_content = item['content'].strip(' \r\n\t')

                    if curr_slide is None:
                        curr_slide = {
                            'type': 'slide',
                            'lines': [line_content]
                        }
                    else:
                        curr_slide['lines'].append(line_content)
                case 'break':
                    if curr_slide is not None:
                        cons_contents.append(curr_slide)
                        curr_slide = None
                case _:
                    raise NotImplementedError(f"Unexpected item type: {item['type']}")

        # save the last slide
        if curr_slide is not None:
            cons_contents.append(curr_slide)

        song['contents'] = cons_contents

        # rich.print(song)

    return songs

def main():
    src = 'resources/2023_FGPC Song Book.docx'

    # start, stop = 701, 800
    # start, stop = 801, 900
    start, stop = 901, 1000

    songs = extract_songs(src, range(start, stop + 1))

    out_filename = 'FGPC-2023 - ({}-{})'.format(start, stop)

    with open(f'etc/fgpc-json-exports/{out_filename}.json', 'w') as f:
        f.write(json.dumps(songs, indent=2))

    print(f"Exported {len(songs)} songs to {out_filename}.json")

if __name__ == "__main__":
    main()
    print("<[DONE]>")