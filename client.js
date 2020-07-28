import * as alt from "alt-client";
import * as native from "natives";

const boardProp = "prop_police_id_board";
const textProp = "prop_police_id_text";
const renderTargetName = "ID_Text";
const animDict = "mp_character_creation@lineup@male_a";
const animName = "loop_raised";

native.requestAnimDict(animDict);

class MugshotBoard {
    static active = false;
    static everyTickHandle = null;
    static handles = {
        board: null,
        text: null,
        scaleform: null,
        renderTarget: null,
    };

    static async start(title, topText, midText, bottomText, rank = -1) {
        MugshotBoard.active = true;

        MugshotBoard.setupObjects();
        await MugshotBoard.setupScaleform(
            title,
            topText,
            midText,
            bottomText,
            rank
        );
        MugshotBoard.setupRendertarget();
        MugshotBoard.attachObjects();
        MugshotBoard.playAnimation();

        MugshotBoard.everyTickHandle = alt.everyTick(MugshotBoard.everyTick);
    }
    static setupObjects() {
        MugshotBoard.handles.board = native.createObject(
            alt.hash(boardProp),
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.z,
            false,
            false,
            false
        );
        MugshotBoard.handles.text = native.createObject(
            alt.hash(textProp),
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.z,
            false,
            false,
            false
        );
    }
    static async setupScaleform(title, topText, midText, bottomText, rank) {
        let handle = native.requestScaleformMovie("mugshot_board_01");
        await awaitScaleformLoad(handle);
        native.beginScaleformMovieMethod(handle, "SET_BOARD");
        native.scaleformMovieMethodAddParamPlayerNameString(title);
        native.scaleformMovieMethodAddParamPlayerNameString(midText);
        native.scaleformMovieMethodAddParamPlayerNameString(bottomText);
        native.scaleformMovieMethodAddParamPlayerNameString(topText);
        native.scaleformMovieMethodAddParamInt(0);
        if (rank > -1) native.scaleformMovieMethodAddParamInt(rank);
        native.endScaleformMovieMethod();

        MugshotBoard.handles.scaleform = handle;
    }
    static setupRendertarget() {
        native.registerNamedRendertarget(renderTargetName, false);
        native.linkNamedRendertarget(alt.hash(textProp));
        MugshotBoard.handles.renderTarget = native.getNamedRendertargetRenderId(
            renderTargetName
        );
    }
    static attachObjects() {
        native.attachEntityToEntity(
            MugshotBoard.handles.board,
            alt.Player.local.scriptID,
            native.getPedBoneIndex(alt.Player.local.scriptID, 28422),
            0,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            2,
            true
        );
        native.attachEntityToEntity(
            MugshotBoard.handles.text,
            alt.Player.local.scriptID,
            native.getPedBoneIndex(alt.Player.local.scriptID, 28422),
            0,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            2,
            true
        );
    }
    static playAnimation() {
        native.taskPlayAnim(
            alt.Player.local.scriptID,
            animDict,
            animName,
            8,
            -8,
            -1,
            1,
            0,
            false,
            false,
            false
        );
    }

    static everyTick() {
        native.setTextRenderId(MugshotBoard.handles.renderTarget);
        native.drawScaleformMovie(
            MugshotBoard.handles.scaleform,
            0.405,
            0.37,
            0.81,
            0.74,
            255,
            255,
            255,
            255,
            0
        );
        native.setTextRenderId(1);
    }

    static stop() {
        if (!MugshotBoard.active) return;
        MugshotBoard.active = false;

        native.deleteObject(MugshotBoard.handles.board);
        native.deleteObject(MugshotBoard.handles.text);
        native.setScaleformMovieAsNoLongerNeeded(
            MugshotBoard.handles.scaleform
        );
        native.releaseNamedRendertarget(MugshotBoard.handles.renderTarget);

        native.stopAnimTask(alt.Player.local.scriptID, animDict, animName, -4);

        alt.clearEveryTick(MugshotBoard.everyTickHandle);
    }
}

function awaitScaleformLoad(scaleform) {
    return new Promise((resolve) => {
        let interval = alt.setInterval(() => {
            if (native.hasScaleformMovieLoaded(scaleform)) {
                alt.clearInterval(interval);
                resolve();
            }
        }, 50);
    });
}

// Start
alt.on("mugshot:start", MugshotBoard.start);
alt.onServer("mugshot:start", MugshotBoard.start);

// Stop
alt.on("mugshot:stop", MugshotBoard.stop);
alt.onServer("mugshot:stop", MugshotBoard.stop);
