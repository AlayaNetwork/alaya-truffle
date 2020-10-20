const web3Utils = require("@alayanetwork/web3-utils");

module.exports = function(chai, _utils) {
  var assert = chai.assert;
  chai.Assertion.addProperty("address", function() {
    this.assert(
      this._obj.length === 42,
      "expected #{this} to be a 42 character address (0x...)",
      "expected #{this} to not be a 42 character address (0x...)"
    );

    // Convert address to a number. Make sure it's not zero.
    // Controversial: Technically there is that edge case where
    // all zeroes could be a valid address. But: This catches all
    // those cases where PlatON returns 0x0000... if something fails.
    const number = web3Utils.toBN(this._obj);
    this.assert(
      number.equals(0) === false,
      "expected address #{this} to not be zero",
      "you shouldn't ever see this."
    );
  });
  assert.isAddress = function(val, exp, msg) {
    return new chai.Assertion(val, msg).to.be.address;
  };
};
