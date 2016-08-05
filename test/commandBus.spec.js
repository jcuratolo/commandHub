var CommandBus = require('../commandBus/commandBus.js');
var expect = require('chai').expect;
var sinon = require('sinon');

describe("commandBus", function () {
    var bus;
    var someCommand = function() {};
    var someOtherCommand = function() {};

    beforeEach(function () {
        bus = new CommandBus({}, {
            publish: sinon.spy(),
            subscribe: sinon.spy()
        }, {
            someCommand: someCommand,
            someOtherCommand: someOtherCommand
        });
    });

    describe('adding methods', function () {
        it('adds the right methods', function () {
            expect(typeof bus.someCommand).to.equal(typeof function() {});
            expect(typeof bus.someOtherCommand).to.equal(typeof function() {});
        });
    });

    describe('running commands', function () {
        it('runs the correct command', function() {
            sinon.spy(bus, 'someOtherCommand');
            sinon.spy(bus, 'someCommand');

            expect(bus.someCommand.called).to.equal(false);
            expect(bus.someOtherCommand.called).to.equal(false);

            bus.run('someCommand', {
                derp: true
            });

            expect(bus.someCommand.calledOnce).to.equal(true);
            expect(bus.someOtherCommand.called).to.equal(false);
        });

        it('mutates the state correctly', function() {
            var MY_INPUT = 'myInput';
            var OTHER_INPUT = 5;

            bus.getInput = function (state, payload) {
                state.input = payload.input;
            };

            bus.otherCommand = function (state, payload) {
                state.input = OTHER_INPUT;
            };

            bus.run('getInput', { input: MY_INPUT });

            expect(bus.state.input).to.equal(MY_INPUT);
            expect(bus.state.input).to.not.equal(OTHER_INPUT);
        });

        it('publishes success if a command does not throw', function () {
            bus.eventHub.publish = function () {};
            sinon.spy(bus.eventHub, 'publish');
            sinon.spy(bus, 'someCommand');

            expect(bus.eventHub.publish.called).to.equal(false);

            bus.run('someCommand', { derp: true });

            expect(bus.someCommand.called).to.equal(true);
            expect(bus.eventHub.publish.called).to.equal(true);
        });
    });
});