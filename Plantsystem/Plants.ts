/************************************************************
 *      PLANT-System for ATHENA-Framework by Der Lord!      *
 * Explanations can be found in this across the source code *      
 ************************************************************/

import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';
import { BlipController } from '../../server/systems/blip';
import { getVectorInFrontOfPlayer } from '../../server/utility/vector';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { buildPlant, loadAllExistingPlants, updateAllPlants } from './PlantsInterface';

const plantInterval = 60000; // How long it takes to remove a minute? default values: 60000 production mode, 1000 testing mode
const plantSystemEnabled = true; // If enabled update interval will start on bootup of Athena. default: true

// Add whatever spots you like here (Press F1 with administrative rights ingame to get Pos from the alt:V Dev Console)
// #default spots 3, add more if you need
const validPlantPlaceSpots = [
    { "x": -2006.942138671875, "y": 2568.26953125, "z": 2.7962563037872314 },
    { "x": -2010.500732421875, "y": 2568.917236328125, "z": 2.7646090984344482 },
    { "x": -2012.62451171875, "y": 2565.571044921875, "z": 2.746884346008301 },
    { "x": -2007.74267578125, "y": 2564.00341796875, "z": 2.6880717277526855 },
    { "x": -2020.5887451171875, "y": 2566.855224609375, "z": 2.6964898109436035 },
    { "x": -2020.66455078125, "y": 2572.015625, "z": 2.710820198059082 },
    { "x": -2020.5101318359375, "y": 2577.8818359375, "z": 2.778646469116211 },
    { "x": -2016.6363525390625, "y": 2578.458251953125, "z": 3.48949933052063 },
    { "x": -2011.7757568359375, "y": 2578.625732421875, "z": 3.5605852603912354 },
    { "x": -2004.8231201171875, "y": 2575.834716796875, "z": 2.8564610481262207 }
];

const distanceToValidSpot: number = 5; // Distance the player can have to a valid spot. default: 5
const blipControlledPlacingSpots: any = true; // Blips enabled? default: true

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, startPlantTimer);

alt.on('Plantsystem:PlacePot', (player: alt.Player) => {
    for (let i = 0; i < validPlantPlaceSpots.length; i++) {
        if (player.pos.isInRange(validPlantPlaceSpots[i] as alt.Vector3, distanceToValidSpot)) {
            playerFuncs.emit.notification(player, "Seems like you are standing in a valid spot. Placing new plant...");
            const playerPos = getVectorInFrontOfPlayer(player, 1);
            buildPlant(player.data.name, playerPos.x, playerPos.y, playerPos.z - 1, 'Beginning...', 60, false);
            return;
        }
    }
});

function startPlantTimer() {

    if (blipControlledPlacingSpots) {
        for (let i = 0; i < validPlantPlaceSpots.length; i++) {
            BlipController.append({
                uid: `Blip-${validPlantPlaceSpots[i]}`,
                text: 'Plantspot',
                scale: 1,
                sprite: 469,
                color: 2,
                shortRange: true,
                pos: validPlantPlaceSpots[i] as alt.Vector3
            });
        }
    }
    if (blipControlledPlacingSpots) {
        alt.log("Building Blips for " + validPlantPlaceSpots.length + " Valid Plant Placing Pots.");
    }
    loadAllExistingPlants(); // Load all Plants from the Database...
    if (plantSystemEnabled) {
        alt.setInterval(() => {
            updateAllPlants();
        }, plantInterval);
    }
}
