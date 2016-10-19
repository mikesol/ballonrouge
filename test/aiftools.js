var aiftools = require('./../aiftools/aiftools')
var _ = require('lodash')

test('values equal durations', function () {
  _.isEqual(aiftools.bufdurs(['pop1','pop2']), {'pop1':0.5,'pop2':0.4});
});
