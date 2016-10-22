'use strict';

const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');

const BASEPATH = process.cwd();

const CACHE = {};

class View {
  constructor(tpl) {
    if(CACHE[this.tpl]) {
      return CACHE[this.tpl];
    }

    this.tpl = tpl;
    this.view = fs.readFileSync(path.join(BASEPATH, 'view', `${tpl}.mustache`), { encoding: 'utf8' });

    // pre-parse
    Mustache.parse(this.view);

    CACHE[this.tpl] = this;
  }

  render(data) {
    return Mustache.render(this.view, data, {
      header: new View('header').view,
      footer: new View('footer').view
    });
  }
}

module.exports = tpl => new View(tpl);