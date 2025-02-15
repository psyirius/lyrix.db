from mappings import bamini

def convert(val: str, mapping: dict, minlen = 1, maxlen = 3) -> str:
    words = val.split()
    for word in words:
        print('WORD:', word)
        _word = ''
        o = 0
        while o < len(word):
            for i in range(maxlen, minlen - 1, -1):
                chs = word[o:o + i]
                if chs in mapping:
                    print(chs, '->', mapping[chs])
                    _word += mapping[chs]
                    o += len(chs)
                    break
            else:
                raise Exception(f'Error: {word}')

        print(word, '->', _word)


if __name__ == '__main__':
    convert("""
At×Rm At×Rm At×Rm
""", bamini)