module.exports.validateRequired = function (v) {
    return (v && v.trim() !== '')
};

module.exports.validateUnsignedInteger = function (value) {
    var reg = /^\d+$/;
    return reg.test(value);
};
