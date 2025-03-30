
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sdg',
  title: 'SDG',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'number',
      title: 'SDG Number',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(17).integer(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Color code for this SDG (e.g. #FF0000)',
    }),
  ],
})
