import * as fs from 'node:fs'
import * as path from 'node:path'

import { unified } from 'unified'
import rehypeParse from 'rehype-parse'

const processor = unified()
    .use(rehypeParse)