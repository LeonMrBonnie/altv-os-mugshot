const rotationAmount = 90.0;

function updateProp(prop, isFakePickup) {
    prop._isFakePickup = isFakePickup;
    prop.notifyStreaming = isFakePickup;

    if (prop.handle) {
        prop._fpLightData = prop.getVariable("_fpLightData");
    }
}

// Events
mp.events.add("playerReady", () => {
    mp.objects.forEach((prop) => {
        if (prop.getVariable("_isFakePickup")) {
            updateProp(prop, true);
        }
    });
});

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "object" && entity._isFakePickup) {
        entity._fpLightData = entity.getVariable("_fpLightData");
        entity.setCollision(false, false);
    }
});

mp.events.add("render", () => {
    const frameTime = mp.game.invokeFloat("0x0000000050597EE2"); // TIMESTEP

    for (const obj of mp.objects.streamed) {
        if (!obj._isFakePickup) {
            continue;
        }

        const { x: rotX, y: rotY, z: rotZ } = obj.getRotation(2);
        obj.setRotation(rotX, rotY, rotZ + (rotationAmount * frameTime), 2, true);

        if (obj._fpLightData) {
            const { x: posX, y: posY, z: posZ } = obj.position;
            const { red, green, blue, range, intensity, shadow } = obj._fpLightData;
            mp.game.graphics.drawLightWithRangeAndShadow(posX, posY, posZ, red, green, blue, range, intensity, shadow);
        }
    }
});

// Data handlers
mp.events.addDataHandler("_isFakePickup", (entity, value) => {
    if (entity.type === "object") {
        updateProp(entity, value);
    }
});

mp.events.addDataHandler("_fpLightData", (entity, value) => {
    if (entity.type === "object") {
        if (value) {
            entity._fpLightData = value;
        } else {
            delete entity._fpLightData;
        }
    }
});