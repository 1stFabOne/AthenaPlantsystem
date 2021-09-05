/************************************************************
 *      PLANT-System for ATHENA-Framework by Der Lord!      *
 * Explanations can be found in this across the source code *      
 ************************************************************/
import * as alt from 'alt-server';
import Database from "@stuyk/ezmongodb";
import { TextLabelController } from '../../server/systems/textlabel';
import { ObjectController } from '../../server/systems/object';
import { distance2d } from '../../shared/utility/vector';
import { playerFuncs } from '../../server/extensions/Player';
import { getFromRegistry } from '../../shared/items/itemRegistry';

const smallPlant = 'bkr_prop_weed_01_small_01a';
const mediumPlant = 'bkr_prop_weed_med_01a';
const bigPlant = 'bkr_prop_weed_lrg_01a';

const harvestDuration = 5000; // Duration for Harvesting in MS

const fertilizeDuration = 5000; // Duration for Fertilizing in MS
const fertilizerRemoveTime = 30; // How many minutes will the fertilizer remove?

const wateringDuration = 5000; // Duration for Watering in MS
const minRequiredWater = 50; // How much water is minimum needed for the plant to grow?
const waterLossPerMinute = 5;

const minBuds = 25; // Min output as weedbuds from harvesting
const maxBuds = 50; // Maximum output as weedbuds from harvesting

// Plants-Interface
interface Plants {
    _id?: any,
    plantOwner?: string,
    position: {
        x: number,
        y: number,
        z: number
    }
    data: {
        state: string,
        remainingMinutes: number,
        water: number,
        fertilizer: any,
        isHarvestable: any
    }
}

// Build a new Plant with a Small-Pot
export async function buildPlant(plantOwner: string, posX: number, posY: number, posZ: number, water, fertilizer, state: string, remainingMinutes: number, isHarvestable: any) {
    const newDocument = {
        plantOwner: plantOwner,
        position: {
            x: posX,
            y: posY,
            z: posZ
        },
        data: {
            state: state,
            remainingMinutes: remainingMinutes,
            water: water,
            fertilizer: fertilizer,
            isHarvestable: isHarvestable
        }
    }
    const plants = await Database.insertData<Plants>(newDocument, 'plants', true);
    if (!plants) {
        throw new Error('Could not insert data for table <plants>');
    }

    ObjectController.append({
        model: smallPlant,
        uid: `WeedPlantIdentifier-${plants._id}`,
        pos: plants.position
    });

    alt.log(`${plantOwner} placed a Weedpot at ${posX}, ${posY}, ${posZ}!`);
    updatePlant("one");
};

export async function loadAllExistingPlants() {
    const allPlants = await Database.fetchAllData<Plants>('plants');
    if (!allPlants) {
        throw new Error('Could not fetch data for table <plants>');
    }
    allPlants.forEach(plant => {
        if (plant.data.remainingMinutes > 45) {
            ObjectController.append({
                model: smallPlant,
                uid: `WeedPlantIdentifier-${plant._id}`,
                pos: plant.position
            });
        } else if (plant.data.remainingMinutes <= 45 && plant.data.remainingMinutes > 15) {
            ObjectController.append({
                model: mediumPlant,
                uid: `WeedPlantIdentifier-${plant._id}`,
                pos: plant.position
            });
        } else if (plant.data.remainingMinutes <= 0) {
            ObjectController.append({
                model: bigPlant,
                uid: `WeedPlantIdentifier-${plant._id}`,
                pos: plant.position
            });
        }

        TextLabelController.append({
            uid: `TextLabelIdentifier-${plant._id}`,
            pos: { "x": plant.position.x, "y": plant.position.y, "z": plant.position.z + 0.5 },
            data: `~w~State: ~g~${plant.data.state}~n~~w~Fertilizer: ~g~${plant.data.fertilizer}~n~~w~Water: ~g~${plant.data.water}%~n~~w~Time: ~g~${plant.data.remainingMinutes} ~w~minutes`,
            maxDistance: 10
        });

        if (plant.data.remainingMinutes <= 0) {
            plant.data.remainingMinutes = 0;
            TextLabelController.remove(`TextLabelIdentifier-${plant._id}`);
            TextLabelController.append({
                uid: `TextLabelIdentifier-${plant._id}`,
                pos: { "x": plant.position.x, "y": plant.position.y, "z": plant.position.z + 0.5 },
                data: `~g~Harvestable`,
                maxDistance: 10
            });
        }
    });
    alt.log(`Found ${allPlants.length} plants to load in the database.`);
}

export async function updatePlant(type: any) {
    const allPlants = await Database.fetchAllData<Plants>('plants');
    if (!allPlants) {
        throw new Error('Could not fetch data for table <plants>');
    }
    allPlants.forEach(async plant => {
        const TextLabelIdentifier = `TextLabelIdentifier-${plant._id}`;

        if (plant.data.remainingMinutes >= 0) {
            TextLabelController.remove(`TextLabelIdentifier-${plant._id}`);
            TextLabelController.append({
                uid: TextLabelIdentifier,
                pos: { "x": plant.position.x, "y": plant.position.y, "z": plant.position.z + 0.5 },
                data: `~w~State: ~g~${plant.data.state}~n~~w~Fertilizer: ~g~${plant.data.fertilizer}~n~~w~Water: ~g~${plant.data.water}%~n~~w~Time: ~g~${plant.data.remainingMinutes} ~w~minutes`,
                maxDistance: 10
            });

            if (plant.data.remainingMinutes == 45) {
                plant.data.state = 'Growthphase...';
                alt.setTimeout(() => {
                    ObjectController.remove(`WeedPlantIdentifier-${plant._id}`);
                    ObjectController.append({
                        model: mediumPlant,
                        uid: `WeedPlantIdentifier-${plant._id}`,
                        pos: plant.position
                    });

                    TextLabelController.remove(`TextLabelIdentifier-${plant._id}`);
                    TextLabelController.append({
                        uid: TextLabelIdentifier,
                        pos: { "x": plant.position.x, "y": plant.position.y, "z": plant.position.z + 0.5 },
                        data: `~w~State: ~g~${plant.data.state}~n~~w~Fertilizer: ~g~${plant.data.fertilizer}~n~~w~Water: ~g~${plant.data.water}%~n~~w~Time: ~g~${plant.data.remainingMinutes} ~w~minutes`,
                        maxDistance: 10
                    });
                }, 250);
            }

            if (plant.data.remainingMinutes == 15) {
                plant.data.state = 'Endphase...';
                alt.setTimeout(() => {
                    ObjectController.remove(`WeedPlantIdentifier-${plant._id}`);
                    ObjectController.append({
                        model: bigPlant,
                        uid: `WeedPlantIdentifier-${plant._id}`,
                        pos: plant.position
                    });
                }, 250);
            }

            if (plant && plant.data.remainingMinutes == 0 && plant.data.isHarvestable == false) {
                plant.data.isHarvestable = true;
                plant.data.remainingMinutes = 0;
                TextLabelController.remove(`TextLabelIdentifier-${plant._id}`);
                TextLabelController.append({
                    uid: `TextLabelIdentifier-${plant._id}`,
                    pos: { "x": plant.position.x, "y": plant.position.y, "z": plant.position.z + 0.5 },
                    data: `~g~Harvestable`,
                    maxDistance: 10
                });
            }
            if (plant.data.water < minRequiredWater) return;
            // Updating Database Stuff..
            if (type = "all") {
                if (plant.data.remainingMinutes >= 0) {
                    await Database.updatePartialData(plant._id, {
                        data:
                        {
                            state: plant.data.state,
                            remainingMinutes: plant.data.remainingMinutes -= 1,
                            water: plant.data.water -= waterLossPerMinute,
                            fertilizer: plant.data.fertilizer,
                            isHarvestable: plant.data.isHarvestable
                        }
                    }, 'plants');
                }
            } else if (type == "one") {
                if (plant.data.remainingMinutes >= 0) {
                    await Database.updatePartialData(plant._id, {
                        data:
                        {
                            state: plant.data.state,
                            remainingMinutes: plant.data.remainingMinutes,
                            water: plant.data.water,
                            fertilizer: plant.data.fertilizer,
                            isHarvestable: plant.data.isHarvestable
                        }
                    }, 'plants');
                }
            }
        }
    });
}

async function harvestPot(player: alt.Player) {
    const allPlants = await Database.fetchAllData<Plants>('plants');
    if (!allPlants) {
        throw new Error('Could not fetch data for table <plants>');
    }
    allPlants.forEach(async plants => {
        if (distance2d(player.pos, plants.position) <= 1) {
            if (plants.data.fertilizer) {
                playerFuncs.emit.notification(player, "Plant is already fertilized.");
                return;
            }
            if (!plants.data.isHarvestable) {
                playerFuncs.emit.notification(player, "This plant is not harvestable yet.");
                return;
            }
            playerFuncs.emit.scenario(player, "WORLD_HUMAN_GARDENER_PLANT", harvestDuration);
            alt.setTimeout(() => {
                TextLabelController.remove(`TextLabelIdentifier-${plants._id}`);
                ObjectController.remove(`WeedPlantIdentifier-${plants._id}`);
                alt.emit('Plantsystem:HandleGiveItems', player);
            }, harvestDuration);
            await Database.deleteById(plants._id, 'plants');
        }
    });
};

async function fertilizePot(player: alt.Player) {
    const allPlants = await Database.fetchAllData<Plants>('plants');
    if (!allPlants) {
        throw new Error('Could not fetch data for table <plants>');
    }
    allPlants.forEach(async plant => {
        if (plant.data.fertilizer) {
            playerFuncs.emit.notification(player, "You can't fertilize a plant that's already fertilized.");
            return;
        }
        if (distance2d(player.pos, plant.position) <= 1) {
            playerFuncs.emit.scenario(player, "WORLD_HUMAN_GARDENER_LEAF_BLOWER", fertilizeDuration);
            alt.setTimeout(async () => {
                playerFuncs.emit.notification(player, `Successfully fertilized the plant infront of you.`);
                await Database.updatePartialData(plant._id, {
                    data:
                    {
                        state: plant.data.state,
                        remainingMinutes: plant.data.remainingMinutes -= fertilizerRemoveTime,
                        water: plant.data.water,
                        fertilizer: true,
                        isHarvestable: plant.data.isHarvestable
                    }
                }, 'plants');
                updatePlant("one");
            }, fertilizeDuration);
        }
    });
}

async function waterPot(player: alt.Player) {
    const plantWater = getFromRegistry("plantwater");

    const allPlants = await Database.fetchAllData<Plants>('plants');
    if (!allPlants) {
        throw new Error('Could not fetch data for table <plants>');
    }

    allPlants.forEach(async plant => {
        if (plant.data.water >= 100) {
            playerFuncs.emit.notification(player, "This plant has already maximum water.");
            console.log(plant.data.water);
            return;
        } else {
            if (distance2d(player.pos, plant.position) <= 1) {
                playerFuncs.emit.scenario(player, "WORLD_HUMAN_GARDENER_LEAF_BLOWER", wateringDuration);
                alt.setTimeout(async () => {
                    await Database.updatePartialData(plant._id, {
                        data:
                        {
                            state: plant.data.state,
                            remainingMinutes: plant.data.remainingMinutes,
                            water: plant.data.water += plantWater.data.amount,
                            fertilizer: plant.data.fertilizer,
                            isHarvestable: plant.data.isHarvestable
                        }
                    }, 'plants');
                    updatePlant("one");
                }, wateringDuration);
            }
        }
    });
}

function getRandomMinMax(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

alt.on('Plantsystem:HarvestPot', (player: alt.Player) => {
    harvestPot(player);
});

alt.on('Plantsystem:FertilizePot', (player: alt.Player) => {
    fertilizePot(player);
});

alt.on('Plantsystem:WaterPot', (player: alt.Player) => {
    waterPot(player);
});

alt.on('Plantsystem:HandleGiveItems', (player: alt.Player) => {
    const itemFromRegistry = getFromRegistry("buds");
    const itemExists = playerFuncs.inventory.isInInventory(player, { name: itemFromRegistry.name });
    const emptySlot = playerFuncs.inventory.getFreeInventorySlot(player);

    itemFromRegistry.quantity = getRandomMinMax(minBuds, maxBuds);
    if (!itemExists) {
        playerFuncs.emit.notification(player, `You receive ${itemFromRegistry.quantity} Weedbuds!`);
        playerFuncs.inventory.inventoryAdd(player, itemFromRegistry, emptySlot.slot, emptySlot.tab);
    } else {
        playerFuncs.emit.notification(player, `You receive ${itemFromRegistry.quantity} Weedbuds!`);
        player.data.inventory[itemExists.tab][itemExists.index].quantity += itemFromRegistry.quantity;
    }

    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.save.field(player, 'toolbar', player.data.toolbar);
    playerFuncs.sync.inventory(player);
});