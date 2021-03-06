import Ember from 'ember'
import layout from '../templates/components/frost-file-picker'
import _ from 'lodash'

// Base design from https://github.com/funkensturm/ember-cli-file-picker
export default Ember.Component.extend({
  layout: layout,
  classNames: ['frost-file-picker'],
  classNameBindings: ['fileName'],

  accept: '*',

  initContext: Ember.on('didInitAttrs', function () {
    this.addObserver('value', () => {
      if (Ember.isNone(this.get('value'))) {
        this.set('file', null)
        this.set('fileName', null)
      }
    })
  }),

  bindChange: Ember.on('didInsertElement', function () {
    this.$('.frost-file-select').on('change', Ember.run.bind(this, 'filesSelected'))
  }),

  unbindChange: Ember.on('willDestroyElement', function () {
    this.$('.frost-file-select').off('change', Ember.run.bind(this, 'filesSelected'))
  }),

  filesSelected: function (event) {
    this.set('fileName', null)

    let files = event.target.files

    if (typeof (this.attrs['validate']) === 'function') {
      this.attrs['validate'](files[0]).then((result) => {
        if (result.valid) {
          this.set('fileName', files[0].name)
          if (_.isFunction(this.attrs['on-change'])) {
            this.attrs['on-change']({id: this.get('id'), type: 'file', value: files[0]})
          }
        }
      })
    } else {
      this.set('fileName', files[0].name)
      if (_.isFunction(this.attrs['on-change'])) {
        this.attrs['on-change']({id: this.get('id'), type: 'file', value: files[0]})
      }
    }
  },

  click: function (event) {
    if (!this.$(event.target).hasClass('frost-file-select')) {
      this.$('.frost-file-select').trigger('click')
    }
  }
})
