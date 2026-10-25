import {author} from './author'
import {blockContent} from './blockContent'
import {category} from './category'
import {post} from './post'
import {seo} from './seo'
import {siteSettings} from './siteSettings'

export const SINGLETON_TYPES = new Set(['siteSettings'])

export const schemaTypes = [post, author, category, siteSettings, blockContent, seo]
