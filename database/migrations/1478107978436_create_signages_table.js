'use strict'

const Schema = use('Schema')

class CreateSignagesTableTableSchema extends Schema {

  up () {
    this.create('signages', table => {
      table.increments()
      table.string('title', 254).notNullable()
      table.text('description').notNullable()
      table.string('creator', 254)
      table.string('language', 254)
      table.string('thumb_url', 254)
      table.string('pdf_url', 254)
      table.timestamps()
    })
  }

  down () {
    this.drop('signages')
  }

}

module.exports = CreateSignagesTableTableSchema
