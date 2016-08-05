function CommandBus(initialState, eventHub, methods) {
    var self = this;

    this.state = initialState;
    this.eventHub = eventHub;

    Object.keys(methods).forEach(function (key) {
        console.log(methods, key);
        self[key] = methods[key];
    });
}

CommandBus.prototype = {
    run: function (name, payload) {
        var self = this;

        return Promise
            .resolve(self[name](self.state, payload))
            .then(function () {
                self.eventHub.publish(name + '.succeeded');
            })
            .catch(function () {
                self.eventHub.publish();
            });
    }
};

module.exports = CommandBus;
