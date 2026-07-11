import {defineCollection} from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders'

import {SectionSchema} from './content/links/types'

const links = defineCollection({
  loader: glob({pattern: "**/*.{yaml,yml}", base:"./src/content/links"}),
  schema: SectionSchema
});

export const collections = {
  links
};