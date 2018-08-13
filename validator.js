module.exports = function () {
    return {
        validateRequired: function (value) {
            return value.trim() !== '';
        },

        validateUnsignedInteger: function (value) {
            var reg = /^\d+$/;
            return reg.test(value);
        }
    };
};
