
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{type: 'reference', to: {type: 'service'}}],
    }),
    defineField({
      name: 'sdgs',
      title: 'SDGs',
      type: 'array',
      of: [{type: 'reference', to: {type: 'sdg'}}],
    }),
    defineField({
      name: 'quoteFromCustomer',
      title: 'Quote from Customer',
      type: 'text',
    }),
    defineField({
      name: 'problemOpportunity',
      title: 'Problem/Opportunity',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'approach',
      title: 'Approach',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'impact',
      title: 'Impact',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'additionalPhoto1',
      title: 'Additional Photo 1',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'additionalPhoto2',
      title: 'Additional Photo 2',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      media: 'coverImage',
    },
    prepare(selection) {
      const {title, client, media} = selection
      return {
        title,
        subtitle: client ? `Client: ${client}` : '',
        media,
      }
    },
  },
})
