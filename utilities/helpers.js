const asyncHandle = function (callback) {
    return function (req, res, next) {
        callback(req, res, next).catch(error => next(error))
    }
}

export { asyncHandle }