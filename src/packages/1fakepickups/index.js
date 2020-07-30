const FakePickup = require("./classes/FakePickup");

const allPickups = new Map();
let lastId = 1;

mp.fakePickups = {
    // Functions
    new: function(model, position, pickupRange, respawnTime, dimension = 0) {
        model = typeof model === "string" ? mp.joaat(model) : model;

        const pickup = new FakePickup(lastId, model, position, pickupRange, respawnTime, dimension);
        allPickups.set(lastId, pickup);

        lastId++;
        return pickup;
    },

    at: function(id) {
        return allPickups.get(id);
    },

    exists: function(id) {
        return allPickups.has(id);
    },

    toArray: function() {
        return Array.from(allPickups.values());
    },

    // Private functions
    _dropId: function(id) {
        allPickups.delete(id);
    },

    // Getters
    get length() {
        return allPickups.size;
    }
};

// Events
mp.events.add("playerEnterColshape", (player, shape) => {
    if (!shape._isFakePickup || shape._fpCollected) {
        return;
    }

    const fakePickup = mp.fakePickups.at(shape._fpId);
    if (!fakePickup) {
        return;
    }

    const cancel = { cancel: false };
    mp.events.call("playerCollectFakePickup", player, fakePickup, cancel);

    if (!cancel.cancel && !fakePickup._isDestroyed) {
        fakePickup._setCollected();
    }
});