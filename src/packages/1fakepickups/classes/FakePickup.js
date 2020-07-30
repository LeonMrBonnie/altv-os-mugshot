module.exports = class FakePickup {
    constructor(id, model, position, pickupRange, respawnTime, dimension) {
        this._id = id;
        this._model = model;
        this._position = position;
        this._pickupRange = pickupRange;
        this._respawnTime = respawnTime;
        this._lightData = null;
        this._dimension = dimension;

        // Respawn stuff
        this._isCollected = false;
        this._isDestroyed = false;
        this._respawnTimer = null;

        // Entities
        this._createProp();

        this._colShape = mp.colshapes.newSphere(position.x, position.y, position.z, pickupRange, dimension);
        this._colShape._isFakePickup = true;
        this._colShape._fpId = id;
        this._colShape._fpCollected = false;
    }

    // Getters and setters
    get id() {
        return this._id;
    }

    get model() {
        return this._model;
    }

    get position() {
        return this._position;
    }

    get pickupRange() {
        return this._pickupRange;
    }

    get respawnTime() {
        return this._respawnTime;
    }

    set respawnTime(newRespawnTime) {
        this._respawnTime = newRespawnTime;
    }

    get lightData() {
        return this._lightData;
    }

    get isCollected() {
        return this._isCollected;
    }

    get dimension() {
        return this._dimension;
    }

    set dimension(newDimension) {
        this._dimension = newDimension;

        if (this._prop) {
            this._prop.dimension = newDimension;
        }

        if (this._colShape) {
            this._colShape.dimension = newDimension;
        }
    }

    // Functions
    setLightData(red, green, blue, range, intensity, shadow) {
        this._lightData = { red, green, blue, range, intensity, shadow };

        if (this._prop) {
            this._prop.setVariable("_fpLightData", this._lightData);
        }
    }

    resetLightData() {
        this._lightData = null;

        if (this._prop) {
            this._prop.setVariable("_fpLightData", this._lightData);
        }
    }

    respawn() {
        if (!this._isCollected || this._isDestroyed) {
            return;
        }

        // Remove existing prop (just in case) and timer to prevent multiple respawns
        this._removeProp();
        this._removeTimer();

        // Other updates
        if (this._colShape) {
            this._colShape._fpCollected = false;
        }

        this._isCollected = false;

        // Recreate the prop
        this._createProp();
    }

    destroy() {
        this._isDestroyed = true;

        this._removeProp();
        this._removeTimer();

        if (this._colShape) {
            this._colShape.destroy();
            this._colShape = null;
        }

        mp.fakePickups._dropId(this._id);
    }

    // Functions (private use)
    _createProp() {
        if (!this._prop) {
            this._prop = mp.objects.new(this._model, this._position, {
                dimension: this._dimension
            });

            this._prop.setVariables({
                "_isFakePickup": true,
                "_fpLightData": this._lightData
            });

            mp.events.call("fakePickupSpawn", this);
        }
    }

    _removeProp() {
        if (this._prop) {
            this._prop.destroy();
            this._prop = null;
        }
    }

    _removeTimer() {
        if (this._respawnTimer) {
            clearTimeout(this._respawnTimer);
            this._respawnTimer = null;
        }
    }

    _setCollected() {
        if (this._isCollected || this._isDestroyed) {
            return;
        }

        this._isCollected = true;

        // Remove prop and stop respawn timer just in case
        this._removeProp();
        this._removeTimer();

        // Update colshape so it doesn't call this function again
        if (this._colShape) {
            this._colShape._fpCollected = true;
        }

        // Stop here if the respawn time is invalid
        if (this._respawnTime <= 0) {
            return;
        }

        this._respawnTimer = setTimeout(() => {
            this.respawn();
        }, this._respawnTime);
    }
};